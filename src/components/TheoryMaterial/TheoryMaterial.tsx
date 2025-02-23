import { Box, Typography } from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";

interface ITheoryMaterialProps {
  name: string;
}

export function TheoryMaterial({ name }: ITheoryMaterialProps) {
  return (
    <Box>
      <Box
        sx={{
          borderTop: "1px solid rgba(30, 30, 30, 0.3)",
          marginY: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography sx={{ marginY: 0.6 }}>{name}</Typography>
        <DownloadIcon
          sx={{ cursor: "pointer", "&:hover": { transform: "scale(1.12)" } }}
        />
      </Box>
    </Box>
  );
}
