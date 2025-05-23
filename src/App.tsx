import { ThemeProvider } from "@mui/material/styles";
import { theme } from "./Theme/theme";
import { AuthProvider } from "./context/AuthContext";
import { Router } from "./Router/Router";
import "./App.css";
import { AppProvider } from "./context/AppContext";
import { ClassProvider } from "./context/ClassContext";

export function App() {
  return (
    <ThemeProvider theme={theme}>
      <AppProvider>
        <AuthProvider>
          <ClassProvider>
          <Router />
          </ClassProvider>
        </AuthProvider>
      </AppProvider>
    </ThemeProvider>
  );
}
