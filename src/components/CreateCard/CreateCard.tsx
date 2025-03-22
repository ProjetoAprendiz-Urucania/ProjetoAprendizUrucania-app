import { Box, Button, TextField } from "@mui/material";
import { useAuth } from "../../hooks/useAuth";
import addimage from "../../assets/img/CreateCard/addImage.svg";
import { useEffect, useRef } from "react";

export function CreateCard() {
  const { user } = useAuth();
  const loading = useRef(true);

  useEffect(() => {
    const timeout = setTimeout(() => {
      loading.current = false;
    }, 1000);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <>
      {user?.role === "admin" && (
        <Box
          sx={{
            backgroundColor: "white",
            borderRadius: "12px",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            padding: { xs: 4, md: 6 },
            gap: 3,
            width: "100%",
            maxWidth: "500px",
            margin: "0 auto",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              border: "1px dashed #1E1E1E",
              padding: { xs: 3, md: 4 },
              marginBottom: { xs: 1, md: 2 },
              width: "100%",
              cursor: "pointer",
            }}
          >
            <Box
              component="img"
              src={addimage}
              alt="Upload classes image"
              sx={{
                width: { xs: "40px", md: "50px" },
                ":hover": {
                  transform: "scale(1.05)",
                },
              }}
            />
          </Box>
          <TextField
            id="classname"
            label="Nome da Turma"
            variant="outlined"
            sx={inputStyle}
            fullWidth
          />
          <TextField
            id="teachers"
            label="Professores ( separados por ',' )"
            variant="outlined"
            sx={inputStyle}
            fullWidth
          />

          <Button
            type="submit"
            sx={{
              backgroundColor: "#BB1626",
              fontWeight: "bold",
              color: "white",
              mt: 2,
            }}
          >
            Confirmar
          </Button>
        </Box>
      )}
    </>
  );
}

const inputStyle = {
  "& .MuiInputLabel-root": {
    color: "#1F1F1F",
    fontSize: "15px",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  "& .MuiInputLabel-root.Mui-focused": {
    fontWeight: "bold",
    color: "#ED3237",
  },
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: "#1F1F1F",
    },
    "&:hover fieldset": {
      borderColor: "#ED3237",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#ED3237",
    },
  },
};
