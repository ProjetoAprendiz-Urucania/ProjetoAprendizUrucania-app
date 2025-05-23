import { Box, Snackbar, Alert } from "@mui/material";
import { useLocation } from "react-router-dom";
import { AuthForm } from "./AuthForm/AuthForm";
import { AuthFormPassword } from "./AuthForm/AuthFormPassword";
import logoIgreja from "../assets/img/Form/projeto_aprendiz_polo_urucania.svg";
import { useState } from "react";

type AuthMode = "register" | "forgot" | "login" | "newPassword";

export function AuthPage() {
  const location = useLocation();
  const path = location.pathname;

  const getMode = (): AuthMode => {
    if (path.includes("register")) return "register";
    if (path.includes("forgot")) return "forgot";
    if (path.includes("login")) return "login";
    return "login";
  };

  const mode = getMode();

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<
    "success" | "error" | "info" | "warning"
  >("info");

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleApiResponse = (
    message: string,
    severity: "success" | "error" | "info" | "warning",
  ) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

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
        {mode === "newPassword" || mode === "forgot" ? (
          <AuthFormPassword mode={mode} handleApiResponse={handleApiResponse} />
        ) : (
          <AuthForm mode={mode} handleApiResponse={handleApiResponse} />
        )}

        <Box
          component="img"
          src={logoIgreja}
          alt="ICM Logo"
          sx={{
            width: { xs: "16.6em", sm: "18.4em", md: "20.2em" },
            marginTop: { sm: "1.4em", md: "1.6em" },
            marginBottom: -1.8,
          }}
        />
      </Box>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}
