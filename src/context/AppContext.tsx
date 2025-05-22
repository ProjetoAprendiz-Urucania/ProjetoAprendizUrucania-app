import { AlertColor } from "@mui/material";
import { createContext, ReactNode, useContext, useState } from "react";
import {
  AlertMessage,
  horizontalAlign,
  verticalAlign,
} from "../components/AlertMessage/AlertMessage";

interface IAppContextProps {
  handleMessage: (
    message: string,
    error: AlertColor,
    position?: {
      vertical?: verticalAlign;
      horizontal?: horizontalAlign;
    }
  ) => void;
}

export const AppContext = createContext<IAppContextProps | undefined>(
  undefined
);

export const AppProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState<AlertColor>();
  const [position, setPosition] = useState<{
    vertical?: verticalAlign;
    horizontal?: horizontalAlign;
  }>({
    vertical: "bottom",
    horizontal: "right",
  });

  const handleCloseSnackbar = (
    _event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackbar(false);
  };

  const handleMessage = (
    message: string,
    error: AlertColor,
    position?: {
      vertical?: verticalAlign;
      horizontal?: horizontalAlign;
    }
  ) => {
    setMessage(message);
    setError(error);
    setOpenSnackbar(true);
    if (position) {
      setPosition(position);
    }
  };

  return (
    <AppContext.Provider value={{ handleMessage }}>
      {children}
      <AlertMessage
        open={openSnackbar}
        onClose={handleCloseSnackbar}
        severity={error}
        variant="filled"
        vertical={position.vertical ?? "bottom"}
        horizontal={position.horizontal ?? "right"}
      >
        {message}
      </AlertMessage>
    </AppContext.Provider>
  );
};

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp should be used within a AppProvider.");
  }
  return context;
}
