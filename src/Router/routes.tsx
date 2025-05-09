import { createBrowserRouter } from "react-router-dom";
import { AuthPage } from "../Pages/AuthPage";
import { AuthForm } from "../Pages/AuthForm/AuthForm";
import { AuthFormPassword } from "../Pages/AuthForm/AuthFormPassword";

export const routes = createBrowserRouter([
  {
    path: "/",
    element: <AuthPage />,
    children: [
      {
        path: "/login",
        element: <AuthForm mode="login" handleApiResponse={(message, severity) => console.log(`${severity}: ${message}`)} />,
      },
      {
        path: "/register",
        element: <AuthForm mode="register" handleApiResponse={(message, severity) => console.log(`${severity}: ${message}`)} />,
      },
      {
        path: "/forgot",
        element: <AuthFormPassword mode="forgot" handleApiResponse={(message, severity) => console.log(`${severity}: ${message}`)} />,
      },
      {
        path: "/newPassword",
        element: <AuthFormPassword mode="newPassword" handleApiResponse={(message, severity) => console.log(`${severity}: ${message}`)} />,
      },
    ],
  },
]);
