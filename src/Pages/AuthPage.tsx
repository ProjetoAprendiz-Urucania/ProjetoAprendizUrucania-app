import { Box } from "@mui/material";
import AuthForm from "../components/AuthForm/AuthForm";
import logoIgreja from "../assets/img/Form/projeto_aprendiz_polo_urucania.svg";
import { useLocation } from "react-router-dom";

export function AuthPage() {
  const location = useLocation();
  const mode = location.pathname.includes("register") ? "register" : "login";

  return (
    <Box
      id="background"
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        background: "linear-gradient(26deg, #ffffff,#ffffff,#fff4f5,#fccacf)",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          flexDirection: "column",
          gap: 6,
        }}
      >
        <AuthForm mode={mode} />
        <Box
          component="img"
          src={logoIgreja}
          alt="ICM Logo"
          loading="lazy"
          sx={{
            width: { xs: "16em" },
            marginBottom: { xs: -8, sm: -10 },
          }}
        />
      </Box>
    </Box>
  );
}
