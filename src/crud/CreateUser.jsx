import { Password } from "primereact/password";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Controller, useForm } from "react-hook-form";
import { Dropdown } from "primereact/dropdown";
import { useMutation, useQueryClient } from "react-query";
import { createUser } from "../services/userservice";
import { Button, LoadingOverlay, Text } from "@mantine/core";
import { useNavigate } from "react-router-dom";
import { showNotification } from "@mantine/notifications";

const schema = yup
  .object({
    prenom: yup.string().required(),
    nom: yup.string().required(),
    email: yup.string().email().required(),
    password: yup.string().required(),
    role: yup.string().required(),
  })
  .required();

export const CreateUser = () => {
  const qc = useQueryClient();
  const navigate = useNavigate();
  const qk = ["get_users"];
  const { mutate: create, isLoading } = useMutation(
    (data) => createUser(data),
    {
      onSuccess: (_) => {
        showNotification({
          title: "Création Utilisateur",
          message: "La création a été prise en compte!!",
          color: "green",
        });
        qc.invalidateQueries(qk);
        navigate("/dashboard/users");
      },
      onError: (_) => {
        showNotification({
          title: "Création Utilisateur",
          message: "La création a echouée!!",
          color: "red",
        });
      },
    }
  );
  const defaultValues = {
    nom: "",
    prenom: "",
    email: "",
    password: (
      Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2)
    ).substring(0, 9),
    role: "",
  };
  const {
    control,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues,
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
  const generatePassword = (e) => {
    e.preventDefault();
    setValue(
      "password",
      (
        Math.random().toString(36).slice(2) +
        Math.random().toString(36).slice(2)
      ).substring(0, 9)
    );
  };

  return (
    <div className="card w-5/12 mx-auto my-10 shadow-2xl bg-gradient-to-br from-white to-cyan-500 opacity-90  p-5 animate__animated animate__zoomIn animate__faster">
      <LoadingOverlay visible={isLoading} overlayBlur={2} />
      <div className="my-5 flex items-center justify-center bg-cyan-900 py-2 rounded-md">
        <Text size={28} fw="bold" className="text-white">
          CREATION D'UN UTILISATEUR
        </Text>
      </div>
      <form className="mb-3" onSubmit={handleSubmit(create)} method="POST">
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
                className="focus:shadow-soft-primary-outline text-sm leading-5.6 ease-soft block w-full appearance-none rounded-lg border border-solid border-green-300 bg-white bg-clip-padding px-3 py-2 font-normal text-green-700 outline-none transition-all placeholder:text-green-500 focus:border-green-300 focus:outline-none"
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
                className="focus:shadow-soft-primary-outline text-sm leading-5.6 ease-soft block w-full appearance-none rounded-lg border border-solid border-green-300 bg-white bg-clip-padding px-3 py-2 font-normal text-green-700 outline-none transition-all placeholder:text-green-500 focus:border-green-300 focus:outline-none"
                id="email"
                placeholder="Entrer votre Email"
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
        <div className="mb-3 w-full">
          <label htmlFor="password" className="form-label">
            Mot de passe
          </label>
          <Controller
            control={control}
            name="password"
            render={({ field }) => (
              <div className="flex items-center space-x-4 w-full">
                <Password {...field} placeholder="Mot de passe*" toggleMask />
                <button
                  className="inline-block px-6 py-3 font-bold text-center text-white uppercase align-middle transition-all rounded-lg cursor-pointer bg-gradient-to-tl from-green-700 to-green-300 leading-pro text-xs ease-soft-in tracking-tight-soft shadow-soft-md bg-150 bg-x-25 hover:scale-102 active:opacity-85 hover:shadow-soft-xs mr-2"
                  onClick={generatePassword}
                >
                  {" "}
                  Générer mot de passe
                </button>
              </div>
            )}
          />
          {getFormErrorMessage("password")}
        </div>

        <div className="flex items-center justify-between my-5">
          <div>
            <Button type="submit" className="bg-sky-900 hover:bg-cyan-600">
              CREER L'UTILISATEUR
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
