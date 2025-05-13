import { createBrowserRouter } from "react-router-dom";
import { AuthPage } from "../Pages/AuthPage";
import { AuthForm } from "../Pages/AuthForm/AuthForm";
import { AuthFormPassword } from "../Pages/AuthForm/AuthFormPassword";
import { ClassesPage } from "../Pages/ClassesPage";
import { ClassPage } from "../Pages/ClassPage";
import { ProtectedRoute } from "../hoc/ProtectedRoute";
import { LessonPage } from "../Pages/LessonPage";
import { AppLayout } from "../layout/AppLayout";

export const routes = createBrowserRouter([
  {
    path: "/",
    element: (
      <AppLayout>
        <AuthPage />,
      </AppLayout>
    ),
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
        path: "/newPassword",
        element: <AuthFormPassword mode="newPassword" />,
      },
    ],
  },
  {
    path: "/classes",
    element: (
      <AppLayout>
        <ProtectedRoute>
          <ClassesPage />
        </ProtectedRoute>
      </AppLayout>
    ),
  },
  {
    path: "/classes/:id",
    element: (
      <AppLayout>
        <ProtectedRoute>
          <ClassPage />
        </ProtectedRoute>
      </AppLayout>
    ),
  },
  {
    path: "/classes/:classId/:lessonId",
    element: (
      <AppLayout>
        <ProtectedRoute>
          <LessonPage />
        </ProtectedRoute>
      </AppLayout>
    ),
  },
]);
