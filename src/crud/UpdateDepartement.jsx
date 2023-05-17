import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Controller, useForm } from "react-hook-form";
import { Button, LoadingOverlay, Select, Text, TextInput } from "@mantine/core";

import {
  getDepartement,
  updateDepartement,
} from "../services/departementservice";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useNavigate, useParams } from "react-router-dom";
import { showNotification } from "@mantine/notifications";
import { useState } from "react";
import { getUfrs } from "../services/ufrservice";
const schema = yup
  .object({
    nom: yup.string().required(),
    ufr: yup.string().required(),
  })
  .required();

export const UpdateDepartement = () => {
  const { id } = useParams();
  const [ufrs, setUfrs] = useState([]);
  const qc = useQueryClient();
  const navigate = useNavigate();
  const qk = ["get_Departements"];
  const defaultValues = {
    nom: "",
    ufr: "",
  };
  const qku = ["get_Ufrs"];
  const qkd = ["get_Departement", id];

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
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues,
  });

  const { isLoading: loading } = useQuery(qkd, () => getDepartement(id), {
    onSuccess: (_) => {
      setValue("nom", _[0]?.nom);
      setValue("ufr", _[0]?.ufr);
    },
  });

  const { mutate: update, isLoading: loadingC } = useMutation(
    (data) => updateDepartement(id, data),
    {
      onSuccess: (_) => {
        showNotification({
          title: "Modification Departement",
          message: "La modification a été prise en compte !!",
          color: "green",
        });
        qc.invalidateQueries(qk);
        navigate(`/dashboard/departements`);
      },
      onError: (_) => {
        showNotification({
          title: "Modification Departement",
          message: "La modification a echouée!!",
          color: "red",
        });
      },
    }
  );
  return (
    <div className="card w-5/12 mx-auto my-10 shadow-2xl bg-gradient-to-br from-white to-cyan-500 opacity-90  p-5 animate__animated animate__zoomIn animate__faster">
      <LoadingOverlay
        visible={loadingC || isLoading || loading}
        overlayBlur={2}
      />
      <div className="my-5 flex items-center justify-center bg-cyan-900 py-2 rounded-md">
        <Text size={28} fw="bold" className="text-white">
          MODIFICATION D'UN DEPARTEMENT
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
              MODIFIER DEPARTEMENT
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
