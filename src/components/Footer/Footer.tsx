import { Box, Stack, Typography, Container, IconButton } from "@mui/material";
import YouTubeIcon from "@mui/icons-material/YouTube";
import InstagramIcon from "@mui/icons-material/Instagram";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import projetoAprendizImg from "../../assets/img/Footer/projeto_aprendiz_polo_urucania.svg";

export function Footer() {
  return (
    <Box component="footer" sx={{ bgcolor: "#2D3748", py: 5, mt: 10 }}>
      <Container maxWidth="lg">
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
              width: { xs: 180, sm: 240, md: 280 },
              height: "auto",
            }}
          />

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              height: "100%",
              justifySelf: "flex-end",
              alignSelf: "flex-end",
              alignItems: "flex-start",
            }}
          >
            <Typography
              variant="h5"
              sx={{ fontWeight: 600, color: "white", mb: 2 }}
            >
              Redes sociais
            </Typography>
            <Stack direction="row" spacing={2}>
              <IconButton
                aria-label="WhatsApp"
                href="https://wa.me/"
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  color: "white",
                  ":hover": { bgcolor: "#25D366" },
                }}
              >
                <WhatsAppIcon sx={{ fontSize: 28, p: 0 }} />
              </IconButton>

              <IconButton
                aria-label="YouTube"
                href="https://www.youtube.com/"
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  color: "white",
                  ":hover": { bgcolor: "#FF0000" },
                }}
              >
                <YouTubeIcon sx={{ fontSize: 30, p: 0 }} />
              </IconButton>

              <IconButton
                aria-label="Instagram"
                href="https://www.instagram.com/"
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  color: "white",
                  ":hover": { bgcolor: "#E1306C" },
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
