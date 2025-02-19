import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, Link, TextField, Typography } from "@mui/material";
import imLogo from "../../assets/img/Form/im_logo.png";
import { login, createStudent } from "../../services/student.service";

interface IAuthForm {
  mode: "login" | "register";
}

export default function AuthForm({ mode }: IAuthForm) {
  const isLogin = mode === "login";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [church, setChurch] = useState("");
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password.trim()) {
      setError("Preencha todos os campos obrigatórios");
      return;
    }

    if (!isLogin && !name.trim()) {
      setError("Preencha todos os campos obrigatórios");
      return;
    }

    try {
      let res;
      if (isLogin) {
        res = await login(email, password);
      } else {
        const newStudent = { name, email, password, church };
        res = await createStudent(newStudent);
      }

      console.log(res.status);

      if (res?.status && res.status >= 200 && res.status < 300) {
        navigate("/classes");
      } else if (res?.error) {
        setError(res.error);
      } else {
        setError("Erro desconhecido");
      }
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Erro inesperado. Tente novamente.");
      }
      console.error(error);
    }
  };

  return (
    <Box
      sx={{
        backgroundColor: "white",
        padding: "24px",
        borderRadius: "12px",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <Box sx={{ minWidth: { xs: "240px", sm: "280px" } }}>
        <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
          <Box component="img" src={imLogo} alt="Logo" width="42px" />
        </Box>

        {error && (
          <Typography color="error" textAlign="center" mb={2}>
            {error}
          </Typography>
        )}

        <form
          onSubmit={handleSubmit}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 18,
          }}
        >
          {!isLogin && (
            <>
              <TextField
                id="name"
                label="Nome"
                variant="standard"
                value={name}
                onChange={(e) => setName(e.target.value)}
                sx={inputStyle}
              />
              <TextField
                id="church"
                label="Igreja"
                variant="standard"
                value={church}
                onChange={(e) => setChurch(e.target.value)}
                sx={inputStyle}
              />
            </>
          )}
          <TextField
            id="email"
            label="Email"
            variant="standard"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={inputStyle}
          />
          <TextField
            id="password"
            label="Senha"
            type="password"
            variant="standard"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={inputStyle}
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
            {isLogin ? "Entrar" : "Registrar"}
          </Button>
        </form>

        <Box sx={{ textAlign: "center", mt: 4 }}>
          <Link
            href={isLogin ? "/register" : "/login"}
            sx={{
              fontSize: "14px",
              color: "#6b7280",
              textDecoration: "underline",
              cursor: "pointer",
              "&:hover": {
                color: "#ED3237",
              },
            }}
          >
            {isLogin ? "Registrar-se" : "Fazer Login"}
          </Link>
        </Box>
      </Box>
    </Box>
  );
}

const inputStyle = {
  "& .MuiInputLabel-root": { color: "#1F1F1F" },
  "& .MuiInputLabel-root.Mui-focused": {
    fontWeight: "bold",
    color: "#ED3237",
  },
  "& .MuiInput-underline:before": { borderBottomColor: "#1F1F1F" },
  "& .MuiInput-underline:hover:before": {
    borderBottomColor: "#ED3237 !important",
  },
  "& .MuiInput-underline:after": { borderBottomColor: "#ED3237" },
};
