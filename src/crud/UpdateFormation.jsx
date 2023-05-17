import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Controller, useForm } from "react-hook-form";
import { Button, LoadingOverlay, Select, Text, TextInput } from "@mantine/core";

import { getFormation, updateFormation } from "../services/formationservice";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useNavigate, useParams } from "react-router-dom";
import { showNotification } from "@mantine/notifications";
import { useState } from "react";
import { getDepartements } from "../services/departementservice";

const schema = yup
  .object({
    nom: yup.string().required(),
    departement: yup.string().required(),
  })
  .required();

export const UpdateFormation = () => {
  const [departements, setDepartements] = useState([]);
  const qc = useQueryClient();
  const { id } = useParams();
  const navigate = useNavigate();
  const qk = ["get_Formations"];
  const qkf = ["get_Formation", id];

  const defaultValues = {
    nom: "",
    departement: "",
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

  const { isLoading: loading } = useQuery(qkf, () => getFormation(id), {
    onSuccess: (_) => {
      setValue("nom", _.nom);
      setValue("departement", _.departement);
    },
  });

  const { mutate: update, isLoading: loadingU } = useMutation(
    (data) => updateFormation(id, data),
    {
      onSuccess: (_) => {
        showNotification({
          title: "Mise à jour Formation",
          message: "La Mise a jour a été prise en compte !!",
          color: "green",
        });
        qc.invalidateQueries(qk);
        navigate(`/dashboard/Formations`);
      },
      onError: (_) => {
        showNotification({
          title: "Mise a jour Formation",
          message: "La mise a jour a echouée!!",
          color: "red",
        });
      },
    }
  );
  return (
    <div className="card w-5/12 mx-auto my-10 shadow-2xl bg-gradient-to-br from-white to-cyan-500 opacity-90  p-5 animate__animated animate__zoomIn animate__faster">
      <LoadingOverlay
        visible={loadingU || isLoading || loading}
        overlayBlur={2}
      />
      <div className="my-5 flex items-center justify-center bg-cyan-900 py-2 rounded-md">
        <Text size={28} fw="bold" className="text-white">
          CREATION D'UN DEPARTEMENT
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
              MODIFIER FORMATION
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
