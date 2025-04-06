import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  Link,
  TextField,
  Typography,
} from "@mui/material";
import imLogo from "../../assets/img/Form/im_logo.png";
import { login, createStudent } from "../../services/student.service";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext/AuthContext";
import { useAuth } from "../../hooks/useAuth";
import { IUser } from "../../interfaces/IUser";

interface IAuthForm {
  mode: "login" | "register";
  handleApiResponse: (
    message: string,
    severity: "success" | "error" | "info" | "warning"
  ) => void;
}

export default function AuthForm({ mode, handleApiResponse }: IAuthForm) {
  const userContext = useContext(AuthContext);

  if (!userContext) {
    throw new Error("UserContext must be used within a UserProvider");
  }

  const { setUser } = useAuth();

  const isLogin = mode === "login";
  const isRegister = mode === "register";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [church, setChurch] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      let res: any;

      if (isLogin) {
        res = await login(email, password);
        handleApiResponse("Login bem-sucedido!", "success");
      } else {
        res = await createStudent(name, email, password, church);
        handleApiResponse("Registro realizado com sucesso!", "success");
      }

      if (res.studentWithoutPassword && res.token) {
        const storedUser = localStorage.getItem("user");
        const userObject: IUser | null = storedUser
          ? JSON.parse(storedUser)
          : null;
        setUser(userObject);
        navigate("/classes");
      }
    } catch (error: any) {
      handleApiResponse(
        error.message === "Preencha todos os campos"
          ? "Preencha todos os campos"
          : error.message === "Login error: Invalid email or password."
          ? "Email ou senha inválidos"
          : error.message === "Email already registered."
          ? "Email já está em uso"
          : error.message,
        "error"
      );
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
          {isRegister && (
            <>
              <TextField
                id="name"
                label="Nome"
                variant="outlined"
                value={name}
                onChange={(e) => setName(e.target.value)}
                sx={inputStyle}
              />
              <TextField
                id="church"
                label="Igreja"
                variant="outlined"
                value={church}
                onChange={(e) => setChurch(e.target.value)}
                sx={inputStyle}
              />
            </>
          )}
          <TextField
            id="email"
            label="Email"
            variant="outlined"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={inputStyle}
          />

          <TextField
            id="password"
            label="Senha"
            type={showPassword ? "text" : "password"}
            variant="outlined"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={inputStyle}
            slotProps={{
              input: {
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
              },
            }}
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
            {isLogin ? "Entrar" : isRegister ? "Registrar" : "Enviar código"}
          </Button>
        </form>

        {isLogin && (
          <>
            <Box sx={{ textAlign: "center", mt: 3 }}>
              <Link
                href="forgot"
                sx={{
                  fontSize: "14px",
                  color: "#6b7280",
                  textDecoration: "underline",
                  cursor: "pointer",
                  marginY: 1,
                  "&:hover": {
                    color: "#ED3237",
                  },
                }}
              >
                Esqueci minha senha
              </Link>
            </Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                width: "100%",
                mt: 3.2,
              }}
            >
              <Box
                sx={{ flex: 1, height: "1px", backgroundColor: "#6b7280" }}
              />
              <Typography
                sx={{
                  mx: 1,
                  color: "#6b7280",
                  fontWeight: "200",
                  fontSize: "12px",
                }}
              >
                ou
              </Typography>
              <Box
                sx={{ flex: 1, height: "1px", backgroundColor: "#6b7280" }}
              />
            </Box>
          </>
        )}

        <Box sx={{ textAlign: "center", mt: 3 }}>
          <Link
            href={isLogin ? "/register" : "/login"}
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
            {isLogin ? "Registrar-se" : "Fazer Login"}
          </Link>
        </Box>
      </Box>
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
