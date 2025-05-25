import { Paper, IconButton, Box } from "@mui/material";
import ReactPlayer from "react-player";
import { useAuth } from "../../hooks/useAuth";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import FullscreenExitIcon from "@mui/icons-material/FullscreenExit";
import { useRef, useState, useEffect } from "react";

interface VideoPlayerProps {
  url: string;
  onProgress: (progress: { played: number; playedSeconds: number }) => void;
  onDuration: (duration: number) => void;
}

export function VideoPlayer({ url, onProgress, onDuration }: VideoPlayerProps) {
  const { user } = useAuth();
  const playerRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleFullscreenToggle = () => {
    if (!document.fullscreenElement && playerRef.current) {
      playerRef.current.requestFullscreen();
    } else if (document.fullscreenElement) {
      document.exitFullscreen();
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  return (
    <Paper
      elevation={3}
      sx={{
        borderRadius: 3,
        overflow: "hidden",
        aspectRatio: "16/9",
        backgroundColor: "#000000",
        position: "relative",
        my: 8,
      }}
      ref={playerRef}
    >
      <ReactPlayer
        url={url}
        controls={user?.role === "admin"}
        width="100%"
        height="100%"
        onProgress={({ played, playedSeconds }) => {
          onProgress({ played, playedSeconds });
        }}
        onDuration={onDuration}
      />

      <Box
        sx={{
          position: "absolute",
          bottom: 8,
          right: 8,
          zIndex: 2,
          backgroundColor: "rgba(53, 53, 53, 0.5)",
          borderRadius: "50%",
        }}
      >
        <IconButton onClick={handleFullscreenToggle} sx={{ color: "#BB1626" }}>
          {isFullscreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
        </IconButton>
      </Box>
    </Paper>
  );
}
