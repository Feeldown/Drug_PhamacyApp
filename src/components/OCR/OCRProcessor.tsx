import React, { useState } from 'react';
import * as Tesseract from 'tesseract.js';
import { Box, CircularProgress, Typography, Paper } from '@mui/material';

interface OCRProcessorProps {
  imageSrc: string;
  onResult: (text: string) => void;
}

const OCRProcessor: React.FC<OCRProcessorProps> = ({ imageSrc, onResult }) => {
  const [progress, setProgress] = useState<number>(0);
  const [error, setError] = useState<string>('');

  React.useEffect(() => {
    let isMounted = true;

    const doOCR = async () => {
      // Create worker with Logger and LangPath
      const worker = await Tesseract.createWorker({
        // @ts-ignore
        logger: (p: { status: string; progress: number }) => {
          if (isMounted && p.status === 'recognizing text') {
            setProgress(p.progress * 100);
          }
        },
        langPath: '/tessdata'
      }) as any;
      
      try {
        // Initialize worker
        await worker.loadLanguage('eng+tha');
        await worker.initialize('eng+tha');

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