import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Controller, useForm } from "react-hook-form";
import { Dropdown } from "primereact/dropdown";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { getUser, updateUser } from "../services/userservice";

import { Button, LoadingOverlay, Text } from "@mantine/core";
import { showNotification } from "@mantine/notifications";

const schema = yup
  .object({
    prenom: yup.string().required(),
    nom: yup.string().required(),
    email: yup.string().required(),
    role: yup.string().required(),
  })
  .required();

export const UpdateUser = () => {
  const { id } = useParams();
  const qc = useQueryClient();
  const navigate = useNavigate();
  const qk = ["get_users"];
  const qku = ["get_user", id];
  const defaultValues = {
    nom: "",
    prenom: "",
    email: "",
    role: "",
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
  const { isLoading } = useQuery(qku, () => getUser(id), {
    onSuccess: (_) => {
      setValue("prenom", _.prenom);
      setValue("nom", _.nom);
      setValue("email", _.email);
      setValue("role", _.role);
    },
  });

  const roles = [
    { label: "Utilisateur", value: "user" },
    { label: "Administrateur", value: "admin" },
  ];
  const getFormErrorMessage = (name) => {
    return (
      errors[name] && <small className="p-error">{errors[name].message}</small>
    );
  };
  const { mutate: update, isLoading: loadingU } = useMutation(
    (data) => updateUser(id, data),
    {
      onSuccess: (_) => {
        showNotification({
          title: "Modification Utilisateur",
          message: "La modification a été prise en compte!!",
          color: "green",
        });
        qc.invalidateQueries(qk);
        navigate("/dashboard/users");
      },
      onError: (_) => {
        showNotification({
          title: "Modification Utilisateur",
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
          METTRE A JOUR L'UTILISATEUR
        </Text>
      </div>
      <form className="mb-3" onSubmit={handleSubmit(update)} method="POST">
        <div className="mb-3">
          <label htmlFor="prenom" className="form-label">
            Prenom
          </label>
          <Controller
            control={control}
            name="prenom"
            render={({ field }) => (
              <input
                type="text"
                {...field}
                className="focus:shadow-soft-primary-outline text-sm leading-5.6 
            ease-soft block w-full appearance-none rounded-lg border border-solid border-green-300
             bg-white bg-clip-padding px-3 py-2 font-normal text-green-700 outline-none transition-all
              placeholder:text-green-500 focus:border-green-300 focus:outline-none"
                id="prenom"
                placeholder="Entrer le prenom"
              />
            )}
          />
          {getFormErrorMessage("prenom")}
        </div>
        <div className="mb-3">
          <label htmlFor="nom" className="form-label">
            Nom
          </label>
          <Controller
            control={control}
            name="nom"
            render={({ field }) => (
              <input
                type="text"
                {...field}
                className="focus:shadow-soft-primary-outline text-sm leading-5.6 
            ease-soft block w-full appearance-none rounded-lg border border-solid border-green-300
             bg-white bg-clip-padding px-3 py-2 font-normal text-green-700 outline-none transition-all
              placeholder:text-green-500 focus:border-green-300 focus:outline-none"
                id="nom"
                placeholder="Entrer le nom"
                autoFocus
              />
            )}
          />
          {getFormErrorMessage("nom")}
        </div>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            email
          </label>
          <Controller
            control={control}
            name="email"
            render={({ field }) => (
              <input
                type="email"
                {...field}
                className="focus:shadow-soft-primary-outline text-sm leading-5.6 
            ease-soft block w-full appearance-none rounded-lg border border-solid border-green-300
             bg-white bg-clip-padding px-3 py-2 font-normal text-green-700 outline-none transition-all
              placeholder:text-green-500 focus:border-green-300 focus:outline-none"
                id="email"
                placeholder="Email"
              />
            )}
          />
          {getFormErrorMessage("email")}
        </div>
        <div className="mb-3 flex flex-col justify-center">
          <label htmlFor="role" className="form-label">
            Role
          </label>
          <Controller
            control={control}
            name="role"
            render={({ field }) => (
              <Dropdown
                className="w-full"
                value={field.value}
                options={roles}
                onChange={(e) => field.onChange(e.value)}
                placeholder="Selectionnez le role"
              />
            )}
          />
          {getFormErrorMessage("role")}
        </div>

        <div className="flex items-center justify-between my-5">
          <div>
            <Button type="submit" className="bg-sky-900 hover:bg-cyan-600">
              METTRE A JOUR
            </Button>
          </div>
          <div>
            <Button
              type="button"
              onClick={() => navigate("/dashboard/users")}
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
