import { useEffect, useState } from "react";
import { ContentCard } from "../components/ContentCard/ContentCard";
import { IClass } from "../interfaces/class/IClass";
import { getClasses } from "../services/class.service";
import { Box, Typography } from "@mui/material";
import { SearchBar } from "../components/SearchBar/SearchBar";
import { useParams } from "react-router-dom";

export function Lesson() {
  const {id} = useParams();
  const [classes, setClasses] = useState<IClass[]>([]);

  useEffect(() => {
    const fetchClasses = async () => {
      const response = await getClasses();
      setClasses(response);
    };
    fetchClasses();
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
      {classes.length > 0 &&
        classes.map((classItem) => {
          return (
            <ContentCard
              key={classItem.id}
              id={classItem.id}
              name={classItem.name}
              teacherInfo={classItem.teachers}
              coverImage={classItem.coverImage}
            />
          );
        })}
    </>
  );
}
