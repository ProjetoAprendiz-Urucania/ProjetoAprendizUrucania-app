import { Box, InputAdornment, InputBase } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useLocation } from "react-router-dom";

interface ISearchBarProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
}

export function SearchBar({
  searchTerm,
  setSearchTerm,
}: ISearchBarProps): JSX.Element {
  const location = useLocation();
  const isLessonsPage = /^\/classes\/[a-f0-9]{24}$/.test(location.pathname);

  return (
    <InputBase
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      placeholder={
        !isLessonsPage ? "Busque por turmas..." : "Busque por aulas..."
      }
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
                "&:focus": { color: "#4E4E4E" },
              }}
              onClick={() => setSearchTerm("")}
            />
          </Box>
        </InputAdornment>
      }
    />
  );
}
