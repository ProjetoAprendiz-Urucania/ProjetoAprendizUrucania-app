import { useState } from "react";
import { Box, Button, Link, TextField } from "@mui/material";
import imLogo from "../../assets/img/Form/im_logo.png";

interface AuthFormProps {
  mode: "login" | "register";
}

export default function AuthForm({ mode }: AuthFormProps) {
  const isLogin = mode === "login";

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isLogin) {
      console.log("Login:", email, password);
    } else {
      console.log("Register:", username, email, password);
    }
  };

  return (
    <Box
      sx={{
        backgroundColor: "white",
        padding: "24px",
        borderRadius: "12px",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        minWidth: { xs: "260px", sm: "360px" },
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <Box sx={{ minWidth: { xs: "240px", sm: "280px" } }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            marginBottom: "1em",
          }}
        >
          <Box component="img" src={imLogo} alt="Logo" width="42px" />
        </Box>

        <form
          onSubmit={handleSubmit}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 22,
            justifyItems: "center",
          }}
        >
          {!isLogin && (
            <TextField
              id="username"
              label="Nome"
              variant="standard"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              sx={{
                "& .MuiInputLabel-root": {
                  color: "#1F1F1F",
                },
                "& .MuiInputLabel-root.Mui-focused": {
                  fontWeight: "bold",
                  color: "#ED3237",
                },
                color: "#ED3237",
                "& .MuiInput-underline:before": {
                  borderBottomColor: "#1F1F1F",
                },
                "& .MuiInput-underline:hover:before": {
                  borderBottomColor: "#ED3237 !important",
                },
                "& .MuiInput-underline:after": {
                  borderBottomColor: "#ED3237",
                },
              }}
            />
          )}
          <TextField
            id="email"
            label="Email"
            variant="standard"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={{
              "& .MuiInputLabel-root": {
                color: "#1F1F1F",
              },
              "& .MuiInputLabel-root.Mui-focused": {
                fontWeight: "bold",
                color: "#ED3237",
              },
              color: "#ED3237",
              "& .MuiInput-underline:before": {
                borderBottomColor: "#1F1F1F",
              },
              "& .MuiInput-underline:hover:before": {
                borderBottomColor: "#ED3237 !important",
              },
              "& .MuiInput-underline:after": {
                borderBottomColor: "#ED3237",
              },
            }}
          />
          <TextField
            id="password"
            label="Senha"
            type="password"
            variant="standard"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{
              "& .MuiInputLabel-root": {
                color: "#1F1F1F",
              },
              "& .MuiInputLabel-root.Mui-focused": {
                fontWeight: "bold",
                color: "#ED3237",
              },
              color: "#ED3237",
              "& .MuiInput-underline:before": {
                borderBottomColor: "#1F1F1F",
              },
              "& .MuiInput-underline:hover:before": {
                borderBottomColor: "#ED3237 !important",
              },
              "& .MuiInput-underline:after": {
                borderBottomColor: "#ED3237",
              },
            }}
          />
          <Button
            type="submit"
            sx={{
              backgroundColor: "#BB1626",
              fontWeight: "bold",
              color: "white",
              marginTop: 2,
            }}
          >
            {isLogin ? "Entrar" : "Registrar"}
          </Button>
        </form>

        <Box
          sx={{
            textAlign: "center",
            marginTop: 4,
            textDecoration: "underline",
          }}
        >
          <Link
            href={isLogin ? "/register" : "/login"}
            sx={{
              fontSize: "14px",
              color: "#6b7280",
              cursor: "pointer",
              "&:hover": {
                color: "#ED3237",
                textDecoration: "underline",
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
