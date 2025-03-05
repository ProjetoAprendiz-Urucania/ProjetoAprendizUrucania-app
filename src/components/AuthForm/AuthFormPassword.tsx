import { useState } from "react";
import { useNavigate,useParams } from "react-router-dom";
import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  Link,
  TextField,
  Typography,
} from "@mui/material";

import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext/AuthContext";
import { IStudentData } from "../../interfaces/student/IStudent";
import { updateStudent } from "../../services/student.service";

import imLogo from "../../assets/img/Form/im_logo.png";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import {jwtDecode} from "jwt-decode";

interface IAuthForm {
  mode: "newPassword";
}

export default function AuthFormPassword({ mode }: IAuthForm) {
  const userContext = useContext(AuthContext);

  if (!userContext) {
    throw new Error("UserContext must be used within a UserProvider");
  }

  //const isConfirmCode = mode === "confirmCode";
  const isnewPassword = mode === "newPassword";
  const { token } = useParams<{ token: any }>();
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (!newPassword.trim()) {
      setError("Preencha todos os campos obrigatórios");
      return;
    }

    try {
      let res : any;
      const tk :any  = jwtDecode(token)
      let newStudentPassword :IStudentData = {password: newPassword, name: tk.name, email: tk.email};

      localStorage.setItem("token",token)// need for the updateStudent
      res = updateStudent(tk.id, newStudentPassword);
      localStorage.removeItem("token") //prevents some kind of bug


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
