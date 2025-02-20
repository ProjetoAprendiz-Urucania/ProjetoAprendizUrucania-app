import { Box } from "@mui/material";
import AuthForm from "../components/AuthForm/AuthForm";
import logoIgreja from "../assets/img/Form/projeto_aprendiz_polo_urucania.svg";
import { useLocation } from "react-router-dom";

export function AuthPage() {
  const location = useLocation();
  const mode = location.pathname.includes("register") ? "register" : "login";

  return (
    <Box
      sx={{
        width: "100vw",
        minHeight: "100vh",
        height: "auto",
        position: "absolute",
        top: 0,
        left: 0,
        background: "linear-gradient(to bottom, #ffdada, #fff)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Box
        sx={{
          width: "100%",
          padding: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <AuthForm mode={mode} />
        <Box
          component="img"
          src={logoIgreja}
          alt="ICM Logo"
          sx={{
            width: { xs: "16em", sm: "18em", md: "20em" },
            marginTop: 2,
          }}
        />
      </Box>
    </Box>
  );
}
