import { useEffect, useState } from "react";
import { ContentCard } from "../components/ContentCard/ContentCard";
import { IClass } from "../interfaces/class/IClass";
import { Box, Typography } from "@mui/material";
import { SearchBar } from "../components/SearchBar/SearchBar";
import { getStudentClasses } from "../services/studentClass.service";

export function ClassesPage() {
  const [classes, setClasses] = useState<IClass[]>([]);
  const [classSearch, setClassSearch] = useState("");
  const [tk] = useState<string | null>(localStorage.getItem("token"));

  useEffect(() => {
    const fetchStudentClasses = async () => {
      if (!tk) {
        console.error("Erro: Token inexistente.");
        return;
      }

      const studentString = localStorage.getItem("user");
      if (!studentString) {
        console.error("Erro: Usuário não encontrado no localStorage.");
        return;
      }

      const student = JSON.parse(studentString);

      try {
        const response = await getStudentClasses(student.id, tk);
        if (!response || !response.classes) {
          console.error("Erro: Resposta inesperada da API.");
          return;
        }

        setClasses(response.classes);
      } catch (error) {
        console.error("Erro ao buscar turmas:", error);
      }
    };

    fetchStudentClasses();
  }, [tk]);

  const filteredClasses = classSearch
    ? classes.filter((classItem) =>
        classItem.name.toLowerCase().includes(classSearch.toLowerCase())
      )
    : classes;

  return (
    <>
      <SearchBar searchTerm={classSearch} setSearchTerm={setClassSearch} />
      <Box sx={{ textAlign: "left", marginBottom: 4 }}>
        <Typography variant="h5" sx={{ fontWeight: "600" }}>
          Turmas
        </Typography>
      </Box>
      {filteredClasses.length > 0 ? (
        filteredClasses.map((classItem) => (
          <ContentCard
            key={classItem.id}
            id={classItem.id}
            name={classItem.name}
            teacherInfo={classItem.teachers}
            coverImage={classItem.coverImage}
          />
        ))
      ) : (
        <Typography variant="body1">Nenhuma turma encontrada.</Typography>
      )}
    </>
  );
}
