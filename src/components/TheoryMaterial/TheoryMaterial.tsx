import { Box, Typography } from "@mui/material";
import LaunchIcon from "@mui/icons-material/Launch";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { useApp } from "../../context/AppContext";
import { useMaterialActions } from "../../hooks/useMaterialActions";
import { useAuth } from "../../hooks/useAuth";

export interface TheoryMaterialProps {
  id: string;
  index: number;
  name: string;
  fileType: string;
  lessonId: string;
  fileUrl: string;
  classId: string;
  materialId: string;
}

export function TheoryMaterialItem({
  name,
  index,
  fileUrl,
  materialId,
  lessonId,
}: TheoryMaterialProps) {
  const { user } = useAuth();
  const { removeMaterial } = useMaterialActions();
  const { handleMessage } = useApp();

  const handleOpenFile = () => {
    window.open(fileUrl, "_blank", "noopener,noreferrer");
  };

  const handleDeleteFile = () => {
    removeMaterial(lessonId, materialId);
    handleMessage("Material excluído com sucesso!", "success", {
      vertical: "bottom",
      horizontal: "left",
    });
  };

  return (
    <Box>
      <Box
        sx={{
          borderTop: index === 0 ? "1px solid rgba(30, 30, 30, 0.3)" : "none",         
          borderBottom: "1px solid rgba(30, 30, 30, 0.3)" ,
          display: "flex",
          padding: 1,
          alignItems: "center",
          justifyContent: "space-between",
          cursor: "pointer",
        }}
      >
        <Typography
          sx={{
            maxWidth: { xs: "260px", md: "100%" },
            overflow: "hidden",
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
            cursor: "pointer",
            "&:hover": { transform: "scale(1.02)" },
          }}
          onClick={handleOpenFile}
        >
          {name}
        </Typography>

        <Box display={"flex"} gap={1}>
          {user?.role === "admin" && (
            <DeleteForeverIcon
              onClick={handleDeleteFile}
              sx={{
                cursor: "pointer",
                "&:hover": { transform: "scale(1.04)" },
                width: "1em",
              }}
            />
          )}
          <LaunchIcon
            onClick={handleOpenFile}
            sx={{
              cursor: "pointer",
              "&:hover": { transform: "scale(1.04)" },
              width: "0.8em",
            }}
          />
        </Box>
      </Box>
    </Box>
  );
}
