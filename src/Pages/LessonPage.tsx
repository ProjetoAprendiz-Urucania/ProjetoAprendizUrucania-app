import { useEffect, useState, useCallback, useMemo } from "react";
import { useParams } from "react-router-dom";
import { Box, Button, Typography, LinearProgress } from "@mui/material";
import {
  CheckCircle as CheckCircleIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon,
  KeyboardArrowUp as KeyboardArrowUpIcon,
  Summarize as SummarizeIcon,
} from "@mui/icons-material";

import { handleDownloadExcel } from "../components/HandleDownloadExcel/HandleDownloadExcel";
import { TheoryMaterialItem } from "../components/TheoryMaterial/TheoryMaterial";
import { VideoPlayer } from "../components/Video/VideoPlayer";
import { confirmPresence } from "../services/frequencyList.service";
import { useClass } from "../hooks/useClass";
import { getLesson } from "../services/lesson.service";
import { getMaterialsByLesson } from "../services/theoryMaterials.service";
import { useApp } from "../context/AppContext";
import { useAuth } from "../hooks/useAuth";

import { ILesson } from "../interfaces/lesson/ILesson";
import { ITheoryMaterial } from "../interfaces/TheoryMaterial/ITheoryMaterial";

export function LessonPage() {
  const { user } = useAuth();
  const { lessonId } = useParams<{ lessonId: string }>();
  const { selectedClass } = useClass();
  const { handleMessage } = useApp();

  const [lessonMaterials, setLessonMaterials] = useState<ITheoryMaterial[]>([]);
  const [materialDrop, setMaterialDrop] = useState(false);
  const [progress, setProgress] = useState(0);
  const [playedTime, setPlayedTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [present, setPresent] = useState(false);
  const [link, setLink] = useState<string | undefined>();

  const token = useMemo(() => localStorage.getItem("token"), []);
  const localUser = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "{}");
    } catch {
      return {};
    }
  }, []);

  const formatTime = useCallback((seconds: number) => {
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${String(min).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  }, []);

  const handleConfirmPresence = useCallback(async () => {
    if (!localUser.id || !lessonId || !selectedClass?.id) {
      console.warn("classId, lessonId ou user.id não informados.");
      return;
    }

    try {
      const res = await confirmPresence(
        selectedClass.id,
        lessonId,
        localUser.id
      );

      if (!res.success) {
        handleMessage("Sua presença já foi confirmada!", "warning", {
          vertical: "top",
          horizontal: "right",
        });
        return;
      }

      setPresent(true);
      handleMessage("Presença confirmada com sucesso!", "success", {
        vertical: "top",
        horizontal: "right",
      });
    } catch (error) {
      console.error("Erro inesperado ao confirmar presença:", error);
    }
  }, [localUser.id, lessonId, selectedClass?.id, handleMessage]);

  useEffect(() => {
    if (!selectedClass || !lessonId || !token) return;

    getLesson(selectedClass.id, lessonId, token)
      .then((lesson: ILesson) => setLink(lesson.lessonLink))
      .catch(console.error);
  }, [selectedClass?.id, lessonId, token]);

  useEffect(() => {
    if (!selectedClass?.id || !lessonId || !token) return;

    getMaterialsByLesson(selectedClass.id, lessonId, token)
      .then(setLessonMaterials)
      .catch((error) => {
        console.error("Erro ao buscar materiais:", error);
      });
  }, [selectedClass?.id, lessonId, token]);

  const materials = useMemo(() => {
    return lessonMaterials.map((materialItem, index) => (
      <TheoryMaterialItem
        key={materialItem.id}
        id={materialItem.id}
        index={index}
        name={materialItem.name}
        fileType={materialItem.fileType}
        lessonId={lessonId || ""}
        fileUrl={materialItem.fileUrl}
        classId={selectedClass?.id || ""}
        materialId={materialItem.id}
      />
    ));
  }, [lessonMaterials, lessonId, selectedClass?.id]);

  return (
    <Box sx={{ marginY: { xs: 4, sm: 6, md: 8 } }}>
      <VideoPlayer
        url={link ?? ""}
        onProgress={({ played, playedSeconds }) => {
          setProgress(played * 100);
          setPlayedTime(playedSeconds);
        }}
        onDuration={(d) => setDuration(d)}
      />

      {progress < 85 ? (
        <Box sx={{ width: "100%", marginBottom: 4 }}>
          <Typography
            variant="body2"
            sx={{ color: "#1e1e1e", marginBottom: 1, fontWeight: "bold" }}
          >
            {formatTime(playedTime)} / {formatTime(duration)}
          </Typography>
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
            onClick={handleConfirmPresence}
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
        {materialDrop ? (
          <KeyboardArrowDownIcon
            sx={{ marginRight: "4px", marginLeft: -0.8, cursor: "pointer" }}
            onClick={() => setMaterialDrop(false)}
          />
        ) : (
          <KeyboardArrowUpIcon
            sx={{ marginRight: "4px", marginLeft: -0.8, cursor: "pointer" }}
            onClick={() => setMaterialDrop(true)}
          />
        )}
        <Typography variant="h5" sx={{ fontWeight: "600" }}>
          Materiais Teóricos
        </Typography>
      </Box>

      {!materialDrop && materials}

      {user?.role === "admin" && (
        <Box my={4}>
          <Button
            variant="contained"
            startIcon={<SummarizeIcon />}
            sx={{
              backgroundColor: "#BB1626",
              color: "white",
              fontWeight: "bold",
              textTransform: "none",
              fontSize: "1rem",
              px: 2,
              py: 0.6,
              mt: 2,
              borderRadius: 2,
              boxShadow: 2,
              ":hover": {
                backgroundColor: "#A11420",
                boxShadow: 4,
              },
            }}
            onClick={() => {
              if (selectedClass?.id && lessonId) {
                handleDownloadExcel(selectedClass.id, lessonId, handleMessage);
              }
            }}
          >
            Lista de Presença
          </Button>
        </Box>
      )}
    </Box>
  );
}
