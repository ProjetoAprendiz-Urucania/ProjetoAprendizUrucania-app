import { useEffect, useState } from "react";
import { ContentCard } from "../components/ContentCard/ContentCard";
import { ILesson } from "../interfaces/lesson/ILesson";
import { getLessons } from "../services/lesson.service";
import { Box, Typography } from "@mui/material";
import { SearchBar } from "../components/SearchBar/SearchBar";
import { useParams } from "react-router-dom";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

export function LessonsPage() {
  const { id } = useParams<{ id: string }>();
  const [lessons, setLessons] = useState<ILesson[]>([]);
  const [lessonSearch, setLessonSearch] = useState("");
  const [lessonsDrop, setLessonsDrop] = useState(false);

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
    </>
  );
}
