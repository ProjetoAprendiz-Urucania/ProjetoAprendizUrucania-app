import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography,
} from "@mui/material";
import { useAuth } from "../../hooks/useAuth";
import addfile from "../../assets/img/UploadFile/addfile.svg";
import { useState } from "react";
import { ILesson } from "../../interfaces/lesson/ILesson";
import { useClass } from "../../hooks/useClass";
import { useApp } from "../../context/AppContext";

export function UploadFile({
  lessons,
  setOpenProfileModal,
}: {
  lessons: ILesson[];
  setOpenProfileModal: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const { user } = useAuth();
  const { uploadMaterial } = useClass();
  const { handleMessage } = useApp();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);

  const handleUploadFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      setSelectedFile(file);
    }
  };

  const handleSelectedLesson = (event: SelectChangeEvent) => {
    setSelectedLesson(event.target.value);
  };

  const handleConfirm = async () => {
    if (isUploading || !selectedFile) return;
    uploadMaterial(selectedFile, selectedLesson);
    setOpenProfileModal(false);
    setSelectedFile(null);
    setSelectedLesson("");
    setIsUploading(false);
    handleMessage("Lição adicionada com sucesso!", "success", {
      vertical: "bottom",
      horizontal: "left",
    });
  };

  return (
    <>
      {user?.role === "admin" && (
        <Box
          sx={{
            backgroundColor: "white",
            borderRadius: "12px",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            padding: { xs: 4, md: 6 },
            gap: 3,
            width: "100%",
            margin: "0 auto",
          }}
        >
          <label htmlFor="file-upload" style={{ width: "100%" }}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                border: "2px dashed #1E1E1E",
                borderRadius: "12px",
                padding: { xs: 3, md: 4 },
                cursor: "pointer",
                transition: "border-color 0.3s, transform 0.2s",
                ":hover": {
                  borderColor: "#ED3237",
                  transform: "scale(1.02)",
                },
              }}
            >
              <Box
                component="img"
                src={addfile}
                alt="Upload file icon"
                sx={{
                  width: { xs: "40px", md: "50px" },
                  height: "auto",
                  objectFit: "cover",
                  transition: "transform 0.2s",
                  ":hover": {
                    transform: "scale(1.05)",
                  },
                }}
              />
              <Typography
                variant="body2"
                sx={{
                  marginTop: 2,
                  color: "#1E1E1E",
                  fontWeight: "bold",
                }}
              >
                {selectedFile
                  ? `${selectedFile.name}`
                  : "Clique para selecionar um arquivo"}
              </Typography>
            </Box>
            <input
              id="file-upload"
              type="file"
              accept=".pdf,.doc,.docx,.xlsx,.txt"
              style={{ display: "none" }}
              onChange={handleUploadFile}
            />
          </label>

          <FormControl fullWidth>
            <InputLabel id="lesson-select-label">
              Selecione uma lição
            </InputLabel>
            <Select
              labelId="lesson-select-label"
              id="lesson-select"
              value={selectedLesson}
              label="Selecione uma lição"
              onChange={handleSelectedLesson}
            >
              {lessons.map((lesson) => (
                <MenuItem key={lesson.id} value={lesson.id}>
                  {lesson.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Button
            type="button"
            disabled={!selectedFile || !selectedLesson || isUploading}
            sx={{
              backgroundColor:
                selectedFile && selectedLesson && !isUploading
                  ? "#BB1626"
                  : "#ccc",
              fontWeight: "bold",
              color:
                selectedFile && selectedLesson && !isUploading
                  ? "white"
                  : "#666",
              mt: 2,
              ":hover": {
                backgroundColor:
                  selectedFile && selectedLesson && !isUploading
                    ? "#A11420"
                    : "#ccc",
              },
            }}
            onClick={handleConfirm}
          >
            {isUploading ? "Enviando..." : "Confirmar"}
          </Button>
        </Box>
      )}
    </>
  );
}
