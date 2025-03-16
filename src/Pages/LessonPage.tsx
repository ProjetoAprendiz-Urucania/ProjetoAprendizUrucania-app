import { useEffect, useState } from "react";
import { ILesson } from "../interfaces/lesson/ILesson";
import { getLesson } from "../services/lesson.service";
import { Box, Button, Typography } from "@mui/material";
import { useParams } from "react-router-dom";
import { getMaterialsByLesson } from "../services/theoryMaterials.service";
import { TheoryMaterialItem } from "../components/TheoryMaterial/TheoryMaterial";
import { ITheoryMaterial } from "../interfaces/TheoryMaterial/ITheoryMaterial";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { VideoPlayer } from "../components/Video/VideoPlayer";
import { LinearProgress } from "@mui/material";

export function LessonPage() {
  const { classId, lessonId } = useParams<{
    classId: string;
    lessonId: string;
  }>();
  const [lesson, setLesson] = useState<ILesson | null>(null);
  const [materials, setMaterials] = useState<ITheoryMaterial[]>([]);
  const [materialDrop, setMaterialDrop] = useState(false);
  const [tk] = useState<string | null>(localStorage.getItem("token"));
  const [progress, setProgress] = useState<number>(0);

  useEffect(() => {
    const fetchLessons = async () => {
      if (!classId || !lessonId) {
        console.log("classId ou lessonId não informados");
        return;
      }

      if (!tk) {
        console.log("err get classes() token inexistente");
        return;
      }

      try {
        const response = await getLesson(classId, lessonId, tk);
        setLesson(response);
      } catch (error) {
        console.error("Erro ao buscar a lição:", error);
      }
    };

    fetchLessons();
  }, [classId, lessonId, tk]);

  useEffect(() => {
    const fetchMaterials = async () => {
      if (!classId || !lessonId) return;

      if (!tk) {
        console.log("err get classes() token inexistente");
        return;
      }

      try {
        const materials = await getMaterialsByLesson(classId, lessonId, tk);
        setMaterials(materials);
      } catch (error) {
        console.error("Erro ao buscar materiais:", error);
      }
    };

    fetchMaterials();
  }, [classId, lessonId, tk]);

  useEffect(() => {
    console.log("Progresso atualizado:", progress);
  }, [progress]);

  return (
    <Box sx={{ marginY: { xs: 4, sm: 6, md: 8 } }}>
      <VideoPlayer
        url={lesson?.lessonLink || ""}
        onProgress={(progress) => setProgress(progress)}
      />

      {progress < 99 ? (
        <Box
          sx={{ width: "100%", marginBottom: 4, marginTop: { sx: -1, md: -4 } }}
        >
          <Typography
            variant="body2"
            sx={{ color: "#000", marginBottom: 1 }}
          ></Typography>
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{
              height: 4.2,
              backgroundColor: "#ddd",
              "& .MuiLinearProgress-bar": {
                backgroundColor: "#BB1626",
              },
            }}
          />
        </Box>
      ) : (
        <Box
          sx={{
            width: "100%",
            marginBottom: 4,
            marginTop: { sx: -1, md: -4 },
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <Button
            type="submit"
            sx={{
              backgroundColor: "#BB1626",
              fontWeight: "bold",
              color: "white",
              justifySelf: "flex-end",
              alignSelf: "flex-end",
            }}
          >
            Presente
          </Button>
        </Box>
      )}

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

      {!materialDrop &&
        materials.length > 0 &&
        materials.map((materialItem) => (
          <TheoryMaterialItem key={materialItem.id} {...materialItem} />
        ))}
    </Box>
  );
}
