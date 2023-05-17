import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Controller, useForm } from "react-hook-form";
import { Button, LoadingOverlay, Select, Text, TextInput } from "@mantine/core";

import { createFormation } from "../services/formationservice";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useNavigate } from "react-router-dom";
import { showNotification } from "@mantine/notifications";
import { useState } from "react";
import { getDepartements } from "../services/departementservice";
const schema = yup
  .object({
    nom: yup.string().required(),
    departement: yup.string().required(),
  })
  .required();

export const CreateFormation = () => {
  const [departements, setDepartements] = useState([]);
  const qc = useQueryClient();
  const navigate = useNavigate();
  const qk = ["get_Formations"];
  const defaultValues = {
    nom: "",
    departement: "",
  };
  const qku = ["get_Departements"];

  const { isLoading } = useQuery(qku, () => getDepartements(), {
    onSuccess: (_) => {
      const u = _.map((c) => ({
        value: c._id,
        label: c.nom,
      }));
      setDepartements(u);
    },
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues,
  });

  const { mutate: create, isLoading: loadingC } = useMutation(
    (data) => createFormation(data),
    {
      onSuccess: (_) => {
        showNotification({
          title: "Création Formation",
          message: "La création a été prise en compte !!",
          color: "green",
        });
        qc.invalidateQueries(qk);
        navigate(`/dashboard/Formations`);
      },
      onError: (_) => {
        showNotification({
          title: "Création Formation",
          message: "La création a echouée!!",
          color: "red",
        });
      },
    }
  );
  return (
    <div className="card w-5/12 mx-auto my-10 shadow-2xl bg-gradient-to-br from-white to-cyan-500 opacity-90  p-5 animate__animated animate__zoomIn animate__faster">
      <LoadingOverlay visible={loadingC || isLoading} overlayBlur={2} />
      <div className="my-5 flex items-center justify-center bg-cyan-900 py-2 rounded-md">
        <Text size={28} fw="bold" className="text-white">
          CREATION D'UNE FORMATION
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
                placeholder="Nom de la formation..."
              />
            )}
          />
        </div>
        <div className="mb-3">
          <Controller
            control={control}
            name="departement"
            render={({ field }) => (
              <Select
                label="Departement de la formation..."
                placeholder="Selectionnez le departement..."
                searchable
                clearable
                nothingFound="Pas de départements disponibles"
                data={departements}
                value={field.value}
                onChange={field.onChange}
                error={errors.departement && errors.departement.message}
              />
            )}
          />
        </div>
        <div className="flex items-center justify-between my-5">
          <div>
            <Button type="submit" className="bg-sky-900 hover:bg-cyan-600">
              CREER FORMATION
            </Button>
          </div>
          <div>
            <Button
              type="button"
              onClick={() => navigate("/dashboard/formations")}
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
