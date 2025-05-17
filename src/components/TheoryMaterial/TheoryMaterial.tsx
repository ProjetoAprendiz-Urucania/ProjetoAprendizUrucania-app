import { Box, Typography } from '@mui/material';
import LaunchIcon from '@mui/icons-material/Launch';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { deleteMaterial } from '../../services/theoryMaterials.service';

export interface TheoryMaterialProps {
  id: string;
  name: string;
  fileType: string;
  lessonId: string;
  fileUrl: string;
  classId: string;
  materialId: string;
}

export function TheoryMaterialItem({
  name,
  fileUrl,
  materialId,
  classId,
  lessonId,
}: TheoryMaterialProps) {
  const handleOpenFile = () => {
    window.open(fileUrl, '_blank', 'noopener,noreferrer');
  };

  const handleDeleteFile = async () => {
    try {
      await deleteMaterial(classId, lessonId, materialId);
    } catch (error) {
      console.error('Failed to delete material:', error);
    }
  };

  return (
    <Box>
      <Box
        sx={{
          borderTop: '1px solid rgba(30, 30, 30, 0.3)',
          my: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: 'pointer',
        }}
      >
        <Typography
          sx={{
            mt: 0.8,
            '&:hover': { transform: 'scale(1.02)' },
          }}
          onClick={handleOpenFile}
        >
          {name}
        </Typography>
        <Box display={'flex'} gap={1}>
          <DeleteForeverIcon
            onClick={handleDeleteFile}
            sx={{
              cursor: 'pointer',
              '&:hover': { transform: 'scale(1.04)' },
              width: '1em',
            }}
          />
          <LaunchIcon
            onClick={handleOpenFile}
            sx={{
              cursor: 'pointer',
              '&:hover': { transform: 'scale(1.04)' },
              width: '0.8em',
            }}
          />
        </Box>
      </Box>
    </Box>
  );
}
