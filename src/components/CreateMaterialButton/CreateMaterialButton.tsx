import { Box, Dialog } from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { useState } from "react";
import { UploadFile } from "../UploadFile/UploadFile";
import { ILesson } from "../../interfaces/lesson/ILesson";

export function CreateMaterialButton({ lessons }: { lessons: ILesson[] }) {
  const [openProfileModal, setOpenProfileModal] = useState(false);

  return (
    <>
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
          <AddCircleOutlineIcon
            sx={{ mt: 2, ":hover": { color: "#BB1626" } }}
            onClick={() => setOpenProfileModal(true)}
          />
        </Box>
      </Box>
      <Dialog
        open={openProfileModal}
        onClose={() => setOpenProfileModal(false)}
      >
        <UploadFile lessons={lessons} />
      </Dialog>
    </>
  );
}
