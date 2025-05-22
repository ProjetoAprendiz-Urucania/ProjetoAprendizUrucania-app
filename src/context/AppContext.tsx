import { AlertColor } from "@mui/material";
import { createContext, ReactNode, useState } from "react";
import {
  AlertMessage,
  horizontalAlign,
  verticalAlign,
} from "../components/AlertMessage/AlertMessage";

interface IAppContextProps {
  handleMessage: (
    message: string,
    status: AlertColor,
    position?: {
      vertical?: verticalAlign;
      horizontal?: horizontalAlign;
    },
  ) => void;
  handleCloseSnackbar: (
    _event?: React.SyntheticEvent | Event,
    reason?: string,
  ) => void;
}

export const AppContext = createContext<IAppContextProps | undefined>(
  undefined,
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
    reason?: string,
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
    },
  ) => {
    setMessage(message);
    setError(error);
    setOpenSnackbar(true);
    if (position) {
      setPosition(position);
    }
  };

  return (
    <AppContext.Provider value={{ handleMessage, handleCloseSnackbar }}>
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
