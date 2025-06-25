import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getDrugsByFormAsync, DrugData } from '../../api/drugData';
import './CategoryResult.css';

const DrugCard = ({ drug, onClick }: { drug: DrugData, onClick: () => void }) => {
    const drugIcon = drug.รูปแบบยา.includes('เม็ด') ? '💊' : drug.รูปแบบยา.includes('น้ำ') ? '🧪' : '🩹';
    
    return (
        <div className="drug-card" onClick={onClick}>
            <div className="drug-card-image">{drugIcon}</div>
            <div className="drug-card-info">
                <h3 className="drug-card-title">{drug.ชื่อการค้า}</h3>
                <p className="drug-card-subtitle">{drug.ชื่อสามัญ}</p>
                <div className="drug-card-uses">
                    {drug['ยานี้ใช้สำหรับ'].split(' ').slice(0, 3).join(' ')}...
                </div>
            </div>
        </div>
    );
};

const CategoryResultPage = () => {
    const { form } = useParams<{ form: string }>();
    const navigate = useNavigate();
    const [drugs, setDrugs] = useState<DrugData[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchDrugs = async () => {
            if (form) {
                setLoading(true);
                setError(null);
                try {
                    const normalizedForm = decodeURIComponent(form).trim().toLowerCase();
                    const formDrugs = await getDrugsByFormAsync(normalizedForm);
                    setDrugs(formDrugs);
                } catch (error) {
                    setError('เกิดข้อผิดพลาดในการโหลดข้อมูลยา');
                } finally {
                    setLoading(false);
                }
            } else {
                setError('ไม่พบหมวดหมู่ยา');
            }
        };
        fetchDrugs();
    }, [form]);

    const filteredDrugs = drugs.filter(drug => 
        drug.ชื่อการค้า.toLowerCase().includes(searchQuery.toLowerCase()) ||
        drug.ชื่อสามัญ.toLowerCase().includes(searchQuery.toLowerCase()) ||
        drug['ยานี้ใช้สำหรับ'].toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (error) {
        return <div className="category-result-page"><p style={{color: 'red', textAlign: 'center'}}>{error}</p></div>;
    }

    return (
        <div className="category-result-page">
            <header className="page-header">
                <button onClick={() => navigate(-1)} className="back-btn">←</button>
                <div className="header-content">
                    <h1 className="header-title">{form}</h1>
                    <p className="header-subtitle">พบ {filteredDrugs.length} รายการ</p>
                </div>
            </header>

            <div className="search-bar" style={{ position: 'relative', display: 'flex', alignItems: 'center', marginBottom: 24 }}>
                <span className="search-icon" style={{ position: 'absolute', left: 16, fontSize: 20, color: '#4263eb' }}>🔍</span>
                <input
                    type="text"
                    className="search-input"
                    placeholder="ค้นหายาในหมวดหมู่นี้..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{ paddingLeft: 40, paddingRight: 40 }}
                    autoComplete="off"
                />
                {searchQuery && (
                    <button onClick={() => setSearchQuery('')} style={{ position: 'absolute', right: 10, background: 'none', border: 'none', fontSize: 18, cursor: 'pointer', color: '#888' }}>✕</button>
                )}
            </div>

            {loading ? (
                <div className="loading-state">
                    <div className="loading-spinner" />
                    <p>กำลังโหลดข้อมูลยา...</p>
                </div>
            ) : filteredDrugs.length > 0 ? (
                <div className="drugs-grid">
                    {filteredDrugs.map((drug) => (
                        <DrugCard
                            key={drug.ชื่อการค้า}
                            drug={drug}
                            onClick={() => navigate(`/drugs/${encodeURIComponent(drug.ชื่อการค้า)}`)}
                        />
                    ))}
                </div>
            ) : (
                <div className="no-results">
                    <p>ไม่พบยาที่ตรงกับคำค้นหา</p>
                    <p>ลองค้นหาด้วยคำอื่น</p>
                </div>
            )}
        </div>
    );
};

export default CategoryResultPage; 