import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import { Link } from "react-router-dom";
import imLogo from "../../assets/img/Form/im_logo.png";
import { login, createStudent } from "../../services/user.service";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useAuth } from "../../hooks/useAuth";
import { IUser } from "../../interfaces/IUser";
import { useApp } from "../../context/AppContext";

interface IAuthForm {
  mode: "login" | "register";
}

export function AuthForm({ mode }: IAuthForm) {
  const userContext = useContext(AuthContext);

  if (!userContext) {
    throw new Error("UserContext must be used within a UserProvider");
  }

  const { setUserWithStorage } = useAuth();

  const isLogin = mode === "login";
  const isRegister = mode === "register";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [church, setChurch] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const { handleMessage } = useApp();

  const checkValidFields = () => {
    if (isLogin) {
      if (!email || !password) {
        handleMessage("Preencha todos os campos", "error", {
          vertical: "top",
          horizontal: "right",
        });
        return false;
      }
    }
    if (isRegister) {
      if (!name || !email || !password || !church) {
        handleMessage("Preencha todos os campos", "error", {
          vertical: "top",
          horizontal: "right",
        });
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!checkValidFields()) return;

    try {
      let res: any;

      if (isLogin) {
        res = await login(email, password);
        handleMessage("Login realizado com sucesso!", "success", {
          vertical: "top",
          horizontal: "right",
        });
      } else {
        res = await createStudent(name, email, password, church);
        handleMessage("Registro realizado com sucesso!", "success", {
          vertical: "top",
          horizontal: "right",
        });
      }

      if (res.studentWithoutPassword && res.token) {
        const storedUser = localStorage.getItem("user");
        const userObject: IUser | null = storedUser
          ? JSON.parse(storedUser)
          : null;
        setUserWithStorage(userObject);
        navigate("/classes");
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        handleMessage(error.message, "error", {
          vertical: "top",
          horizontal: "right",
        });
      } else {
        handleMessage("Ocorreu um erro desconhecido.", "error", {
          vertical: "top",
          horizontal: "right",
        });
      }
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
              <Link to="forgot">
                <span
                  style={{
                    fontSize: "14px",
                    color: "#6b7280",
                    textDecoration: "underline",
                    cursor: "pointer",
                  }}
                >
                  Esqueci minha senha
                </span>
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
          <Link to={isLogin ? "/register" : "/login"}>
            <span
              style={{
                fontSize: "14px",
                color: "#6b7280",
                textDecoration: "underline",
                cursor: "pointer",
              }}
            >
              {isLogin ? "Registrar-se" : "Fazer Login"}
            </span>
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
