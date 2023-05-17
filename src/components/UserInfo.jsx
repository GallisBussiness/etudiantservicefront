import {
  createStyles,
  Avatar,
  Text,
  Group,
  LoadingOverlay,
} from "@mantine/core";
import { FaPhone, FaUserGraduate, FaVoicemail } from "react-icons/fa";
import { InscriptionView } from "./InscriptionView";
import TakePhotoModal from "../crud/TakePhotoModal";
import { useMutation, useQueryClient } from "react-query";
import { showNotification } from "@mantine/notifications";
import { updateEtudiantAvatar } from "../services/etudiantservice";

const useStyles = createStyles((theme) => ({
  name: {
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
  },
}));

export function UserInfo({ etudiant }) {
  const { classes } = useStyles();
  const qc = useQueryClient();
  const key = ["get_Etudiant", etudiant?._id];
  const { mutate: update, isLoading: loadingU } = useMutation(
    ({ id, data }) => updateEtudiantAvatar(id, data),
    {
      onSuccess: (_) => {
        showNotification({
          title: "Modification Etudiant",
          message: "La modification a été prise en compte !!",
          color: "green",
        });
        qc.invalidateQueries(key);
      },
      onError: (_) => {
        showNotification({
          title: "Modification Etudiant",
          message: "La modification a echouée!!",
          color: "red",
        });
      },
    }
  );

  const handleUpdatePhoto = () => {
    TakePhotoModal().then((v) =>
      update({ id: etudiant?._id, data: { avatar: v } })
    );
  };

  return (
    <div className="px-5 py-10 bg-slate-50 w-full">
      <LoadingOverlay visible={loadingU} overlayBlur={2} />
      <Group noWrap>
        <Avatar
          src={`${import.meta.env.VITE_BACKURL}/${etudiant?.avatar}`}
          size={94}
          radius="xl"
          onClick={handleUpdatePhoto}
        />
        <div>
          <Text
            size="lg"
            sx={{ textTransform: "uppercase" }}
            weight={700}
            className={classes.name}
          >
            {etudiant?.prenom}
          </Text>

          <Text size="lg" weight={500} className={classes.name}>
            {etudiant?.nom}
          </Text>

          <Group noWrap spacing={10} mt={3}>
            <FaVoicemail stroke={1.5} size={16} className={classes.name} />
            <Text size="md">{etudiant?.email}</Text>
          </Group>

          <Group noWrap spacing={10} mt={5}>
            <FaPhone size={16} className={classes.name} />
            <Text size="md">{etudiant?.telephone}</Text>
          </Group>
          <Group noWrap spacing={10} mt={5}>
            <FaUserGraduate size={16} className={classes.name} />
            <Text size="md">{etudiant?.formation?.nom}</Text>
          </Group>
        </div>
      </Group>
      <InscriptionView etudiant={etudiant} />
    </div>
  );
}
