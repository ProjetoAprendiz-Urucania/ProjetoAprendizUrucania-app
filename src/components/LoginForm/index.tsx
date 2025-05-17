import { Box, Button, Divider, Link, Stack, TextField } from '@mui/material';
import styles from './LoginForm.module.css';

export const LoginForm = () => {
  function handleSubmitForm(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
  }

  return (
    <Box component={'form'} className={styles.formContainer} onSubmit={handleSubmitForm}>
      <Stack>
        <TextField />
        <TextField />
        <TextField></TextField>
        <Button type="submit"></Button>
        <Link>Esqueci minha senha</Link>
        <Divider orientation="horizontal" flexItem></Divider>
        <Link>Registre-se</Link>
      </Stack>
    </Box>
  );
};
