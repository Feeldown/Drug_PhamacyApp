import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { searchDrugsEnhanced, getAllDrugs, DrugData, getUniqueDrugForms, DrugForm } from '../../api/drugData';
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

const SearchPage = () => {
    const navigate = useNavigate();
    const [query, setQuery] = useState('');
    const [allDrugs, setAllDrugs] = useState<DrugData[]>([]);
    const [filters, setFilters] = useState<DrugForm[]>([]);
    const [activeFilter, setActiveFilter] = useState('ทั้งหมด');
    const [isLoading, setIsLoading] = useState(true);
    const [searchType, setSearchType] = useState<'all' | 'generic' | 'brand'>('all');

    useEffect(() => {
        const fetchInitialData = async () => {
            setIsLoading(true);
            try {
                const drugs = await getAllDrugs();
                const forms = await getUniqueDrugForms();
                setAllDrugs(drugs);
                setFilters([{ form: 'ทั้งหมด', count: drugs.length }, ...forms]);
            } catch (error) {
                console.error('Error fetching initial data:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchInitialData();
    }, []);

    const filteredResults = useMemo(() => {
        let base = allDrugs;
        if (activeFilter !== 'ทั้งหมด') {
            const normalizedFilter = activeFilter.trim().toLowerCase();
            base = allDrugs.filter(drug => drug.รูปแบบยา.trim().toLowerCase() === normalizedFilter);
        }
        if (query.trim() !== '') {
            base = searchDrugsEnhanced(query, searchType, base);
        }
        const sorted = [...base].sort((a, b) => a.ชื่อการค้า.localeCompare(b.ชื่อการค้า));
        console.log('filteredResults FINAL:', sorted.map(d => d.ชื่อการค้า + ' | ' + d.รูปแบบยา));
        return sorted;
    }, [allDrugs, query, searchType, activeFilter]);

    useEffect(() => {
        setQuery('');
    }, [activeFilter]);

    useEffect(() => {
        console.log('activeFilter:', activeFilter);
        console.log('allDrugs:', allDrugs.map(d => d.รูปแบบยา));
        console.log('filteredResults:', filteredResults.map(d => d.รูปแบบยา));
    }, [activeFilter, allDrugs, filteredResults]);

    return (
        <div className="search-page">
            <header className="page-header">
                <h1 className="header-title">ค้นหายา</h1>
                <p className="header-subtitle">ค้นหาข้อมูลยาได้ง่ายๆ</p>
            </header>

            <div className="search-section">
                <div className="search-bar">
                    <span className="search-icon">🔍</span>
                    <input
                        type="text"
                        className="search-input"
                        placeholder="ค้นหาชื่อยา, สรรพคุณ หรือ อาการไม่พึงประสงค์"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                </div>

                <div className="search-types">
                    <button 
                        className={`search-type-btn ${searchType === 'all' ? 'active' : ''}`}
                        onClick={() => setSearchType('all')}
                    >
                        ทั้งหมด
                    </button>
                    <button 
                        className={`search-type-btn ${searchType === 'generic' ? 'active' : ''}`}
                        onClick={() => setSearchType('generic')}
                    >
                        ชื่อสามัญ
                    </button>
                    <button 
                        className={`search-type-btn ${searchType === 'brand' ? 'active' : ''}`}
                        onClick={() => setSearchType('brand')}
                    >
                        ชื่อการค้า
                    </button>
                </div>

                <div className="search-methods">
                    <Link to="/scan" className="search-method-card">
                        <span className="method-icon">📷</span>
                        <div className="method-info">
                            <h3>ถ่ายรูปยา</h3>
                            <p>ถ่ายภาพยาเพื่อค้นหาข้อมูล</p>
                        </div>
                    </Link>
                    <Link to="/scan" className="search-method-card">
                        <span className="method-icon">📁</span>
                        <div className="method-info">
                            <h3>อัปโหลดรูปภาพ</h3>
                            <p>เลือกรูปภาพยาจากอุปกรณ์ของคุณ</p>
                        </div>
                    </Link>
                </div>
            </div>

            <div className="filters-section">
                <h2 className="section-title">
                    <span className="title-bar" />
                    หมวดหมู่
                </h2>
                <div className="filters">
                    {filters.map(filter => (
                        <button
                            key={filter.form}
                            className={`filter-btn ${activeFilter === filter.form ? 'active' : ''}`}
                            onClick={() => {
                                console.log('CLICK FILTER:', filter.form);
                                setActiveFilter(filter.form);
                            }}
                        >
                            {filter.form}
                            <span className="filter-count">({filter.count})</span>
                        </button>
                    ))}
                </div>
            </div>

            <div className="results-section">
                <div className="results-header">
                    <h2 className="section-title">ผลการค้นหา</h2>
                    <span className="results-count">พบ {filteredResults.length} รายการ</span>
                </div>

                {isLoading ? (
                    <div className="loading-state">
                        <div className="loading-spinner" />
                        <p>กำลังค้นหา...</p>
                    </div>
                ) : filteredResults.length > 0 ? (
                    <div className="drugs-grid">
                        {filteredResults.map((drug, index) => {
                            const cardKey = drug.ชื่อการค้า + '_' + drug.รูปแบบยา + '_' + index;
                            console.log('RENDER:', cardKey, drug.ชื่อการค้า, drug.รูปแบบยา);
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

export default SearchPage;