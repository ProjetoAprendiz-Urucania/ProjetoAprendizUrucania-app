import { ThemeProvider } from "@mui/material/styles";
import theme from "./Theme/theme";
import "./App.css";
import { AuthProvider } from "./context/AuthContext/AuthProvider";
import { Router } from "./Router/Router";

export function App() {
  return (
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <Router />
      </AuthProvider>
    </ThemeProvider>
  );
}
