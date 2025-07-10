import React, { useRef, useState } from 'react';
import Webcam from 'react-webcam';
import { Button, Box, Paper, Typography } from '@mui/material';
import { PhotoCamera } from '@mui/icons-material';

interface ScannerProps {
  onCapture: (imageSrc: string) => void;
}

const Scanner: React.FC<ScannerProps> = ({ onCapture }) => {
  const webcamRef = useRef<Webcam>(null);
  const [error, setError] = useState<string>('');

  const capture = React.useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      onCapture(imageSrc);
    }
  }, [onCapture]);

  return (
    <Paper elevation={3} sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
        <Typography variant="h6">Scan Drug Label</Typography>
        <Box sx={{ width: '100%', maxWidth: 640, position: 'relative' }}>
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            width="100%"
            onUserMediaError={(err) => setError('Failed to access camera')}
          />
        </Box>
        {error && (
          <Typography color="error">{error}</Typography>
        )}
        <Button
          variant="contained"
          startIcon={<PhotoCamera />}
          onClick={capture}
          disabled={!!error}
        >
          Capture Photo
        </Button>
      </Box>
    </Paper>
  );
};

export default Scanner; 