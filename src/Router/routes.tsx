import { createBrowserRouter } from "react-router-dom";
import { ClassesPage } from "../Pages/ClassesPage";
import { ClassPage } from "../Pages/ClassPage";
import { ProtectedRoute } from "../hoc/ProtectedRoute";
import { LessonPage } from "../Pages/LessonPage";
import { AppLayout } from "../layout/AppLayout";
import { ClassProvider } from "../context/ClassContext";
import { LoginForm } from "../components/LoginForm";
import { RegisterForm } from "../components/RegisterForm";
import { NewPasswordForm } from "../components/NewPasswordForm";
import { ProjetoAprendiz } from "../Pages/ProjetoAprendiz";
import { AccessArea } from "../Pages/AccessArea";

export const routes = createBrowserRouter([
  {
    path: "/",
    element: <ProjetoAprendiz />,
  },

  {
    path: "/",
    element: <AccessArea />,
    children: [
      {
        path: "/login",
        element: <LoginForm />,
      },
      {
        path: "/register",
        element: <RegisterForm />,
      },
      {
        path: "/newPassword",
        element: <NewPasswordForm />,
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
