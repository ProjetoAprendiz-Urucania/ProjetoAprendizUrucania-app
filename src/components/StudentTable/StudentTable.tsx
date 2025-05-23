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
  const [openProfileModal, setOpenProfileModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<IStudent | null>(null);
  const [selectedClassId, setSelectedClassId] = useState<string>("");
  const [studentClasses, setStudentClasses] = useState<IStudent[]>([]);
  const [actionType, setActionType] = useState<"add" | "remove" | null>(null);

  useEffect(() => {
    if (students.length > 0) {
      fetchStudentClasses();
    }
  }, [students]);

  const fetchStudentClasses = async () => {
    const loadedClasses = await Promise.all(
      students.map(async (student) => {
        try {
          if (!student.id) throw new Error("Student ID is undefined");

          const classNames = classes.map((c) => c.name).join(", ");
          return { ...student, classes: classNames };
        } catch (error) {
          console.error("Erro ao buscar classes do aluno:", error);
          return { ...student, classes: "" };
        }
      }),
    );

    setStudentClasses(loadedClasses);
  };

  const handleAddToClass = async () => {
    if (!selectedStudent?.id || !selectedClassId) return;

    const token = localStorage.getItem("token") || "";

    try {
      await addStudentToClass(selectedStudent.id, selectedClassId, token);

      const response = await getStudentClasses(selectedStudent.id, token);

      const classesArray = Array.isArray(response)
        ? response
        : Array.isArray(response?.data)
          ? response.data
          : [];

      const classNames = classesArray.map((c: IClass) => c.name);

      setStudentClasses(classNames);
      await fetchStudentClasses();
    } catch (error) {
      console.error("Erro ao adicionar aluno à turma:", error);
    } finally {
      setSelectedClassId("");
      setOpenProfileModal(false);
    }
  };

  const handleRemoveToClass = async () => {
    if (!selectedStudent?.id || !selectedClassId) return;

    const token = localStorage.getItem("token") || "";

    try {
      await removeStudentToClass(selectedStudent.id, selectedClassId, token);
      await fetchStudentClasses();
    } catch (error) {
      console.error("Erro ao remover aluno à turma:", error);
    } finally {
      setSelectedClassId("");
      setOpenProfileModal(false);
    }
  };

  const columns: GridColDef[] = [
    {
      field: "profilePicture",
      headerName: "Foto",
      width: 100,
      sortable: false,
      renderCell: (params) =>
        params.value ? (
          <Box
            component="img"
            src={params.value}
            alt="Foto do aluno"
            sx={{
              width: 42,
              height: 42,
              borderRadius: "50%",
              objectFit: "cover",
            }}
          />
        ) : (
          <Avatar src="/broken-image.jpg" />
        ),
    },
    { field: "name", headerName: "Nome", width: 200, sortable: false },
    { field: "email", headerName: "Email", width: 250, sortable: false },
    { field: "church", headerName: "Igreja", width: 200, sortable: false },
    {
      field: "classes",
      headerName: "Turmas do usuário",
      width: 200,
      sortable: false,
      renderCell: (params) => {
        const classList = (params.row.classes || " Não há turmas")
          .split(",")
          .map((name: string) => name.trim())
          .filter(Boolean);

        return (
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              mt: 1,
              gap: "4px",
              maxHeight: "100%",
              overflow: "auto",
            }}
          >
            {classList.map((name: string, index: number) => (
              <Box
                key={index}
                sx={{
                  fontSize: "0.7rem",
                  whiteSpace: "normal",
                  wordBreak: "break-word",
                  color: "#BB1626",
                  p: "3px 6px",
                  borderRadius: "4px",
                  backgroundColor: "#BB162610",
                }}
              >
                {name}
              </Box>
            ))}
          </Box>
        );
      },
    },
    {
      field: "actions",
      headerName: "Ações das turmas",
      width: 300,
      renderCell: (params) => (
        <Box sx={{ display: "flex", gap: "12px" }}>
          {" "}
          <Button
            variant="outlined"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedStudent(params.row as IStudent);
              setActionType("add");
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
            Adicionar
          </Button>
          <Button
            variant="outlined"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedStudent(params.row as IStudent);
              setActionType("remove");
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
            Remover
          </Button>
        </Box>
      ),
    },
  ];

  return (
    <>
      <Box sx={{ height: 500, width: "100%" }}>
        <DataGrid
          rows={studentClasses}
          columns={columns}
          getRowId={(row: IStudent) => row.id ?? ""}
          pageSizeOptions={[5, 10, 20]}
          disableColumnResize
          disableRowSelectionOnClick
          getRowHeight={() => "auto"}
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

            "& .MuiDataGrid-cell": {
              display: "flex",
              alignItems: "center",
            },
            "& .MuiDataGrid-row": {
              minHeight: "60px !important",
            },
          }}
        />
      </Box>

      <Dialog
        open={openProfileModal}
        onClose={() => setOpenProfileModal(false)}
      >
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel id="class-select-label">Turma</InputLabel>
            <Select
              value={selectedClassId}
              onChange={(e) => setSelectedClassId(e.target.value)}
              fullWidth
            >
              {classes
                .filter((classItem) => {
                  const studentClassNames =
                    selectedStudent?.classes?.split(",").map((c) => c.trim()) ||
                    [];

                  const isInStudentClass = studentClassNames.includes(
                    classItem.name ?? "",
                  );

                  if (actionType === "add") return !isInStudentClass;
                  if (actionType === "remove") return isInStudentClass;
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
            sx={{ backgroundColor: "#BB1626", color: "#fff" }}
            onClick={handleAddToClass}
            disabled={!selectedClassId}
          >
            Adicionar
          </Button>
          <Button
            variant="contained"
            sx={{ backgroundColor: "#BB1626", color: "#fff" }}
            onClick={handleRemoveToClass}
            disabled={!selectedClassId}
          >
            Remover
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
