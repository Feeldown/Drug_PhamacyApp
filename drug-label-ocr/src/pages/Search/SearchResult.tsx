import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { searchDrugsEnhanced, DrugData, getAllDrugs } from '../../api/drugData';
import './Search.css';

const DrugCard = ({ drug, onClick }: { drug: DrugData, onClick: () => void }) => {
    const getDrugIcon = (form: string) => {
        if (form.includes('เม็ด')) return '💊';
        if (form.includes('น้ำ')) return '🧪';
        if (form.includes('ครีม') || form.includes('ขี้ผึ้ง')) return '🧴';
        if (form.includes('ฉีด')) return '💉';
        if (form.includes('แคปซูล')) return '💊';
        if (form.includes('แกรนูล')) return '🧪';
        return '💊';
    };
    return (
        <div className="drug-card" onClick={onClick}>
            <div className="drug-card-image">{getDrugIcon(drug.รูปแบบยา)}</div>
            <div className="drug-card-info">
                <h3 className="drug-card-title">{drug.ชื่อการค้า}</h3>
                <p className="drug-card-subtitle">{drug.ชื่อสามัญ}</p>
                <div className="drug-card-uses">
                    {drug['ยานี้ใช้สำหรับ'].split('\n')[0].replace('* ', '')}
                </div>
            </div>
        </div>
    );
};

const SearchResult = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const query = searchParams.get('query') || '';
    const [results, setResults] = useState<DrugData[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchResults = async () => {
            setIsLoading(true);
            const allDrugs = await getAllDrugs();
            const normalized = query.trim().toLowerCase().replace(/\s+/g, '');
            // exact match ก่อน
            const exact = allDrugs.filter(drug =>
                drug.ชื่อการค้า.trim().toLowerCase().replace(/\s+/g, '') === normalized ||
                drug.ชื่อสามัญ.trim().toLowerCase().replace(/\s+/g, '') === normalized
            );
            if (exact.length > 0) {
                setResults(exact);
                setIsLoading(false);
                return;
            }
            // fallback: contains
            const filtered = query.trim() ? await searchDrugsEnhanced(query, 'all', allDrugs) : [];
            setResults(filtered);
            setIsLoading(false);
        };
        fetchResults();
    }, [query]);

    const handleBack = () => navigate(-1);

    return (
        <div className="search-page">
            <header className="page-header" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <button onClick={handleBack} style={{ fontSize: 24, background: 'none', border: 'none', cursor: 'pointer', marginRight: 8 }}>←</button>
                <h1 className="header-title" style={{ flex: 1 }}>ผลการค้นหา</h1>
            </header>
            <div className="results-section">
                <div className="results-header">
                    <h2 className="section-title">ผลการค้นหา</h2>
                    <span className="results-count">พบ {results.length} รายการ</span>
                </div>
                {isLoading ? (
                    <div className="loading-state">
                        <div className="loading-spinner" />
                        <p>กำลังค้นหา...</p>
                    </div>
                ) : results.length > 0 ? (
                    <div className="drugs-grid">
                        {results.map((drug, index) => {
                            const cardKey = drug.ชื่อการค้า + '_' + drug.รูปแบบยา + '_' + index;
                            return (
                                <DrugCard
                                    key={cardKey}
                                    drug={drug}
                                    onClick={() => navigate(`/drug-details?name=${encodeURIComponent(drug.ชื่อการค้า)}`)}
                                />
                            );
                        })}
                    </div>
                ) : (
                    <div className="no-results">
                        <p>ไม่พบผลการค้นหา</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SearchResult; 