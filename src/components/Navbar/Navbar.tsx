import React, { useEffect, useState } from "react";
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
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { useNavigate } from "react-router-dom";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import imLogo from "../../assets/img/Navbar/im_logo.svg";
import avatar from "../../assets/img/Navbar/avatar.png";
import menuIcon from "../../assets/img/Navbar/menu.png";
import {
  uploadProfilePhoto,
  deleteProfilePhoto,
} from "../../services/user.service";
import { useClass } from "../../hooks/useClass";
import { useMatch } from "react-router-dom";

const menuNavigation = ["Perfil", "Turmas", "Sair"];
const avatarMenuOptions = ["Alterar Foto"];

interface NavbarProps {
  token: string | null;
  logout: () => void;
}

export function Navbar({ token, logout }: NavbarProps) {
  const { setSelectedClass } = useClass();
  const user = localStorage.getItem("user");

  let parsedUser = null;

  if (user) {
    parsedUser = JSON.parse(user);
  }

  const navigate = useNavigate();
  const [anchorElMenu, setAnchorElMenu] = useState<null | HTMLElement>(null);
  const [anchorElAvatar, setAnchorElAvatar] = useState<null | HTMLElement>(
    null
  );
  const [openProfileModal, setOpenProfileModal] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<File | null>();
  const [profilePhoto, setProfilePhoto] = useState<string | null>();
  const [imageError, setImageError] = useState(false);
  const [loading, setLoading] = useState(false);

  const isClassesPage = useMatch("/classes");
  const isClassPage = useMatch("/classes/:classId/lessons");
  const isLessonPage = useMatch("/classes/:classId/lessons/:lessonId");
  const isProfilePage = useMatch("/classes/profile/:id");

  const matchClassPage = useMatch("/classes/:classId/lessons");
  const matchLessonPage = useMatch("/classes/:classId/lessons/:lessonId");

  useEffect(() => {
    if (!token) {
      logout();
      navigate("/login");
    }
  }, [token, logout, navigate]);

  useEffect(() => {
    if (!openProfileModal) {
      setSelectedPhoto(null);
    }
  }, [openProfileModal]);

  useEffect(() => {
    if (parsedUser && parsedUser.profilePicture) {
      setProfilePhoto(parsedUser.profilePicture);
    } else {
      setProfilePhoto(null);
    }
  }, [parsedUser, loading]);

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
    if (page === "Perfil") navigate(`/classes/profile/${parsedUser?.id}`);
    if (page === "Turmas") navigate("/classes");
    if (page === "Alterar Foto") setOpenProfileModal(true);
    if (page === "Sair") {
      logout();
      navigate("/login");
    }
  };

  const handleNavigate = () => {
    if (isProfilePage) {
      navigate("/classes");
      return;
    }
    if (matchClassPage) {
      navigate("/classes");
      setSelectedClass(null);
    } else if (matchLessonPage) {
      const classId = matchLessonPage.params.classId;
      navigate(`/classes/${classId}/lessons`);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];

      if (!file.type.startsWith("image/")) {
        alert("Por favor, selecione um arquivo de imagem válido.");
        return;
      }

      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = (e) => {
        const img = new Image();
        img.src = e.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");

          if (!ctx) return;

          const MAX_WIDTH = 800;
          const MAX_HEIGHT = 800;
          let { width, height } = img;

          if (width > MAX_WIDTH || height > MAX_HEIGHT) {
            const ratio = Math.min(MAX_WIDTH / width, MAX_HEIGHT / height);
            width *= ratio;
            height *= ratio;
          }

          canvas.width = width;
          canvas.height = height;
          ctx.drawImage(img, 0, 0, width, height);

          canvas.toBlob(
            (blob) => {
              if (blob) {
                const jpegFile = new File(
                  [blob],
                  file.name.replace(/\.\w+$/, ".jpeg"),
                  {
                    type: blob.type || "image/jpeg",
                  }
                );

                setSelectedPhoto(jpegFile);
              }
            },
            "image/jpeg",
            0.9
          );
        };
      };
    }
  };

  const handleSave = async () => {
    try {
      if (parsedUser?.id && selectedPhoto) {
        const res = await uploadProfilePhoto(parsedUser?.id, selectedPhoto);
        setProfilePhoto(res.updatedStudent?.profilePicture);

        if (parsedUser) {
          parsedUser.profilePicture = res.updatedStudent?.profilePicture;
          localStorage.setItem("user", JSON.stringify(parsedUser));
        }
      }

      setOpenProfileModal(false);
      setLoading(true);
    } catch (error) {
      console.error(error);
    } finally {
      setAnchorElMenu(null);
      setAnchorElAvatar(null);
    }
  };

  const handleDeletePhoto = async () => {
    if (!parsedUser?.id) return;

    try {
      const res = await deleteProfilePhoto(parsedUser.id);

      if (res?.studentData) {
        setProfilePhoto(res.studentData.profilePicture ?? null);
        if (parsedUser) {
          parsedUser.profilePicture = res.studentData.profilePicture ?? null;
          localStorage.setItem("user", JSON.stringify(parsedUser));
        }
        setLoading(true);
        setOpenProfileModal(false);
      }
    } catch (error) {
      console.error("Erro ao deletar foto de perfil:", error);
      alert("Ocorreu um erro ao excluir a foto. Tente novamente.");
    } finally {
      setAnchorElMenu(null);
      setAnchorElAvatar(null);
    }
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
                <IconButton
                  onClick={handleMenuToggle(setAnchorElAvatar)}
                  sx={{
                    borderRadius: "50%",
                    border: "2px solid #FFFFFF",
                    width: "40px",
                    height: "40px",
                    padding: 0,
                  }}
                >
                  <Box
                    component="img"
                    src={imageError ? avatar : profilePhoto || avatar}
                    onError={(e) => {
                      setImageError(true);
                      e.currentTarget.src = avatar;
                    }}
                    sx={{
                      width: "38px",
                      height: "38px",
                      objectFit: "cover",
                      borderRadius: "50%",
                      padding: imageError || !profilePhoto ? 0.8 : 0,
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
                onClick={handleNavigate}
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
                {isProfilePage
                  ? "Turmas"
                  : isClassPage
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
        <DialogTitle sx={{ fontWeight: 600 }}>
          Alterar Foto de Perfil
        </DialogTitle>
        <DialogContent
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            gap: 2.4,
          }}
        >
          <Box sx={{ position: "relative", display: "inline-block" }}>
            <label
              htmlFor="file-upload"
              style={{ display: "block", cursor: "pointer" }}
            >
              <Box
                component="img"
                src={
                  selectedPhoto
                    ? URL.createObjectURL(selectedPhoto)
                    : profilePhoto || avatar
                }
                onError={(e) => {
                  setImageError(true);
                  e.currentTarget.src = avatar;
                }}
                sx={{
                  width: "124px",
                  height: "124px",
                  objectFit: "cover",
                  borderRadius: "50%",
                  border: "2px solid #ccc",
                }}
              />

              <Box
                sx={{
                  position: "absolute",
                  bottom: -4,
                  left: "50%",
                  transform: "translateX(-50%)",
                  backgroundColor: "#BB1626",
                  borderRadius: "50%",
                  padding: "6px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <AddAPhotoIcon sx={{ color: "white", fontSize: "20px" }} />
              </Box>
            </label>

            {profilePhoto && (
              <Box
                onClick={handleDeletePhoto}
                sx={{
                  position: "absolute",
                  top: 12,
                  right: 0,
                  transform: "translate(25%, -25%)",
                  backgroundColor: "#BB1626",
                  borderRadius: "50%",
                  paddingX: "5px",
                  paddingY: "4px",
                  cursor: "pointer",
                }}
              >
                <DeleteForeverIcon sx={{ color: "white", fontSize: "20px" }} />
              </Box>
            )}

            <input
              id="file-upload"
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={handleFileChange}
            />
          </Box>

          <DialogActions sx={{ width: "100%" }}>
            <Button
              sx={{
                backgroundColor: "#BB1626",
                color: "white",
                fontWeight: 600,
                width: "100%",
                ":hover": {
                  backgroundColor: "#A31421",
                },
              }}
              onClick={() => {
                if (selectedPhoto instanceof File) {
                  handleSave();
                } else {
                  setOpenProfileModal(false);
                  setAnchorElMenu(null);
                }
              }}
            >
              {selectedPhoto ? "Salvar" : "Fechar"}
            </Button>
          </DialogActions>
        </DialogContent>
      </Dialog>
    </AppBar>
  );
}
