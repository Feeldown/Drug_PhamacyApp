import React, { useState, useRef, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import Webcam from 'react-webcam';
import './Scan.css';

const navItems = [
  { to: '/', label: 'หน้าหลัก', icon: '🏠' },
  { to: '/search', label: 'ค้นหา', icon: '🔍' },
  { to: '/categories', label: 'หมวดหมู่', icon: '📁' },
  { to: '/help', label: 'ช่วยเหลือ', icon: '❔' },
];

// We will need a ResultCard component, let's assume it exists in a shared directory
// import ResultCard from '../shared/ResultCard'; 
// For now, let's define a placeholder so the code runs.
const ResultCard = ({ drug }: { drug: any }) => (
    <div className="result-card">
        <div className="result-header">
            <div className="result-image-placeholder">💊</div>
            <div className="result-info">
                <h3 className="result-title">{drug.name}</h3>
                <div className="result-tags">
                    <span className="result-tag">ยาเม็ด</span>
                </div>
                <div className="result-match">
                    <span>✓</span>
                    <span>ตรงกัน {drug.match}%</span>
                </div>
            </div>
        </div>
    </div>
);

type Tab = 'camera' | 'upload';

const ScanPage = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<Tab>('camera');
    const [image, setImage] = useState<string | null>(null);
    const [results, setResults] = useState<any[] | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const webcamRef = useRef<Webcam>(null);
    const [cameraError, setCameraError] = useState<string>('');

    // ถ่ายภาพจาก webcam
    const handleCapture = () => {
        if (webcamRef.current) {
            const imgSrc = webcamRef.current.getScreenshot();
            if (imgSrc) {
                setImage(imgSrc);
                // mock OCR
                setResults([
                    { name: 'ยาพาราเซตามอล', match: 95 },
                    { name: 'ไอบูโพรเฟน', match: 88 }
                ]);
            }
        }
    };

    // อัปโหลดไฟล์
    const onDrop = useCallback((acceptedFiles: File[]) => {
        const file = acceptedFiles[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result as string);
                setResults([
                    { name: 'ยาพาราเซตามอล', match: 95 },
                    { name: 'ไอบูโพรเฟน', match: 88 }
                ]);
            };
            reader.readAsDataURL(file);
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'image/*': ['.jpeg', '.png', '.jpg'] },
        noClick: true,
        noKeyboard: true,
    });
    
    const handleUploadButtonClick = () => {
        fileInputRef.current?.click();
    };

    return (
        <div className="scan-page">
            <header className="header">
                <button onClick={() => navigate(-1)} className="back-btn">←</button>
                <h1 className="header-title">ถ่ายรูป/อัปโหลดยา</h1>
            </header>

            <div className="tabs">
                <button 
                    className={`tab-btn ${activeTab === 'camera' ? 'active' : ''}`}
                    onClick={() => setActiveTab('camera')}>
                    <span className="tab-icon">📷</span>
                    ถ่ายรูป
                </button>
                <button 
                    className={`tab-btn ${activeTab === 'upload' ? 'active' : ''}`}
                    onClick={() => setActiveTab('upload')}>
                    <span className="tab-icon">📁</span>
                    อัปโหลด
                </button>
            </div>

            {activeTab === 'camera' && (
                <div className="camera-view">
                    <div className="camera-container">
                        <Webcam
                            audio={false}
                            ref={webcamRef}
                            screenshotFormat="image/jpeg"
                            width="100%"
                            videoConstraints={{ facingMode: 'environment' }}
                            onUserMediaError={() => setCameraError('ไม่สามารถเข้าถึงกล้องได้')}
                        />
                    </div>
                    {cameraError && <div style={{ color: 'red', marginTop: 8 }}>{cameraError}</div>}
                    <button className="camera-btn" onClick={handleCapture} disabled={!!cameraError}>
                        <span>📸</span>
                        <span>ถ่ายภาพ</span>
                    </button>
                </div>
            )}

            {activeTab === 'upload' && (
                <div {...getRootProps()} className={`upload-area ${isDragActive ? 'active' : ''}`}>
                    <input {...getInputProps()} ref={fileInputRef} style={{ display: 'none' }} />
                    <div className="upload-icon">📁</div>
                    <h2 className="upload-title">อัปโหลดรูปยา</h2>
                    <p className="upload-subtitle">ลากไฟล์มาวางที่นี่ หรือ</p>
                    <button onClick={handleUploadButtonClick} className="upload-btn">
                        <span>เลือกไฟล์</span>
                        <span>📎</span>
                    </button>
                </div>
            )}

            {/* แสดงภาพที่ถ่ายหรืออัปโหลด */}
            {image && (
                <img src={image} alt="preview" className="preview-image" />
            )}

            {/* แสดงผล OCR */}
            {results && (
                <div className="search-results">
                    <div className="results-header">
                        <h2 className="results-title">ผลการค้นหา</h2>
                        <span className="results-count">พบ {results.length} รายการ</span>
                    </div>
                    {results.map((drug, index) => (
                        <ResultCard key={index} drug={drug} />
                    ))}
                </div>
            )}

            {/* Bottom Navigation */}
            <nav className="bottom-nav">
                <div className="nav-items">
                    {navItems.map(item => (
                        <Link
                            key={item.label}
                            to={item.to}
                            className="nav-item"
                        >
                            <span className="nav-icon">{item.icon}</span>
                            <span className="nav-label">{item.label}</span>
                        </Link>
                    ))}
                </div>
            </nav>
        </div>
    );
};

export default ScanPage; 