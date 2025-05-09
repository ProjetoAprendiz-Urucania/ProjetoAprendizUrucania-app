import { createBrowserRouter } from "react-router-dom";
import AuthForm from "../components/AuthForm/AuthForm";
import { AuthPage } from "../Pages/AuthPage";

export const routes = createBrowserRouter([
  {
    path: "/",
    element: <AuthPage />,
    children: [
      {
        index: true,
        path: "/login",
        element: <AuthForm mode="login" />,
      },
      {
        path: "/register",
        element: <AuthForm mode="register" />,
      },
    ],
  },
]);
