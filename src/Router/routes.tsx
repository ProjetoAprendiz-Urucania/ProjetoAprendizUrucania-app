import { createBrowserRouter } from "react-router-dom";
import { AuthPage } from "../Pages/AuthPage";
import { AuthForm } from "../Pages/AuthForm/AuthForm";
import { AuthFormPassword } from "../Pages/AuthForm/AuthFormPassword";
import { ClassesPage } from "../Pages/ClassesPage";
import { ClassPage } from "../Pages/ClassPage";
import { ProtectedRoute } from "../hoc/ProtectedRoute";
import { LessonPage } from "../Pages/LessonPage";
import { AppLayout } from "../layout/AppLayout";
import { ClassProvider } from "../context/ClassContext";

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
        path: "/newPassword/:token",
        element: <AuthFormPassword mode="newPassword" />,
      },
    ],
  },
  {
    path: "/classes",
    element: (
      <ClassProvider>
        <AppLayout>
          <ProtectedRoute>
            <ClassesPage />
          </ProtectedRoute>
        </AppLayout>
      </ClassProvider>
    ),
  },
  {
    path: "/classes/:id",
    element: (
      <ClassProvider>
        <AppLayout>
          <ProtectedRoute>
            <ClassPage />
          </ProtectedRoute>
        </AppLayout>
      </ClassProvider>
    ),
  },
  {
    path: "/classes/:classId/lessons/:lessonId",
    element: (
      <ClassProvider>
        <AppLayout>
          <ProtectedRoute>
            <LessonPage />
          </ProtectedRoute>
        </AppLayout>
      </ClassProvider>
    ),
  },
]);
