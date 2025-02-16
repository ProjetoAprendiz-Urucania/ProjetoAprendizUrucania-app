import { useState, useEffect } from "react";
import { Box } from "@mui/material";
import AuthForm from "../components/AuthForm/AuthForm";
import logoIgreja from "../assets/img/Form/projeto_aprendiz_polo_urucania.svg";
import { useLocation } from "react-router-dom";

export function AuthPage() {
  const location = useLocation();
  const mode = location.pathname.includes("register") ? "register" : "login";

  const [isPageLoaded, setIsPageLoaded] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.src = logoIgreja;
    img.onload = () => setIsImageLoaded(true);

    const handlePageLoad = () => setIsPageLoaded(true);
    window.addEventListener("load", handlePageLoad);

    return () => window.removeEventListener("load", handlePageLoad);
  }, []);

  if (!isPageLoaded || !isImageLoaded) return null;

  return (
    <Box
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
          sx={{
            width: { xs: "16em" },
            marginBottom: { xs: -8, sm: -10 },
          }}
        />
      </Box>
    </Box>
  );
}
