import { Alert, AlertColor, Snackbar } from "@mui/material";

export type verticalAlign = "top" | "bottom";
export type horizontalAlign = "left" | "center" | "right";

interface AlertMessageProps {
  children: string;
  open: boolean;
  onClose: () => void;
  severity?: AlertColor;
  variant?: "filled" | "standard" | "outlined";
  vertical: "top" | "bottom";
  horizontal: "left" | "center" | "right";
}

export const AlertMessage = ({
  open,
  onClose,
  severity,
  variant,
  vertical = "bottom",
  horizontal = "right",
  children,
}: AlertMessageProps) => {
  return (
    <Snackbar
      open={open}
      autoHideDuration={4000}
      onClose={onClose}
      anchorOrigin={{
        vertical: vertical,
        horizontal: horizontal,
      }}
    >
      <Alert
        onClose={onClose}
        severity={severity}
        sx={{ width: "100%" }}
        variant={variant}
      >
        {children}
      </Alert>
    </Snackbar>
  );
};
