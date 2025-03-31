import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Box, Button, Typography, LinearProgress } from "@mui/material";
import {
  CheckCircle as CheckCircleIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon,
  KeyboardArrowUp as KeyboardArrowUpIcon,
} from "@mui/icons-material";

import { ILesson } from "../interfaces/lesson/ILesson";
import { ITheoryMaterial } from "../interfaces/TheoryMaterial/ITheoryMaterial";
import { getLesson } from "../services/lesson.service";
import { getMaterialsByLesson } from "../services/theoryMaterials.service";
import { TheoryMaterialItem } from "../components/TheoryMaterial/TheoryMaterial";
import { VideoPlayer } from "../components/Video/VideoPlayer";
import { confirmPresence } from "../services/frequencyList";

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
  const [present, setPresent] = useState<boolean>(false);

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

  const handleConfirmPresence = async () => {
    try {
      const userData = localStorage.getItem("user");
      if (!userData) {
        console.error("Usuário não encontrado no localStorage.");
        return;
      }

      const user = JSON.parse(userData);
      if (!user.id || !lessonId || !classId) {
        console.warn("classId, lessonId ou user.id não informados.");
        return;
      }

      const res = await confirmPresence(classId, lessonId, user.id);

      if (!res.success) {
        console.error("Erro ao confirmar presença:", res.message || res);
        return;
      }

      setPresent(true);
    } catch (error) {
      console.error("Erro inesperado ao confirmar presença:", error);
    }
  };

  return (
    <Box sx={{ marginY: { xs: 4, sm: 6, md: 8 } }}>
      <VideoPlayer
        url={lesson?.lessonLink || ""}
        onProgress={(progress) => setProgress(progress)}
      />

      {progress < 99 ? (
        <Box sx={{ width: "100%", marginBottom: 4 }}>
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
            marginBottom: 6,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Button
            onClick={() => handleConfirmPresence()}
            sx={{
              backgroundColor: "#BB1626",
              fontWeight: "bold",
              color: "white",
              paddingX: 4,
              paddingY: 1.2,
              fontSize: "1rem",
              textTransform: "none",
              display: "flex",
              alignItems: "center",
              borderRadius: 8,
              boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
              "&:hover": {
                backgroundColor: "#9B0E1D",
              },
            }}
            endIcon={<CheckCircleIcon />}
          >
            {present ? "Presença Confirmada" : "Confirmar Presença"}
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
