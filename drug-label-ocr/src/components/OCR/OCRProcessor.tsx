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

  const isImageTooDark = (imageData: ImageData, threshold = 40): boolean => {
    let total = 0;
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
      // คำนวณค่า brightness เฉลี่ย (grayscale)
      total += (data[i] + data[i + 1] + data[i + 2]) / 3;
    }
    const avg = total / (imageData.width * imageData.height);
    return avg < threshold;
  };

  const preprocessImage = (src: string): Promise<string | null> => {
    return new Promise((resolve) => {
      const img = new window.Image();
      img.crossOrigin = 'Anonymous';
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return resolve(src);
        ctx.drawImage(img, 0, 0);
        // Grayscale
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        // ตรวจสอบความมืดของภาพ
        if (isImageTooDark(imageData)) {
          resolve(null);
          return;
        }
        const data = imageData.data;
        for (let i = 0; i < data.length; i += 4) {
          const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
          // เพิ่ม contrast
          const contrast = 1.2; // ปรับค่าตามต้องการ
          const contrasted = (avg - 128) * contrast + 128;
          data[i] = data[i + 1] = data[i + 2] = Math.max(0, Math.min(255, contrasted));
        }
        ctx.putImageData(imageData, 0, 0);
        resolve(canvas.toDataURL('image/jpeg'));
      };
      img.onerror = () => resolve(src);
      img.src = src;
    });
  };

  React.useEffect(() => {
    let isMounted = true;

    const doOCR = async () => {
      // Create worker with logger
      const worker = await createWorker({
        logger: (p: { status: string; progress: number }) => {
          if (isMounted && p.status === 'recognizing text') {
            setProgress(p.progress * 100);
          }
        }
      });
      
      try {
        // Initialize worker
        await worker.loadLanguage('tha+eng');
        await worker.initialize('tha+eng');

        // Preprocess image
        const processedImage = await preprocessImage(imageSrc);
        if (!processedImage) {
          setError('ภาพมืดเกินไป กรุณาถ่ายใหม่ให้สว่างขึ้น');
          return;
        }

        // Perform OCR
        const { data: { text } } = await worker.recognize(processedImage);
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
          <Typography color="error">เกิดข้อผิดพลาดในการประมวลผลรูปภาพ กรุณาลองใหม่อีกครั้ง</Typography>
        )}
      </Box>
    </Paper>
  );
};

export default OCRProcessor; 