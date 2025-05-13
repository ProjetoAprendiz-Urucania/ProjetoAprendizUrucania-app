import { createContext } from "react";
import { IUser } from "../interfaces/IUser";
import { useState, ReactNode, useEffect } from "react";

interface AuthContextType {
  user: IUser | null;
  token: string | null;
  setUserWithStorage: (user: IUser | null) => void;
  setTokenWithStorage: (token: string | null) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem("token");
  });

  const [user, setUser] = useState<IUser | null>(() => {
    try {
      const storedUser = localStorage.getItem("user");
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (error) {
      console.error("Erro ao recuperar usuário do localStorage:", error);
      return null;
    }
  });

  const setUserWithStorage = (user: IUser | null) => {
    setUser(user);
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
    window.dispatchEvent(new Event("storage"));
  };

  const setTokenWithStorage = (token: string | null) => {
    setToken(token);
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }
    window.dispatchEvent(new Event("storage"));
  };

  useEffect(() => {
    const handleStorageChange = () => {
      try {
        const storedUser = localStorage.getItem("user");
        setUser(storedUser ? JSON.parse(storedUser) : null);
        setToken(localStorage.getItem("token"));
      } catch (error) {
        console.error("Erro ao atualizar usuário do localStorage:", error);
      }
    };

    const handleAuthLogout = () => logout(true);

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("auth:logout", handleAuthLogout);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("auth:logout", handleAuthLogout);
    };
  }, []);

  const logout = (internal = false) => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");

    if (!internal) {
      window.dispatchEvent(new Event("auth:logout"));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        setUserWithStorage,
        setTokenWithStorage,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
