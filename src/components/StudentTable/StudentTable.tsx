import { useEffect, useState } from "react";
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
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { IStudent } from "../../interfaces/student/IStudent";
import { IClass } from "../../interfaces/class/IClass";
import {
  getStudentClasses,
  addStudentToClass,
  removeStudentToClass,
} from "../../services/studentClass.service";

interface StudentTableProps {
  students: IStudent[];
  classes: IClass[];
}

export function StudentTable({ students, classes }: StudentTableProps) {
  const [studentsWithClasses, setStudentsWithClasses] = useState<IStudent[]>(
    []
  );
  const [openModal, setOpenModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<IStudent | null>(null);
  const [selectedClassId, setSelectedClassId] = useState("");
  const [actionType, setActionType] = useState<"add" | "remove" | null>(null);

  const token = localStorage.getItem("token") || "";

  useEffect(() => {
    const fetchAllStudentClasses = async () => {
      const updated = await Promise.all(
        students.map(async (student) => {
          try {
            const { classes: studentClasses } = await getStudentClasses(
              student.id ?? "",
              token
            );
            return {
              ...student,
              classes: Array.isArray(studentClasses) ? studentClasses : [],
            };
          } catch (error) {
            console.error(`Erro ao buscar turmas de ${student.name}:`, error);
            return { ...student, classes: [] };
          }
        })
      );
      setStudentsWithClasses(updated);
    };

    fetchAllStudentClasses();
  }, [students]);

  const handleSubmit = async () => {
    if (!selectedStudent?.id || !selectedClassId) return;

    try {
      if (actionType === "add") {
        await addStudentToClass(selectedStudent.id, selectedClassId, token);
      } else if (actionType === "remove") {
        await removeStudentToClass(selectedStudent.id, selectedClassId, token);
      }

      await refreshStudentData(selectedStudent.id);
    } catch (error) {
      console.error("Erro ao atualizar turma:", error);
    } finally {
      setOpenModal(false);
      setSelectedClassId("");
    }
  };

  const refreshStudentData = async (studentId: string) => {
    try {
      const { classes: updatedClasses } = await getStudentClasses(
        studentId,
        token
      );
      setStudentsWithClasses((prev) =>
        prev.map((s) =>
          s.id === studentId
            ? {
                ...s,
                classes: Array.isArray(updatedClasses) ? updatedClasses : [],
              }
            : s
        )
      );
    } catch (err) {
      console.error("Erro ao atualizar estudante:", err);
    }
  };

  const openClassModal = (student: IStudent, type: "add" | "remove") => {
    setSelectedStudent(student);
    setActionType(type);
    setSelectedClassId("");
    setOpenModal(true);
  };

  const getAvailableClasses = (): IClass[] => {
    if (!selectedStudent || !actionType) return [];

    const studentClassIds = new Set(selectedStudent.classes?.map((c) => c.id));

    return classes.filter((classItem) => {
      const isInClass = studentClassIds.has(classItem.id ?? "");
      return actionType === "add" ? !isInClass : isInClass;
    });
  };

  const btnStyle = {
    color: "#BB1626",
    borderColor: "#BB1626",
    textTransform: "none",
    fontSize: "0.75rem",
    padding: "4px 8px",
    "&:hover": {
      backgroundColor: "#BB1626",
      color: "#fff",
    },
  };

  const columns: GridColDef[] = [
    {
      field: "profilePicture",
      headerName: "Foto",
      width: 70,
      sortable: false,
      renderCell: ({ value }) => <Avatar src={value || "/broken-image.jpg"} />,
    },
    { field: "name", headerName: "Nome", flex: 1 },
    { field: "email", headerName: "Email", flex: 1.5 },
    { field: "church", headerName: "Igreja", flex: 1 },
    {
      field: "classes",
      headerName: "Turmas",
      flex: 2,
      renderCell: ({ row }) => {
        const classList: IClass[] = row.classes || [];
        return (
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
            {classList.length > 0 ? (
              classList.map((c) => (
                <Box
                  key={c.id}
                  sx={{
                    fontSize: "0.75rem",
                    backgroundColor: "#BB162610",
                    color: "#BB1626",
                    px: 1,
                    borderRadius: 1,
                  }}
                >
                  {c.name}
                </Box>
              ))
            ) : (
              <Box sx={{ fontSize: "0.75rem", color: "#999" }}>Sem turmas</Box>
            )}
          </Box>
        );
      },
    },
    {
      field: "actions",
      headerName: "Ações",
      flex: 2,
      renderCell: ({ row }) => (
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button
            variant="outlined"
            onClick={() => openClassModal(row, "add")}
            sx={btnStyle}
          >
            Adicionar
          </Button>
          <Button
            variant="outlined"
            onClick={() => openClassModal(row, "remove")}
            sx={btnStyle}
          >
            Remover
          </Button>
        </Box>
      ),
    },
  ];

  return (
    <Box sx={{ mt: 4, mb: 8 }}>
      <Box sx={{ width: "100%", height: 600 }}>
        <DataGrid
          rows={studentsWithClasses}
          columns={columns}
          getRowId={(row) => row.id ?? ""}
          disableRowSelectionOnClick
          getRowHeight={() => "auto"}
          sx={{
            "& .MuiDataGrid-cell": {
              alignItems: "center",
              py: "1.2em",
            },
            "& .MuiDataGrid-virtualScrollerRenderZone": {
              rowGap: 1,
            },
          }}
        />
      </Box>

      <Dialog
        open={openModal}
        onClose={() => setOpenModal(false)}
        PaperProps={{
          sx: {
            p: 3,
            borderRadius: 3,
            minWidth: 350,
            backgroundColor: "#fff",
          },
        }}
      >
        <DialogContent sx={{ p: 0 }}>
          <Box sx={{ mb: 2 }}>
            <Box
              component="h2"
              sx={{
                fontSize: "1.25rem",
                fontWeight: "bold",
                color: "#BB1626",
                mb: 2,
              }}
            >
              {actionType === "add" ? "Adicionar à turma" : "Remover da turma"}
            </Box>
            <FormControl fullWidth>
              <InputLabel>Turma</InputLabel>
              <Select
                value={selectedClassId}
                onChange={(e) => setSelectedClassId(e.target.value)}
                label="Turma"
              >
                {getAvailableClasses().map((classItem) => (
                  <MenuItem key={classItem.id} value={classItem.id}>
                    {classItem.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </DialogContent>

        <DialogActions sx={{ justifyContent: "flex-end", gap: 1 }}>
          <Button
            onClick={() => setOpenModal(false)}
            sx={{
              color: "#BB1626",
              borderColor: "#BB1626",
              textTransform: "none",
              "&:hover": {
                backgroundColor: "#BB162610",
                borderColor: "#BB1626",
              },
            }}
            variant="outlined"
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!selectedClassId}
            variant="contained"
            sx={{
              backgroundColor: "#BB1626",
              textTransform: "none",
              "&:hover": {
                backgroundColor: "#a3131f",
              },
            }}
          >
            {actionType === "add" ? "Adicionar" : "Remover"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
