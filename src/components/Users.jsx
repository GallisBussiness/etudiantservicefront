import { FilterMatchMode, FilterOperator } from "primereact/api";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Toast } from "primereact/toast";
import { Toolbar } from "primereact/toolbar";
import { useRef, useState } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import { MdDelete } from "react-icons/md";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { InputText } from "primereact/inputtext";
import { BsFillPenFill } from "react-icons/bs";

import { getUsers, removeUser } from "../services/userservice";
import { useNavigate } from "react-router-dom";

const Users = () => {
  const [selectedUsers, setSelectedUsers] = useState(null);
  const qc = useQueryClient();
  const navigate = useNavigate();
  const toast = useRef();
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    nom: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    prenom: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    email: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
  });
  const [globalFilterValue, setGlobalFilterValue] = useState("");

  const onGlobalFilterChange = (e) => {
    const value = e.target.value;
    let _filters = { ...filters };
    _filters["global"].value = value;

    setFilters(_filters);
    setGlobalFilterValue(value);
  };

  const qk = ["get_users"];

  const { data: users, isLoading } = useQuery(qk, () => getUsers());

  const { mutate: deleteD } = useMutation((id) => removeUser(id), {
    onSuccess: (_) => {
      toast.current.show({
        severity: "success",
        summary: "Suppréssion User",
        detail: "Suppréssion réussie !!",
      });
      qc.invalidateQueries(qk);
    },
    onError: (_) => {
      toast.current.show({
        severity: "error",
        summary: "Suppréssion User",
        detail: "Suppréssion échouée !!",
      });
    },
  });

  const leftToolbarTemplate = () => {
    return (
      <div className="flex items-center justify-center space-x-2">
        <button
          className="inline-block px-6 py-3 font-bold text-center text-white uppercase align-middle transition-all rounded-lg cursor-pointer bg-gradient-to-tl from-blue-700 to-blue-300 leading-pro text-xs ease-soft-in tracking-tight-soft shadow-soft-md bg-150 bg-x-25 hover:scale-102 active:opacity-85 hover:shadow-soft-xs"
          onClick={() => handleCreateUser()}
        >
          Nouveau <AiOutlinePlus className="h-6 w-6 text-white inline" />
        </button>
        <button
          className="inline-block px-6 py-3 font-bold text-center text-white uppercase align-middle transition-all rounded-lg cursor-pointer bg-gradient-to-tl from-red-700 to-red-300 leading-pro text-xs ease-soft-in tracking-tight-soft shadow-soft-md bg-150 bg-x-25 hover:scale-102 active:opacity-85 hover:shadow-soft-xs"
          onClick={() => handleDelete()}
          disabled={!selectedUsers || !selectedUsers.length}
        >
          Supprimer <MdDelete className="h-6 w-6 text-white inline" />
        </button>
      </div>
    );
  };

  const handleUpdateUser = (d) => {
    navigate(`/dashboard/users/update/${d._id}`);
  };

  const handleCreateUser = () => {
    navigate(`/dashboard/users/create`);
  };

  const handleDelete = () => {
    for (let i = 0; i < selectedUsers?.length; i++) {
      deleteD(selectedUsers[i]?._id);
    }
  };

  const renderHeader = () => {
    return (
      <div className="flex justify-between items-center">
        <h5 className="m-0">Liste des Utilisateurs</h5>
        <span className="p-input-icon-left">
          <i className="pi pi-search" />
          <InputText
            value={globalFilterValue}
            onChange={onGlobalFilterChange}
            placeholder="Rechercher ..."
          />
        </span>
      </div>
    );
  };

  const actionBodyTemplate = (rowData) => {
    return (
      <div className="flex items-center justify-center space-x-1">
        <button
          type="button"
          onClick={() => handleUpdateUser(rowData)}
          className="inline-block px-6 py-3 font-bold text-center text-white uppercase align-middle transition-all rounded-lg cursor-pointer bg-gradient-to-tl from-blue-700 to-blue-300 leading-pro text-xs ease-soft-in tracking-tight-soft shadow-soft-md bg-150 bg-x-25 hover:scale-102 active:opacity-85 hover:shadow-soft-xs"
        >
          <BsFillPenFill className="text-white inline" />
        </button>
      </div>
    );
  };

  const header = renderHeader();

  return (
    <div className="animate__animated animate__zoomIn animate__faster bg-white">
      <div className="flex flex-wrap mt-6">
        <div className="w-full mb-6 lg:mb-0 lg:flex-none">
          <div className="relative flex flex-col h-40 min-w-0 break-words bg-white shadow-soft-xl rounded-2xl bg-clip-border">
            <div className="flex-auto p-4">
              <div className="flex flex-wrap -mx-3">
                <div className="max-w-full px-3 lg:w-1/2 lg:flex-none">
                  <div className="flex items-center justify-center h-full">
                    <h5 className="font-bold text-3xl">
                      Gestion des Utilisateurs
                    </h5>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="datatable-doc mt-4 w-4/5 mx-auto">
        <div className="card">
          <Toolbar className="mb-4" left={leftToolbarTemplate}></Toolbar>
          <DataTable
            value={users}
            paginator
            className="p-datatable-customers"
            header={header}
            rows={10}
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            rowsPerPageOptions={[10, 25, 50]}
            dataKey="_id"
            rowHover
            selection={selectedUsers}
            onSelectionChange={(e) => setSelectedUsers(e.value)}
            filters={filters}
            filterDisplay="row"
            loading={isLoading}
            responsiveLayout="scroll"
            globalFilterFields={["nom", "prenom"]}
            emptyMessage="Aucun Utilisateur trouvé"
            currentPageReportTemplate="Voir {first} de {last} à {totalRecords} utilisateurs"
            size="small"
          >
            <Column
              selectionMode="multiple"
              headerStyle={{ width: "3em" }}
            ></Column>
            <Column
              field="prenom"
              header="Prenom"
              filter
              filterPlaceholder="Par prenom ..."
              sortable
              style={{ minWidth: "14rem" }}
            />
            <Column
              field="nom"
              header="Nom"
              filter
              filterPlaceholder="Par nom ..."
              sortable
              style={{ minWidth: "14rem" }}
            />

            <Column
              field="email"
              header="Email"
              filter
              filterPlaceholder="Par email ..."
              sortable
              style={{ minWidth: "8rem" }}
            />
            <Column
              field="role"
              header="Role"
              sortable
              style={{ minWidth: "8rem" }}
            />
            <Column
              headerStyle={{ width: "4rem", textAlign: "center" }}
              bodyStyle={{ textAlign: "center", overflow: "visible" }}
              body={actionBodyTemplate}
            />
          </DataTable>
        </div>
      </div>
      <Toast ref={toast} />
    </div>
  );
};

export default Users;
