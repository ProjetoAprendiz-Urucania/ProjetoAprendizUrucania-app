import { Box } from "@mui/material";
import ReactPlayer from "react-player";

interface VideoPlayerProps {
  url: string;
  onProgress: (progress: number) => void;
}

export function VideoPlayer({ url, onProgress }: VideoPlayerProps) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
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
        <ReactPlayer
          url={url}
          controls
          width="100%"
          height="100%"
          onProgress={({ played }) => {
            onProgress(played * 100);
          }}
        />
      </Box>
    </Box>
  );
}
