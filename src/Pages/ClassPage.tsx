import { useEffect, useState } from "react";
import { ContentCard } from "../components/ContentCard/ContentCard";
import { ILesson } from "../interfaces/lesson/ILesson";
import { getLessonsByClassId } from "../services/lesson.service";
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
  const [tk] = useState<string | null>(localStorage.getItem("token"));

  const [searchTerm, setSearchTerm] = useState("");
  const [lessonsDrop, setLessonsDrop] = useState(false);
  const [materialDrop, setMaterialDrop] = useState(false);
  


  useEffect(() => {
    const fetchLessons = async () => {
      if (id) {
        if(!tk){
           console.log("err get classes() token inexistente")
         }else{
          const response = await getLessonsByClassId(id,tk);
          setLessons(response);
        }

      } else {
        console.log("ID não informado");
      }
    };
    fetchLessons();
  }, [id]);

  useEffect(() => {
    const fetchMaterials = async () => {
      if (lessons.length > 0 && id) {
        const materialsArray = await Promise.all(
          lessons.map(async (lesson) => {
            console.log("lessonId:-----------------------", lesson.id);
            if(!tk){
              console.log("err get classes() token inexistente")
            }else{
              return getMaterial(id, lesson.id,tk);
            }
            
          })
        );

        setMaterials(materialsArray.flat().filter(Boolean));
      }
    };

    fetchMaterials();
  }, [id, lessons]);

  return (
    <>
      <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
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
          Aulas
        </Typography>
      </Box>
      {!lessonsDrop &&
        (lessons.length > 0 && !searchTerm
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
                lessonItem.name.toLowerCase().includes(searchTerm.toLowerCase())
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
          Materiais Teóricos
        </Typography>
      </Box>
      <Box sx={{ textAlign: "left" }}>
        {!materialDrop &&
          (materials.length > 0 && !searchTerm
            ? materials.map((materialItem) => {
                return materialItem ? (
                  <TheoryMaterial key={materialItem.id} {...materialItem} />
                ) : null;
              })
            : materials
                .filter((materialItem) =>
                  materialItem.name
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase())
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
