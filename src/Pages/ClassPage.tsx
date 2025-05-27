import { useEffect, useMemo, useState } from "react";
import { Box, Typography } from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

import { SearchBar } from "../components/SearchBar/SearchBar";
import { ContentCard } from "../components/ContentCard/ContentCard";
import { CreateCardButton } from "../components/CreateCardButton/CreateCardButton";
import { CreateMaterialButton } from "../components/CreateMaterialButton/CreateMaterialButton";
import { TheoryMaterialItem } from "../components/TheoryMaterial/TheoryMaterial";

import { useAuth } from "../hooks/useAuth";
import { useClass } from "../hooks/useClass";
import { useParams } from "react-router-dom";

export function ClassPage() {
  const { user } = useAuth();
  const { classId } = useParams();
  const { selectedClass, lessons, materials, fetchLessons, fetchMaterials } =
    useClass();

  const [searchTerm, setSearchTerm] = useState("");
  const [lessonsDrop, setLessonsDrop] = useState(false);
  const [materialDrop, setMaterialDrop] = useState(false);

  const filteredLessons = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return lessons.filter((lesson) => lesson.name.toLowerCase().includes(term));
  }, [lessons, searchTerm]);

  const filteredMaterials = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return materials.filter((material) =>
      material.name.toLowerCase().includes(term)
    );
  }, [materials, searchTerm]);

  useEffect(() => {
    if (selectedClass?.id) {
      fetchLessons();
      fetchMaterials();
    }
  }, [selectedClass?.id, classId, fetchLessons, fetchMaterials]);

  return (
    <Box mb={12} mt={2}>
      <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

      <Box
        sx={{ textAlign: "left", mb: 1, display: "flex", alignItems: "center" }}
      >
        {lessonsDrop ? (
          <KeyboardArrowDownIcon
            sx={{ mr: "4px", ml: -0.8, cursor: "pointer" }}
            onClick={() => setLessonsDrop(false)}
          />
        ) : (
          <KeyboardArrowUpIcon
            sx={{ mr: "4px", ml: -0.8, cursor: "pointer" }}
            onClick={() => setLessonsDrop(true)}
          />
        )}
        <Typography variant="h5" sx={{ fontWeight: "600" }}>
          Aulas
        </Typography>
      </Box>

      {!lessonsDrop &&
        ((searchTerm ? filteredLessons : lessons).length === 0 ? (
          <Typography my={4} pl={3}>
            Nenhuma aula encontrada.
          </Typography>
        ) : (
          (searchTerm ? filteredLessons : lessons).map((lesson, index) => (
            <ContentCard
              key={lesson.id}
              id={lesson.id}
              index={index}
              name={lesson.name}
              teacherInfo={lesson.teacher}
              coverImage={lesson.coverImage || ""}
            />
          ))
        ))}

      <CreateCardButton />

      <Box
        sx={{ textAlign: "left", my: 2, display: "flex", alignItems: "center" }}
      >
        {materialDrop ? (
          <KeyboardArrowDownIcon
            sx={{ mr: "4px", ml: -0.8, cursor: "pointer" }}
            onClick={() => setMaterialDrop(false)}
          />
        ) : (
          <KeyboardArrowUpIcon
            sx={{ mr: "4px", ml: -0.8, cursor: "pointer" }}
            onClick={() => setMaterialDrop(true)}
          />
        )}
        <Typography variant="h5" sx={{ fontWeight: "600", my: 2 }}>
          Materiais Teóricos
        </Typography>
      </Box>

      {!materialDrop &&
        ((searchTerm ? filteredMaterials : materials).length === 0 ? (
          <Typography my={4} pl={3}>
            Nenhum material encontrado.
          </Typography>
        ) : (
          (searchTerm ? filteredMaterials : materials).map(
            (material, materialIndex) => (
              <TheoryMaterialItem
                key={material.id}
                index={materialIndex}
                {...material}
                lessonId={material.lessonId || ""}
                classId={selectedClass?.id || ""}
                materialId={material.id}
              />
            )
          )
        ))}

      {user?.role === "admin" && <CreateMaterialButton lessons={lessons} />}
    </Box>
  );
}
