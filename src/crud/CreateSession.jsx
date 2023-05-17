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

import { createSession } from "../services/sessionservice";
import { useMutation, useQueryClient } from "react-query";
import { useNavigate } from "react-router-dom";
import { showNotification } from "@mantine/notifications";
const schema = yup
  .object({
    nom: yup.string().required(),
    etat: yup.boolean().required(),
  })
  .required();

export const CreateSession = () => {
  const qc = useQueryClient();
  const navigate = useNavigate();
  const qk = ["get_Sessions"];
  const defaultValues = {
    nom: "",
    etat: false,
  };
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues,
  });
  const { mutate: create, isLoading: loadingC } = useMutation(
    (data) => createSession(data),
    {
      onSuccess: (_) => {
        showNotification({
          title: "Création Session",
          message: "La création a été prise en compte !!",
          color: "green",
        });
        qc.invalidateQueries(qk);
        navigate(`/dashboard/sessions`);
      },
      onError: (_) => {
        showNotification({
          title: "Création Session",
          message: "La création a echouée!!",
          color: "red",
        });
      },
    }
  );
  return (
    <div className="card w-5/12 mx-auto my-10 shadow-2xl bg-gradient-to-br from-white to-cyan-500 opacity-90  p-5 animate__animated animate__zoomIn animate__faster">
      <LoadingOverlay visible={loadingC} overlayBlur={2} />
      <div className="my-5 flex items-center justify-center bg-cyan-900 py-2 rounded-md">
        <Text size={28} fw="bold" className="text-white">
          CREATION D'UNE SESSION
        </Text>
      </div>
      <form onSubmit={handleSubmit(create)} method="POST">
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
                placeholder="Nom de la session"
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
              CREER LA SESSION
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
