import { createBrowserRouter } from "react-router-dom";
import { AuthForm } from "../Pages/AuthForm/AuthForm";
import { AuthFormPassword } from "../Pages/AuthForm/AuthFormPassword";
import { ClassesPage } from "../Pages/ClassesPage";
import { ClassPage } from "../Pages/ClassPage";
import { ProtectedRoute } from "../hoc/ProtectedRoute";
import { LessonPage } from "../Pages/LessonPage";
import { AppLayout } from "../layout/AppLayout";
import { ClassProvider } from "../context/ClassContext";
import { AuthLayout } from "../layout/AuthLayout";
import { Profile } from "../Pages/Profile";

export const routes = createBrowserRouter([
  {
    path: "/",
    element: <AuthLayout />,
    children: [
      {
        path: "/login",
        element: <AuthForm mode="login" />,
      },
      {
        path: "/register",
        element: <AuthForm mode="register" />,
      },
      {
        path: "/forgot",
        element: <AuthFormPassword mode="forgot" />,
      },
      {
        path: "/newPassword/:token",
        element: <AuthFormPassword mode="newPassword" />,
      },
      { path: "", element: <AuthForm mode="login" /> },
    ],
  },
  {
    path: "classes",
    element: (
      <ClassProvider>
        <AppLayout />
      </ClassProvider>
    ),
    children: [
      {
        path: "",
        element: (
          <ProtectedRoute>
            <ClassesPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "profile/:id", 
        element: <Profile />,
      },
      {
        path: ":id/lessons",
        element: (
          <ProtectedRoute>
            <ClassPage />
          </ProtectedRoute>
        ),
      },
      {
        path: ":classId/lessons/:lessonId",
        element: (
          <ProtectedRoute>
            <LessonPage />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);
