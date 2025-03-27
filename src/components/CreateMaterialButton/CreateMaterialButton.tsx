import { Box } from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";

export function CreateMaterialButton() {
  return (
    <Box>
      <Box
        sx={{
          borderTop: "1px solid rgba(30, 30, 30, 0.3)",
          my: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
        }}
      >
        <AddCircleOutlineIcon sx={{ mt: 2, ":hover": { color: "#BB1626" } }} />
      </Box>
    </Box>
  );
}
