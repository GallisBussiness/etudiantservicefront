import { FilterMatchMode, FilterOperator } from "primereact/api";
import { ConfirmPopup } from "primereact/confirmpopup";
import { confirmPopup } from "primereact/confirmpopup";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Toast } from "primereact/toast";
import { Toolbar } from "primereact/toolbar";
import { useRef, useState } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import { MdDelete } from "react-icons/md";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { InputText } from "primereact/inputtext";
import { BsEye, BsPencilSquare } from "react-icons/bs";
import { getEtudiants, removeEtudiant } from "../services/etudiantservice";
import { FaFileCsv, FaFileExcel, FaFilePdf } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { ActionIcon, Button, LoadingOverlay } from "@mantine/core";
import { format, parseISO } from "date-fns";

function Etudiants() {
  const [selectedEtudiants, setSelectedEtudiants] = useState(null);
  const qk = ["get_Etudiants"];
  const { data: Etudiants, isLoading } = useQuery(qk, () => getEtudiants());
  const qc = useQueryClient();
  const navigate = useNavigate();
  const toast = useRef();

  const dt = useRef(null);

  const cols = [
    { field: "nce", header: "NCE" },
    { field: "ine", header: "INE" },
    { field: "prenom", header: "PRENOM" },
    { field: "nom", header: "NOM" },
    { field: "lieuDeNaissance", header: "Lieu de Naissance" },
    { field: "adresse", header: "ADRESSE" },
  ];

  const exportColumns = cols.map((col) => ({
    title: col.header,
    dataKey: col.field,
  }));

  const exportCSV = (selectionOnly) => {
    dt.current.exportCSV({ selectionOnly });
  };

  const exportPdf = () => {
    import("jspdf").then((jsPDF) => {
      import("jspdf-autotable").then(() => {
        const doc = new jsPDF.default(0, 0);

        doc.autoTable(exportColumns, Etudiants);
        doc.save("etudiants.pdf");
      });
    });
  };

  const exportSPdf = () => {
    import("jspdf").then((jsPDF) => {
      import("jspdf-autotable").then(() => {
        const doc = new jsPDF.default(0, 0);

        doc.autoTable(exportColumns, selectedEtudiants);
        doc.save("etudiants_selection.pdf");
      });
    });
  };

  const exportExcel = () => {
    import("xlsx").then((xlsx) => {
      const worksheet = xlsx.utils.json_to_sheet(Etudiants);
      const workbook = {
        Sheets: { data: worksheet },
        SheetNames: ["Etudiants"],
      };
      const excelBuffer = xlsx.write(workbook, {
        bookType: "xlsx",
        type: "array",
      });

      saveAsExcelFile(excelBuffer, "Etudiants");
    });
  };

  const saveAsExcelFile = (buffer, fileName) => {
    import("file-saver").then((module) => {
      if (module && module.default) {
        let EXCEL_TYPE =
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
        let EXCEL_EXTENSION = ".xlsx";
        const data = new Blob([buffer], {
          type: EXCEL_TYPE,
        });

        module.default.saveAs(
          data,
          fileName + "_export_" + new Date().getTime() + EXCEL_EXTENSION
        );
      }
    });
  };

  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    nom: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    prenom: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    nce: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    ine: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    telephone: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
  });
  const [globalFilterValue, setGlobalFilterValue] = useState("");

  const onGlobalFilterChange = (e) => {
    const value = e.target.value;
    let _filters = { ...filters };
    _filters["global"].value = value;

    setFilters(_filters);
    setGlobalFilterValue(value);
  };

  const { mutate: deleteD, isLoading: loadingD } = useMutation(
    (id) => removeEtudiant(id),
    {
      onSuccess: (_) => {
        toast.current.show({
          severity: "success",
          summary: "Suppréssion Etudiant",
          detail: "Suppréssion réussie !!",
        });
        qc.invalidateQueries(qk);
      },
      onError: (_) => {
        toast.current.show({
          severity: "error",
          summary: "Suppréssion Etudiant",
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
          onClick={handleCreateEtudiant}
          leftIcon={<AiOutlinePlus />}
        >
          Inscription
        </Button>
        <Button
          className="bg-red-500 hover:bg-red-700"
          disabled={!selectedEtudiants || !selectedEtudiants.length}
          onClick={(ev) => handleDelete(ev)}
          leftIcon={<MdDelete />}
        >
          {" "}
          Supprimer
        </Button>
      </div>
    );
  };

  const rightToolbarTemplate = () => {
    return (
      <div className="flex items-center justify-center space-x-2">
        <ActionIcon onClick={() => exportCSV(false)} title="CSV EXPORTS">
          <FaFileCsv className="text-sky-500 w-6 h-6" />
        </ActionIcon>
        <ActionIcon onClick={exportExcel} title="XLS EXPORTS">
          <FaFileExcel className="text-green-500 w-6 h-6" />
        </ActionIcon>
        <ActionIcon onClick={exportPdf} title="PDF EXPORTS">
          <FaFilePdf className="text-red-500 w-6 h-6" />
        </ActionIcon>
        <ActionIcon onClick={exportSPdf} title="PDF SELECTION EXPORTS">
          <FaFilePdf className="text-amber-500 w-6 h-6" />
        </ActionIcon>
        <ActionIcon
          onClick={() => exportCSV(true)}
          title="CSV SELECTION EXPORTS"
        >
          <FaFileCsv className="text-sky-500 w-6 h-6" />
        </ActionIcon>
      </div>
    );
  };

  const handleUpdateEtudiant = (d) => {
    navigate(`/dashboard/etudiants/update/${d._id}`);
  };

  const handleViewEtudiant = (d) => {
    navigate(`/dashboard/etudiants/${d._id}`);
  };
  const handleCreateEtudiant = () => {
    navigate(`/dashboard/etudiants/create`);
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
        for (let i = 0; i < selectedEtudiants?.length; i++) {
          deleteD(selectedEtudiants[i]?._id);
        }
      },
      reject: () => {},
    });
  };

  const renderHeader = () => {
    return (
      <div className="flex justify-between items-center">
        <h5 className="m-0">Liste des Etudiants</h5>
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
          onClick={() => handleUpdateEtudiant(rowData)}
        >
          <BsPencilSquare size={26} />
        </ActionIcon>
        <ActionIcon
          color="blue"
          size="lg"
          onClick={() => handleViewEtudiant(rowData)}
        >
          <BsEye size={26} />
        </ActionIcon>
      </div>
    );
  };

  const header = renderHeader();
  const dateTemplate = (row) =>
    row.dateDeNaissance
      ? format(parseISO(row?.dateDeNaissance), "dd-MM-yyyy")
      : "";
  const createdTemplate = (row) =>
    row.createdAt ? format(parseISO(row?.createdAt), "dd-MM-yyyy") : "neant";

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
                      Gestion des Etudiants
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
          <Toolbar
            className="mb-4"
            left={leftToolbarTemplate}
            right={rightToolbarTemplate}
          ></Toolbar>
          <DataTable
            value={Etudiants}
            paginator
            className="p-datatable-customers"
            header={header}
            rows={10}
            ref={dt}
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            rowsPerPageOptions={[10, 25, 50]}
            dataKey="_id"
            size="small"
            selection={selectedEtudiants}
            onSelectionChange={(e) => setSelectedEtudiants(e.value)}
            filters={filters}
            filterDisplay="row"
            loading={isLoading}
            responsiveLayout="scroll"
            globalFilterFields={[
              "nom",
              "cni",
              "nce",
              "prenom",
              "telephone",
              "lieuDeNaissance",
              "adresse",
            ]}
            emptyMessage="Aucun Etudiant trouvé"
            currentPageReportTemplate="Voir {first} de {last} à {totalRecords} étudiants"
          >
            <Column
              selectionMode="multiple"
              headerStyle={{ width: "2em" }}
            ></Column>
            <Column
              field="createdAt"
              header="date Création"
              sortable
              body={createdTemplate}
              style={{ minWidth: "6rem" }}
            />
            <Column
              field="nce"
              header="NCE"
              sortable
              style={{ minWidth: "6rem" }}
            />
            <Column field="cni" header="CNI" style={{ minWidth: "6rem" }} />
            <Column
              field="prenom"
              header="Prenom"
              filter
              filterPlaceholder="Par prenom ..."
              sortable
              style={{ minWidth: "6rem" }}
            />
            <Column
              field="nom"
              header="Nom"
              filter
              filterPlaceholder="Par nom ..."
              sortable
              style={{ minWidth: "6rem" }}
            />
            <Column
              field="dateDeNaissance"
              header="Date de Naissance"
              body={dateTemplate}
              sortable
              style={{ minWidth: "3rem" }}
            />
            <Column
              field="lieuDeNaissance"
              header="Lieu de Naissance"
              sortable
              style={{ minWidth: "3rem" }}
            />
            <Column
              field="telephone"
              header="Telephone"
              sortable
              style={{ minWidth: "6rem" }}
            />
            <Column
              field="adresse"
              header="Adresse"
              sortable
              style={{ minWidth: "4rem" }}
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
}

export default Etudiants;
