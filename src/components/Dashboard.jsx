import { BackgroundImage, Button } from "@mantine/core";
import { useAuthUser, useSignOut } from "react-auth-kit";
import { useQuery, useQueryClient } from "react-query";
import { Route, Routes, Link, useNavigate } from "react-router-dom";
import { getAuth } from "../services/authservice";
import Users from "./Users";
import Etudiants from "./Etudiants";
import {
  FaDiscourse,
  FaUniversity,
  FaUser,
  FaUsers,
  FaWindows,
} from "react-icons/fa";
import { FcDepartment } from "react-icons/fc";
import CreateEtudiant from "../crud/CreateEtudiant";
import UpdateEtudiant from "../crud/UpdateEtudiant";
import { CreateUser } from "../crud/CreateUser";
import { UpdateUser } from "../crud/UpdateUser";
import { Ufrs } from "./Ufrs";
import { CreateUfr } from "../crud/CreateUfr";
import { UpdateUfr } from "../crud/UpdateUfr";
import { CreateDepartement } from "../crud/CreateDepartement";
import { UpdateDepartement } from "../crud/UpdateDepartement";
import { Departements } from "./Departements";
import { UpdateFormation } from "../crud/UpdateFormation";
import { CreateFormation } from "../crud/CreateFormation";
import { Formations } from "./Formations";
import Etudiant from "./Etudiant";
import { Sessions } from "./Sessions";
import { UpdateSession } from "../crud/UpdateSession";
import { CreateSession } from "../crud/CreateSession";

const Dashboard = () => {
  const auth = useAuthUser()();
  const qk = ["auth", auth?.id];
  const { data } = useQuery(qk, () => getAuth(auth?.id), {
    stateTime: 100_000,
    refetchOnWindowFocus: false,
  });
  const qc = useQueryClient();
  const navigate = useNavigate();
  const signOut = useSignOut();

  const logout = () => {
    if (signOut()) {
      qc.clear();
      navigate("/login", { replace: true });
    }
  };

  return (
    <BackgroundImage src="/img/bg.png" className="overflow-x-hidden">
      <div className="drawer drawer-mobile">
        <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content flex flex-col">
          <div className="navbar bg-sky-500">
            <div className="flex-none">
              <button className="btn btn-square btn-ghost">
                <label
                  htmlFor="my-drawer-2"
                  className="btn bg-white drawer-button py-0 px-2"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    className="inline-block w-5 h-5 stroke-current"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 6h16M4 12h16M4 18h16"
                    ></path>
                  </svg>{" "}
                </label>
              </button>
            </div>
            <div className="flex-1">
              <a className="btn btn-ghost normal-case text-xl mx-2 text-white">
                SERVICE ETUDIANT
              </a>
            </div>
          </div>
          <Routes>
            <Route path="" element={<Etudiants />} />
            <Route path="users" element={<Users />} />
            <Route path="users/create" element={<CreateUser />} />
            <Route path="users/update/:id" element={<UpdateUser />} />
            <Route path="ufrs" element={<Ufrs />} />
            <Route path="ufrs/create" element={<CreateUfr />} />
            <Route path="ufrs/update/:id" element={<UpdateUfr />} />
            <Route path="sessions" element={<Sessions />} />
            <Route path="sessions/create" element={<CreateSession />} />
            <Route path="sessions/update/:id" element={<UpdateSession />} />
            <Route path="formations" element={<Formations />} />
            <Route path="formations/create" element={<CreateFormation />} />
            <Route path="formations/update/:id" element={<UpdateFormation />} />
            <Route path="departements" element={<Departements />} />
            <Route path="departements/create" element={<CreateDepartement />} />
            <Route
              path="departements/update/:id"
              element={<UpdateDepartement />}
            />
            <Route path="etudiants" element={<Etudiants />} />
            <Route path="etudiants/:id" element={<Etudiant />} />
            <Route path="etudiants/create" element={<CreateEtudiant />} />
            <Route path="etudiants/update/:id" element={<UpdateEtudiant />} />
          </Routes>
        </div>
        <div className="drawer-side">
          <label htmlFor="my-drawer-2" className="drawer-overlay"></label>
          <div className="bg-sky-900 w-80">
            <div className=" flex items-center justify-center my-5">
              <div className="avatar">
                <div className="w-24 rounded">
                  <img src="/img/logo.png" />
                </div>
              </div>
            </div>
            <div className="bg-cyan-500 w-80 flex flex-col items-center justify-between space-y-20 py-5">
              <ul className="menu p-2 rounded-box bg-white w-full">
                <Link
                  to="/dashboard/users"
                  className="bg-white hover:bg-orange-400 hover:text-white rounded-md shadow-md text-center py-2"
                >
                  <FaUser className="inline text-green-600" /> UTILISATEURS
                </Link>
                <Link
                  to="/dashboard/etudiants"
                  className="bg-white hover:bg-orange-400 hover:text-white rounded-md shadow-md text-center py-2"
                >
                  <FaUsers className="inline text-green-600" /> ETUDIANTS
                </Link>
                <Link
                  to="/dashboard/ufrs"
                  className="bg-white hover:bg-orange-400 hover:text-white rounded-md shadow-md text-center py-2"
                >
                  <FaUniversity className="inline text-green-600" /> UFRS
                </Link>
                <Link
                  to="/dashboard/departements"
                  className="bg-white hover:bg-orange-400 hover:text-white rounded-md shadow-md text-center py-2"
                >
                  <FcDepartment className="inline text-green-600" />{" "}
                  DEPARTEMENTS
                </Link>
                <Link
                  to="/dashboard/formations"
                  className="bg-white hover:bg-orange-400 hover:text-white rounded-md shadow-md text-center py-2"
                >
                  <FaDiscourse className="inline text-green-600" /> FORMATIONS
                </Link>
                <Link
                  to="/dashboard/sessions"
                  className="bg-white hover:bg-orange-400 hover:text-white rounded-md shadow-md text-center py-2"
                >
                  <FaWindows className="inline text-green-600" /> SESSIONS
                </Link>
              </ul>
              <Button
                onClick={logout}
                className="bg-blue-500 hover:bg-orange-400 hover:text-white rounded-md shadow-md text-center py-2 animate-pulse"
              >
                SE DECONNECTER
              </Button>
            </div>
          </div>
        </div>
      </div>
    </BackgroundImage>
  );
};

export default Dashboard;
