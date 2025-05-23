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
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import defaultCardImage from "../../assets/img/defaultCardImage.svg";
import { ICardData } from "../../interfaces/ICardData";
import { useAuth } from "../../hooks/useAuth";
import optionsIcon from "../../assets/img/ContentCard/options.png";
import { CreateCard } from "../CreateCard/CreateCard";
import { useClass } from "../../hooks/useClass";
import { useApp } from "../../context/AppContext";
import { useClassActions } from "../../hooks/useClassActions";
import { useLessonActions } from "../../hooks/useLessonActions";

const adminMenu = ["Editar", "Excluir"];

export function ContentCard({
  id,
  index,
  name,
  teacherInfo,
  coverImage,
}: ICardData) {
  const { user } = useAuth();
  const { handleMessage } = useApp();
  const { handleSelectedClass, selectedClass } = useClass();
  const { removeLesson } = useLessonActions();
  const { removeClass } = useClassActions();

  const navigate = useNavigate();
  const location = useLocation();

  const isClassesPage = location.pathname === "/classes";
  const token = localStorage.getItem("token");

  const [imageSrc, setImageSrc] = useState<string>(defaultCardImage);

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const [openEditModal, setOpenEditModal] = useState(false);

  useEffect(() => {
    if (!coverImage) {
      setImageSrc(defaultCardImage);
      return;
    }

    const img = new Image();
    img.src = coverImage;
    img.onload = () => setImageSrc(coverImage);
    img.onerror = () => setImageSrc(defaultCardImage);
  }, [coverImage]);

  const handleOpenContent = useCallback(() => {
    if (isClassesPage) {
      handleSelectedClass(index);
      navigate(`/classes/${id}`);
    } else if (selectedClass) {
      navigate(`/classes/${selectedClass.id}/lessons/${id}`);
    }
  }, [isClassesPage, handleSelectedClass, index, id, navigate, selectedClass]);

  const handleOpenMenu = useCallback((e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    setAnchorEl(e.currentTarget);
  }, []);

  const handleCloseMenu = useCallback(() => {
    setAnchorEl(null);
  }, []);

  const handleMenuClick = useCallback(
    async (option: string) => {
      if (isClassesPage) {
        handleSelectedClass(index);
      }

      handleCloseMenu();

      if (option === "Editar") {
        setOpenEditModal(true);
      } else if (option === "Excluir" && token) {
        try {
          if (!isClassesPage) {
            removeLesson(id);
            handleMessage("Aula excluída com sucesso.", "success", {
              vertical: "bottom",
              horizontal: "left",
            });
          } else {
            removeClass(id);
            handleMessage("Turma excluída com sucesso.", "success", {
              vertical: "bottom",
              horizontal: "left",
            });
          }
        } catch (error) {
          console.error("Erro ao excluir:", error);
          handleMessage("Erro ao excluir item.", "error", {
            vertical: "bottom",
            horizontal: "left",
          });
        }
      }
    },
    [
      handleCloseMenu,
      handleSelectedClass,
      index,
      isClassesPage,
      token,
      removeLesson,
      removeClass,
      id,
      handleMessage,
    ]
  );

  return (
    <>
      <Card
        onClick={handleOpenContent}
        sx={{
          display: "flex",
          my: 2.8,
          borderRadius: 2,
          boxShadow: "0px 4px 10px rgba(0,0,0,0.51)",
          transition: "box-shadow 0.2s ease-in-out, transform 0.2s ease-in-out",
          cursor: "pointer",
          "&:hover": {
            transform: "scale(1.001)",
            boxShadow: "0px 6px 15px rgba(0,0,0,0.51)",
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minWidth: 116,
            overflow: "hidden",
          }}
        >
          <CardMedia
            component="img"
            image={imageSrc}
            alt="Capa do curso"
            sx={{
              width: 76,
              height: 58,
              aspectRatio: "4 / 3",
              objectFit: "cover",
              borderRadius: 1,
              border: "1px outset whitesmoke",
              filter: "drop-shadow(0 0.6px 0.6px rgba(0,0,0,0.7))",
            }}
          />
        </Box>

        <Box
          sx={{
            ml: -1.8,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexGrow: 1,
          }}
        >
          <CardContent
            sx={{
              display: "flex",
              justifyContent: "space-between",
              p: 1.5,
              pr: 0,
              width: "100%",
              textAlign: "left",
            }}
          >
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              <Typography
                sx={{
                  fontSize: { xs: 15, sm: 16, md: 18, lg: 20 },
                  fontWeight: 600,
                  maxWidth: { xs: 180, sm: 190, md: 200, lg: "100%" },
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
                  fontSize: { xs: 12, md: 14, lg: 16 },
                  maxWidth: { xs: 140, sm: 380, md: 500, lg: 540 },
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
            <Box
              sx={{ display: "flex", alignItems: "center", ml: "auto", pr: 2 }}
            >
              <Box
                component="img"
                src={optionsIcon}
                alt="Opções"
                onClick={handleOpenMenu}
                sx={{
                  width: 24,
                  cursor: "pointer",
                  transition: "transform 0.15s ease-in-out",
                  "&:hover": { transform: "scale(1.2)" },
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
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        {adminMenu.map((option) => (
          <MenuItem key={option} onClick={() => handleMenuClick(option)}>
            {option}
          </MenuItem>
        ))}
      </Menu>

      <Dialog
        open={openEditModal}
        onClose={() => setOpenEditModal(false)}
        maxWidth="sm"
        fullWidth
      >
        <CreateCard index={index} setOpenProfileModal={setOpenEditModal} />
      </Dialog>
    </>
  );
}
