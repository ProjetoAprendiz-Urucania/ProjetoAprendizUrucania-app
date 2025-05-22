import { createContext } from "react";
import { IUser } from "../../interfaces/IUser";

interface AuthContextType {
  user: IUser | null;
  token: string | null;
  setUser: (user: IUser | null) => void;
  setToken: (token: string | null) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);
