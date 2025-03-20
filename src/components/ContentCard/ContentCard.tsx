import { Box, Card, CardContent, CardMedia, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import defaultCardImage from "../../assets/img/defaultCardImage.svg";
import { ICardData } from "../../interfaces/ICardData";
import { useAuth } from "../../hooks/useAuth";
import options from "../../assets/img/ContentCard/options.png";

export function ContentCard({ id, name, teacherInfo, coverImage }: ICardData) {
  const { user } = useAuth();
  const [imageSrc, setImageSrc] = useState<string>(defaultCardImage);
  const navigate = useNavigate();

  useEffect(() => {
    if (coverImage) {
      const img = new Image();
      img.src = coverImage;
      img.onload = () => setImageSrc(coverImage);
      img.onerror = () => setImageSrc(defaultCardImage);
    }
  }, [coverImage]);

  const handleOpenLessons = (id: string) => {
    navigate(`${location.pathname}/${id}`);
  };

  console.log(user);

  return (
    <Card
      sx={{
        display: "flex",
        marginY: 2.8,
        borderRadius: 2,
        "&:hover": { transform: "scale(1.01)" },
        cursor: "pointer",
      }}
      onClick={() => handleOpenLessons(id)}
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
            aspectRatio: 4 / 3,
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
          }}
        >
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <Typography
              component="div"
              sx={{
                fontSize: { xs: "15px", sm: "16px", md: "18px", lg: "20px" },
                fontWeight: 600,
                maxWidth: { xs: "180px", sm: "190px", md: "200px", lg: "100%" },
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {name}
            </Typography>
            <Typography
              variant="subtitle2"
              component="div"
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
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
              marginLeft: "auto",
              width: "100%",
            }}
          >
            <Box
              component="img"
              src={options}
              sx={{
                width: "24px",
                mr: 2,
                ":hover": { transform: "scale(1.2)" },
              }}
            />
          </Box>
        )}
      </Box>
    </Card>
  );
}
