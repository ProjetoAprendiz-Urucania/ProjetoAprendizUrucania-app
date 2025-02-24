import { createContext } from "react";

interface User {
  name: string;
  email: string;
  profilePicture?: string;
}

interface UserContextType {
  user: User | null;
  setUser: (user: User) => void;
  logout: () => void;
}

export const UserContext = createContext<UserContextType | undefined>(
  undefined
);
