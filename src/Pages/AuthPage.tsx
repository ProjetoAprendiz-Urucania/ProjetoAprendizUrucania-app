import { Box } from "@mui/material";
import { useLocation } from "react-router-dom";
import { AuthForm } from "./AuthForm/AuthForm";
import { AuthFormPassword } from "./AuthForm/AuthFormPassword";
import logoIgreja from "../assets/img/Form/projeto_aprendiz_polo_urucania.svg";

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
          <AuthFormPassword mode={mode} />
        ) : (
          <AuthForm mode={mode} />
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
    </Box>
  );
}
