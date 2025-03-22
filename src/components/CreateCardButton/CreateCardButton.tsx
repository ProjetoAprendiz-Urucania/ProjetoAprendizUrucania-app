import { Card, Dialog } from "@mui/material";
import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { CreateCard } from "../CreateCard/CreateCard";

export function CreateCardButton() {
  const { user } = useAuth();

  const [openProfileModal, setOpenProfileModal] = useState(false);

  return (
    <>
      {user?.role === "admin" && (
        <>
          <Card
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginY: 2.8,
              padding: { xs: 1.8, md: 2.6 },
              borderRadius: 2,
              boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.51)",
              transition:
                "box-shadow 0.2s ease-in-out, transform 0.2s ease-in-out",
              "&:hover": {
                transform: "scale(1.01)",
                boxShadow: "0px 6px 15px rgba(0, 0, 0, 0.51)",
              },
              cursor: "pointer",
            }}
            onClick={() => setOpenProfileModal(true)}
          >
            <AddCircleIcon
              sx={{
                color: "#C94551",
                fontSize: "2.4em",
                "&:hover": {
                  transform: "scale(1.1)",
                },
              }}
            />
          </Card>
          <Dialog
            open={openProfileModal}
            onClose={() => setOpenProfileModal(false)}
          >
            <CreateCard />
          </Dialog>
        </>
      )}
    </>
  );
}
