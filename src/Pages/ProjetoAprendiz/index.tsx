import { Box, Grid } from "@mui/material";
import { LogoMain } from "../../components/LogoMain";
import styles from "./ProjetoAprendiz.module.css";
import { CustomButton } from "../../components/Button";
import { DoubleArrow } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

export const ProjetoAprendiz = () => {
  const navigate = useNavigate();

  const handleNavigateLogin = () => {
    navigate("/login");
  };

  return (
    <Box className={styles.page}>
      <Grid container spacing={0} height={'100vh'} justifyContent={'center'}>
        <Grid
          item
          xs={12}
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
        >
        <Box className={styles.logoMain}>
          <LogoMain width="500px" />
        </Box>
        <Box
          display={"flex"}
          flexDirection="row"
          justifyContent="center"
          gap={2}
          alignItems="center"
        >
          <CustomButton label='Vamos começar' endIcon={<DoubleArrow />} onClick={handleNavigateLogin}/>
        </Box>
        </Grid>
      </Grid>
    </Box>
  );
};
