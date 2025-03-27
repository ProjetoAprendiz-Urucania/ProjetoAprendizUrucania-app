import { Box, Typography } from "@mui/material";
import LaunchIcon from "@mui/icons-material/Launch";

interface TheoryMaterialProps {
  name: string;
  fileUrl: string;
}

export function TheoryMaterialItem({ name, fileUrl }: TheoryMaterialProps) {
  const handleOpenFile = () => {
    window.open(fileUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <Box>
      <Box
        sx={{
          borderTop: "1px solid rgba(30, 30, 30, 0.3)",
          my: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          cursor: "pointer",
        }}
        onClick={handleOpenFile}
      >
        <Typography
          sx={{
            mt: 0.8,
            "&:hover": { transform: "scale(1.02)" },
          }}
        >
          {name}
        </Typography>
        <LaunchIcon
          sx={{
            cursor: "pointer",
            "&:hover": { transform: "scale(1.04)" },
            width: "0.8em",
          }}
        />
      </Box>
    </Box>
  );
}
