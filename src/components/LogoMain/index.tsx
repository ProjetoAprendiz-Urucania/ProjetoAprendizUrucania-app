import { Box } from '@mui/material';
import logoMain from '../../assets/img/Form/projeto_aprendiz_polo_urucania.svg';

export const LogoMain = ({ width }: { width: string }) => {
    return (
        <Box
            width={width}
            component="img"
            src={logoMain}
            alt="Descrição da imagem"
            sx={{
                borderRadius: 2,
                objectFit: 'cover',
            }}
        />
    );
};