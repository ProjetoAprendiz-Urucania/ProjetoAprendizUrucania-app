import { useEffect, useState } from "react";
import { ILesson } from "../interfaces/lesson/ILesson";
import { getLesson } from "../services/lesson.service";
import { Box, Typography } from "@mui/material";
import { useParams } from "react-router-dom";
import { getMaterialsByLesson } from "../services/theoryMaterials.service";
import { TheoryMaterialItem } from "../components/TheoryMaterial/TheoryMaterial";
import { ITheoryMaterial } from "../interfaces/TheoryMaterial/ITheoryMaterial";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { VideoPlayer } from "../components/Video/VideoPlayer";

export function LessonPage() {
  const { classId, lessonId } = useParams<{
    classId: string;
    lessonId: string;
  }>();
  const [lesson, setLesson] = useState<ILesson>();
  const [materials, setMaterials] = useState<ITheoryMaterial[]>([]);
  const [materialDrop, setMaterialDrop] = useState(false);
  const [tk] = useState<string | null>(localStorage.getItem("token"));

  useEffect(() => {
    const fetchLessons = async () => {
      if (classId && lessonId) {
        if (!tk) {
          console.log("err get classes() token inexistente");
        } else {
          const response = await getLesson(classId, lessonId, tk);
          setLesson(response);
        }
      } else {
        console.log("classId ou lessonId não informados");
      }
    };
    fetchLessons();
  }, [classId, lessonId, tk]);

  useEffect(() => {
    const fetchMaterials = async () => {
      if (lesson && classId && lessonId) {
        let allMaterials: ITheoryMaterial[] = [];
        if (!tk) {
          console.log("err get classes() token inexistente");
        } else {
          const materials = await getMaterialsByLesson(classId, lessonId, tk);
          allMaterials = [...allMaterials, ...materials];
          setMaterials(allMaterials);
        }
      }
    };
    fetchMaterials();
  }, [classId, lessonId, lesson, tk]);

  return (
    <Box sx={{ marginY: { xs: 4, sm: 6, md: 8 } }}>
      <VideoPlayer url={lesson?.lessonLink || ""} />
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
      <Box sx={{ textAlign: "left", marginBottom: 4 }}>
        {!materialDrop &&
          materials.length > 0 &&
          materials.map((materialItem) => {
            return materialItem ? (
              <TheoryMaterialItem key={materialItem.id} {...materialItem} />
            ) : null;
          })}
      </Box>
    </Box>
  );
}
