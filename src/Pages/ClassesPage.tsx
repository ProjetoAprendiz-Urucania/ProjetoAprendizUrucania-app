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
        console.log("err get classes() token inexistente");
      } else {
        const studentString = localStorage.getItem("user");
        if (!studentString) {
          console.error("Erro: usuário não encontrado no localStorage");
          return;
        }

        const student = JSON.parse(studentString);

        const response = await getStudentClasses(student.id, tk);
        console.log(response);

        setClasses(response.classes);
      }
    };
    fetchStudentClasses();
  }, [tk]);

  return (
    <>
      <SearchBar searchTerm={classSearch} setSearchTerm={setClassSearch} />
      <Box
        sx={{
          textAlign: "left",
          marginBottom: 4,
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: "600" }}>
          Turmas
        </Typography>
      </Box>
      {classes.length > 0 && !classSearch
        ? classes.map((classItem) => {
            return (
              <ContentCard
                key={classItem.id}
                id={classItem.id}
                name={classItem.name}
                teacherInfo={classItem.teachers}
                coverImage={classItem.coverImage}
              />
            );
          })
        : classes
            .filter((classItem) =>
              classItem.name.toLowerCase().includes(classSearch.toLowerCase())
            )
            .map((classItem) => (
              <ContentCard
                key={classItem.id}
                id={classItem.id}
                name={classItem.name}
                teacherInfo={classItem.teachers}
                coverImage={classItem.coverImage}
              />
            ))}
    </>
  );
}
