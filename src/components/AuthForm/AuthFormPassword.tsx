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
import {
  confirmHashChangePassword,
} from "../../services/student.service";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext/AuthContext";
import { useAuth } from "../../hooks/useAuth";
import { IUser } from "../../interfaces/IUser";

interface IAuthForm {
  mode: "confirmCode" | "newPassword";
}

export default function AuthFormPassword({ mode }: IAuthForm) {
  const userContext = useContext(AuthContext);

  if (!userContext) {
    throw new Error("UserContext must be used within a UserProvider");
  }

  const { setUser } = useAuth();

  const isConfirmCode = mode === "confirmCode";
  const isnewPassword = mode === "newPassword";

  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (isConfirmCode) {
      if (!code.trim()) {
        setError("Preencha todos os campos obrigatórios");
        return;
      }
    } else {
      if (!newPassword.trim()) {
        setError("Preencha todos os campos obrigatórios");
        return;
      }
    }

    try {
      let res: any;

      if (isConfirmCode) {
        let localHash = localStorage.getItem("hash");
        if (localHash) {
          res = await confirmHashChangePassword(code, localHash);
        }
      } /*else if(isLogin) {
          res = await login(email, password);
        } else {
          res = await createStudent(name, email, password, church);
        }*/

      if (res === true) {
        localStorage.removeItem("hash")
        navigate("/newPassword");
      } else {
        console.log("resposta ao registro:", res);
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
            gap: 28,
          }}
        >
          {isConfirmCode && (
            <TextField
              id="code"
              label="Code"
              variant="standard"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              sx={inputStyle}
            />
          )}

          {isnewPassword && (
            <TextField
              id="password"
              label="Nova Senha"
              type={showPassword ? "text" : "password"}
              variant="standard"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
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
            {isConfirmCode ? "Confirmar" : "Mudar Senha"}
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
