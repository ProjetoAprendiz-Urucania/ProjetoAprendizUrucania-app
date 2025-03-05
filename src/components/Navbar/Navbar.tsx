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
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import imLogo from "../../assets/img/Navbar/im_logo.svg";
import avatar from "../../assets/img/Navbar/avatar.png";
import menuIcon from "../../assets/img/Navbar/menu.png";

const menuNavigation = ["Turmas", "Sair"];
const avatarMenuOptions = ["Alterar foto de perfil"];

interface NavbarProps {
  token: string | null;
  logout: () => void;
}

function Navbar({ token, logout }: NavbarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [anchorElMenu, setAnchorElMenu] = useState<null | HTMLElement>(null);
  const [anchorElAvatar, setAnchorElAvatar] = useState<null | HTMLElement>(
    null
  );

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
    if (page === "Alterar foto de perfil") navigate("/perfil");
    if (page === "Sair") {
      logout();
      navigate("/login");
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
                <IconButton onClick={handleMenuToggle(setAnchorElAvatar)}>
                  <Box component="img" src={avatar} sx={{ width: "1.36em" }} />
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
    </AppBar>
  );
}

export default Navbar;
