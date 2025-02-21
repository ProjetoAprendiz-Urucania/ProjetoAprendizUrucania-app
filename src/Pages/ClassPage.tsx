import { useEffect, useState } from "react";
import { ContentCard } from "../components/ContentCard/ContentCard";
import { IClass } from "../interfaces/class/IClass";
import { getClasses } from "../services/class.service";
import { Box, Typography } from "@mui/material";
import { SearchBar } from "../components/SearchBar/SearchBar";

export function ClassPage() {
  const [classes, setClasses] = useState<IClass[]>([]);
  const [classSearch, setClassSearch] = useState("");

  useEffect(() => {
    const fetchClasses = async () => {
      const response = await getClasses();
      setClasses(response);
    };
    fetchClasses();
  }, []);

  return (
    <>
      <SearchBar searchTerm={classSearch} setSearchTerm={setClassSearch} />
      <Box
        sx={{
          textAlign: "left",
          marginBottom: 4,
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: "600" }}>
          Turmas
        </Typography>
      </Box>
      {classes.length > 0 && !classSearch
        ? classes.map((classItem) => {
            return (
              <ContentCard
                key={classItem.id}
                id={classItem.id}
                name={classItem.name}
                teacherInfo={classItem.teachers}
                coverImage={classItem.coverImage}
              />
            );
          })
        : classes
            .filter((classItem) =>
              classItem.name.toLowerCase().includes(classSearch.toLowerCase())
            )
            .map((classItem) => (
              <ContentCard
                key={classItem.id}
                id={classItem.id}
                name={classItem.name}
                teacherInfo={classItem.teachers}
                coverImage={classItem.coverImage}
              />
            ))}
    </>
  );
}
