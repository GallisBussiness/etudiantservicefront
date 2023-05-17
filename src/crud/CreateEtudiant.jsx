import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Controller, useForm } from "react-hook-form";
import { MaskField } from "react-mask-field";
import {
  Button,
  Input,
  LoadingOverlay,
  Radio,
  Select,
  Text,
  TextInput,
} from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import "dayjs/locale/fr";
import { parseISO } from "date-fns";
import { FaUser } from "react-icons/fa";
import { TbNumber } from "react-icons/tb";
import { createEtudiant } from "../services/etudiantservice";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useNavigate } from "react-router-dom";
import { showNotification } from "@mantine/notifications";
import { getFormations } from "../services/formationservice";
import { useState } from "react";
import { getActivateSessions } from "../services/sessionservice";
const schema = yup
  .object({
    prenom: yup.string().required(),
    nom: yup.string().required(),
    nce: yup.string(),
    cni: yup.string().required(),
    sexe: yup.string().required(),
    dateDeNaissance: yup.string().required(),
    lieuDeNaissance: yup.string().required(),
    adresse: yup.string(),
    telephone: yup.string().required(),
    email: yup.string(),
  })
  .required();

function CreateEtudiant() {
  const qc = useQueryClient();
  const navigate = useNavigate();
  const qk = ["get_Etudiants"];

  const defaultValues = {
    nce: "",
    cni: "",
    nom: "",
    prenom: "",
    sexe: "",
    dateDeNaissance: new Date().toISOString(),
    lieuDeNaissance: "",
    adresse: "",
    telephone: "",
    email: "neant@zig.univ.sn",
  };
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues,
  });
  const { mutate: create, isLoading: loadingC } = useMutation(
    (data) => createEtudiant(data),
    {
      onSuccess: (_) => {
        showNotification({
          title: "Création Etudiant",
          message: "La création a été prise en compte !!",
          color: "green",
        });
        qc.invalidateQueries(qk);
        navigate(`/dashboard/etudiants/${_._id}`);
      },
      onError: (_) => {
        showNotification({
          title: "Création Etudiant",
          message: "La création a echouée!!",
          color: "red",
        });
      },
    }
  );

  // const formations = [
  //   {
  //     value: "SS MEDECINE GENERALE NIVEAU 1",
  //     label: "SS MEDECINE GENERALE NIVEAU 1",
  //     group: "UFR DES SCIENCES DE LA SANTE",
  //   },
  //   {
  //     value: "SS MEDECINE GENERALE NIVEAU 2",
  //     label: "SS MEDECINE GENERALE NIVEAU 2",
  //     group: "UFR DES SCIENCES DE LA SANTE",
  //   },
  //   {
  //     value: "SS MEDECINE GENERALE NIVEAU 3",
  //     label: "SS MEDECINE GENERALE NIVEAU 3",
  //     group: "UFR DES SCIENCES DE LA SANTE",
  //   },
  //   {
  //     value: "SS MEDECINE GENERALE NIVEAU 4",
  //     label: "SS MEDECINE GENERALE NIVEAU 4",
  //     group: "UFR DES SCIENCES DE LA SANTE",
  //   },
  //   {
  //     value: "SS MEDECINE GENERALE NIVEAU 5",
  //     label: "SS MEDECINE GENERALE NIVEAU 5",
  //     group: "UFR DES SCIENCES DE LA SANTE",
  //   },
  //   {
  //     value: "SS MEDECINE GENERALE NIVEAU 6",
  //     label: "SS MEDECINE GENERALE NIVEAU 6",
  //     group: "UFR DES SCIENCES DE LA SANTE",
  //   },
  //   {
  //     value: "SS MEDECINE GENERALE NIVEAU 7",
  //     label: "SS MEDECINE GENERALE NIVEAU 7",
  //     group: "UFR DES SCIENCES DE LA SANTE",
  //   },
  //   {
  //     value: "SS MEDECINE GENERALE NIVEAU 8",
  //     label: "SS MEDECINE GENERALE NIVEAU 8",
  //     group: "UFR DES SCIENCES DE LA SANTE",
  //   },
  //   {
  //     value: "SS LICENCE PROFESSIONNELLE BIOLOGIE MÉDICALE NIVEAU 1",
  //     label: "SS LICENCE PROFESSIONNELLE BIOLOGIE MÉDICALE NIVEAU 1",
  //     group: "UFR DES SCIENCES DE LA SANTE",
  //   },
  //   {
  //     value: "SS LICENCE PROFESSIONNELLE BIOLOGIE MÉDICALE NIVEAU 2",
  //     label: "SS LICENCE PROFESSIONNELLE BIOLOGIE MÉDICALE NIVEAU 2",
  //     group: "UFR DES SCIENCES DE LA SANTE",
  //   },
  //   {
  //     value: "SS LICENCE PROFESSIONNELLE BIOLOGIE MÉDICALE NIVEAU 3",
  //     label: "SS LICENCE PROFESSIONNELLE BIOLOGIE MÉDICALE NIVEAU 3",
  //     group: "UFR DES SCIENCES DE LA SANTE",
  //   },
  //   {
  //     value: "SS LICENCE SCIENCES OBSTÉTRICALES NIVEAU 1",
  //     label: "SS LICENCE SCIENCES OBSTÉTRICALES NIVEAU 1",
  //     group: "UFR DES SCIENCES DE LA SANTE",
  //   },
  //   {
  //     value: "SS LICENCE SCIENCES OBSTÉTRICALES NIVEAU 2",
  //     label: "SS LICENCE SCIENCES OBSTÉTRICALES NIVEAU 2",
  //     group: "UFR DES SCIENCES DE LA SANTE",
  //   },
  //   {
  //     value: "SS LICENCE SCIENCES OBSTÉTRICALES NIVEAU 3",
  //     label: "SS LICENCE SCIENCES OBSTÉTRICALES NIVEAU 3",
  //     group: "UFR DES SCIENCES DE LA SANTE",
  //   },
  //   {
  //     value: "SS LICENCE SOINS INFIRMIERS NIVEAU 1",
  //     label: "SS LICENCE SOINS INFIRMIERS NIVEAU 1",
  //     group: "UFR DES SCIENCES DE LA SANTE",
  //   },
  //   {
  //     value: "SS LICENCE SOINS INFIRMIERS NIVEAU 2",
  //     label: "SS LICENCE SOINS INFIRMIERS NIVEAU 2",
  //     group: "UFR DES SCIENCES DE LA SANTE",
  //   },
  //   {
  //     value: "SS LICENCE SOINS INFIRMIERS NIVEAU 3",
  //     label: "SS LICENCE SOINS INFIRMIERS NIVEAU 3",
  //     group: "UFR DES SCIENCES DE LA SANTE",
  //   },
  //   {
  //     value: "SS MASTER THÉRAPIES DE SUPPLÉANCE RÉNALE NIVEAU 4",
  //     label: "SS MASTER THÉRAPIES DE SUPPLÉANCE RÉNALE NIVEAU 4",
  //     group: "UFR DES SCIENCES DE LA SANTE",
  //   },
  //   {
  //     value: "SES LICENCE SCIENCES JURIDIQUES NIVEAU 1",
  //     label: "SES LICENCE SCIENCES JURIDIQUES NIVEAU 1",
  //     group: "UFR SCIENCES ECONOMIQUES ET SOCIALES",
  //   },
  //   {
  //     value: "SES LICENCE SCIENCES JURIDIQUES NIVEAU 2",
  //     label: "SES LICENCE SCIENCES JURIDIQUES NIVEAU 2",
  //     group: "UFR SCIENCES ECONOMIQUES ET SOCIALES",
  //   },
  //   {
  //     value: "SES LICENCE DROIT DES AFFAIRES NIVEAU 3",
  //     label: "SES LICENCE DROIT DES AFFAIRES NIVEAU 3",
  //     group: "UFR SCIENCES ECONOMIQUES ET SOCIALES",
  //   },
  //   {
  //     value: "SES LICENCE DROIT PUBLIC ÉCONOMIQUE NIVEAU 3",
  //     label: "SES LICENCE DROIT PUBLIC ÉCONOMIQUE NIVEAU 3",
  //     group: "UFR SCIENCES ECONOMIQUES ET SOCIALES",
  //   },
  //   {
  //     value: "SES MASTER DROIT PRIVÉ NIVEAU 4",
  //     label: "SES MASTER DROIT PRIVÉ NIVEAU 4",
  //     group: "UFR SCIENCES ECONOMIQUES ET SOCIALES",
  //   },
  //   {
  //     value:
  //       "SES MASTER DROIT PRIVÉ SPÉCIALITÉ DROIT PRIVÉ FONDAMENTAL NIVEAU 5",
  //     label:
  //       "SES MASTER DROIT PRIVÉ SPÉCIALITÉ DROIT PRIVÉ FONDAMENTAL NIVEAU 5",
  //     group: "UFR SCIENCES ECONOMIQUES ET SOCIALES",
  //   },
  //   {
  //     value:
  //       "SES MASTER DROIT PRIVÉ SPÉCIALITÉ DROIT DES ACTIVITÉS ÉCONOMIQUES NIVEAU 5",
  //     label:
  //       "SES MASTER DROIT PRIVÉ SPÉCIALITÉ DROIT DES ACTIVITÉS ÉCONOMIQUES NIVEAU 5",
  //     group: "UFR SCIENCES ECONOMIQUES ET SOCIALES",
  //   },
  //   {
  //     value:
  //       "SES MASTER DROIT PUBLIC SPÉCIALITÉ DROIT ET ADMINISTRATION DES COLLECTIVITÉS TERRITORIALES NIVEAU 4",
  //     label:
  //       "SES MASTER DROIT PUBLIC SPÉCIALITÉ DROIT ET ADMINISTRATION DES COLLECTIVITÉS TERRITORIALES NIVEAU 4",
  //     group: "UFR SCIENCES ECONOMIQUES ET SOCIALES",
  //   },
  //   {
  //     value:
  //       "SES MASTER DROIT PUBLIC SPÉCIALITÉ DROIT ET ADMINISTRATION DES COLLECTIVITÉS TERRITORIALES NIVEAU 5",
  //     label:
  //       "SES MASTER DROIT PUBLIC SPÉCIALITÉ DROIT ET ADMINISTRATION DES COLLECTIVITÉS TERRITORIALES NIVEAU 5",
  //     group: "UFR SCIENCES ECONOMIQUES ET SOCIALES",
  //   },
  //   {
  //     value: "SES LICENCE ECONOMIE GESTION NIVEAU 1",
  //     label: "SES LICENCE ECONOMIE GESTION NIVEAU 1",
  //     group: "UFR SCIENCES ECONOMIQUES ET SOCIALES",
  //   },
  //   {
  //     value: "SES LICENCE ECONOMIE GESTION NIVEAU 2",
  //     label: "SES LICENCE ECONOMIE GESTION NIVEAU 2",
  //     group: "UFR SCIENCES ECONOMIQUES ET SOCIALES",
  //   },
  //   {
  //     value: "SES LICENCE GESTION DES ENTREPRISES NIVEAU 3",
  //     label: "SES LICENCE GESTION DES ENTREPRISES NIVEAU 3",
  //     group: "UFR SCIENCES ECONOMIQUES ET SOCIALES",
  //   },
  //   {
  //     value: "SES LICENCE ANALYSE ET POLITIQUE ÉCONOMIQUE NIVEAU 3",
  //     label: "SES LICENCE ANALYSE ET POLITIQUE ÉCONOMIQUE NIVEAU 3",
  //     group: "UFR SCIENCES ECONOMIQUES ET SOCIALES",
  //   },
  //   {
  //     value:
  //       "SES MASTER FINDEV SPÉCIALITÉ EVALUATION D'IMPACT DES POLITIQUES DE DÉVELOPPEMENT NIVEAU 4",
  //     label:
  //       "SES MASTER FINDEV SPÉCIALITÉ EVALUATION D'IMPACT DES POLITIQUES DE DÉVELOPPEMENT NIVEAU 4",
  //     group: "UFR SCIENCES ECONOMIQUES ET SOCIALES",
  //   },
  //   {
  //     value:
  //       "SES MASTER FINDEV SPÉCIALITÉ EVALUATION D'IMPACT DES POLITIQUES DE DÉVELOPPEMENT NIVEAU 5",
  //     label:
  //       "SES MASTER FINDEV SPÉCIALITÉ EVALUATION D'IMPACT DES POLITIQUES DE DÉVELOPPEMENT NIVEAU 5",
  //     group: "UFR SCIENCES ECONOMIQUES ET SOCIALES",
  //   },
  //   {
  //     value: "SES MASTER FINDEV SPÉCIALITÉ FINANCE NIVEAU 4",
  //     label: "SES MASTER FINDEV SPÉCIALITÉ FINANCE NIVEAU 4",
  //     group: "UFR SCIENCES ECONOMIQUES ET SOCIALES",
  //   },
  //   {
  //     value: "SES MASTER FINDEV SPÉCIALITÉ FINANCE NIVEAU 5",
  //     label: "SES MASTER FINDEV SPÉCIALITÉ FINANCE NIVEAU 5",
  //     group: "UFR SCIENCES ECONOMIQUES ET SOCIALES",
  //   },
  //   {
  //     value: "SES LICENCE MANAGEMENT INFORMATISÉ DES ORGANISATIONS NIVEAU 1",
  //     label: "SES LICENCE MANAGEMENT INFORMATISÉ DES ORGANISATIONS NIVEAU 1",
  //     group: "UFR SCIENCES ECONOMIQUES ET SOCIALES",
  //   },
  //   {
  //     value: "SES LICENCE MANAGEMENT INFORMATISÉ DES ORGANISATIONS NIVEAU 2",
  //     label: "SES LICENCE MANAGEMENT INFORMATISÉ DES ORGANISATIONS NIVEAU 2",
  //     group: "UFR SCIENCES ECONOMIQUES ET SOCIALES",
  //   },
  //   {
  //     value: "SES LICENCE MANAGEMENT INFORMATISÉ DES ORGANISATIONS NIVEAU 3",
  //     label: "SES LICENCE MANAGEMENT INFORMATISÉ DES ORGANISATIONS NIVEAU 3",
  //     group: "UFR SCIENCES ECONOMIQUES ET SOCIALES",
  //   },
  //   {
  //     value:
  //       "SES MASTER GESTION SPÉCIALITÉ MANAGEMENT DES SYSTÈMES D'INFORMATION AUTOMATISÉS NIVEAU 4",
  //     label:
  //       "SES MASTER GESTION SPÉCIALITÉ MANAGEMENT DES SYSTÈMES D'INFORMATION AUTOMATISÉS NIVEAU 4",
  //     group: "UFR SCIENCES ECONOMIQUES ET SOCIALES",
  //   },
  //   {
  //     value:
  //       "SES MASTER GESTION SPÉCIALITÉ MANAGEMENT DES SYSTÈMES D'INFORMATION AUTOMATISÉS NIVEAU 5",
  //     label:
  //       "SES MASTER GESTION SPÉCIALITÉ MANAGEMENT DES SYSTÈMES D'INFORMATION AUTOMATISÉS NIVEAU 5",
  //     group: "UFR SCIENCES ECONOMIQUES ET SOCIALES",
  //   },
  //   {
  //     value:
  //       "SES LICENCE PROFESSIONNELLE DUT+1 GESTION DE PROJETS ET CRÉATION D'ENTREPRISE NIVEAU 3",
  //     label:
  //       "SES LICENCE PROFESSIONNELLE DUT+1 GESTION DE PROJETS ET CRÉATION D'ENTREPRISE NIVEAU 3",
  //     group: "UFR SCIENCES ECONOMIQUES ET SOCIALES",
  //   },
  //   {
  //     value: "SES LICENCE SOCIOLOGIE NIVEAU 1",
  //     label: "SES LICENCE SOCIOLOGIE NIVEAU 1",
  //     group: "UFR SCIENCES ECONOMIQUES ET SOCIALES",
  //   },
  //   {
  //     value: "SES LICENCE SOCIOLOGIE NIVEAU 2",
  //     label: "SES LICENCE SOCIOLOGIE NIVEAU 2",
  //     group: "UFR SCIENCES ECONOMIQUES ET SOCIALES",
  //   },
  //   {
  //     value: "SES LICENCE SOCIOLOGIE NIVEAU 3",
  //     label: "SES LICENCE SOCIOLOGIE NIVEAU 3",
  //     group: "UFR SCIENCES ECONOMIQUES ET SOCIALES",
  //   },
  //   {
  //     value:
  //       "SES MASTER SOCIOLOGIE/POLITIQUES PUBLIQUES, CULTURES ET DÉVELOPPEMENT NIVEAU 4",
  //     label:
  //       "SES MASTER SOCIOLOGIE/POLITIQUES PUBLIQUES, CULTURES ET DÉVELOPPEMENT NIVEAU 4",
  //     group: "UFR SCIENCES ECONOMIQUES ET SOCIALES",
  //   },
  //   {
  //     value:
  //       "SES MASTER SOCIOLOGIE SPÉCIALITÉ MIGRATION, SANTÉ ET DÉVELOPPEMENT NIVEAU 5",
  //     label:
  //       "SES MASTER SOCIOLOGIE SPÉCIALITÉ MIGRATION, SANTÉ ET DÉVELOPPEMENT NIVEAU 5",
  //     group: "UFR SCIENCES ECONOMIQUES ET SOCIALES",
  //   },
  //   {
  //     value: "SES LICENCE TOURISME NIVEAU 1",
  //     label: "SES LICENCE TOURISME NIVEAU 1",
  //     group: "UFR SCIENCES ECONOMIQUES ET SOCIALES",
  //   },
  //   {
  //     value: "SES LICENCE TOURISME NIVEAU 2",
  //     label: "SES LICENCE TOURISME NIVEAU 2",
  //     group: "UFR SCIENCES ECONOMIQUES ET SOCIALES",
  //   },
  //   {
  //     value: "SES LICENCE TOURISME NIVEAU 3",
  //     label: "SES LICENCE TOURISME NIVEAU 3",
  //     group: "UFR SCIENCES ECONOMIQUES ET SOCIALES",
  //   },
  //   {
  //     value:
  //       "SES MASTER TOURISME SPÉCIALITÉ MANAGEMENT DES ACTIVITÉS DU TOURISME ET DE LA CULTURE NIVEAU 4",
  //     label:
  //       "SES MASTER TOURISME SPÉCIALITÉ MANAGEMENT DES ACTIVITÉS DU TOURISME ET DE LA CULTURE NIVEAU 4",
  //     group: "UFR SCIENCES ECONOMIQUES ET SOCIALES",
  //   },
  //   {
  //     value:
  //       "SES MASTER TOURISME SPÉCIALITÉ MANAGEMENT DES ACTIVITÉS DU TOURISME ET DE LA CULTURE NIVEAU 5",
  //     label:
  //       "SES MASTER TOURISME SPÉCIALITÉ MANAGEMENT DES ACTIVITÉS DU TOURISME ET DE LA CULTURE NIVEAU 5",
  //     group: "UFR SCIENCES ECONOMIQUES ET SOCIALES",
  //   },
  //   {
  //     value: "ST LICENCE PHYSIQUE CHIMIE NIVEAU 1",
  //     label: "ST LICENCE PHYSIQUE CHIMIE NIVEAU 1",
  //     group: "UFR SCIENCES ET TECHNOLOGIES",
  //   },
  //   {
  //     value: "ST LICENCE PHYSIQUE CHIMIE NIVEAU 2",
  //     label: "ST LICENCE PHYSIQUE CHIMIE NIVEAU 2",
  //     group: "UFR SCIENCES ET TECHNOLOGIES",
  //   },
  //   {
  //     value: "ST LICENCE MATHEMATIQUES PHYSIQUE INFORMATIQUE NIVEAU 1",
  //     label: "ST LICENCE MATHEMATIQUES PHYSIQUE INFORMATIQUE NIVEAU 1",
  //     group: "UFR SCIENCES ET TECHNOLOGIES",
  //   },
  //   {
  //     value: "ST LICENCE MATHEMATIQUES PHYSIQUE INFORMATIQUE NIVEAU 2",
  //     label: "ST LICENCE MATHEMATIQUES PHYSIQUE INFORMATIQUE NIVEAU 2",
  //     group: "UFR SCIENCES ET TECHNOLOGIES",
  //   },
  //   {
  //     value: "ST LICENCE MATHÉMATIQUES NIVEAU 3",
  //     label: "ST LICENCE MATHÉMATIQUES NIVEAU 3",
  //     group: "UFR SCIENCES ET TECHNOLOGIES",
  //   },
  //   {
  //     value: "ST LICENCE INFORMATIQUE NIVEAU 3",
  //     label: "ST LICENCE INFORMATIQUE NIVEAU 3",
  //     group: "UFR SCIENCES ET TECHNOLOGIES",
  //   },
  //   {
  //     value: "ST LICENCE CHIMIE NIVEAU 3",
  //     label: "ST LICENCE CHIMIE NIVEAU 3",
  //     group: "UFR SCIENCES ET TECHNOLOGIES",
  //   },
  //   {
  //     value: "ST LICENCE INGÉNIERIE INFORMATIQUE NIVEAU 1",
  //     label: "ST LICENCE INGÉNIERIE INFORMATIQUE NIVEAU 1",
  //     group: "UFR SCIENCES ET TECHNOLOGIES",
  //   },
  //   {
  //     value: "ST LICENCE INGÉNIERIE INFORMATIQUE NIVEAU 2",
  //     label: "ST LICENCE INGÉNIERIE INFORMATIQUE NIVEAU 2",
  //     group: "UFR SCIENCES ET TECHNOLOGIES",
  //   },
  //   {
  //     value: "ST LICENCE INGÉNIERIE INFORMATIQUE NIVEAU 3",
  //     label: "ST LICENCE INGÉNIERIE INFORMATIQUE NIVEAU 3",
  //     group: "UFR SCIENCES ET TECHNOLOGIES",
  //   },
  //   {
  //     value: "ST LICENCE AGROFORESTERIE NIVEAU 1",
  //     label: "ST LICENCE AGROFORESTERIE NIVEAU 1",
  //     group: "UFR SCIENCES ET TECHNOLOGIES",
  //   },
  //   {
  //     value: "ST LICENCE AGROFORESTERIE NIVEAU 2",
  //     label: "ST LICENCE AGROFORESTERIE NIVEAU 2",
  //     group: "UFR SCIENCES ET TECHNOLOGIES",
  //   },
  //   {
  //     value: "ST LICENCE AGROFORESTERIE NIVEAU 3",
  //     label: "ST LICENCE AGROFORESTERIE NIVEAU 3",
  //     group: "UFR SCIENCES ET TECHNOLOGIES",
  //   },
  //   {
  //     value: "ST LICENCE GEOGRAPHIE NIVEAU 1",
  //     label: "ST LICENCE GEOGRAPHIE NIVEAU 1",
  //     group: "UFR SCIENCES ET TECHNOLOGIES",
  //   },
  //   {
  //     value: "ST LICENCE GEOGRAPHIE NIVEAU 2",
  //     label: "ST LICENCE GEOGRAPHIE NIVEAU 2",
  //     group: "UFR SCIENCES ET TECHNOLOGIES",
  //   },
  //   {
  //     value: "ST LICENCE GEOGRAPHIE NIVEAU 3",
  //     label: "ST LICENCE GEOGRAPHIE NIVEAU 3",
  //     group: "UFR SCIENCES ET TECHNOLOGIES",
  //   },
  //   {
  //     value:
  //       "ST LICENCE PROFESSIONNELLE AGRORESSOURCES VÉGÉTALES ET ENTREPRENARIAT NIVEAU 3",
  //     label:
  //       "ST LICENCE PROFESSIONNELLE AGRORESSOURCES VÉGÉTALES ET ENTREPRENARIAT NIVEAU 3",
  //     group: "UFR SCIENCES ET TECHNOLOGIES",
  //   },
  //   {
  //     value:
  //       "ST LICENCE PROFESSIONNELLE ENERGIES RENOUVELABLES ET EFFICACITE ENERGÉTIQUE NIVEAU 3",
  //     label:
  //       "ST LICENCE PROFESSIONNELLE ENERGIES RENOUVELABLES ET EFFICACITE ENERGÉTIQUE NIVEAU 3",
  //     group: "UFR SCIENCES ET TECHNOLOGIES",
  //   },
  //   {
  //     value: "ST LICENCE PROFESSIONNELLE CREATION MULTIMEDIA NIVEAU 1",
  //     label: "ST LICENCE PROFESSIONNELLE CREATION MULTIMEDIA NIVEAU 1",
  //     group: "UFR SCIENCES ET TECHNOLOGIES",
  //   },
  //   {
  //     value: "ST LICENCE PROFESSIONNELLE CREATION MULTIMEDIA NIVEAU 2",
  //     label: "ST LICENCE PROFESSIONNELLE CREATION MULTIMEDIA NIVEAU 2",
  //     group: "UFR SCIENCES ET TECHNOLOGIES",
  //   },
  //   {
  //     value: "ST LICENCE PROFESSIONNELLE CREATION MULTIMEDIA NIVEAU 3",
  //     label: "ST LICENCE PROFESSIONNELLE CREATION MULTIMEDIA NIVEAU 3",
  //     group: "UFR SCIENCES ET TECHNOLOGIES",
  //   },
  //   {
  //     value:
  //       "ST MASTER AGROFORESTERIE SPECIALITE AMENAGEMENT ET GESTION DURABLE DES ECOSYSTEMES FORESTIERS ET AGROFORESTIERS NIVEAU 4",
  //     label:
  //       "ST MASTER AGROFORESTERIE SPECIALITE AMENAGEMENT ET GESTION DURABLE DES ECOSYSTEMES FORESTIERS ET AGROFORESTIERS NIVEAU 4",
  //     group: "UFR SCIENCES ET TECHNOLOGIES",
  //   },
  //   {
  //     value:
  //       "ST MASTER AGROFORESTERIE SPECIALITE AMENAGEMENT ET GESTION DURABLE DES ECOSYSTEMES FORESTIERS ET AGROFORESTIERS NIVEAU 5",
  //     label:
  //       "ST MASTER AGROFORESTERIE SPECIALITE AMENAGEMENT ET GESTION DURABLE DES ECOSYSTEMES FORESTIERS ET AGROFORESTIERS NIVEAU 5",
  //     group: "UFR SCIENCES ET TECHNOLOGIES",
  //   },
  //   {
  //     value:
  //       "ST MASTER CHIMIE SPÉCIALITE CHIMIE DU SOLIDE ET DES MATERIAUX NIVEAU 4",
  //     label:
  //       "ST MASTER CHIMIE SPÉCIALITE CHIMIE DU SOLIDE ET DES MATERIAUX NIVEAU 4",
  //     group: "UFR SCIENCES ET TECHNOLOGIES",
  //   },
  //   {
  //     value:
  //       "ST MASTER CHIMIE SPÉCIALITE CHIMIE DU SOLIDE ET DES MATERIAUX NIVEAU 5",
  //     label:
  //       "ST MASTER CHIMIE SPÉCIALITE CHIMIE DU SOLIDE ET DES MATERIAUX NIVEAU 5",
  //     group: "UFR SCIENCES ET TECHNOLOGIES",
  //   },
  //   {
  //     value:
  //       "ST MASTER CHIMIE SPECIALITE SYNTHESE ORGANIQUE ET PRODUITS NATURELS NIVEAU 4",
  //     label:
  //       "ST MASTER CHIMIE SPECIALITE SYNTHESE ORGANIQUE ET PRODUITS NATURELS NIVEAU 4",
  //     group: "UFR SCIENCES ET TECHNOLOGIES",
  //   },
  //   {
  //     value:
  //       "ST MASTER CHIMIE SPECIALITE SYNTHESE ORGANIQUE ET PRODUITS NATURELS NIVEAU 5",
  //     label:
  //       "ST MASTER CHIMIE SPECIALITE SYNTHESE ORGANIQUE ET PRODUITS NATURELS NIVEAU 5",
  //     group: "UFR SCIENCES ET TECHNOLOGIES",
  //   },
  //   {
  //     value:
  //       "ST MASTER GÉOGRAPHIE / ESPACES, SOCIÉTÉS ET DÉVELOPPEMENT NIVEAU 4",
  //     label:
  //       "ST MASTER GÉOGRAPHIE / ESPACES, SOCIÉTÉS ET DÉVELOPPEMENT NIVEAU 4",
  //     group: "UFR SCIENCES ET TECHNOLOGIES",
  //   },
  //   {
  //     value:
  //       "ST MASTER GEOGRAPHIE SPÉCIALITÉ AMÊNAGEMENT ET TERRITOIRES NIVEAU 4",
  //     label:
  //       "ST MASTER GEOGRAPHIE SPÉCIALITÉ AMÊNAGEMENT ET TERRITOIRES NIVEAU 4",
  //     group: "UFR SCIENCES ET TECHNOLOGIES",
  //   },
  //   {
  //     value:
  //       "ST MASTER GEOGRAPHIE SPÉCIALITÉ AMÊNAGEMENT ET TERRITOIRES NIVEAU 5",
  //     label:
  //       "ST MASTER GEOGRAPHIE SPÉCIALITÉ AMÊNAGEMENT ET TERRITOIRES NIVEAU 5",
  //     group: "UFR SCIENCES ET TECHNOLOGIES",
  //   },
  //   {
  //     value:
  //       "ST MASTER GÉOGRAPHIE SPÉCIALITÉ ENVIRONNEMENT ET DÉVELOPPEMENT NIVEAU 5",
  //     label:
  //       "ST MASTER GÉOGRAPHIE SPÉCIALITÉ ENVIRONNEMENT ET DÉVELOPPEMENT NIVEAU 5",
  //     group: "UFR SCIENCES ET TECHNOLOGIES",
  //   },
  //   {
  //     value: "ST MASTER INFORMATIQUE SPÉCIALITÉ GÉNIE LOGICIEL NIVEAU 4",
  //     label: "ST MASTER INFORMATIQUE SPÉCIALITÉ GÉNIE LOGICIEL NIVEAU 4",
  //     group: "UFR SCIENCES ET TECHNOLOGIES",
  //   },
  //   {
  //     value: "ST MASTER INFORMATIQUE SPÉCIALITÉ GÉNIE LOGICIEL NIVEAU 5",
  //     label: "ST MASTER INFORMATIQUE SPÉCIALITÉ GÉNIE LOGICIEL NIVEAU 5",
  //     group: "UFR SCIENCES ET TECHNOLOGIES",
  //   },
  //   {
  //     value: "ST MASTER INFORMATIQUE SPÉCIALITÉ RÉSEAUX ET SYSTÈMES NIVEAU 4",
  //     label: "ST MASTER INFORMATIQUE SPÉCIALITÉ RÉSEAUX ET SYSTÈMES NIVEAU 4",
  //     group: "UFR SCIENCES ET TECHNOLOGIES",
  //   },
  //   {
  //     value: "ST MASTER INFORMATIQUE SPÉCIALITÉ RÉSEAUX ET SYSTÈMES NIVEAU 5",
  //     label: "ST MASTER INFORMATIQUE SPÉCIALITÉ RÉSEAUX ET SYSTÈMES NIVEAU 5",
  //     group: "UFR SCIENCES ET TECHNOLOGIES",
  //   },
  //   {
  //     value:
  //       "ST MASTER MATHÉMATIQUES ET APPLICATIONS SPÉCIALITÉ MATHÉMATIQUES APPLIQUÉES NIVEAU 4",
  //     label:
  //       "ST MASTER MATHÉMATIQUES ET APPLICATIONS SPÉCIALITÉ MATHÉMATIQUES APPLIQUÉES NIVEAU 4",
  //     group: "UFR SCIENCES ET TECHNOLOGIES",
  //   },
  //   {
  //     value:
  //       "ST MASTER MATHÉMATIQUES ET APPLICATIONS SPÉCIALITÉ MATHÉMATIQUES APPLIQUÉES NIVEAU 5",
  //     label:
  //       "ST MASTER MATHÉMATIQUES ET APPLICATIONS SPÉCIALITÉ MATHÉMATIQUES APPLIQUÉES NIVEAU 5",
  //     group: "UFR SCIENCES ET TECHNOLOGIES",
  //   },
  //   {
  //     value:
  //       "ST MASTER PHYSIQUE SPECIALITE INTERUNIVERSITAIRE EN ENERGIE RENOUVELABLE NIVEAU 4",
  //     label:
  //       "ST MASTER PHYSIQUE SPECIALITE INTERUNIVERSITAIRE EN ENERGIE RENOUVELABLE NIVEAU 4",
  //     group: "UFR SCIENCES ET TECHNOLOGIES",
  //   },
  //   {
  //     value:
  //       "ST MASTER PHYSIQUE SPECIALITE INTERUNIVERSITAIRE EN ENERGIE RENOUVELABLE NIVEAU 5",
  //     label:
  //       "ST MASTER PHYSIQUE SPECIALITE INTERUNIVERSITAIRE EN ENERGIE RENOUVELABLE NIVEAU 5",
  //     group: "UFR SCIENCES ET TECHNOLOGIES",
  //   },
  //   {
  //     value: "ST MASTER PHYSIQUE SPECIALITE PHYSIQUE DES MATÉRIAUX NIVEAU 4",
  //     label: "ST MASTER PHYSIQUE SPECIALITE PHYSIQUE DES MATÉRIAUX NIVEAU 4",
  //     group: "UFR SCIENCES ET TECHNOLOGIES",
  //   },
  //   {
  //     value: "ST MASTER PHYSIQUE SPECIALITE PHYSIQUE DES MATÉRIAUX NIVEAU 5",
  //     label: "ST MASTER PHYSIQUE SPECIALITE PHYSIQUE DES MATÉRIAUX NIVEAU 5",
  //     group: "UFR SCIENCES ET TECHNOLOGIES",
  //   },
  //   {
  //     value:
  //       "ST MASTER PHYSIQUE SPECIALITE SCIENCE DE L'ATMOSPHÈRE ET D'OCÉANOGRAPHIE NIVEAU 4",
  //     label:
  //       "ST MASTER PHYSIQUE SPECIALITE SCIENCE DE L'ATMOSPHÈRE ET D'OCÉANOGRAPHIE NIVEAU 4",
  //     group: "UFR SCIENCES ET TECHNOLOGIES",
  //   },
  //   {
  //     value:
  //       "ST MASTER PHYSIQUE SPECIALITE SCIENCE DE L'ATMOSPHÈRE ET D'OCÉANOGRAPHIE NIVEAU 5",
  //     label:
  //       "ST MASTER PHYSIQUE SPECIALITE SCIENCE DE L'ATMOSPHÈRE ET D'OCÉANOGRAPHIE NIVEAU 5",
  //     group: "UFR SCIENCES ET TECHNOLOGIES",
  //   },
  //   {
  //     value: "LASHU LICENCE HISTOIRE ET CIVILISATIONS NIVEAU 1",
  //     label: "LASHU LICENCE HISTOIRE ET CIVILISATIONS NIVEAU 1",
  //     group: "UFR LETTRES, ARTS ET SCIENCES HUMAINES",
  //   },
  //   {
  //     value: "LASHU LICENCE HISTOIRE ET CIVILISATIONS NIVEAU 2",
  //     label: "LASHU LICENCE HISTOIRE ET CIVILISATIONS NIVEAU 2",
  //     group: "UFR LETTRES, ARTS ET SCIENCES HUMAINES",
  //   },
  //   {
  //     value: "LASHU LICENCE HISTOIRE ET CIVILISATIONS NIVEAU 3",
  //     label: "LASHU LICENCE HISTOIRE ET CIVILISATIONS NIVEAU 3",
  //     group: "UFR LETTRES, ARTS ET SCIENCES HUMAINES",
  //   },
  //   {
  //     value: "LASHU LICENCE LANGUES ETRANGERES APPLIQUEES NIVEAU 1",
  //     label: "LASHU LICENCE LANGUES ETRANGERES APPLIQUEES NIVEAU 1",
  //     group: "UFR LETTRES, ARTS ET SCIENCES HUMAINES",
  //   },
  //   {
  //     value: "LASHU LICENCE LANGUES ETRANGERES APPLIQUEES NIVEAU 2",
  //     label: "LASHU LICENCE LANGUES ETRANGERES APPLIQUEES NIVEAU 2",
  //     group: "UFR LETTRES, ARTS ET SCIENCES HUMAINES",
  //   },
  //   {
  //     value: "LASHU LICENCE LANGUES ETRANGERES APPLIQUEES NIVEAU 3",
  //     label: "LASHU LICENCE LANGUES ETRANGERES APPLIQUEES NIVEAU 3",
  //     group: "UFR LETTRES, ARTS ET SCIENCES HUMAINES",
  //   },
  //   {
  //     value: "LASHU LICENCE LETTRES MODERNES NIVEAU 1",
  //     label: "LASHU LICENCE LETTRES MODERNES NIVEAU 1",
  //     group: "UFR LETTRES, ARTS ET SCIENCES HUMAINES",
  //   },
  //   {
  //     value: "LASHU LICENCE LETTRES MODERNES NIVEAU 2",
  //     label: "LASHU LICENCE LETTRES MODERNES NIVEAU 2",
  //     group: "UFR LETTRES, ARTS ET SCIENCES HUMAINES",
  //   },
  //   {
  //     value: "LASHU LICENCE LETTRES MODERNES NIVEAU 3",
  //     label: "LASHU LICENCE LETTRES MODERNES NIVEAU 3",
  //     group: "UFR LETTRES, ARTS ET SCIENCES HUMAINES",
  //   },
  //   {
  //     value:
  //       "LASHU MASTER LEA SPECIALITÉ COOPÉRATION INTERNATIONALE ET DÉVELOPPEMENT NIVEAU 4",
  //     label:
  //       "LASHU MASTER LEA SPECIALITÉ COOPÉRATION INTERNATIONALE ET DÉVELOPPEMENT NIVEAU 4",
  //     group: "UFR LETTRES, ARTS ET SCIENCES HUMAINES",
  //   },
  //   {
  //     value:
  //       "LASHU MASTER LEA SPECIALITÉ COOPÉRATION INTERNATIONALE ET DÉVELOPPEMENT NIVEAU 5",
  //     label:
  //       "LASHU MASTER LEA SPECIALITÉ COOPÉRATION INTERNATIONALE ET DÉVELOPPEMENT NIVEAU 5",
  //     group: "UFR LETTRES, ARTS ET SCIENCES HUMAINES",
  //   },
  //   {
  //     value:
  //       "LASHU MASTER LETTRES MODERNES SPÉCIALITÉ ETUDES LITTÉRAIRES NIVEAU 4",
  //     label:
  //       "LASHU MASTER LETTRES MODERNES SPÉCIALITÉ ETUDES LITTÉRAIRES NIVEAU 4",
  //     group: "UFR LETTRES, ARTS ET SCIENCES HUMAINES",
  //   },
  //   {
  //     value:
  //       "LASHU MASTER LETTRES MODERNES SPÉCIALITÉ ETUDES LITTÉRAIRES NIVEAU 5",
  //     label:
  //       "LASHU MASTER LETTRES MODERNES SPÉCIALITÉ ETUDES LITTÉRAIRES NIVEAU 5",
  //     group: "UFR LETTRES, ARTS ET SCIENCES HUMAINES",
  //   },
  //   {
  //     value:
  //       "LASHU MASTER LETTRES MODERNES SPÉCIALITÉ SCIENCE DU LANGAGE NIVEAU 4",
  //     label:
  //       "LASHU MASTER LETTRES MODERNES SPÉCIALITÉ SCIENCE DU LANGAGE NIVEAU 4",
  //     group: "UFR LETTRES, ARTS ET SCIENCES HUMAINES",
  //   },
  //   {
  //     value:
  //       "LASHU MASTER LETTRES MODERNES SPÉCIALITÉ SCIENCE DU LANGAGE NIVEAU 5",
  //     label:
  //       "LASHU MASTER LETTRES MODERNES SPÉCIALITÉ SCIENCE DU LANGAGE NIVEAU 5",
  //     group: "UFR LETTRES, ARTS ET SCIENCES HUMAINES",
  //   },
  //   {
  //     value: "LASHU MASTER SCIENCES HISTORIQUES NIVEAU 4",
  //     label: "LASHU MASTER SCIENCES HISTORIQUES NIVEAU 4",
  //     group: "UFR LETTRES, ARTS ET SCIENCES HUMAINES",
  //   },
  //   {
  //     value: "LASHU MASTER SCIENCES HISTORIQUES NIVEAU 5",
  //     label: "LASHU MASTER SCIENCES HISTORIQUES NIVEAU 5",
  //     group: "UFR LETTRES, ARTS ET SCIENCES HUMAINES",
  //   },
  // ];

  return (
    <div className="card w-5/12 mx-auto my-10 shadow-2xl bg-gradient-to-br from-white to-cyan-500 opacity-90  p-5 animate__animated animate__zoomIn animate__faster">
      <LoadingOverlay visible={loadingC} overlayBlur={2} />
      <div className="my-5 flex items-center justify-center bg-cyan-900 py-2 rounded-md">
        <Text size={28} fw="bold" className="text-white">
          CREATION D'UN ETUDIANT
        </Text>
      </div>
      <form onSubmit={handleSubmit(create)} method="POST">
        <div>
          <Controller
            control={control}
            name="nce"
            render={({ field }) => (
              <TextInput
                label="Numéro carte d'étudiant"
                error={errors.nce && errors.nce.message}
                value={field.value}
                onChange={field.onChange}
                rightSection={<TbNumber className="text-cyan-900" />}
              />
            )}
          />
        </div>
        <div>
          <Controller
            control={control}
            name="cni"
            render={({ field }) => (
              <TextInput
                value={field.value}
                onChange={field.onChange}
                label="CNI"
                error={errors.cni && errors.cni.message}
                placeholder="CNI de l'étudiant"
                rightSection={<TbNumber className="text-cyan-900" />}
              />
            )}
          />
        </div>
        <div>
          <Controller
            control={control}
            name="prenom"
            render={({ field }) => (
              <TextInput
                value={field.value}
                onChange={field.onChange}
                label="Prenom"
                error={errors.nom && errors.nom.message}
                placeholder="prenom de l'étudiant"
                rightSection={<FaUser className="text-cyan-900" />}
              />
            )}
          />
        </div>
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
                placeholder="Nom de l'étudiant"
                rightSection={<FaUser className="text-cyan-900" />}
              />
            )}
          />
        </div>
        <div className="my-5">
          <Controller
            control={control}
            name="sexe"
            render={({ field }) => (
              <Radio.Group
                value={field.value}
                onChange={field.onChange}
                name="sexe"
                error={errors.sexe && errors.sexe.message}
                label="Selectionnez le sexe"
              >
                <div className="flex items-center space-x-2">
                  <Radio value="H" label="HOMME" />
                  <Radio value="F" label="FEMME" />
                </div>
              </Radio.Group>
            )}
          />
        </div>
        <div>
          <Controller
            control={control}
            name="dateDeNaissance"
            render={({ field }) => (
              <DatePickerInput
                placeholder="Choisir la date de Naissance"
                label="Date de Naissance"
                locale="fr"
                value={parseISO(field.value)}
                onChange={(v) => field.onChange(v.toISOString())}
                error={errors.dateDeNaissance && errors.dateDeNaissance.message}
              />
            )}
          />
        </div>
        <div>
          <Controller
            control={control}
            name="lieuDeNaissance"
            render={({ field }) => (
              <TextInput
                value={field.value}
                onChange={field.onChange}
                label="lieu de Naissance"
                error={errors.lieuDeNaissance && errors.lieuDeNaissance.message}
                placeholder="Lieu de Naissance"
              />
            )}
          />
        </div>
        <div>
          <Controller
            control={control}
            name="adresse"
            render={({ field }) => (
              <TextInput
                value={field.value}
                onChange={field.onChange}
                label="Adresse"
                error={errors.adresse && errors.adresse.message}
                placeholder="Adresse de l'étudiant"
              />
            )}
          />
        </div>
        <div>
          <Controller
            control={control}
            name="email"
            render={({ field }) => (
              <TextInput
                value={field.value}
                onChange={field.onChange}
                label="EMAIL"
                error={errors.email && errors.email.message}
                placeholder="Email de l'étudiant"
              />
            )}
          />
        </div>
        <div>
          <Controller
            control={control}
            name="telephone"
            render={({ field }) => (
              <Input.Wrapper
                id="tel"
                label="Téléphone"
                error={errors.telephone && errors.telephone.message}
                required
              >
                <Input
                  component={MaskField}
                  mask="_________"
                  replacement={{ _: /\d/ }}
                  id="tel"
                  placeholder="Numéro de téléphone"
                  value={field.value}
                  onChange={field.onChange}
                />
              </Input.Wrapper>
            )}
          />
        </div>
        <div className="flex items-center justify-between my-5">
          <div>
            <Button type="submit" className="bg-sky-900 hover:bg-cyan-600">
              CREER L'ETUDIANT
            </Button>
          </div>
          <div>
            <Button
              type="button"
              onClick={() => navigate("/dashboard/etudiants")}
              className="bg-red-900 hover:bg-red-600"
            >
              ANNULER
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default CreateEtudiant;
