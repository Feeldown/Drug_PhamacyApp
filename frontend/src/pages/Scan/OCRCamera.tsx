import React, { useRef, useState } from 'react';
import Webcam from 'react-webcam';
import OCRProcessor from '../../components/OCR/OCRProcessor';

const OCRCamera = () => {
  const webcamRef = useRef<Webcam>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [ocrResult, setOcrResult] = useState('');
  const [processing, setProcessing] = useState(false);

  const capture = () => {
    if (!webcamRef.current) return;
    const src = webcamRef.current.getScreenshot();
    if (!src) return;
    setImageSrc(src);
    setOcrResult('');
    setProcessing(true);
  };

  const handleOCRResult = (text: string) => {
    setOcrResult(text);
    setProcessing(false);
  };

  const handleRetake = () => {
    setImageSrc(null);
    setOcrResult('');
    setProcessing(false);
  };

  return (
    <div style={{ textAlign: 'center' }}>
      {!imageSrc && (
        <>
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            width={320}
            height={240}
          />
          <div style={{ margin: '16px 0' }}>
            <button onClick={capture} disabled={processing}>
              ถ่ายภาพและอ่านข้อความ
            </button>
          </div>
        </>
      )}
      {imageSrc && processing && (
        <OCRProcessor imageSrc={imageSrc} onResult={handleOCRResult} />
      )}
      {imageSrc && !processing && (
        <div>
          <img src={imageSrc} alt="captured" style={{ maxWidth: 320, margin: '16px 0' }} />
          <h3>ผลลัพธ์ OCR:</h3>
          <pre style={{ background: '#f8f8f8', padding: 8 }}>{ocrResult}</pre>
          <button onClick={handleRetake}>ถ่ายใหม่</button>
        </div>
      )}
    </div>
  );
};

export default OCRCamera; 