import { Box } from "@mui/material";
import ReactPlayer from "react-player";

interface VideoPlayerProps {
  url: string;
}

export function VideoPlayer({ url }: VideoPlayerProps) {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        marginY: { xs: 4.2, sm: 6, md: 8, lg: 12 },
        backgroundColor: "#000000",
      }}
    >
      <Box
        sx={{
          width: { xs: "100%", sm: "80%", md: "70%" },
          aspectRatio: "16 / 9",
        }}
      >
        <ReactPlayer url={url} controls width="100%" height="100%" />
      </Box>
    </Box>
  );
}
