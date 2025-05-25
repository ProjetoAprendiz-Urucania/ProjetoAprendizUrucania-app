import {
  Box,
  Dialog,
  Typography,
  Card,
  CardContent,
  IconButton,
  Tooltip,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
} from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import VisibilityIcon from "@mui/icons-material/Visibility";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import DeleteIcon from "@mui/icons-material/Delete";
import { useState } from "react";
import { UploadFile } from "../UploadFile/UploadFile";
import { ILesson } from "../../interfaces/lesson/ILesson";

interface MaterialItem {
  name: string;
  url: string;
}

export function CreateMaterialButton({
  lessons,
  materials = [],
}: {
  lessons: ILesson[];
  materials?: MaterialItem[];
}) {
  const [openProfileModal, setOpenProfileModal] = useState(false);

  return (
    <>
      {materials.length > 0 && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="h6" fontWeight={600} gutterBottom>
            Materiais Teóricos
          </Typography>
          <List>
            {materials.map((file, index) => (
              <ListItem
                key={index}
                sx={{
                  border: "1px solid #eee",
                  borderRadius: 1,
                  mb: 1,
                  px: 2,
                  py: 1,
                  backgroundColor: "#fafafa",
                  ":hover": { backgroundColor: "#f0f0f0" },
                }}
              >
                <ListItemText
                  primary={file.name}
                  secondary={
                    <Typography variant="caption" color="text.secondary">
                      {file.url}
                    </Typography>
                  }
                />
                <ListItemSecondaryAction>
                  <Tooltip title="Visualizar">
                    <IconButton
                      href={file.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <VisibilityIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Download">
                    <IconButton href={file.url} download>
                      <FileDownloadIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Excluir">
                    <IconButton onClick={() => {}}>
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        </Box>
      )}

      <Card
        sx={{
          border: "1px dashed #ccc",
          borderRadius: 2,
          padding: 1.2,
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          transition: "all 0.3s",
          ":hover": {
            borderColor: "#BB1626",
            backgroundColor: "#f9f9f9",
          },
          cursor: "pointer",
          mt: 4,
        }}
        onClick={() => setOpenProfileModal(true)}
      >
        <Tooltip title="Adicionar novo material">
          <IconButton
            disableRipple
            disableFocusRipple
            sx={{ backgroundColor: "transparent !important" }}
          >
            <AddCircleIcon
              sx={{
                color: "#C94551",
                fontSize: "1.6em",
                "&:hover": {
                  transform: "scale(1.1)",
                },
              }}
            />
          </IconButton>
        </Tooltip>
        <CardContent>
          <Typography variant="subtitle1" fontWeight={600} sx={{ mt: -2 }}>
            Adicionar material
          </Typography>
        </CardContent>
      </Card>

      <Dialog
        open={openProfileModal}
        onClose={() => setOpenProfileModal(false)}
        fullWidth
        maxWidth="sm"
      >
        <UploadFile
          lessons={lessons}
          setOpenProfileModal={setOpenProfileModal}
        />
      </Dialog>
    </>
  );
}
