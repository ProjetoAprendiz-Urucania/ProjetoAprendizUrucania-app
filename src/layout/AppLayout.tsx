import { useLocation } from "react-router-dom";
import { Navbar } from "../components/Navbar/Navbar";
import { useAuth } from "../hooks/useAuth";
import { Box, Container } from "@mui/material";
import { Footer } from "../components/Footer/Footer";

export function AppLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const { token, logout } = useAuth();

  const authRoutes = ["/login", "/register", "/forgot", "/newPassword"];
  const isAuthRoute = authRoutes.includes(location.pathname);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
      }}
    >
      {!isAuthRoute && <Navbar token={token} logout={logout} />}
      <Container
        maxWidth="xl"
        sx={{
          flexGrow: 1,
          py: 2,
        }}
      >
        {children}
      </Container>
      {!isAuthRoute && <Footer />}
    </Box>
  );
}
