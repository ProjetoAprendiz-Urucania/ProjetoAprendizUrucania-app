import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import "./App.css";
import Navbar from "./components/Navbar/Navbar";
import { AuthPage } from "./Pages/AuthPage";
import { ClassesPage } from "./Pages/ClassesPage";
import { Container } from "@mui/material";
import { ClassPage } from "./Pages/ClassPage";

function App() {
  const location = useLocation();

  const isLoginPage = location.pathname === "/login";
  const isRegisterPage = location.pathname === "/register";

  return (
    <>
      {!isLoginPage && !isRegisterPage && <Navbar />}
      <Container maxWidth="xl">
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<AuthPage />} />
          <Route path="/register" element={<AuthPage />} />
          <Route path="/classes" element={<ClassesPage />} />
          <Route path="/classes/:id" element={<ClassPage />} />
        </Routes>
      </Container>
    </>
  );
}

export default App;
