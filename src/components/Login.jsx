import { useEffect } from "react";
import { useAuthUser, useIsAuthenticated, useSignIn } from "react-auth-kit";
import { useNavigate } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useMutation } from "react-query";
import { Controller, useForm } from "react-hook-form";
import {
  TextInput,
  PasswordInput,
  Group,
  Button,
  Stack,
  LoadingOverlay,
} from "@mantine/core";
import { login } from "../services/authservice";
import { showNotification } from "@mantine/notifications";

const schema = yup
  .object({
    username: yup.string().required(),
    password: yup.string().required(),
  })
  .required();

function Login() {
  const isAuth = useIsAuthenticated();
  const auth = useAuthUser()();
  const signIn = useSignIn();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuth()) {
      const targetDashboard = "/dashboard";
      navigate(targetDashboard, { replace: true });
    }
    return;
  }, [isAuth, navigate, auth]);

  const defaultValues = { username: "", password: "" };
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues,
  });

  const { mutate, isLoading } = useMutation((data) => login(data), {
    onSuccess(data) {
      showNotification({
        title: "Connection Réussi",
        message: "Bienvenue !!",
        color: "green",
      });
      if (
        signIn({
          token: data?.token,
          expiresIn: 3600,
          tokenType: "Bearer",
          authState: { id: data?.id },
        })
      ) {
        const targetDashboard = "/dashboard";
        navigate(targetDashboard, { replace: true });
      } else {
        showNotification({
          title: "Connection Echouée",
          message: "Une erreur s'est produite !!",
          color: "red",
        });
      }
    },
    onError: (_) => {
      showNotification({
        title: "Connection Echouée",
        message: "Identifiant et/ou mot de passe incorrecte !!",
        color: "red",
      });
    },
  });

  const onConnect = (data) => {
    mutate(data);
  };

  return (
    <>
      <LoadingOverlay visible={isLoading} overlayBlur={2} />
      <div className="hero min-h-screen bg-cyan-500 text-white">
        <div className="hero-content flex-col lg:flex-row-reverse">
          <div className="text-center lg:text-left">
            <h1 className="text-5xl font-bold animate__animated animate__bounceInDown">
              SERVICE ETUDIANT CROUS/Z
            </h1>
            {/* <p className="py-6">Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda excepturi exercitationem quasi. In deleniti eaque aut repudiandae et a id nisi.</p> */}
          </div>
          <div className="card flex-shrink-0 w-full max-w-sm shadow-2xl bg-white p-4 animate__animated animate__zoomInLeft">
            <div className=" flex items-center justify-center">
              <div className="avatar">
                <div className="w-24 rounded">
                  <img src="/img/logo.png" />
                </div>
              </div>
            </div>
            <form onSubmit={handleSubmit(onConnect)} method="POST">
              <Stack>
                <Controller
                  control={control}
                  name="username"
                  render={({ field }) => (
                    <>
                      <TextInput
                        required
                        label="Email"
                        placeholder="gallis@child.dev"
                        value={field.value}
                        onChange={(event) =>
                          field.onChange(event.currentTarget.value)
                        }
                        error={errors.username && "Invalid email"}
                      />
                    </>
                  )}
                />

                <Controller
                  control={control}
                  name="password"
                  render={({ field }) => (
                    <>
                      <PasswordInput
                        required
                        label="Mot de Passe"
                        placeholder="Votre mot de passe"
                        value={field.value}
                        onChange={(event) =>
                          field.onChange(event.currentTarget.value)
                        }
                        error={errors.password && "Password invalid !!"}
                      />
                    </>
                  )}
                />
              </Stack>

              <Group position="apart" mt="xl">
                <Button type="submit" className="bg-cyan-900 hover:bg-cyan-500">
                  Se Connecter
                </Button>
              </Group>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;
