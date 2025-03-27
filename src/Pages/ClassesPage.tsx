import { useEffect, useState } from "react";
import { ContentCard } from "../components/ContentCard/ContentCard";
import { IClass } from "../interfaces/class/IClass";
import { Box, CircularProgress, Typography } from "@mui/material";
import { SearchBar } from "../components/SearchBar/SearchBar";
import {
  getAdminClasses,
  getStudentClasses,
} from "../services/studentClass.service";
import { CreateCardButton } from "../components/CreateCardButton/CreateCardButton";
import { useAuth } from "../hooks/useAuth";

export function ClassesPage() {
  const { user } = useAuth();
  const [classes, setClasses] = useState<IClass[]>([]);
  const [classSearch, setClassSearch] = useState("");
  const [loading, setLoading] = useState(true);
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
        const response =
          user?.role === "admin"
            ? await getAdminClasses(tk)
            : await getStudentClasses(student.id, tk);

        if (!response && user?.role === "admin") {
          console.error(
            "Erro: Resposta inesperada da API na busca das classes do adm."
          );
          return;
        }

        if (!response && user?.role === "student") {
          console.error(
            "Erro: Resposta inesperada da API na busca das classes do estudante."
          );
          return;
        }

        if (user?.role === "admin") {
          setClasses(response);
        } else {
          setClasses(response.classes);
        }
      } catch (error) {
        console.error("Erro ao buscar turmas:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudentClasses();
  }, [tk, user?.role]);

  const filteredClasses = classSearch
    ? classes.filter((classItem) =>
        classItem.name.toLowerCase().includes(classSearch.toLowerCase())
      )
    : classes;

  return (
    <>
      {loading ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
          }}
        >
          <CircularProgress sx={{ color: "#BB1626" }} />
        </Box>
      ) : (
        <>
          <SearchBar searchTerm={classSearch} setSearchTerm={setClassSearch} />
          <Box sx={{ textAlign: "left", marginBottom: 1 }}>
            <Typography variant="h5" sx={{ fontWeight: "600" }}>
              Turmas
            </Typography>
          </Box>
          {filteredClasses.length > 0 ? (
            filteredClasses.map((classItem) => (
              <ContentCard
                key={classItem.id}
                id={classItem.id ? classItem.id : ""}
                name={classItem.name}
                teacherInfo={classItem.teachers}
                coverImage={classItem.coverImage ? classItem.coverImage : ""}
              />
            ))
          ) : (
            <>
              {user?.role === "admin" ? (
                <CreateCardButton />
              ) : (
                <Typography variant="body1" sx={{ mb: 12, mt: 2 }}>
                  Nenhuma turma encontrada.
                </Typography>
              )}
            </>
          )}

          {user?.role === "admin" && <CreateCardButton />}
        </>
      )}
    </>
  );
}
