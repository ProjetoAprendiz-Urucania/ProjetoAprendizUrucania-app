import { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Avatar,
  Paper,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

export const Profile: React.FC = () => {
  const [profilePic, setProfilePic] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [igreja, setIgreja] = useState("");

  const handleProfilePicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProfilePic(e.target.files[0]);
      setPreview(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleRemovePic = () => {
    setProfilePic(null);
    setPreview(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Perfil atualizado!");
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
              onClick={handleRemovePic}
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
