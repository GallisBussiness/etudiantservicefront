import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import { getEtudiantById } from "../services/etudiantservice";
import { useRef } from "react";
import { Toast } from "primereact/toast";
import { UserInfo } from "./UserInfo";
import { LoadingOverlay } from "@mantine/core";
import ModalContainer from "react-modal-promise";

function Etudiant() {
  const { id } = useParams();
  const toast = useRef();
  const key = ["get_Etudiant", id];
  const { data, isLoading } = useQuery(key, () => getEtudiantById(id));
  return (
    <div className="w-full">
      <LoadingOverlay visible={isLoading} overlayBlur={2} />
      {data && (
        <>
          <UserInfo etudiant={data} />
        </>
      )}
      <Toast ref={toast} />
      <ModalContainer />
    </div>
  );
}

export default Etudiant;
