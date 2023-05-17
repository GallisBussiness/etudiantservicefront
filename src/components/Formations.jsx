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
import { getFormations, removeFormation } from "../services/formationservice";
import { useNavigate } from "react-router-dom";
import { ActionIcon, Button, LoadingOverlay } from "@mantine/core";
import { confirmPopup, ConfirmPopup } from "primereact/confirmpopup";
import { BsPencilSquare } from "react-icons/bs";

export const Formations = () => {
  const [selectedFormations, setSelectedFormations] = useState(null);
  const qc = useQueryClient();
  const navigate = useNavigate();
  const toast = useRef();
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    nom: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
    },
  });
  const [globalFilterValue, setGlobalFilterValue] = useState("");

  const onGlobalFilterChange = (e) => {
    const value = e.target.value;
    let _filters = { ...filters };
    _filters["global"].value = value;

    setFilters(_filters);
    setGlobalFilterValue(value);
  };

  const qk = ["get_Formations"];

  const { data: Formations, isLoading } = useQuery(qk, () => getFormations());

  const { mutate: deleteD, isLoading: loadingD } = useMutation(
    (id) => removeFormation(id),
    {
      onSuccess: (_) => {
        toast.current.show({
          severity: "success",
          summary: "Suppréssion Formation",
          detail: "Suppréssion réussie !!",
        });
        qc.invalidateQueries(qk);
      },
      onError: (_) => {
        toast.current.show({
          severity: "error",
          summary: "Suppréssion Formation",
          detail: "Suppréssion échouée !!",
        });
      },
    }
  );

  const leftToolbarTemplate = () => {
    return (
      <div className="flex items-center justify-center space-x-2">
        <Button
          className="bg-green-500 hover:bg-green-700"
          onClick={handleCreateFormation}
          leftIcon={<AiOutlinePlus />}
        >
          Nouveau
        </Button>
        <Button
          className="bg-red-500 hover:bg-red-700"
          disabled={!selectedFormations || !selectedFormations.length}
          onClick={(ev) => handleDelete(ev)}
          leftIcon={<MdDelete />}
        >
          {" "}
          Supprimer
        </Button>
      </div>
    );
  };

  const handleUpdateFormation = (d) => {
    navigate(`/dashboard/formations/update/${d._id}`);
  };

  const handleViewFormation = (d) => {
    navigate(`/dashboard/formations/${d._id}`);
  };
  const handleCreateFormation = () => {
    navigate(`/dashboard/formations/create`);
  };

  const handleDelete = async (event) => {
    confirmPopup({
      target: event.currentTarget,
      message: "Etes vous sur de vouloir supprimer ?",
      icon: "pi pi-exclamation-triangle",
      acceptLabel: "Supprimer",
      acceptClassName:
        "bg-red-500 hover:bg-red-700 border-none ring-node focus:ring-none",
      accept: () => {
        for (let i = 0; i < selectedFormations?.length; i++) {
          deleteD(selectedFormations[i]?._id);
        }
      },
      reject: () => {},
    });
  };

  const renderHeader = () => {
    return (
      <div className="flex justify-between items-center">
        <h5 className="m-0">Liste des Formations</h5>
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
        <ActionIcon
          color="green"
          size="lg"
          onClick={() => handleUpdateFormation(rowData)}
        >
          <BsPencilSquare size={26} />
        </ActionIcon>
      </div>
    );
  };

  const header = renderHeader();
  return (
    <div className="animate__animated animate__zoomIn animate__faster bg-white">
      <LoadingOverlay visible={isLoading || loadingD} overlayBlur={2} />
      <div className="flex flex-wrap bg-whity">
        <div className="w-full px-3 mb-6 lg:mb-0 lg:flex-none">
          <div className="relative flex flex-col h-40 min-w-0 break-words bg-white shadow-soft-xl bg-clip-border">
            <div className="flex-auto p-4">
              <div className="flex flex-wrap -mx-3">
                <div className="max-w-full px-3 lg:w-1/2 lg:flex-none">
                  <div className="flex items-center justify-start h-full">
                    <h5 className="font-bold text-3xl">
                      Gestion des Formations
                    </h5>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="datatable-doc mt-4 mx-10">
        <div className="card">
          <Toolbar className="mb-4" left={leftToolbarTemplate}></Toolbar>
          <DataTable
            value={Formations}
            paginator
            className="p-datatable-customers"
            header={header}
            rows={10}
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            rowsPerPageOptions={[10, 25, 50]}
            dataKey="_id"
            rowHover
            selection={selectedFormations}
            onSelectionChange={(e) => setSelectedFormations(e.value)}
            filters={filters}
            filterDisplay="menu"
            loading={isLoading}
            responsiveLayout="scroll"
            globalFilterFields={["nom"]}
            emptyMessage="Aucun Formation trouvé"
            currentPageReportTemplate="Voir {first} de {last} à {totalRecords} formations"
          >
            <Column
              selectionMode="multiple"
              headerStyle={{ width: "2em" }}
            ></Column>

            <Column
              field="nom"
              header="Nom"
              sortable
              style={{ minWidth: "6rem" }}
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
      <ConfirmPopup />
    </div>
  );
};
