import {
  ActionIcon,
  Button,
  Checkbox,
  LoadingOverlay,
  Table,
} from "@mantine/core";
import {
  createInscription,
  getInscriptionsByEtudiant,
  updateInscription,
} from "../services/inscriptionservice";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { FaPencilAlt, FaUniregistry } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import CreateInscription from "../crud/CreateInscription";
import { showNotification } from "@mantine/notifications";
import UpdateInscription from "../crud/UpdateInscription";
import { useState } from "react";

export const InscriptionView = ({ etudiant }) => {
  const key = ["getInscription", etudiant?._id];
  const key2 = ["get_Etudiant", etudiant?._id];
  const [isOneActive, setIsOneActive] = useState(false);
  const qc = useQueryClient();
  const { data, isLoading } = useQuery(
    key,
    () => getInscriptionsByEtudiant(etudiant._id),
    {
      onSuccess: (_) => {
        const isoa = _.some((v) => v.active === true);
        setIsOneActive(isoa);
      },
    }
  );

  const { mutate: create, isLoading: loadingC } = useMutation(
    (data) => createInscription(data),
    {
      onSuccess: (_) => {
        showNotification({
          title: "Création Inscription",
          message: "La création a été prise en compte !!",
          color: "green",
        });
        qc.invalidateQueries(key);
      },
      onError: (_) => {
        showNotification({
          title: "Création Inscription",
          message: "La création a echouée!!",
          color: "red",
        });
      },
    }
  );

  const { mutate: update, isLoading: loadingU } = useMutation(
    ({ id, data }) => updateInscription(id, data),
    {
      onSuccess: (_) => {
        showNotification({
          title: "Modification Inscription",
          message: "La Modification a été prise en compte !!",
          color: "green",
        });
        qc.invalidateQueries(key);
        qc.invalidateQueries(key2);
      },
      onError: (_) => {
        showNotification({
          title: "Modification Inscription",
          message: "La modification a echouée!!",
          color: "red",
        });
      },
    }
  );

  const setChecked = (id, checked) => {
    update({ id, data: { active: checked } });
  };

  const handleCreateInscription = () => {
    CreateInscription({ etudiant }).then(create);
  };

  const handleUpdateInscription = (ins) => {
    UpdateInscription({ etudiant, inscription: ins }).then(update);
  };

  return (
    <div className="my-10 mx-auto w-10/12">
      <LoadingOverlay
        visible={isLoading || loadingC || loadingU}
        overlayBlur={2}
      />
      {data && data?.length === 0 ? (
        <div>
          {" "}
          <Button onClick={handleCreateInscription} className="bg-cyan-900">
            INSCRIPTION <FaUniregistry />
          </Button>{" "}
        </div>
      ) : (
        <div>
          <Table>
            <thead>
              <tr>
                <th>ACTIVE</th>
                <th>SESSION</th>
                <th>FORMATION</th>
                <th>OPTION</th>
              </tr>
            </thead>
            <tbody>
              {data?.map((ins) => (
                <tr key={ins._id}>
                  <td>
                    <Checkbox
                      disabled={!ins.active && isOneActive}
                      checked={ins.active}
                      onChange={(event) =>
                        setChecked(ins._id, event.currentTarget.checked)
                      }
                    />
                  </td>
                  <td>{ins?.session?.nom}</td>
                  <td>{ins?.formation?.nom}</td>
                  <td>
                    <ActionIcon onClick={() => handleUpdateInscription(ins)}>
                      <FaPencilAlt />
                    </ActionIcon>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}
      {data && data?.length > 0 && (
        <div className="my-5 mx-5">
          {" "}
          <Button onClick={handleCreateInscription} className="bg-cyan-900">
            REINSCRIPTION <FaUniregistry />
          </Button>{" "}
        </div>
      )}
    </div>
  );
};
