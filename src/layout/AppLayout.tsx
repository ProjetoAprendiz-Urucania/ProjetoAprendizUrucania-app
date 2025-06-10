import { Outlet } from "react-router-dom";
import { Navbar } from "../components/Navbar/Navbar";
import { useAuth } from "../hooks/useAuth";
import { Box, Container } from "@mui/material";
import { Footer } from "../components/Footer/Footer";

export function AppLayout() {
  const { token, logout } = useAuth();

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
        }}
      >
        <Navbar token={token} logout={logout} />
        <Container
          maxWidth="xl"
          sx={{
            width: "100%",
            py: 2,
          }}
        >
          <Outlet />
        </Container>
      </Box>
      <Footer />
    </>
  );
}
