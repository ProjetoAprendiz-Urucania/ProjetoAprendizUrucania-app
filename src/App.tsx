import { ThemeProvider } from "@mui/material/styles";
import { theme } from "./Theme/theme";
import { AuthProvider } from "./context/AuthContext";
import { Router } from "./Router/Router";
import "./global.css";
import { AppProvider } from "./context/AppContext";

export function App() {
  return (
    <ThemeProvider theme={theme}>
      <AppProvider>
        <AuthProvider>
          <Router />
        </AuthProvider>
      </AppProvider>
    </ThemeProvider>
  );
}
