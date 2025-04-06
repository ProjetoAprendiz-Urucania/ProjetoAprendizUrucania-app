import { DataGrid, GridColDef } from "@mui/x-data-grid";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import { IStudent } from "../../interfaces/student/IStudent";
import { useEffect, useState } from "react";
import {
  getStudentClasses,
  addStudentToClass,
} from "../../services/studentClass.service";
import { IClass } from "../../interfaces/class/IClass";

interface StudentTableProps {
  students: IStudent[];
  classes: IClass[];
}

export function StudentTable({ students, classes }: StudentTableProps) {
  const [studentsWithClasses, setStudentsWithClasses] = useState<IStudent[]>(
    []
  );
  const [openProfileModal, setOpenProfileModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<IStudent | null>(null);
  const [selectedClassId, setSelectedClassId] = useState<string>("");

  useEffect(() => {
    const fetchStudentClasses = async () => {
      const token = localStorage.getItem("token") || "";

      const updatedStudents = await Promise.all(
        students.map(async (student) => {
          try {
            if (!student.id) throw new Error("Student ID is undefined");
            const response = await getStudentClasses(student.id, token);
            console.log("response:", response);

            const classes = response.map((c: { name: string }) => c.name);
            return { ...student, classes };
          } catch {
            return { ...student, classes: [] };
          }
        })
      );

      setStudentsWithClasses(updatedStudents);
    };

    fetchStudentClasses();
  }, [students]);

  const handleAddToClass = async () => {
    if (!selectedStudent?.id || !selectedClassId) return;

    const token = localStorage.getItem("token") || "";

    try {
      await addStudentToClass(selectedStudent.id, selectedClassId, token);
      const updatedStudent = await getStudentClasses(selectedStudent.id, token);
      const updatedStudents = studentsWithClasses.map((student) =>
        student.id === selectedStudent.id
          ? {
              ...student,
              classes: updatedStudent.map((c: { name: string }) => c.name),
            }
          : student
      );
      setStudentsWithClasses(updatedStudents);
    } catch (error) {
      console.error("Erro ao adicionar aluno à turma:", error);
    } finally {
      setSelectedClassId("");
      setOpenProfileModal(false);
    }
  };

  const columns: GridColDef[] = [
    { field: "name", headerName: "Nome", flex: 1, sortable: false },
    { field: "email", headerName: "Email", flex: 1, sortable: false },
    { field: "church", headerName: "Igreja", flex: 1, sortable: false },
    {
      field: "classes",
      headerName: "Classes",
      flex: 1,
      sortable: false,
      renderCell: (params) => {
        const classList = params.value?.join(", ");
        return <span>{classList || "Nenhuma"}</span>;
      },
    },
    {
      field: "actions",
      headerName: "Ações",
      flex: 1,
      renderCell: (params) => (
        <Button
          variant="outlined"
          onClick={(e) => {
            e.stopPropagation();
            setSelectedStudent(params.row as IStudent);
            setOpenProfileModal(true);
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
    <>
      <Box sx={{ height: 500, width: "100%" }}>
        <DataGrid
          rows={studentsWithClasses}
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

      <Dialog
        open={openProfileModal}
        onClose={() => setOpenProfileModal(false)}
      >
        <DialogTitle>Adicionar aluno à turma</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel id="class-select-label">Turma</InputLabel>
            <Select
              labelId="class-select-label"
              value={selectedClassId}
              label="Turma"
              onChange={(e) => setSelectedClassId(e.target.value)}
            >
              {classes.map((classItem) => (
                <MenuItem key={classItem.id} value={classItem.id}>
                  {classItem.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenProfileModal(false)}>Cancelar</Button>
          <Button
            variant="contained"
            sx={{ backgroundColor: "#BB1626", color: "#fff" }}
            onClick={handleAddToClass}
            disabled={!selectedClassId}
          >
            Adicionar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
