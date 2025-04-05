import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Box, Button } from "@mui/material";
import { IStudent } from "../../interfaces/student/IStudent";

interface StudentTableProps {
  students: IStudent[];
}

export function StudentTable({ students }: StudentTableProps) {
  const columns: GridColDef[] = [
    { field: "name", headerName: "Nome", flex: 1, sortable: false },
    { field: "email", headerName: "Email", flex: 1, sortable: false },
    { field: "church", headerName: "Igreja", flex: 1, sortable: false },
    {
      field: "actions",
      headerName: "Ações",
      flex: 1,
      renderCell: (params) => (
        <Button
          variant="outlined"
          onClick={(e) => {
            e.stopPropagation();
            console.log("Edit student:", params.row);
          }}
          sx={{
            color: "#BB1626",
            borderColor: "#BB1626",
            "&:hover": {
              backgroundColor: "#BB1626",
              color: "#fff",
            },
          }}
        >
          Editar
        </Button>
      ),
    },
  ];

  return (
    <Box sx={{ height: 500, width: "100%" }}>
      <DataGrid
        rows={students}
        columns={columns}
        getRowId={(row: IStudent) => row.id || ""}
        pageSizeOptions={[5, 10, 20]}
        checkboxSelection
        disableColumnResize
        disableRowSelectionOnClick
        sx={{
          "& .MuiCheckbox-root": {
            color: "#BB1626",
            "&.Mui-checked": {
              color: "#BB1626",
            },
          },
          "& .MuiDataGrid-row.Mui-selected": {
            backgroundColor: "#BB162610",
            "&:hover": {
              backgroundColor: "#BB162620",
            },
          },
          "& .MuiDataGrid-columnHeader:focus, & .MuiDataGrid-cell:focus": {
            outline: "none",
          },
          "& .MuiDataGrid-cell:focus-within": {
            outline: "none",
          },
          "& .MuiDataGrid-columnHeaderTitle": {
            fontWeight: "bold",
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "1px solid #BB1626",
          },
        }}
      />
    </Box>
  );
}
