import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { IStudent } from "../interfaces/student/IStudent";

interface IProtectedRouteProps {
  children: ReactNode;
  roleRequired?: string;
}

const ProtectedRoute = ({ children, roleRequired }: IProtectedRouteProps) => {
  const storedUser = localStorage.getItem("user");
  const storeToken = localStorage.getItem("token");

  let user: IStudent | null = null;

  try {
    user = storedUser ? JSON.parse(storedUser) : null;
  } catch (error) {
    console.error("Erro ao parsear os dados do usuário:", error);
    localStorage.removeItem("user");
  }

  const location = useLocation();

  if (!user || !storeToken || storeToken.trim() === "") {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (roleRequired && user.role !== roleRequired) {
    console.warn(`Acesso negado. Necessário papel: ${roleRequired}.`);
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
