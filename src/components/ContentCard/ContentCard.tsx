import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";

import Typography from "@mui/material/Typography";

import defaultCardImage from "../../assets/img/defaultCardImage.png";
import { ICardData } from "../../interfaces/ICardData";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export function ContentCard({ id, name, teacherInfo, coverImage }: ICardData) {
  const [imageSrc, setImageSrc] = useState(coverImage || defaultCardImage);
  const navigate = useNavigate();
  console.log("id", id);
  console.log("name", name);
  console.log("teacherInfo", teacherInfo);
  console.log("coverImage", coverImage);

  const handleOpenLessons = (id: string) => {
    navigate(`/classes/${id}`);
  };

  return (
    <Card
      sx={{
        display: "flex",
        marginY: { xs: 2, sm: 3, md: 4 },
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
          maxWidth: { xs: 100, sm: 120, md: 130 },
          overflow: "hidden",
        }}
      >
        <CardMedia
          component="img"
          sx={{
            objectFit: "cover",
            maxWidth: "60%",
            minHeight: "56px",
            borderRadius: 1,
            filter: "drop-shadow(0.8px 0.8px 0.8px rgba(0, 0, 0, 0.7))",
          }}
          image={imageSrc}
          alt="Live from space album cover"
          onError={() => setImageSrc(defaultCardImage)}
        />
      </Box>

      <Box
        sx={{
          marginLeft: -1.8,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CardContent sx={{ textAlign: "left" }}>
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
              maxWidth: { xs: "180px", sm: "380px", md: "500px", lg: "540px" },
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {teacherInfo}
          </Typography>
        </CardContent>
      </Box>
    </Card>
  );
}
