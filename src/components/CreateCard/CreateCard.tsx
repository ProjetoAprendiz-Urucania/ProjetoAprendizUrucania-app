import { Box, Button, TextField, Typography } from "@mui/material";
import { useAuth } from "../../hooks/useAuth";
import addimage from "../../assets/img/CreateCard/addImage.svg";
import { useEffect, useRef, useState } from "react";
import { createClass, uploadClassPhoto } from "../../services/class.service";
import { IClass } from "../../interfaces/class/IClass";
import { ILesson } from "../../interfaces/lesson/ILesson";
import { createLesson, uploadLessonPhoto } from "../../services/lesson.service";
import { useParams } from "react-router-dom";

export function CreateCard() {
  const { user } = useAuth();
  const { id } = useParams<{ id: string }>();

  const token = localStorage.getItem("token");
  const loading = useRef(true);
  const [selectedPhoto, setSelectedPhoto] = useState<File | null>();
  const [name, setName] = useState<string>("");
  const [teachers, setTeachers] = useState<string>("");
  const [lessonLink, setLessonLink] = useState<string>("");

  const isClassPage = /^\/classes\/[a-f0-9]{24}$/.test(location.pathname);

  useEffect(() => {
    const timeout = setTimeout(() => {
      loading.current = false;
    }, 1000);

    return () => clearTimeout(timeout);
  }, []);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];

      if (!file.type.startsWith("image/")) {
        alert("Por favor, selecione um arquivo de imagem válido.");
        return;
      }

      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = (e) => {
        const img = new Image();
        img.src = e.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");

          if (!ctx) return;

          canvas.width = img.width;
          canvas.height = img.height;

          ctx.drawImage(img, 0, 0);

          canvas.toBlob(
            (blob) => {
              if (blob) {
                const jpegFile = new File(
                  [blob],
                  file.name.replace(/\.\w+$/, ".jpeg"),
                  {
                    type: "image/jpeg",
                  }
                );
                setSelectedPhoto(jpegFile);
              }
            },
            "image/jpeg",
            0.9
          );
        };
      };
    }
  };

  const handleCreateClassCard = async () => {
    try {
      if (selectedPhoto && name && teachers && token) {
        const payload: IClass = {
          name: name,
          teachers: teachers,
        };

        const response = await createClass(payload, token);

        if (response) {
          await uploadClassPhoto(response.id, selectedPhoto, token);
          window.location.reload();
        }
      }
    } catch (error) {
      console.error("Erro ao criar card:", error);
    }
  };

  const handleCreateLessonCard = async () => {
    try {
      console.log(id);
      if (name && teachers && token && id) {
        const payload: ILesson = {
          name: name,
          teacher: teachers,
          lessonLink: lessonLink,
        };

        const response = await createLesson(id, payload, token);

        if (response && selectedPhoto) {
          await uploadLessonPhoto(id, response.id, selectedPhoto, token);
          window.location.reload();
        }
      }
    } catch (error) {
      console.error("Erro ao criar card:", error);
    }
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
            minWidth: { xs: "300px", md: "400px" },
            maxWidth: "500px",
            margin: "0 auto",
          }}
        >
          {/* Upload de Imagem */}
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
                src={
                  selectedPhoto ? URL.createObjectURL(selectedPhoto) : addimage
                }
                alt="Upload classes image"
                sx={{
                  width: selectedPhoto ? "100px" : { xs: "40px", md: "50px" },
                  height: selectedPhoto ? "100px" : "auto",
                  objectFit: "cover",
                  transition: "transform 0.2s",
                  ":hover": {
                    transform: selectedPhoto ? "scale(1.1)" : "scale(1.05)",
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
                {selectedPhoto
                  ? "Imagem selecionada"
                  : "Clique para selecionar uma imagem"}
              </Typography>
            </Box>
            <input
              id="file-upload"
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={handleFileChange}
            />
          </label>

          {/* Campo para link e nome da aula/turma */}
          {isClassPage && (
            <>
              <TextField
                id="lessonLink"
                label="Link da Aula"
                variant="outlined"
                sx={inputStyle}
                fullWidth
                value={lessonLink}
                onChange={(e) => setLessonLink(e.target.value)}
              />
              <TextField
                id="lessonName"
                label="Nome da Aula"
                variant="outlined"
                sx={inputStyle}
                fullWidth
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </>
          )}

          {!isClassPage && (
            <TextField
              id="className"
              label="Nome da Turma"
              variant="outlined"
              sx={inputStyle}
              fullWidth
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          )}

          {/* Campo para professores */}
          <TextField
            id="teachers"
            label={
              isClassPage ? "Professor" : "Professores (separados por vírgula)"
            }
            variant="outlined"
            sx={inputStyle}
            fullWidth
            value={teachers}
            onChange={(e) => setTeachers(e.target.value)}
          />

          {/* Botão de confirmação */}
          <Button
            type="submit"
            disabled={
              (!isClassPage && !name) ||
              (isClassPage && (!name || !lessonLink)) ||
              !teachers
            }
            sx={{
              backgroundColor: "#BB1626",
              fontWeight: "bold",
              color: "white",
              mt: 2,
              ":disabled": {
                backgroundColor: "#ccc",
                color: "#666",
              },
            }}
            onClick={
              isClassPage ? handleCreateLessonCard : handleCreateClassCard
            }
          >
            Confirmar
          </Button>
        </Box>
      )}
    </>
  );
}

const inputStyle = {
  "& .MuiInputLabel-root": {
    color: "#1F1F1F",
    fontSize: "15px",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  "& .MuiInputLabel-root.Mui-focused": {
    fontWeight: "bold",
    color: "#ED3237",
  },
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: "#1F1F1F",
    },
    "&:hover fieldset": {
      borderColor: "#ED3237",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#ED3237",
    },
  },
};
