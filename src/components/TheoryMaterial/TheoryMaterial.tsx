import { Box, Typography } from "@mui/material";

interface ITheoryMaterialProps {
  name: string;
}

export function TheoryMaterial({ name }: ITheoryMaterialProps) {
  return (
    <Box>
      <Box>
        <Typography>{name}</Typography>
      </Box>
    </Box>
  );
}
