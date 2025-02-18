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
import menu from "../../assets/img/Navbar/menu.png";

const pages = ["Turmas", "Aulas", "Materiais Teóricos"];
const settings = ["Perfil", "Sair"];

function Navbar() {
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(
    null
  );
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null
  );

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <AppBar
      position="static"
      sx={{
        backgroundColor: "#BB1626",
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24,
      }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Tooltip title="Open settings">
            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
              <Box
                component="img"
                src={avatar}
                sx={{ width: { xs: "1.2em", sm: "1.4em" } }}
              />
            </IconButton>
          </Tooltip>
          <Box
            component="img"
            src={imLogo}
            alt="ICM Logo"
            loading="lazy"
            sx={{
              marginLeft: { xs: "6px", md: "14px" },
              width: { xs: "4em", sm: "4.6em", md: "5.2em" },
              height: { xs: "2.77em", sm: "3.18em", md: "3.6em" },
            }}
          />
        </Box>
        <IconButton onClick={handleOpenNavMenu} color="inherit" sx={{ p: 0 }}>
          <Box component="img" src={menu} sx={{ width: "1em" }} />
        </IconButton>

        <Menu
          id="menu-nav"
          anchorEl={anchorElNav}
          anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
          transformOrigin={{ vertical: "top", horizontal: "left" }}
          open={Boolean(anchorElNav)}
          onClose={handleCloseNavMenu}
        >
          {pages.map((page) => (
            <MenuItem key={page} onClick={handleCloseNavMenu}>
              <Typography sx={{ textAlign: "center" }}>{page}</Typography>
            </MenuItem>
          ))}
        </Menu>

        <Menu
          id="menu-user"
          anchorEl={anchorElUser}
          anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
          transformOrigin={{ vertical: "top", horizontal: "left" }}
          open={Boolean(anchorElUser)}
          onClose={handleCloseUserMenu}
        >
          {settings.map((setting) => (
            <MenuItem key={setting} onClick={handleCloseUserMenu}>
              <Typography sx={{ textAlign: "center" }}>{setting}</Typography>
            </MenuItem>
          ))}
        </Menu>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
