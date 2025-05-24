import { useEffect, useState } from "react";
import { ContentCard } from "../components/ContentCard/ContentCard";
import { Box, Typography } from "@mui/material";
import { SearchBar } from "../components/SearchBar/SearchBar";
import { CreateCardButton } from "../components/CreateCardButton/CreateCardButton";
import { getStudents } from "../services/user.service";
import { IStudent } from "../interfaces/student/IStudent";
import { StudentTable } from "../components/StudentTable/StudentTable";
import { useClass } from "../hooks/useClass";
import { useAuth } from "../hooks/useAuth";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

export function ClassesPage() {
  const { user } = useAuth();
  const { classes, fetchStudentClasses } = useClass();
  const [classesDrop, setClassesDrop] = useState(false);

  const [students, setStudents] = useState<IStudent[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const studentsData = await getStudents();
        setStudents(studentsData);
      } catch (error) {
        console.error("Erro ao buscar alunos:", error);
      }
    };

    fetchStudents();
  }, []);

  useEffect(() => {
    fetchStudentClasses();
  }, []);

  const filteredClasses = searchTerm
    ? classes.filter((classItem) =>
        (classItem.name ?? "").toLowerCase().includes(searchTerm.toLowerCase()),
      )
    : classes;

  return (
    <Box  mb={12} mt={2}>
      <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

      <Box
        sx={{
          textAlign: "left",
          marginBottom: 1,
          display: "flex",
          alignItems: "center",
        }}
      >
        {!classesDrop ? (
          <KeyboardArrowUpIcon
            sx={{ marginRight: "4px", marginLeft: -0.8, cursor: "pointer" }}
            onClick={() => setClassesDrop(true)}
          />
        ) : (
          <KeyboardArrowDownIcon
            sx={{ marginRight: "4px", marginLeft: -0.8, cursor: "pointer" }}
            onClick={() => setClassesDrop(false)}
          />
        )}
        <Typography variant="h5" sx={{ fontWeight: "600" }}>
          Turmas
        </Typography>
      </Box>
        
      {!classesDrop && filteredClasses.length > 0
        ? filteredClasses.map((classItem, index) => (
            <ContentCard
              key={classItem.id}
              id={classItem.id}
              index={index}
              name={classItem.name || ""}
              teacherInfo={classItem.teachers}
              coverImage={classItem.coverImage || ""}
            />
          ))
        : null}

      {filteredClasses.length === 0 && user?.role === "student" && (
        <Typography variant="h6" sx={{ mb: 2, mt: 4 }}>
          Nenhuma turma encontrada
        </Typography>
      )}

      {user?.role === "admin" && <CreateCardButton />}

      {user?.role === "admin" && (
        <>
          <Box
            sx={{
              textAlign: "left",
              my: 2,
              display: "flex",
              alignItems: "center",
            }}
          >
            <Typography variant="h5" sx={{ fontWeight: "600", mt: 4 }}>
              Alunos
            </Typography>
          </Box>
          <Box sx={{ textAlign: "left", mb: 4 }}>
            <StudentTable students={students} classes={classes} />
          </Box>
        </>
      )}
    </Box>
  );
}
