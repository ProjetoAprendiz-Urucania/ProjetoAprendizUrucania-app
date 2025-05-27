import { Outlet } from "react-router-dom";
import { Box, Container } from "@mui/material";

export function AuthLayout() {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        background: "linear-gradient(to bottom, #ffdada, #fff)",
      }}
    >
      <Container
        maxWidth="xl"
        sx={{
          width: "100%",
          flexGrow: 1,
          py: 2,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "transparent",
        }}
      >
        <Outlet />
      </Container>
    </Box>
  );
}
