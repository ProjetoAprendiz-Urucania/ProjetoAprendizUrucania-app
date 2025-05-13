import { useLocation } from "react-router-dom";
import { Navbar } from "../components/Navbar/Navbar";
import { useAuth } from "../hooks/useAuth";
import { Container } from "@mui/material";

export function AppLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const { token, logout } = useAuth();

  // Rotas de autenticação
  const authRoutes = ["/login", "/register", "/forgot", "/newPassword"];
  const isAuthRoute = authRoutes.includes(location.pathname);

  return (
    <>
      {!isAuthRoute && <Navbar token={token} logout={logout} />}
      <Container maxWidth="xl">{children}</Container>
    </>
  );
}
