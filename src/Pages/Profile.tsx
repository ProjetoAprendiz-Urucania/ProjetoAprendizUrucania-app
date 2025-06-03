import { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  Avatar,
  Paper,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { updateStudent, uploadProfilePhoto, getStudentById } from "../services/user.service";
import { useApp } from "../context/AppContext";

export const Profile: React.FC = () => {
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [igreja, setIgreja] = useState("");
  const { handleMessage } = useApp();

  // Carregar dados do usuário ao montar o componente
  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      const user = JSON.parse(userStr);
      setName(user.name || "");
      setEmail(user.email || "");
      setIgreja(user.church || "");
      if (user.profilePicture) setPreview(user.profilePicture);
    }
  }, []);

  const handleProfilePicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProfilePicture(e.target.files[0]);
      setPreview(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleRemovePhoto = () => {
    setProfilePicture(null);
    setPreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const storedUserData = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    if (!storedUserData || !token) {
      handleMessage("Usuário não encontrado. Faça login novamente.", "error", {
        vertical: "top",
        horizontal: "right",
      });
      return;
    }
    const user = JSON.parse(storedUserData);

    try {
      // Atualiza os dados principais
      const updatedUser = {
        ...user,
        name,
        email,
        church: igreja,
      };
      await updateStudent(user.id, updatedUser, token);

      // Atualiza a foto de perfil, se houver nova imagem selecionada
      if (profilePicture) {
        await uploadProfilePhoto(user.id, profilePicture);
      }

      // Busca o usuário atualizado do backend para garantir que a imagem está correta
      const userFromBackend = await getStudentById(user.id);

      // Atualiza o localStorage com os novos dados do backend
      localStorage.setItem("user", JSON.stringify(userFromBackend));
      if (userFromBackend.profilePicture) setPreview(userFromBackend.profilePicture);

      handleMessage("Perfil atualizado com sucesso!", "success", {
        vertical: "top",
        horizontal: "right",
      });
    } catch (error) {
      handleMessage(
        "Erro ao atualizar perfil. Tente novamente mais tarde.",
        "error",
        {
          vertical: "top",
          horizontal: "right",
        }
      );
      console.error(error);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Paper
        elevation={6}
        sx={{
          maxWidth: 420,
          width: "100%",
          p: { xs: 2, sm: 4 },
          borderRadius: 4,
          boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.15)",
          background: "rgba(255,255,255,0.95)",
        }}
      >
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            flexDirection: "column",
            gap: 3,
            marginBottom: 2,
          }}
        >
          <Box
            sx={{
              mb: 2,
              position: "relative",
            }}
          >
            <IconButton
              aria-label="Remover foto"
              onClick={handleRemovePhoto}
              sx={{
                position: "absolute",
                top: 8,
                right: 8,
                color: "#b71c1c",
                bgcolor: "rgba(255,255,255,0.7)",
                "&:hover": { bgcolor: "#ffcdd2" },
              }}
              size="small"
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
            <label
              htmlFor="profilePic"
              style={{
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <input
                id="profilePic"
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={handleProfilePicChange}
              />
              <Avatar
                src={preview || "https://via.placeholder.com/160?text=Foto"}
                alt="Foto de Perfil"
                sx={{
                  width: 150,
                  height: 150,
                  mb: 1,
                  border: "3px solid #b71c1c",
                  bgcolor: "#fff",
                }}
              />
            </label>
          </Box>
          <TextField
            label="Nome"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            fullWidth
            variant="outlined"
            InputProps={{
              sx: { borderRadius: 2 },
            }}
            sx={{ mb: 1 }}
          />
          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            fullWidth
            variant="outlined"
            InputProps={{
              sx: { borderRadius: 2 },
            }}
            sx={{ mb: 1 }}
          />
          <TextField
            label="Igreja"
            value={igreja}
            onChange={(e) => setIgreja(e.target.value)}
            required
            fullWidth
            variant="outlined"
            InputProps={{
              sx: { borderRadius: 2 },
            }}
            sx={{ mb: 2 }}
          />
          <Button
            type="submit"
            variant="contained"
            fullWidth
            size="large"
            sx={{
              mt: 1,
              borderRadius: 2,
              fontWeight: 600,
              letterSpacing: 1,
              boxShadow: 2,
              py: 1.5,
              bgcolor: "#b71c1c",
              "&:hover": { bgcolor: "#c62828" },
            }}
          >
            Confirmar
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};
