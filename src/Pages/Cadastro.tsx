import { Box } from "@mui/material";
import CadastroForm from "../components/Form/FormCadastro";
import logoIgreja from "../assets/img/Form/projeto_aprendiz_polo_urucania[1].svg";

export default function Cadastro() {
  return (
    <div id="background" style={{ display: "flex", alignItems: "center", 
                                justifyContent: "center", 
                                minHeight: "100vh", 
                                background: "linear-gradient(26deg, #ffffff,#ffffff,#fff4f5,#fccacf)", 
                                width:"100vw", flexDirection:"column"}}>
        <CadastroForm />
        <div style={{marginTop:"95px"}}>
        <Box
              component="img"
              src={logoIgreja}
              alt="ICM Logo"
              loading="lazy"
              sx={{
                width: { xs: "10em", sm: "10em", md: "10em" },
              }}
          />
        </div>

        

    </div>
  );
}
