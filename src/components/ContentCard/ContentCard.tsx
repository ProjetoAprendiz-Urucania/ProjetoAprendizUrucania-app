import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Dialog,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import defaultCardImage from "../../assets/img/defaultCardImage.svg";
import { ICardData } from "../../interfaces/ICardData";
import { useAuth } from "../../hooks/useAuth";
import options from "../../assets/img/ContentCard/options.png";
import { deleteClass } from "../../services/class.service";

const adminMenu = ["Editar", "Excluir"];

export function ContentCard({ id, name, teacherInfo, coverImage }: ICardData) {
  const { user } = useAuth();
  const [imageSrc, setImageSrc] = useState<string>(defaultCardImage);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [openProfileModal, setOpenProfileModal] = useState(false);
  const token = localStorage.getItem("token");

  const navigate = useNavigate();

  useEffect(() => {
    if (coverImage) {
      const img = new Image();
      img.src = coverImage;
      img.onload = () => setImageSrc(coverImage);
      img.onerror = () => setImageSrc(defaultCardImage);
    }
  }, [coverImage]);

  const handleOpenLessons = () => {
    navigate(`${location.pathname}/${id}`);
  };

  const handleOpenMenu = (e: React.MouseEvent<HTMLImageElement>) => {
    e.stopPropagation();
    setAnchorEl(e.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleMenuClick = (option: string) => {
    if (option === "Editar") {
      setOpenProfileModal(true);
    } else if (option === "Excluir") {
      if (token) deleteClass(id, token);
    }
    handleCloseMenu();
  };

  return (
    <>
      <Card
        sx={{
          display: "flex",
          marginY: 2.8,
          borderRadius: 2,
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.51)",
          transition: "box-shadow 0.2s ease-in-out, transform 0.2s ease-in-out",
          "&:hover": {
            transform: "scale(1.001)",
            boxShadow: "0px 6px 15px rgba(0, 0, 0, 0.51)",
          },
          cursor: "pointer",
        }}
        onClick={handleOpenLessons}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minWidth: "116px",
            overflow: "hidden",
          }}
        >
          <CardMedia
            component="img"
            sx={{
              width: "76px",
              height: "58px",
              aspectRatio: "4 / 3",
              objectFit: "cover",
              borderRadius: 1,
              border: "1px outset whitesmoke",
              filter: "drop-shadow(0px 0.6px 0.6px rgba(0, 0, 0, 0.7))",
            }}
            image={imageSrc}
            alt="Capa do curso"
          />
        </Box>

        <Box
          sx={{
            marginLeft: -1.8,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <CardContent
            sx={{
              textAlign: "left",
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              <Typography
                sx={{
                  fontSize: { xs: "15px", sm: "16px", md: "18px", lg: "20px" },
                  fontWeight: 600,
                  maxWidth: {
                    xs: "180px",
                    sm: "190px",
                    md: "200px",
                    lg: "100%",
                  },
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {name}
              </Typography>
              <Typography
                variant="subtitle2"
                sx={{
                  color: "text.secondary",
                  fontSize: { xs: "12px", md: "14px", lg: "16px" },
                  maxWidth: {
                    xs: "140px",
                    sm: "380px",
                    md: "500px",
                    lg: "540px",
                  },
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {teacherInfo}
              </Typography>
            </Box>
          </CardContent>

          {user?.role === "admin" && (
            <Box sx={{ display: "flex", alignItems: "center", ml: "auto" }}>
              <Box
                component="img"
                src={options}
                onClick={handleOpenMenu}
                alt="Opções"
                sx={{
                  width: "24px",
                  mr: 2,
                  ":hover": { transform: "scale(1.2)" },
                  cursor: "pointer",
                }}
              />
            </Box>
          )}
        </Box>
      </Card>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
      >
        {adminMenu.map((option) => (
          <MenuItem key={option} onClick={() => handleMenuClick(option)}>
            {option}
          </MenuItem>
        ))}
      </Menu>

      <Dialog
        open={openProfileModal}
        onClose={() => setOpenProfileModal(false)}
      ></Dialog>
    </>
  );
}
