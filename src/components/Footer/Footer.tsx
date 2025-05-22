import { Box, Stack, Typography, Container, IconButton } from "@mui/material";
import YouTubeIcon from "@mui/icons-material/YouTube";
import InstagramIcon from "@mui/icons-material/Instagram";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import projetoAprendizImg from "../../assets/img/Footer/projeto_aprendiz_polo_urucania.svg";

export function Footer() {
  return (
    <Box
      sx={{
        bgcolor: "#2D3748",
        py: 4,
        bottom: 0,
        left: 0,
        width: "100vw",
      }}
    >
      <Container maxWidth="xl">
        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems="center"
          spacing={4}
          sx={{
            borderBottom: "1px solid rgba(255, 255, 255, 0.12)",
            pb: 3,
            textAlign: { xs: "center", sm: "left" },
          }}
        >
          <Box
            component="img"
            src={projetoAprendizImg}
            alt="Projeto Aprendiz Polo Urucânia"
            sx={{
              width: { xs: 342, md: 462 },
              height: "auto",
            }}
          />

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              height: "100%",
              justifySelf: { xs: "center", md: "flex-end" },
              alignSelf: { xs: "center", md: "flex-end" },
              alignItems: "flex-start",
            }}
          >
            <Typography
              sx={{
                fontWeight: 600,
                fontSize: "32px",
                color: "white",
                mb: 6,
              }}
            >
              Redes sociais
            </Typography>
            <Stack
              direction="row"
              spacing={0.5}
              sx={{ alignSelf: { xs: "center", md: "flex-end" } }}
            >
              <IconButton
                aria-label="WhatsApp"
                href="https://wa.me/5521987255902"
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  color: "white",
                  ":hover": { color: "#25D366" },
                }}
              >
                <WhatsAppIcon sx={{ fontSize: 28, p: 0 }} />
              </IconButton>

              <IconButton
                aria-label="YouTube"
                href="https://www.youtube.com/@ProjetoAprendizUruc%C3%A2nia"
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  color: "white",
                  ":hover": { color: "#FF0000" },
                }}
              >
                <YouTubeIcon sx={{ fontSize: 30, p: 0 }} />
              </IconButton>

              <IconButton
                aria-label="Instagram"
                href="https://www.instagram.com/icm.pedregoso/"
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  color: "white",
                  ":hover": { color: "#E1306C" },
                }}
              >
                <InstagramIcon sx={{ fontSize: 28, p: 0 }} />
              </IconButton>
            </Stack>
          </Box>
        </Stack>

        <Typography
          sx={{
            color: "white",
            opacity: 0.6,
            mt: 3,
            fontWeight: 300,
            fontSize: { xs: 14, md: 16 },
            textAlign: "center",
          }}
        >
          © {new Date().getFullYear()} Projeto Aprendiz Polo Urucânia. Todos os
          direitos reservados.
        </Typography>
      </Container>
    </Box>
  );
}
