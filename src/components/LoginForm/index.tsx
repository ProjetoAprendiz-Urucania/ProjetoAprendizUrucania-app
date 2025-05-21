import {
  Box,
  Button,
  Divider,
  IconButton,
  InputAdornment,
  Link,
  Stack,
  TextField,
} from '@mui/material';
import styles from './LoginForm.module.css';
import { VisibilityOff, Visibility } from '@mui/icons-material';
import { useState } from 'react';

export const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);

  function handleSubmitForm(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
  }

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseUpPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  return (
    <Box
      component={'form'}
      className={styles.formContainer}
      onSubmit={handleSubmitForm}
    >
      <Stack>
        <Box className={styles.groupTextFields}>
          <TextField
            className="textFieldForms"
            id="email"
            label="Email"
            variant="outlined"
          />
          <TextField
            className="textFieldForms"
            id="password"
            label="Password"
            variant="outlined"
            slotProps={
              <InputAdornment position="end">
                <IconButton
                  aria-label={
                    showPassword ? 'hide the password' : 'display the password'
                  }
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                  onMouseUp={handleMouseUpPassword}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
          />
        </Box>
        <Button type="submit">Entrar</Button>
        <Link>Esqueci minha senha</Link>
        <Divider>ou</Divider>
        <Link>Registre-se</Link>
      </Stack>
    </Box>
  );
};
