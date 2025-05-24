import { useEffect, useState } from "react";
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

export function ClassPage() {
  const { user } = useAuth();
  const { selectedClass, fetchLessons, lessons, fetchMaterials, materials } =
    useClass();

  const [searchTerm, setSearchTerm] = useState("");
  const [lessonsDrop, setLessonsDrop] = useState(false);
  const [materialDrop, setMaterialDrop] = useState(false);

  useEffect(() => {
    if (selectedClass?.id) {
      fetchLessons();
      fetchMaterials();
    }
  }, [selectedClass?.id]);

  const filteredLessons = lessons.filter((lesson) =>
    lesson.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredMaterials = materials.filter((material) =>
    material.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box mb={12} mt={2}>
      <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <Box
        sx={{ textAlign: "left", mb: 1, display: "flex", alignItems: "center" }}
      >
        {!lessonsDrop ? (
          <KeyboardArrowUpIcon
            sx={{ mr: "4px", ml: -0.8, cursor: "pointer" }}
            onClick={() => setLessonsDrop(true)}
          />
        ) : (
          <KeyboardArrowDownIcon
            sx={{ mr: "4px", ml: -0.8, cursor: "pointer" }}
            onClick={() => setLessonsDrop(false)}
          />
        )}
        <Typography variant="h5" sx={{ fontWeight: "600" }}>
          Aulas
        </Typography>
      </Box>

      {!lessonsDrop && (
        <>
          {(searchTerm ? filteredLessons : lessons).map((lesson, index) => (
            <ContentCard
              key={lesson.id}
              id={lesson.id}
              index={index}
              name={lesson.name}
              teacherInfo={lesson.teacher}
              coverImage={lesson.coverImage || ""}
            />
          ))}
        </>
      )}
      <CreateCardButton />

      <Box
        sx={{ textAlign: "left", my: 2, display: "flex", alignItems: "center" }}
      >
        {!materialDrop ? (
          <KeyboardArrowUpIcon
            sx={{ mr: "4px", ml: -0.8, cursor: "pointer" }}
            onClick={() => setMaterialDrop(true)}
          />
        ) : (
          <KeyboardArrowDownIcon
            sx={{ mr: "4px", ml: -0.8, cursor: "pointer" }}
            onClick={() => setMaterialDrop(false)}
          />
        )}
        <Typography variant="h5" sx={{ fontWeight: "600",my: 2 }}>
          Materiais Teóricos
        </Typography>
      </Box>

      {!materialDrop && (
        <>
          {(searchTerm ? filteredMaterials : materials).map((material,materialIndex) => (
            <TheoryMaterialItem
              key={material.id}
              index={materialIndex}
              {...material}
              lessonId={material.lessonId || ""}
              classId={selectedClass?.id || ""}
              materialId={material.id}
            />
          ))}
        </>
      )}
      {user?.role === "admin" && <CreateMaterialButton lessons={lessons} />}
    </Box>
  );
}
