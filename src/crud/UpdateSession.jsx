import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Controller, useForm } from "react-hook-form";
import {
  Button,
  Group,
  LoadingOverlay,
  Switch,
  Text,
  TextInput,
} from "@mantine/core";
import { TbCheck, TbX } from "react-icons/tb";
import { getSession, updateSession } from "../services/sessionservice";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useNavigate, useParams } from "react-router-dom";
import { showNotification } from "@mantine/notifications";
const schema = yup
  .object({
    nom: yup.string().required(),
    etat: yup.boolean().required(),
  })
  .required();

export const UpdateSession = () => {
  const { id } = useParams();
  const qc = useQueryClient();
  const navigate = useNavigate();
  const qk = ["get_Sessions"];
  const qke = ["get_Session", id];
  const defaultValues = {
    nom: "",
    etat: false,
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
  const { isLoading } = useQuery(qke, () => getSession(id), {
    onSuccess: (_) => {
      setValue("nom", _.nom);
      setValue("etat", _.etat);
    },
  });

  const { mutate: update, isLoading: loadingU } = useMutation(
    (data) => updateSession(id, data),
    {
      onSuccess: (_) => {
        showNotification({
          title: "Modification Session",
          message: "La modification a été prise en compte !!",
          color: "green",
        });
        qc.invalidateQueries(qk);
        navigate("/dashboard/sessions");
      },
      onError: (_) => {
        showNotification({
          title: "Modification Session",
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
          MODIFICATION D'UNE SESSION
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
                placeholder="Nom de l'Session"
              />
            )}
          />
        </div>
        <div className="my-5">
          <Controller
            control={control}
            name="etat"
            render={({ field }) => (
              <Group position="left">
                <Switch
                  checked={field.value}
                  onChange={(event) =>
                    field.onChange(event.currentTarget.checked)
                  }
                  color="teal"
                  size="md"
                  label="Etat de la session"
                  thumbIcon={
                    field.value ? (
                      <TbCheck size={3} className="text-teal-600" stroke={3} />
                    ) : (
                      <TbX size={2} className="text-red-600" stroke={3} />
                    )
                  }
                />
              </Group>
            )}
          />
        </div>
        <div className="flex items-center justify-between my-5">
          <div>
            <Button type="submit" className="bg-sky-900 hover:bg-cyan-600">
              MODIFIER LA SESSION
            </Button>
          </div>
          <div>
            <Button
              type="button"
              onClick={() => navigate("/dashboard/sessions")}
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
