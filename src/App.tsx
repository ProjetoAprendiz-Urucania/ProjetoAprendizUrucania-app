import { ThemeProvider } from '@mui/material/styles';
import { theme } from './Theme/theme';
import { AuthProvider } from './context/AuthContext';
import { Router } from './Router/Router';
import './styles/global.css';

export function App() {
  return (
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <Router />
      </AuthProvider>
    </ThemeProvider>
  );
}
