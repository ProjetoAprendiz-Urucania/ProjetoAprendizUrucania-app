import { useState, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  Link,
  TextField,
  Snackbar,
  Alert,
} from "@mui/material";

import { AuthContext } from "../../context/AuthContext/AuthContext";
import { IStudent } from "../../interfaces/student/IStudent";
import { updateStudent, forgotPassword } from "../../services/user.service";

import imLogo from "../../assets/img/Form/im_logo.png";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { jwtDecode, JwtPayload } from "jwt-decode";
import { useApp } from "../../context/AppContext";

interface ITokenPayload extends JwtPayload {
  id: string;
  name: string;
  email: string;
}

interface IAuthFormPassword {
  mode: "newPassword" | "forgot";
}

export default function AuthFormPassword({ mode }: IAuthFormPassword) {
  const userContext = useContext(AuthContext);

  if (!userContext) {
    throw new Error("UserContext must be used within a UserProvider");
  }

  const isForgot = mode === "forgot";
  const isnewPassword = mode === "newPassword";

  const [email, setEmail] = useState("");
  const { token } = useParams<{ token?: string }>();
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const { handleMessage } = useApp();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (isForgot) {
      if (!email.trim()) {
        handleMessage("Preencha com seu email", "error", {
          vertical: "bottom",
          horizontal: "left",
        });
        return;
      }
    } else if (!newPassword.trim()) {
      handleMessage("Preencha todos os campos obrigatórios", "error", {
        vertical: "bottom",
        horizontal: "left",
      });
      return;
    }

    try {
      let res: any;

      if (isForgot) {
        res = await forgotPassword(email);

        if (res === "userExists") {
          setEmail("");
          setSuccess(
            "Seu link de Recuperação foi enviado ao email informado, redirecionando a login"
          );
          setTimeout(() => navigate("/login"), 3000);
        }
      } else {
        const tk: ITokenPayload = jwtDecode(token || "");
        const newStudentPassword: IStudent = {
          password: newPassword,
          name: tk.name,
          email: tk.email,
        };

        res = await updateStudent(tk.id, newStudentPassword, token || "");

        if (res.email) {
          setNewPassword("");
          setSuccess("Senha mudada com sucesso, redirecionando a login");
          setTimeout(() => navigate("/login"), 3000);
        }
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : "Erro inesperado");
    }
  };

  return (
    <Box
      sx={{
        backgroundColor: "white",
        padding: "30px",
        borderRadius: "12px",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
      }}
    >
      <Box sx={{ minWidth: { xs: "240px", sm: "280px" } }}>
        <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 3 }}>
          <Box component="img" src={imLogo} alt="Logo" width="42px" />
        </Box>

        <form
          onSubmit={handleSubmit}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 28,
          }}
        >
          {isnewPassword && (
            <TextField
              id="password"
              label="Nova Senha"
              type={showPassword ? "text" : "password"}
              variant="outlined"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              sx={inputStyle}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      onMouseDown={(e) => e.preventDefault()}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          )}

          {isForgot && (
            <TextField
              id="email"
              label="Email"
              variant="outlined"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={inputStyle}
            />
          )}

          <Button
            type="submit"
            sx={{
              backgroundColor: "#BB1626",
              fontWeight: "bold",
              color: "white",
              mt: 2,
            }}
          >
            {isnewPassword ? "Mudar Senha" : "Confirmar"}
          </Button>
        </form>

        <Box sx={{ textAlign: "center", mt: 3 }}>
          <Link
            href="/login"
            sx={{
              fontSize: "14px",
              color: "#ED3237",
              fontWeight: "bolder",
              textDecoration: "underline",
              cursor: "pointer",
              marginY: 1.5,
              "&:hover": {
                color: "#BB1626",
              },
            }}
          >
            Fazer Login
          </Link>
        </Box>
      </Box>

      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
      >
        <Alert severity="error" sx={{ width: "100%" }}>
          {error}
        </Alert>
      </Snackbar>

      <Snackbar
        open={!!success}
        autoHideDuration={6000}
        onClose={() => setSuccess(null)}
      >
        <Alert severity="success" sx={{ width: "100%" }}>
          {success}
        </Alert>
      </Snackbar>
    </Box>
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
