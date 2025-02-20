import { useEffect, useState } from "react";
import { ContentCard } from "../components/ContentCard/ContentCard";
import { ILesson } from "../interfaces/lesson/ILesson";
import { getLessons } from "../services/lesson.service";
import { Box, Typography } from "@mui/material";
import { SearchBar } from "../components/SearchBar/SearchBar";
import { useParams } from "react-router-dom";

export function Lesson() {
  const {id} = useParams<{id: string}>();
  const [lessons, setLessons] = useState<ILesson[]>([]);

  useEffect(() => {
    const fetchLessons = async () => {
      if(id){
        const response = await getLessons(id);
      setLessons(response);
      }else{
        console.log("ID não informado")
      }
      
    };
    fetchLessons();
  }, []);

  return (
    <>
      <SearchBar />
      <Box
        sx={{
          textAlign: "left",
          marginBottom: 4,
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: "600" }}>
          Aula
        </Typography>
      </Box>
      {lessons.length > 0 &&
        lessons.map((lessonItem) => {
          return (
            <ContentCard
              key={lessonItem.id}
              id={lessonItem.id}
              name={lessonItem.name}
              teacherInfo={lessonItem.teacher}
              coverImage={lessonItem.coverImage}
            />
          );
        })}
    </>
  );
}
