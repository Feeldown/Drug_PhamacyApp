import React, { useState } from 'react';
import { createWorker } from 'tesseract.js';
import { Box, CircularProgress, Typography, Paper } from '@mui/material';

interface OCRProcessorProps {
  imageSrc: string;
  onResult: (text: string) => void;
}

interface TesseractWorker {
  loadLanguage: (lang: string) => Promise<void>;
  initialize: (lang: string) => Promise<void>;
  setProgressHandler: (handler: (progress: { status: string; progress: number }) => void) => void;
  recognize: (image: string) => Promise<{ data: { text: string } }>;
  terminate: () => Promise<void>;
}

const OCRProcessor: React.FC<OCRProcessorProps> = ({ imageSrc, onResult }) => {
  const [progress, setProgress] = useState<number>(0);
  const [error, setError] = useState<string>('');

  React.useEffect(() => {
    let isMounted = true;

    const doOCR = async () => {
      // Create worker with type assertion
      const worker = (await createWorker()) as unknown as TesseractWorker;
      
      try {
        // Set progress handler
        worker.setProgressHandler((p) => {
          if (isMounted && p.status === 'recognizing text') {
            setProgress(p.progress * 100);
          }
        });

        // Initialize worker
        await worker.loadLanguage('eng');
        await worker.initialize('eng');

        // Perform OCR
        const { data: { text } } = await worker.recognize(imageSrc);
        if (isMounted) {
          onResult(text);
        }
      } catch (err) {
        if (isMounted) {
          setError('Failed to process image');
          console.error(err);
        }
      } finally {
        await worker.terminate();
      }
    };

    doOCR();

    return () => {
      isMounted = false;
    };
  }, [imageSrc, onResult]);

  return (
    <Paper elevation={3} sx={{ p: 2, mt: 2 }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
        <Typography variant="h6">Processing Image</Typography>
        <CircularProgress variant="determinate" value={progress} />
        <Typography variant="body2">{Math.round(progress)}%</Typography>
        {error && (
          <Typography color="error">{error}</Typography>
        )}
      </Box>
    </Paper>
  );
};

export default OCRProcessor; 