import React, { useRef, useState } from 'react';
import Webcam from 'react-webcam';

const OCRCamera = () => {
  const webcamRef = useRef<Webcam>(null);
  const [ocrResult, setOcrResult] = useState('');
  const [loading, setLoading] = useState(false);

  const capture = async () => {
    if (!webcamRef.current) return;
    const imageSrc = webcamRef.current.getScreenshot();
    if (!imageSrc) return;
    setLoading(true);
    try {
      const res = await fetch('https://drug-phamacyapp.onrender.com/api/ocr', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: imageSrc })
      });
      const data = await res.json();
      setOcrResult(data.text);
    } catch (e) {
      setOcrResult('เกิดข้อผิดพลาดในการประมวลผลภาพ');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        width={320}
        height={240}
      />
      <div style={{ margin: '16px 0' }}>
        <button onClick={capture} disabled={loading}>
          {loading ? 'กำลังประมวลผล...' : 'ถ่ายภาพและอ่านข้อความ'}
        </button>
      </div>
      <div>
        <h3>ผลลัพธ์ OCR:</h3>
        <pre style={{ background: '#f8f8f8', padding: 8 }}>{ocrResult}</pre>
      </div>
    </div>
  );
};

export default OCRCamera; 