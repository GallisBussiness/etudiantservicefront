import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Controller, useForm } from "react-hook-form";
import { Button, LoadingOverlay, Select, Text, TextInput } from "@mantine/core";

import { createDepartement } from "../services/departementservice";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useNavigate } from "react-router-dom";
import { showNotification } from "@mantine/notifications";
import { useState } from "react";
import { getUfrs } from "../services/ufrservice";
const schema = yup
  .object({
    nom: yup.string().required(),
    ufr: yup.string().required(),
  })
  .required();

export const CreateDepartement = () => {
  const [ufrs, setUfrs] = useState([]);
  const qc = useQueryClient();
  const navigate = useNavigate();
  const qk = ["get_Departements"];
  const defaultValues = {
    nom: "",
    ufr: "",
  };
  const qku = ["get_Ufrs"];

  const { isLoading } = useQuery(qku, () => getUfrs(), {
    onSuccess: (_) => {
      const u = _.map((c) => ({
        value: c._id,
        label: c.nom,
      }));
      setUfrs(u);
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
    (data) => createDepartement(data),
    {
      onSuccess: (_) => {
        showNotification({
          title: "Création Departement",
          message: "La création a été prise en compte !!",
          color: "green",
        });
        qc.invalidateQueries(qk);
        navigate(`/dashboard/departements`);
      },
      onError: (_) => {
        showNotification({
          title: "Création Departement",
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
          CREATION D'UN DEPARTEMENT
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
                placeholder="Nom du département..."
              />
            )}
          />
        </div>
        <div className="mb-3">
          <Controller
            control={control}
            name="ufr"
            render={({ field }) => (
              <Select
                label="Ufr"
                placeholder="Selectionnez l'ufr ..."
                searchable
                clearable
                nothingFound="Pas d'ufr disponibles"
                data={ufrs}
                value={field.value}
                onChange={field.onChange}
                error={errors.ufr && errors.ufr.message}
              />
            )}
          />
        </div>
        <div className="flex items-center justify-between my-5">
          <div>
            <Button type="submit" className="bg-sky-900 hover:bg-cyan-600">
              CREER DEPARTEMENT
            </Button>
          </div>
          <div>
            <Button
              type="button"
              onClick={() => navigate("/dashboard/departements")}
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
