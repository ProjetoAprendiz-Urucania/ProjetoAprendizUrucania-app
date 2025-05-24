import { Paper, Stack, Typography } from "@mui/material";
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import ReactPlayer from "react-player";
import { useAuth } from "../../hooks/useAuth";

interface VideoPlayerProps {
  url: string;
  onProgress: (progress: number) => void;
}

export function VideoPlayer({ url, onProgress }: VideoPlayerProps) {
  const {user} = useAuth();
  return (
    <Paper 
      elevation={3} 
      sx={{ 
        borderRadius: 3, 
        overflow: 'hidden', 
        aspectRatio: '16/9',
        backgroundColor: "#000000",
        position: 'relative',
        my: 8,
      }}
    >
      {url ? (
        <ReactPlayer
          url={url}
          controls={user?.role === 'admin' ? true : false}
          width="100%"
          height="100%"
          onProgress={({ played }) => {
            onProgress(played * 100);
          }}
        />
      ) : (
        <Stack 
          alignItems="center" 
          justifyContent="center" 
          spacing={2}
          sx={{ 
            height: '100%', 
            color: 'white', 
            position: 'absolute', 
            top: 0, left: 0, right: 0, bottom: 0, 
            backgroundColor: 'rgba(0,0,0,0.7)' 
          }}
        >
          <PlayArrowIcon sx={{ fontSize: 64, opacity: 0.7 }} />
          <Typography variant="body2" sx={{ opacity: 0.8 }}>
            No video available
          </Typography>
        </Stack>
      )}
    </Paper>
  );
}
