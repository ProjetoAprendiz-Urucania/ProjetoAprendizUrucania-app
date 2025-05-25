import { useEffect, useMemo, useState } from "react";
import { Box, Typography } from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

import { ContentCard } from "../components/ContentCard/ContentCard";
import { SearchBar } from "../components/SearchBar/SearchBar";
import { CreateCardButton } from "../components/CreateCardButton/CreateCardButton";
import { StudentTable } from "../components/StudentTable/StudentTable";

import { getStudents } from "../services/user.service";
import { IStudent } from "../interfaces/student/IStudent";
import { useClass } from "../hooks/useClass";
import { useAuth } from "../hooks/useAuth";

export function ClassesPage() {
  const { user } = useAuth();
  const { classes, fetchStudentClasses } = useClass();

  const [students, setStudents] = useState<IStudent[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [classesDrop, setClassesDrop] = useState(false);

  useEffect(() => {
    const loadStudents = async () => {
      try {
        const studentsData = await getStudents();
        setStudents(studentsData);
      } catch (error) {
        console.error("Erro ao buscar alunos:", error);
      }
    };

    loadStudents();
  }, []);

  useEffect(() => {
    fetchStudentClasses();
  }, []);

  const filteredClasses = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return classes.filter((classItem) =>
      (classItem.name ?? "").toLowerCase().includes(term)
    );
  }, [classes, searchTerm]);

  const shouldShowEmptyMessage =
    filteredClasses.length === 0 && user?.role === "student";

  return (
    <Box mb={12} mt={2}>
      <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

      <Box
        sx={{ textAlign: "left", mb: 1, display: "flex", alignItems: "center" }}
      >
        {classesDrop ? (
          <KeyboardArrowDownIcon
            sx={{ mr: "4px", ml: -0.8, cursor: "pointer" }}
            onClick={() => setClassesDrop(false)}
          />
        ) : (
          <KeyboardArrowUpIcon
            sx={{ mr: "4px", ml: -0.8, cursor: "pointer" }}
            onClick={() => setClassesDrop(true)}
          />
        )}
        <Typography variant="h5" sx={{ fontWeight: "600" }}>
          Turmas
        </Typography>
      </Box>

      {!classesDrop &&
        filteredClasses.map((classItem, index) => (
          <ContentCard
            key={classItem.id}
            id={classItem.id}
            index={index}
            name={classItem.name || ""}
            teacherInfo={classItem.teachers}
            coverImage={classItem.coverImage || ""}
          />
        ))}

      {shouldShowEmptyMessage && (
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
