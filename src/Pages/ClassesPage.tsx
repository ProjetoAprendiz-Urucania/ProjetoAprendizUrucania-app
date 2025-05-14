import { useEffect, useState } from "react";
import { ContentCard } from "../components/ContentCard/ContentCard";
import { Box, CircularProgress, Typography } from "@mui/material";
import { SearchBar } from "../components/SearchBar/SearchBar";
import { getStudentClasses } from "../services/studentClass.service";
import { CreateCardButton } from "../components/CreateCardButton/CreateCardButton";
import { useAuth } from "../hooks/useAuth";
import { getStudents } from "../services/user.service";
import { IStudent } from "../interfaces/student/IStudent";
import { StudentTable } from "../components/StudentTable/StudentTable";
import { getAdminClasses } from "../services/class.service";
import { useClass } from "../hooks/useClass";

export function ClassesPage() {
  const { user } = useAuth();
  const { classes, setClasses } = useClass();
  const [students, setStudents] = useState<IStudent[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [tk] = useState<string | null>(localStorage.getItem("token"));

  useEffect(() => {
    const fetchStudentClasses = async () => {
      if (!tk) return console.error("Erro: Token inexistente.");

      const studentString = localStorage.getItem("user");
      if (!studentString)
        return console.error("Erro: Usuário não encontrado no localStorage.");

      const student = JSON.parse(studentString);

      try {
        const response =
          user?.role === "admin"
            ? await getAdminClasses(tk)
            : await getStudentClasses(student.id, tk);

        console.log("Resposta da API:", response);

        if (!response) return console.error("Erro: Resposta inesperada da API");

        const fetchedClasses =
          user?.role === "admin"
            ? Array.isArray(response)
              ? response
              : []
            : Array.isArray(response.classes)
            ? response.classes
            : [];

        setClasses(fetchedClasses);
      } catch (error) {
        console.error("Erro ao buscar turmas:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudentClasses();
  }, [tk, user?.role, loading]);

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

  const filteredClasses = searchTerm
    ? classes.filter((classItem) =>
        (classItem.name ?? "").toLowerCase().includes(searchTerm.toLowerCase())
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
          <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

          <Box sx={{ textAlign: "left", marginBottom: 1 }}>
            <Typography variant="h5" sx={{ fontWeight: "600" }}>
              Turmas
            </Typography>
          </Box>

          {filteredClasses.length > 0 ? (
            filteredClasses.map((classItem, index) => (
              <ContentCard
                key={classItem.id}
                id={classItem.id}
                index={index}
                name={classItem.name || ""}
                teacherInfo={classItem.teachers}
                coverImage={classItem.coverImage || ""}
                setLoading={setLoading}
              />
            ))
          ) : (
            <Typography variant="body1" sx={{ mb: 2, mt: 4 }}>
              Nenhuma turma encontrada.
            </Typography>
          )}

          {user?.role === "admin" && (
            <CreateCardButton setLoading={setLoading} />
          )}

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
                <Typography variant="h5" sx={{ fontWeight: "600" }}>
                  Alunos
                </Typography>
              </Box>
              <Box sx={{ textAlign: "left", mb: 4 }}>
                <StudentTable students={students} classes={classes} />
              </Box>
            </>
          )}
        </>
      )}
    </>
  );
}
