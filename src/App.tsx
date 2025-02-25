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
import { UserProvider } from "./context/provider/userProvider";
import ProtectedRoute from "./hoc/ProtectedRoute";

function App() {
  const location = useLocation();

  const isLoginPage = location.pathname === "/login";
  const isRegisterPage = location.pathname === "/register";

  const isAuthenticated = Boolean(localStorage.getItem("token"));

  return (
    <UserProvider>
      {" "}
      <ThemeProvider theme={theme}>
        {!isLoginPage && !isRegisterPage && <Navbar />}
        <Container maxWidth="xl">
          <Routes>
            <Route path="/login" element={<AuthPage />} />
            <Route path="/register" element={<AuthPage />} />
            <Route
              path="/"
              element={
                <Navigate
                  to={isAuthenticated ? "/classes" : "/login"}
                  replace
                />
              }
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
      </ThemeProvider>
    </UserProvider>
  );
}

export default App;
