import { Box, Button, TextField, Typography } from "@mui/material";
import { useAuth } from "../../hooks/useAuth";
import addimage from "../../assets/img/CreateCard/addImage.svg";
import { useState } from "react";

import { ICreateClass, IUpdateClass } from "../../interfaces/class/IClass";
import { ICreateLesson, IUpdateLesson } from "../../interfaces/lesson/ILesson";
import { useClass } from "../../hooks/useClass";
import { useApp } from "../../context/AppContext";
import { useClassActions } from "../../hooks/useClassActions";
import { useLessonActions } from "../../hooks/useLessonActions";
import { useMatch } from "react-router-dom";

export function CreateCard({
  index,
  setOpenProfileModal,
}: {
  index?: number | null;
  setOpenProfileModal: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const { user } = useAuth();
  const { handleMessage } = useApp();
  const { selectedClass, classes, lessons } = useClass();
  const { updateLesson, addLesson } = useLessonActions();
  const { addClass, updateClass } = useClassActions();

  const token = localStorage.getItem("token");
  const [selectedPhoto, setSelectedPhoto] = useState<File | null>();
  const [name, setName] = useState<string>("");
  const [teachers, setTeachers] = useState<string>("");
  const [lessonLink, setLessonLink] = useState<string>("");

  const isClassPage = useMatch("/classes/:classId/lessons");

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];

      if (!file.type.startsWith("image/")) {
        handleMessage("Por favor, selecione um arquivo de valido.", "error", {
          vertical: "top",
          horizontal: "left",
        });
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

          const MAX_WIDTH = 800;
          const MAX_HEIGHT = 800;
          let { width, height } = img;

          if (width > MAX_WIDTH || height > MAX_HEIGHT) {
            const ratio = Math.min(MAX_WIDTH / width, MAX_HEIGHT / height);
            width *= ratio;
            height *= ratio;
          }

          canvas.width = width;
          canvas.height = height;
          ctx.drawImage(img, 0, 0, width, height);

          canvas.toBlob(
            (blob) => {
              if (blob) {
                const jpegFile = new File(
                  [blob],
                  file.name.replace(/\.\w+$/, ".jpeg"),
                  {
                    type: blob.type || "image/jpeg",
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
    if (name && teachers && token) {
      const payload: ICreateClass = {
        name: name,
        teachers: teachers,
        coverImage: selectedPhoto || undefined,
      };

      const classExists = classes.some(
        (classItem) => classItem.name === payload.name
      );

      if (classExists) {
        handleMessage("Nome da turma já existe!", "warning", {
          vertical: "top",
          horizontal: "right",
        });
        return;
      }

      addClass(payload);
    }

    if (name && teachers && token) {
      setOpenProfileModal(false);
    }
  };

  const handleCreateLessonCard = async () => {
    if (name && teachers && token && selectedClass && selectedClass.id) {
      const payload: ICreateLesson = {
        name,
        teacher: teachers,
        coverImage: selectedPhoto || undefined,
        lessonLink,
      };

      const lessonExists = lessons.some(
        (lessonItem) => lessonItem.name === payload.name
      );

      if (lessonExists) {
        handleMessage("Nome da aula já existe!", "warning", {
          vertical: "top",
          horizontal: "right",
        });
        return;
      }

      try {
        await addLesson(payload);
        handleMessage("Aula criada com sucesso!", "success", {
          vertical: "top",
          horizontal: "right",
        });
        setOpenProfileModal(false);
      } catch (error) {
        console.error(error);
        handleMessage("Erro ao criar aula!", "error", {
          vertical: "top",
          horizontal: "right",
        });
      }
    }
  };

  const handleUpdateClassCard = async () => {
    const payload: Partial<IUpdateClass> = {};
    payload.name = name;
    payload.teacherInfo = teachers;
    payload.coverImage = selectedPhoto ?? undefined;

    const classExists = classes.some(
      (classItem) => classItem.name === payload.name
    );

    if (classExists) {
      handleMessage("Nome da turma já existe!", "warning", {
        vertical: "top",
        horizontal: "right",
      });
      return;
    }

    if (
      Object.keys(payload).length > 0 &&
      typeof index === "number" &&
      index >= 0 &&
      index < classes.length
    ) {
      updateClass(classes[index].id, payload);
      handleMessage("Turma atualizada com sucesso!", "success", {
        vertical: "top",
        horizontal: "right",
      });
    }

    setOpenProfileModal(false);
  };

  const handleUpdateLessonCard = async () => {
    if (!selectedClass) {
      console.error("selectedClass is undefined");
      return null;
    }

    const payload: Partial<IUpdateLesson> = {};
    payload.name = name;
    payload.teacher = teachers;
    payload.lessonLink = lessonLink;
    payload.coverImage = selectedPhoto ?? undefined;

    const lessonExists = lessons.some(
      (lessonItem) => lessonItem.name === payload.name
    );

    if (lessonExists) {
      handleMessage("Nome da aula já existe!", "warning", {
        vertical: "top",
        horizontal: "right",
      });
      return;
    }

    if (
      Object.keys(payload).length > 0 &&
      typeof index === "number" &&
      selectedClass.lessons[index]
    ) {
      updateLesson(selectedClass.lessons[index].id, payload);
    }

    setOpenProfileModal(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isClassPage) {
      if (index !== null && index !== undefined) {
        handleUpdateLessonCard();
      } else {
        handleCreateLessonCard();
      }
    } else {
      if (index !== null && index !== undefined) {
        handleUpdateClassCard();
      } else {
        handleCreateClassCard();
      }
    }
  };

  return (
    <>
      {user?.role === "admin" && (
        <Box
          component="form"
          onSubmit={handleSubmit}
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
                textAlign: "center",
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
                  textAlign: "center",
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

          {isClassPage && (
            <>
              <TextField
                required={index === undefined}
                id="lessonLink"
                label="Link da Aula"
                variant="outlined"
                sx={inputStyle}
                fullWidth
                value={lessonLink}
                onChange={(e) => setLessonLink(e.target.value)}
              />
              <TextField
                required={index === undefined}
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
              required={index === undefined}
              id="className"
              label="Nome da Turma"
              variant="outlined"
              sx={inputStyle}
              fullWidth
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          )}

          <TextField
            required={index === undefined}
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

          <Button
            type="submit"
            sx={{
              backgroundColor: "#BB1626",
              fontWeight: "bold",
              color: "white",
              mt: 2,
            }}
          >
            {index !== null && index !== undefined ? "Atualizar" : "Confirmar"}
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
