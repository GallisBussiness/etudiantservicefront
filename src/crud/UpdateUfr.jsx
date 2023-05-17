import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Controller, useForm } from "react-hook-form";
import { Button, LoadingOverlay, Text, TextInput } from "@mantine/core";

import { getUfr, updateUfr } from "../services/ufrservice";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useNavigate, useParams } from "react-router-dom";
import { showNotification } from "@mantine/notifications";
const schema = yup
  .object({
    nom: yup.string().required(),
  })
  .required();

export const UpdateUfr = () => {
  const { id } = useParams();
  const qc = useQueryClient();
  const navigate = useNavigate();
  const qk = ["get_Ufrs"];
  const qke = ["get_Ufr", id];
  const defaultValues = {
    nom: "",
  };
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues,
  });
  const { isLoading } = useQuery(qke, () => getUfr(id), {
    onSuccess: (_) => {
      setValue("nom", _.nom);
    },
  });

  const { mutate: update, isLoading: loadingU } = useMutation(
    (data) => updateUfr(id, data),
    {
      onSuccess: (_) => {
        showNotification({
          title: "Modification Ufr",
          message: "La modification a été prise en compte !!",
          color: "green",
        });
        qc.invalidateQueries(qk);
        navigate("/dashboard/ufrs");
      },
      onError: (_) => {
        showNotification({
          title: "Modification Ufr",
          message: "La modification a echouée!!",
          color: "red",
        });
      },
    }
  );
  return (
    <div className="card w-5/12 mx-auto my-10 shadow-2xl bg-gradient-to-br from-white to-cyan-500 opacity-90  p-5 animate__animated animate__zoomIn animate__faster">
      <LoadingOverlay visible={isLoading || loadingU} overlayBlur={2} />
      <div className="my-5 flex items-center justify-center bg-cyan-900 py-2 rounded-md">
        <Text size={28} fw="bold" className="text-white">
          MODIFICATION D'UN UFR
        </Text>
      </div>
      <form onSubmit={handleSubmit(update)} method="POST">
        <div>
          <Controller
            control={control}
            name="nom"
            render={({ field }) => (
              <TextInput
                value={field.value}
                onChange={field.onChange}
                label="Nom"
                error={errors.nom && errors.nom.message}
                placeholder="Nom de l'ufr"
              />
            )}
          />
        </div>
        <div className="flex items-center justify-between my-5">
          <div>
            <Button type="submit" className="bg-sky-900 hover:bg-cyan-600">
              MODIFIER L'UFR
            </Button>
          </div>
          <div>
            <Button
              type="button"
              onClick={() => navigate("/dashboard/ufrs")}
              className="bg-red-900 hover:bg-red-600"
            >
              ANNULER
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};
