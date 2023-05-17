import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Controller, useForm } from "react-hook-form";
import { Button, LoadingOverlay, Modal, Select, Text } from "@mantine/core";
import { create } from "react-modal-promise";
import { useQuery } from "react-query";
import { FaSave } from "react-icons/fa";
import { useState } from "react";
import { getFormations } from "../services/formationservice";
import { getActivateSessions } from "../services/sessionservice";

const schema = yup
  .object({
    etudiant: yup.string().required(),
    session: yup.string().required(),
    formation: yup.string().required(),
  })
  .required();

const CreateInscription = ({ isOpen, onResolve, onReject, etudiant }) => {
  const [formations, setFormations] = useState([]);
  const [sessions, setSessions] = useState([]);

  const defaultValues = {
    etudiant: etudiant._id,
    session: "",
    formation: "",
  };

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues,
  });

  const qkf = ["get_Formations"];
  const qks = ["get_Sessions"];
  const { isLoading } = useQuery(qkf, () => getFormations(), {
    onSuccess: (_) => {
      const u = _.map((c) => ({
        value: c._id,
        label: c.nom,
      }));
      setFormations(u);
    },
  });
  const { isLoading: loadings } = useQuery(qks, () => getActivateSessions(), {
    onSuccess: (_) => {
      const u = _.map((c) => ({
        value: c._id,
        label: c.nom,
      }));
      setSessions(u);
    },
  });

  return (
    <Modal
      opened={isOpen}
      onClose={onReject}
      title="INSCRIPTION ET REINSCRIPTION"
      centered
    >
      <div className="w-full">
        <LoadingOverlay visible={isLoading || loadings} overlayBlur={2} />
        <div className="my-5 flex items-center justify-center bg-cyan-900 py-2 rounded-md">
          <Text size={28} fw="bold" className="text-white">
            {etudiant.prenom} {etudiant.nom}
          </Text>
        </div>
        <form onSubmit={handleSubmit(onResolve)} method="POST">
          <div className="mb-3">
            <Controller
              control={control}
              name="session"
              render={({ field }) => (
                <Select
                  label="Session"
                  placeholder="Selectionnez la session ..."
                  searchable
                  clearable
                  nothingFound="Pas de sessions disponibles"
                  data={sessions}
                  value={field.value}
                  onChange={field.onChange}
                  error={errors.session && errors.session.message}
                />
              )}
            />
          </div>

          <div className="mb-3">
            <Controller
              control={control}
              name="formation"
              render={({ field }) => (
                <Select
                  label="Formation"
                  placeholder="Selectionnez la formation ..."
                  searchable
                  clearable
                  nothingFound="Pas de formations disponibles"
                  data={formations}
                  value={field.value}
                  onChange={field.onChange}
                  error={errors.formation && errors.formation.message}
                />
              )}
            />
          </div>

          <div className="flex items-center justify-between my-5">
            <div>
              <Button type="submit" className="bg-sky-900 hover:bg-cyan-600">
                INSCRIRE <FaSave />
              </Button>
            </div>
            <div>
              <Button
                type="button"
                onClick={() => onReject(false)}
                className="bg-red-900 hover:bg-red-600"
              >
                ANNULER
              </Button>
            </div>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default create(CreateInscription);
