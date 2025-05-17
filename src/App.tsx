import { ThemeProvider } from '@mui/material/styles';
import { theme } from './Theme/theme';
import { AuthProvider } from './context/AuthContext';
import { Router } from './Router/Router';
import './App.css';
import { LoginForm } from './components/LoginForm';

export function App() {
  return (
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <LoginForm />
        {/* <Router /> */}
      </AuthProvider>
    </ThemeProvider>
  );
}
