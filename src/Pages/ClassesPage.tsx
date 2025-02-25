import { useEffect, useState } from "react";
import { ContentCard } from "../components/ContentCard/ContentCard";
import { IClass } from "../interfaces/class/IClass";
import { getClasses } from "../services/class.service";
import { Box, Typography } from "@mui/material";
import { SearchBar } from "../components/SearchBar/SearchBar";

export function ClassesPage() {
  const [classes, setClasses] = useState<IClass[]>([]);
  const [classSearch, setClassSearch] = useState("");
  const [tk] = useState<string | null>(localStorage.getItem("token"));

  useEffect(() => {
    const fetchClasses = async () => {
      if(!tk){
        console.log("err get classes() token inexistente")
      }else{
        const response = await getClasses(tk);
        setClasses(response);
      }
      
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
