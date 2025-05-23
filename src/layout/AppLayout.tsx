import { Navbar } from "../components/Navbar/Navbar";
import { useAuth } from "../hooks/useAuth";
import { Container } from "@mui/material";
import { Footer } from "../components/Footer/Footer";

export function AppLayout({ children }: { children: React.ReactNode }) {
  const { token, logout } = useAuth();
  return (
    <>
      <Navbar token={token} logout={logout} />
      <Container maxWidth="xl">{children}</Container>
      <Footer/>
    </>
  );
}
