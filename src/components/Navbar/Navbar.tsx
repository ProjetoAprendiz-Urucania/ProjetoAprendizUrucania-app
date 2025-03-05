import React, { useEffect, useState, useRef } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Tooltip,
  MenuItem,
  Menu,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";
import { useLocation, useNavigate } from "react-router-dom";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import imLogo from "../../assets/img/Navbar/im_logo.svg";
import avatar from "../../assets/img/Navbar/avatar.png";
import menuIcon from "../../assets/img/Navbar/menu.png";
import { useAuth } from "../../hooks/useAuth";
import { uploadProfilePhoto } from "../../services/student.service";

const menuNavigation = ["Turmas", "Sair"];
const avatarMenuOptions = ["Alterar Foto"];

interface NavbarProps {
  token: string | null;
  logout: () => void;
}

function Navbar({ token, logout }: NavbarProps) {
  const user = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [anchorElMenu, setAnchorElMenu] = useState<null | HTMLElement>(null);
  const [anchorElAvatar, setAnchorElAvatar] = useState<null | HTMLElement>(
    null
  );
  const [openProfileModal, setOpenProfileModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [selectedPhoto, setSelectedPhoto] = useState<File | null>();
  const [profilePhoto, setProfilePhoto] = useState<string | null>();

  const isClassesPage = location.pathname === "/classes";
  const isClassPage = /^\/classes\/[a-f0-9]{24}$/.test(location.pathname);
  const isLessonPage = /^\/classes\/[a-f0-9]{24}\/([a-f0-9]{24})?$/.test(
    location.pathname
  );

  useEffect(() => {
    if (!token) {
      logout();
      navigate("/login");
    }
  }, [token, logout, navigate]);

  useEffect(() => {
    if (!openProfileModal) {
      setProfilePhoto(user.user?.profilePicture);
    }
  }, [openProfileModal, user.user?.profilePicture]);

  useEffect(() => {
    if (!openProfileModal) {
      setSelectedPhoto(null);
    }
  }, [openProfileModal]);

  const handleMenuToggle =
    (setter: React.Dispatch<React.SetStateAction<null | HTMLElement>>) =>
    (event: React.MouseEvent<HTMLElement>) =>
      setter(event.currentTarget);

  const handleMenuClose =
    (setter: React.Dispatch<React.SetStateAction<null | HTMLElement>>) => () =>
      setter(null);

  const handleMenuItemClick = (page: string) => {
    setAnchorElMenu(null);
    if (!token) {
      logout();
      navigate("/login");
      return;
    }
    if (page === "Turmas") navigate("/classes");
    if (page === "Alterar Foto") setOpenProfileModal(true);
    if (page === "Sair") {
      logout();
      navigate("/login");
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];

      if (!file.type.startsWith("image/")) {
        alert("Por favor, selecione um arquivo de imagem válido.");
        return;
      }

      setSelectedPhoto(file);
    }
  };

  const handleSave = () => {
    if (user.user?.id && selectedPhoto)
      uploadProfilePhoto(user.user?.id, selectedPhoto);
    setOpenProfileModal(false);
  };

  return (
    <AppBar
      position="static"
      sx={{
        backgroundColor: "#BB1626",
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24,
        padding: 0.2,
      }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          {isClassesPage ? (
            <>
              <Tooltip title="Abrir menu do usuário">
                <IconButton onClick={handleMenuToggle(setAnchorElAvatar)}>
                  <Box
                    component="img"
                    src={
                      profilePhoto && profilePhoto.trim() !== ""
                        ? profilePhoto
                        : avatar
                    }
                    onError={(e) => {
                      e.currentTarget.src = avatar;
                      e.currentTarget.onerror = null;
                    }}
                    sx={{
                      width: "40px",
                      height: "40px",
                      objectFit: "cover",
                      border: !profilePhoto ? "2px solid white" : "none",
                      borderRadius: "50%",
                    }}
                  />
                </IconButton>
              </Tooltip>
              <Menu
                anchorEl={anchorElAvatar}
                open={Boolean(anchorElAvatar)}
                onClose={handleMenuClose(setAnchorElAvatar)}
              >
                {avatarMenuOptions.map((option) => (
                  <MenuItem
                    key={option}
                    onClick={() => handleMenuItemClick(option)}
                  >
                    <Typography>{option}</Typography>
                  </MenuItem>
                ))}
              </Menu>
              <Box
                component="img"
                src={imLogo}
                alt="ICM Logo"
                loading="lazy"
                sx={{ width: "5.6em", height: "3.6em" }}
              />
            </>
          ) : (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <IconButton
                sx={{
                  borderRadius: "90px",
                  padding: 0.4,
                  color: "#FFFFFF",
                  backgroundColor: "#E5E5E550",
                  "&:hover": { backgroundColor: "#C0515B" },
                }}
                onClick={() => navigate(-1)}
              >
                <ChevronLeftIcon />
              </IconButton>
              <Typography
                sx={{
                  fontWeight: "600",
                  fontSize: "16px",
                  letterSpacing: "1.4px",
                }}
              >
                {isClassPage
                  ? "Turmas"
                  : isLessonPage
                  ? "Aulas e Materiais"
                  : ""}
              </Typography>
            </Box>
          )}
        </Box>

        <Tooltip title="Abrir menu">
          <IconButton onClick={handleMenuToggle(setAnchorElMenu)}>
            <Box component="img" src={menuIcon} sx={{ width: "1em" }} />
          </IconButton>
        </Tooltip>

        <Menu
          anchorEl={anchorElMenu}
          open={Boolean(anchorElMenu)}
          onClose={handleMenuClose(setAnchorElMenu)}
        >
          {menuNavigation.map((item) => (
            <MenuItem key={item} onClick={() => handleMenuItemClick(item)}>
              <Typography sx={{ textAlign: "center" }}>{item}</Typography>
            </MenuItem>
          ))}
        </Menu>
      </Toolbar>

      <Dialog
        open={openProfileModal}
        onClose={() => setOpenProfileModal(false)}
        sx={{ backgroundClip: "whitesmoke" }}
      >
        <DialogTitle>Alterar Foto de Perfil</DialogTitle>
        <DialogContent
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            gap: 2.4,
          }}
        >
          {selectedPhoto ? (
            <Box sx={{ cursor: "pointer", m: 0, p: 0 }} onClick={handleClick}>
              <Box
                component="img"
                src={URL.createObjectURL(selectedPhoto)}
                sx={{
                  width: "110px",
                  height: "110px",
                  objectFit: "cover",
                  borderRadius: "50%",
                }}
              />
              <Box
                sx={{
                  position: "absolute",
                  top: "45%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  backgroundColor: "#BB162670",
                  borderRadius: "50%",
                  padding: "7px 8px",
                  opacity: "90%",
                }}
              >
                <AddAPhotoIcon sx={{ color: "whitesmoke", fontSize: "18px" }} />
              </Box>
            </Box>
          ) : (
            <Box
              sx={{
                backgroundColor: "#EAEAEA",
                padding: "2.6em",
                cursor: "pointer",
                borderRadius: "50%",
              }}
              onClick={handleClick}
            >
              {" "}
              <AddAPhotoIcon />
            </Box>
          )}
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={handleFileChange}
          />
          <DialogActions sx={{ width: "100%" }}>
            <Button
              sx={{
                backgroundColor: "#BB1626",
                color: "white",
                fontWeight: 600,
                width: "100%",
              }}
              onClick={() => {
                if (selectedPhoto) {
                  if (selectedPhoto.type.startsWith("image/")) {
                    handleSave();
                  } else {
                    alert("O arquivo selecionado não é uma imagem válida.");
                  }
                } else {
                  setOpenProfileModal(false);
                }
              }}
            >
              {selectedPhoto && selectedPhoto.type.startsWith("image/")
                ? "Salvar"
                : "Fechar"}
            </Button>
          </DialogActions>
        </DialogContent>
      </Dialog>
    </AppBar>
  );
}

export default Navbar;
