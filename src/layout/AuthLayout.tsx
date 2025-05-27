import { Outlet, useMatch } from "react-router-dom";
import { Navbar } from "../components/Navbar/Navbar";
import { useAuth } from "../hooks/useAuth";
import { Box, Container } from "@mui/material";
import { Footer } from "../components/Footer/Footer";

export function AuthLayout() {
  const { token, logout } = useAuth();

  const matchLogin = useMatch("/login");
  const matchRegister = useMatch("/register");
  const matchForgot = useMatch("/forgot");
  const matchNewPassword = useMatch("/newPassword/:token");

  const isAuthRoute =
    !!matchLogin || !!matchRegister || !!matchForgot || !!matchNewPassword;

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        background: "linear-gradient(to bottom, #ffdada, #fff)",
      }}
    >
      {!isAuthRoute && <Navbar token={token} logout={logout} />}
      <Container
        maxWidth="xl"
        sx={{
          width: "100%",
          flexGrow: 1,
          py: 2,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "transparent",
        }}
      >
        <Outlet />
      </Container>
      {!isAuthRoute && <Footer />}
    </Box>
  );
}
