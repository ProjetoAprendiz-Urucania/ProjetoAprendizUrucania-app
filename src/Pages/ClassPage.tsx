import { useEffect, useState } from "react";
import { ContentCard } from "../components/ContentCard/ContentCard";
import { ILesson } from "../interfaces/lesson/ILesson";
import { getLessons } from "../services/lesson.service";
import { Box, Typography } from "@mui/material";
import { SearchBar } from "../components/SearchBar/SearchBar";
import { useParams } from "react-router-dom";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { getMaterial } from "../services/theoryMaterials.service";
import { TheoryMaterial } from "../components/TheoryMaterial/TheoryMaterial";
import { ITheoryMaterial } from "../interfaces/TheoryMaterial/ITheoryMaterial";

export function ClassPage() {
  const { id } = useParams<{ id: string }>();
  const [lessons, setLessons] = useState<ILesson[]>([]);
  const [materials, setMaterials] = useState<ITheoryMaterial[]>([]);

  const [lessonSearch, setLessonSearch] = useState("");
  const [lessonsDrop, setLessonsDrop] = useState(false);
  const [materialDrop, setMaterialDrop] = useState(false);

  useEffect(() => {
    const fetchLessons = async () => {
      if (id) {
        const response = await getLessons(id);
        setLessons(response);
      } else {
        console.log("ID não informado");
      }
    };
    fetchLessons();
  }, [id]);

  useEffect(() => {
    const fetchMaterials = async () => {
      if (lessons.length > 0 && id) {
        let allMaterials: ITheoryMaterial[] = [];

        for (const lesson of lessons) {
          const materials = await getMaterial(id, lesson.id);
          allMaterials = [...allMaterials, ...materials];
        }

        setMaterials(allMaterials);
      }
    };
    fetchMaterials();
  }, [id, lessons]);

  console.log(materials);

  return (
    <>
      <SearchBar searchTerm={lessonSearch} setSearchTerm={setLessonSearch} />
      <Box
        sx={{
          textAlign: "left",
          marginBottom: 4,
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
          Aula
        </Typography>
      </Box>
      {!lessonsDrop &&
        (lessons.length > 0 && !lessonSearch
          ? lessons.map((lessonItem) => {
              return (
                <ContentCard
                  key={lessonItem.id}
                  id={lessonItem.id}
                  name={lessonItem.name}
                  teacherInfo={lessonItem.teacher}
                  coverImage={lessonItem.coverImage}
                />
              );
            })
          : lessons
              .filter((lessonItem) =>
                lessonItem.name
                  .toLowerCase()
                  .includes(lessonSearch.toLowerCase())
              )
              .map((lessonItem) => {
                return (
                  <ContentCard
                    key={lessonItem.id}
                    id={lessonItem.id}
                    name={lessonItem.name}
                    teacherInfo={lessonItem.teacher}
                    coverImage={lessonItem.coverImage}
                  />
                );
              }))}
      <Box
        sx={{
          textAlign: "left",
          marginBottom: 4,
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
          Material Teórico
        </Typography>
      </Box>
      <Box sx={{ textAlign: "left" }}>
        {!materialDrop &&
          (materials.length > 0 && !lessonSearch
            ? materials.map((materialItem) => {
                console.log("materialItem", materialItem);
                return materialItem ? (
                  <TheoryMaterial key={materialItem.id} {...materialItem} />
                ) : null;
              })
            : materials
                .filter((materialItem) =>
                  materialItem.name
                    .toLowerCase()
                    .includes(lessonSearch.toLowerCase())
                )
                .map((materialItem) => {
                  return materialItem ? (
                    <TheoryMaterial key={materialItem.id} {...materialItem} />
                  ) : null;
                }))}
      </Box>
    </>
  );
}
