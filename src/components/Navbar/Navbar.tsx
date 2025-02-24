import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import imLogo from "../../assets/img/Navbar/im_logo.svg";
import avatar from "../../assets/img/Navbar/avatar.png";
import { Box } from "@mui/material";
import menuIcon from "../../assets/img/Navbar/menu.png";
import { useLocation, useNavigate } from "react-router-dom";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import { useUser } from "../../hooks/useUser";

const menuNavigation = ["Turmas", "Aulas"];
const avatarMenuOptions = ["Perfil", "Sair"];

function Navbar() {
  const { user, logout } = useUser();
  const location = useLocation();
  const navigate = useNavigate();

  const isClassPage = /^\/classes\/[a-f0-9]{24}$/.test(location.pathname);
  const isLessonPage = /^\/classes\/[a-f0-9]{24}\/[a-f0-9]{24}$/.test(
    location.pathname
  );
  const isClassesPage = location.pathname === "/classes";

  const [anchorElMenu, setAnchorElMenu] = React.useState<null | HTMLElement>(
    null
  );
  const [anchorElAvatar, setAnchorElAvatar] =
    React.useState<null | HTMLElement>(null);

  const handleOpenAvatar = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElAvatar(event.currentTarget);
  };

  const handleCloseAvatar = () => {
    setAnchorElAvatar(null);
  };

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElMenu(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorElMenu(null);
  };

  const handleMenuItemClick = (page: string) => {
    handleCloseMenu();
    if (page === "Turmas") {
      navigate("/classes");
    } else if (page === "Perfil") {
      navigate("/perfil");
    } else if (page === "Sair") {
      logout();
      navigate("/login");
      localStorage.removeItem("token")
    }
  };

  console.log("Dados do Usuário:", user);

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
              <Box>
                <Tooltip title="Abrir menu do usuário">
                  <IconButton onClick={handleOpenAvatar}>
                    <Box
                      component="img"
                      src={avatar}
                      sx={{
                        width: "1.36em",
                      }}
                    />
                  </IconButton>
                </Tooltip>
                <Menu
                  id="menu-avatar"
                  anchorEl={anchorElAvatar}
                  open={Boolean(anchorElAvatar)}
                  onClose={handleCloseAvatar}
                  anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
                  transformOrigin={{ vertical: "top", horizontal: "left" }}
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
              </Box>

              <Box
                component="img"
                src={imLogo}
                alt="ICM Logo"
                loading="lazy"
                sx={{
                  width: { xs: "4.6em", sm: "5.2em", md: "5.6em" },
                  height: { xs: "2.97em", sm: "3.18em", md: "3.6em" },
                }}
              />
            </>
          ) : (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Box
                sx={{
                  borderRadius: "90px",
                  padding: 0.4,
                  backgroundColor: "#E5E5E550",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  "&:hover": {
                    backgroundColor: "#C0515B",
                    transform: "scale(1.06)",
                  },
                }}
              >
                <ChevronLeftIcon
                  sx={{
                    cursor: "pointer",
                    "&:hover": { transform: "scale(1.06)" },
                  }}
                  onClick={() => navigate(-1)}
                />
              </Box>

              {isClassPage && (
                <Typography
                  sx={{
                    fontWeight: "600",
                    fontSize: "16px",
                    letterSpacing: "1.4px",
                  }}
                >
                  Turmas
                </Typography>
              )}

              {isLessonPage && (
                <Typography
                  sx={{
                    fontWeight: "600",
                    fontSize: "16px",
                    letterSpacing: "1.4px",
                  }}
                >
                  Aulas e Materiais
                </Typography>
              )}
            </Box>
          )}
        </Box>

        <Box>
          <Tooltip title="Abrir menu">
            <IconButton onClick={handleOpenMenu} sx={{ p: 0 }}>
              <Box
                component="img"
                src={menuIcon}
                sx={{ width: { xs: "0.8em", sm: "1em" } }}
              />
            </IconButton>
          </Tooltip>
        </Box>

        <Menu
          id="menu-navigation"
          anchorEl={anchorElMenu}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "right" }}
          open={Boolean(anchorElMenu)}
          onClose={handleCloseMenu}
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
