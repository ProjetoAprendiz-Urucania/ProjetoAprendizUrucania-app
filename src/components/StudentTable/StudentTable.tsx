import { DataGrid, GridColDef } from "@mui/x-data-grid";
import {
  Avatar,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
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
  removeStudentToClass,
} from "../../services/studentClass.service";
import { IClass } from "../../interfaces/class/IClass";

interface StudentTableProps {
  students: IStudent[];
  classes: IClass[];
}

export function StudentTable({ students, classes }: StudentTableProps) {
  const [openModal, setOpenModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<IStudent | null>(null);
  const [selectedClassId, setSelectedClassId] = useState<string>("");
  const [studentsWithClasses, setStudentsWithClasses] = useState<IStudent[]>(
    []
  );
  const [actionType, setActionType] = useState<"add" | "remove" | null>(null);
  const token = localStorage.getItem("token") || "";

  useEffect(() => {
    const fetchAllStudentClasses = async () => {
      const updatedStudents = await Promise.all(
        students.map(async (student) => {
          try {
            const response = await getStudentClasses(student.id ?? "", token);

            const classList = Array.isArray(response.classes)
              ? response.classes
              : [];
            console.log(`Classes for ${student.name}:`, classList);
            return {
              ...student,
              classes: classList,
            };
          } catch (error) {
            console.error(
              `Erro ao buscar turmas do aluno ${student.name}:`,
              error
            );
            return { ...student, classes: [] };
          }
        })
      );

      setStudentsWithClasses(updatedStudents);
    };

    fetchAllStudentClasses();
  }, [students, selectedClassId]);

  const openClassModal = (student: IStudent, type: "add" | "remove") => {
    setSelectedStudent(student);
    setActionType(type);
    setSelectedClassId("");
    setOpenModal(true);
  };

  const handleSubmit = async () => {
    if (!selectedStudent?.id || !selectedClassId) return;

    try {
      if (actionType === "add") {
        await addStudentToClass(selectedStudent.id, selectedClassId, token);
      } else if (actionType === "remove") {
        await removeStudentToClass(selectedStudent.id, selectedClassId, token);
      }
    } catch (error) {
      console.error("Erro ao atualizar turma:", error);
    } finally {
      setOpenModal(false);
      setSelectedClassId("");
    }
  };

  const columns: GridColDef[] = [
    {
      field: "profilePicture",
      headerName: "Foto",
      flex: 0.25,
      sortable: false,
      renderCell: (params) =>
        params.value ? (
          <Avatar src={params.value} />
        ) : (
          <Avatar src="/broken-image.jpg" />
        ),
    },
    { field: "name", headerName: "Nome", width: 200 },
    { field: "email", headerName: "Email", width: 250 },
    { field: "church", headerName: "Igreja", width: 200 },
    {
      field: "classes",
      headerName: "Turmas",
      flex: 0.5,
      renderCell: (params) => {
        const classList: IClass[] = Array.isArray(params.row.classes)
          ? params.row.classes
          : [];

        return (
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
            {classList.length > 0 ? (
              classList.map((classItem, idx) => (
                <Box
                  key={idx}
                  sx={{
                    fontSize: "0.7rem",
                    backgroundColor: "#BB162610",
                    color: "#BB1626",
                    px: 2,
                    borderRadius: "4px",
                  }}
                >
                  {classItem.name}
                </Box>
              ))
            ) : (
              <Box sx={{ fontSize: "0.8rem", color: "#999" }}>Sem turmas</Box>
            )}
          </Box>
        );
      },
    },
    {
      field: "actions",
      headerName: "Ações",
      flex: 0.5,
      renderCell: (params) => (
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button
            variant="outlined"
            onClick={() => openClassModal(params.row, "add")}
            sx={btnStyle}
          >
            Adicionar
          </Button>
          <Button
            variant="outlined"
            onClick={() => openClassModal(params.row, "remove")}
            sx={btnStyle}
          >
            Remover
          </Button>
        </Box>
      ),
    },
  ];

  const btnStyle = {
    color: "#BB1626",
    borderColor: "#BB1626",
    "&:hover": {
      backgroundColor: "#BB1626",
      color: "#fff",
    },
  };

  return (
    <>
      <Box sx={{ width: "100%" }}>
        <DataGrid
          rows={studentsWithClasses}
          columns={columns}
          getRowId={(row) => row.id ?? ""}
          disableRowSelectionOnClick
          getRowHeight={() => 50}
          pageSizeOptions={[5, 10, 20]}
          sx={{
            "& .MuiDataGrid-cell": {
              display: "flex",
              alignItems: "center",
              paddingTop: "16px",
              paddingBottom: "16px",
            },
            "& .MuiDataGrid-row": {
              minHeight: "80px !important",
            },
            "& .MuiDataGrid-columnHeader": {
              minHeight: "72px !important",
            },
            "& .MuiDataGrid-virtualScrollerRenderZone": {
              rowGap: "8px",
            },
          }}
          autoHeight
        />
      </Box>

      <Dialog open={openModal} onClose={() => setOpenModal(false)}>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Turma</InputLabel>
            <Select
              value={selectedClassId}
              onChange={(e) => setSelectedClassId(e.target.value)}
            >
              {classes
                .filter((classItem) => {
                  const currentClassNames =
                    selectedStudent?.classes?.map((c) => c.name) || [];

                  const isInClass = currentClassNames.includes(
                    classItem.name ?? ""
                  );

                  if (actionType === "add") return !isInClass;
                  if (actionType === "remove") return isInClass;
                  return false;
                })
                .map((classItem) => (
                  <MenuItem key={classItem.id} value={classItem.id}>
                    {classItem.name}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            sx={{ backgroundColor: "#BB1626" }}
            onClick={handleSubmit}
            disabled={!selectedClassId}
          >
            {actionType === "add" ? "Adicionar" : "Remover"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
