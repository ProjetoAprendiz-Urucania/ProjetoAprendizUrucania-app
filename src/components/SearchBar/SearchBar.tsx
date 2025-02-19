import { Box, InputAdornment, InputBase } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";

export function SearchBar() {
  return (
    <InputBase
      placeholder="Busque por turmas..."
      autoFocus
      sx={{
        flex: 1,
        minWidth: "100%",
        backgroundColor: "#EAEAEA",
        color: "#1E1E1E",
        borderRadius: "4px",
        padding: "8px",
        marginY: 4.6,
        paddingRight: "40px",
      }}
      endAdornment={
        <InputAdornment position="end" sx={{ marginRight: -3 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <CloseIcon
              sx={{
                cursor: "pointer",
                color: "#4E4E4E",
                "&:hover": { color: "red" },
              }}
            />
            <span
              style={{
                height: "26px",
                backgroundColor: "#4E4E4E",
                width: "2px",
              }}
            ></span>
            <SearchIcon
              sx={{
                cursor: "pointer",
                color: "#4E4E4E",
                "&:hover": { color: "red" },
              }}
            />
          </Box>
        </InputAdornment>
      }
    />
  );
}
