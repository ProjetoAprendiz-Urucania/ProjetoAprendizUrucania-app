import { useEffect, useState } from "react";
import { ContentCard } from "../components/ContentCard/ContentCard";
import { Box, Typography } from "@mui/material";
import { SearchBar } from "../components/SearchBar/SearchBar";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { TheoryMaterialItem } from "../components/TheoryMaterial/TheoryMaterial";
import { CreateCardButton } from "../components/CreateCardButton/CreateCardButton";
import { CreateMaterialButton } from "../components/CreateMaterialButton/CreateMaterialButton";
import { useAuth } from "../hooks/useAuth";
import { useClass } from "../hooks/useClass";

export function ClassPage() {
  const { user } = useAuth();
  const { selectedClass, getClassLessons, getMaterials, loading } = useClass();

  const [searchTerm, setSearchTerm] = useState("");
  const [lessonsDrop, setLessonsDrop] = useState(false);
  const [materialDrop, setMaterialDrop] = useState(false);

  useEffect(() => {
    if (!loading) {
      getMaterials();
    }
  }, [loading]);

  return (
    <>
      <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <Box
        sx={{
          textAlign: "left",
          marginBottom: 1,
          display: "flex",
          alignItems: "center",
        }}
      >
        {!lessonsDrop ? (
          <KeyboardArrowUpIcon
            sx={{ marginRight: "4px", marginLeft: -0.8, cursor: "pointer" }}
            onClick={() => setLessonsDrop(true)}
          />
        ) : (
          <KeyboardArrowDownIcon
            sx={{ marginRight: "4px", marginLeft: -0.8, cursor: "pointer" }}
            onClick={() => setLessonsDrop(false)}
          />
        )}
        <Typography variant="h5" sx={{ fontWeight: "600" }}>
          Aulas
        </Typography>
      </Box>
      {!lessonsDrop &&
        ((getClassLessons() ?? 0) && !searchTerm
          ? (getClassLessons() || []).map((lessonItem, index) => {
              return (
                <ContentCard
                  key={lessonItem.id}
                  id={lessonItem.id}
                  index={index}
                  name={lessonItem.name}
                  teacherInfo={lessonItem.teacher}
                  coverImage={
                    lessonItem.coverImage ? lessonItem.coverImage : ""
                  }
                />
              );
            })
          : Array.isArray(getClassLessons())
            ? (getClassLessons() ?? [])
                .filter((lessonItem) =>
                  lessonItem.name
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()),
                )
                .map((lessonItem, index) => (
                  <ContentCard
                    key={lessonItem.id}
                    id={lessonItem.id}
                    index={index}
                    name={lessonItem.name}
                    teacherInfo={lessonItem.teacher}
                    coverImage={lessonItem.coverImage ?? ""}
                  />
                ))
            : null)}
      <CreateCardButton />
      <Box
        sx={{
          textAlign: "left",
          my: 2,
          display: "flex",
          alignItems: "center",
        }}
      >
        {!materialDrop ? (
          <KeyboardArrowUpIcon
            sx={{ marginRight: "4px", marginLeft: -0.8, cursor: "pointer" }}
            onClick={() => setMaterialDrop(true)}
          />
        ) : (
          <KeyboardArrowDownIcon
            sx={{ marginRight: "4px", marginLeft: -0.8, cursor: "pointer" }}
            onClick={() => setMaterialDrop(false)}
          />
        )}
        <Typography variant="h5" sx={{ fontWeight: "600" }}>
          Materiais Teóricos
        </Typography>
      </Box>
      <Box sx={{ textAlign: "left", mb: 4 }}>
        {!materialDrop &&
          ((selectedClass?.theoryMaterials ?? 0) && !searchTerm
            ? (selectedClass?.theoryMaterials ?? []).map((materialItem) => {
                return materialItem ? (
                  <TheoryMaterialItem
                    key={materialItem.id}
                    {...materialItem}
                    lessonId={materialItem.lessonId || ""}
                    classId={selectedClass?.id || ""}
                    materialId={materialItem.id}
                  />
                ) : null;
              })
            : (selectedClass?.theoryMaterials ?? [])
                .filter((materialItem) =>
                  materialItem.name
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()),
                )
                .map((materialItem) => {
                  return materialItem ? (
                    <TheoryMaterialItem
                      key={materialItem.id}
                      {...materialItem}
                      lessonId={materialItem.lessonId || ""}
                      classId={selectedClass?.id || ""}
                      materialId={materialItem.id}
                    />
                  ) : null;
                }))}
        {user?.role === "admin" ? (
          <CreateMaterialButton lessons={getClassLessons() || []} />
        ) : null}
      </Box>
    </>
  );
}
