import {
  Routes,
  Route,
  useLocation,
  Navigate,
  useNavigate,
} from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./Theme/theme";
import "./App.css";
import Navbar from "./components/Navbar/Navbar";
import { AuthPage } from "./Pages/AuthPage";
import { ClassesPage } from "./Pages/ClassesPage";
import { Container, Box } from "@mui/material";
import { ClassPage } from "./Pages/ClassPage";
import { LessonPage } from "./Pages/LessonPage";
import ProtectedRoute from "./hoc/ProtectedRoute";
import { useAuth } from "./hooks/useAuth";
import { Footer } from "./components/Footer/Footer";
import { useEffect } from "react";
import { ClassProvider } from "./context/ClassContext";

function App() {
  const location = useLocation();
  const { token, logout } = useAuth();
  const navigate = useNavigate();

  const isLoginPage = location.pathname === "/login";
  const isRegisterPage = location.pathname === "/register";
  const isForgot = location.pathname === "/forgot";
  const isNewPassword = location.pathname.startsWith("/newPassword");

  useEffect(() => {
    if (location.pathname !== "/" && location.pathname.endsWith("/")) {
      navigate(location.pathname.slice(0, -1) + location.search, {
        replace: true,
      });
    }
  }, [location, navigate]);

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
      >
        {!isLoginPage && !isRegisterPage && !isForgot && !isNewPassword && (
          <Navbar logout={logout} token={token} />
        )}

        <Container
          maxWidth="xl"
          sx={{ flex: 1, display: "flex", flexDirection: "column", mb: 6 }}
        >
          <Routes>
            <Route path="/newPassword/:token" element={<AuthPage />} />
            <Route path="/forgot" element={<AuthPage />} />
            <Route path="/login" element={<AuthPage />} />
            <Route path="/register" element={<AuthPage />} />
            <Route
              path="/"
              element={
                <Navigate
                  to={
                    token
                      ? isNewPassword
                        ? "/newPassword/:token"
                        : "/classes"
                      : isNewPassword
                      ? "/newPassword/:token"
                      : "/login"
                  }
                  replace
                />
              }
            />
            <Route
              path="/classes"
              element={
                <ProtectedRoute>
                  <ClassProvider>
                    <ClassesPage />
                  </ClassProvider>
                </ProtectedRoute>
              }
            />
            <Route
              path="/classes/:id"
              element={
                <ProtectedRoute>
                  <ClassProvider>
                    <ClassPage />
                  </ClassProvider>
                </ProtectedRoute>
              }
            />
            <Route
              path="/classes/:classId/lessons/:lessonId"
              element={
                <ProtectedRoute>
                  <ClassProvider>
                    <LessonPage />
                  </ClassProvider>
                </ProtectedRoute>
              }
            />
          </Routes>
        </Container>

        {!isLoginPage && !isRegisterPage && !isForgot && !isNewPassword && (
          <Footer />
        )}
      </Box>
    </ThemeProvider>
  );
}

export default App;
