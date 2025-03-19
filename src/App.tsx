import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./Theme/theme";
import "./App.css";
import Navbar from "./components/Navbar/Navbar";
import { AuthPage } from "./Pages/AuthPage";
import { ClassesPage } from "./Pages/ClassesPage";
import { Container } from "@mui/material";
import { ClassPage } from "./Pages/ClassPage";
import { LessonPage } from "./Pages/LessonPage";
import ProtectedRoute from "./hoc/ProtectedRoute";
import { useAuth } from "./hooks/useAuth";
import { Footer } from "./components/Footer/Footer";

function App() {
  const location = useLocation();
  const { token, logout } = useAuth();

  const isLoginPage = location.pathname === "/login";
  const isRegisterPage = location.pathname === "/register";
  const isForgot = location.pathname === "/forgot";
  const isnewPassword = location.pathname.startsWith("/newPassword");

  return (
    <ThemeProvider theme={theme}>
      {!isLoginPage && !isRegisterPage && !isForgot && !isnewPassword && (
        <Navbar logout={logout} token={token} />
      )}
      <Container maxWidth="xl">
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
                    ? isnewPassword
                      ? "/newPassword/:token"
                      : "/classes"
                    : isnewPassword
                    ? "/newPassword/:token"
                    : "/login"
                }
                replace
              />
            } // Privents from heading to /login when you try to reset password without a user/token on storage
          />
          <Route
            path="/classes"
            element={
              <ProtectedRoute>
                <ClassesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/classes/:id"
            element={
              <ProtectedRoute>
                <ClassPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/classes/:classId/:lessonId"
            element={
              <ProtectedRoute>
                <LessonPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Container>
      <Footer />
    </ThemeProvider>
  );
}

export default App;
