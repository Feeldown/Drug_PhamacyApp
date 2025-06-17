import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { searchDrugsEnhanced, getAllDrugs, DrugData, getUniqueDrugForms, DrugForm } from '../../api/drugData';
import './Search.css';

// ฟังก์ชันช่วย normalize ข้อความ
function normalizeText(text: string) {
  return text
    .toLowerCase()
    .replace(/\s+/g, '') // ลบช่องว่างทั้งหมด
    .replace(/[^\wก-๙a-zA-Z0-9\[\]\(\)\-\+\%]/g, ''); // ลบอักขระพิเศษ ยกเว้นที่จำเป็น
}

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
        <div className="drug-card compact" onClick={onClick}>
            <div className="drug-card-image compact">{getDrugIcon(drug.รูปแบบยา)}</div>
            <div className="drug-card-info compact">
                <h3 className="drug-card-title compact">{drug.ชื่อการค้า}</h3>
            </div>
        </div>
    );
};

const SearchPage = () => {
    const navigate = useNavigate();
    const [query, setQuery] = useState('');
    const [allDrugs, setAllDrugs] = useState<DrugData[]>([]);
    const [results, setResults] = useState<DrugData[]>([]);
    const [filters, setFilters] = useState<DrugForm[]>([]);
    const [activeFilter, setActiveFilter] = useState('ทั้งหมด');
    const [isLoading, setIsLoading] = useState(true);
    const [searchType, setSearchType] = useState<'all' | 'generic' | 'brand'>('all');
    const [activeTab, setActiveTab] = useState<'name' | 'category' | 'image'>('name');

    useEffect(() => {
        const fetchInitialData = async () => {
            setIsLoading(true);
            try {
                const drugs = await getAllDrugs();
                const forms = await getUniqueDrugForms();
                setAllDrugs(drugs);
                setResults(drugs);
                setFilters([{ form: 'ทั้งหมด', count: drugs.length }, ...forms]);
            } catch (error) {
                console.error('Error fetching initial data:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchInitialData();
    }, []);

    // สำหรับค้นหาด้วยชื่อ
    useEffect(() => {
        if (activeTab !== 'name') return;
        setIsLoading(true);
        let searchedDrugs: DrugData[] = allDrugs;
        const normQuery = normalizeText(query.trim());
        if (normQuery !== '') {
            searchedDrugs = allDrugs.filter(drug => {
                const generic = normalizeText(drug.ชื่อสามัญ);
                const brand = normalizeText(drug.ชื่อการค้า);
                const uses = normalizeText(drug['ยานี้ใช้สำหรับ'] || '');
                const side = normalizeText(drug['อาการไม่พึงประสงค์ทั่วไป'] || '');
                if (searchType === 'generic') {
                  return generic.includes(normQuery) || uses.includes(normQuery) || side.includes(normQuery);
                } else if (searchType === 'brand') {
                  return brand.includes(normQuery) || uses.includes(normQuery) || side.includes(normQuery);
                } else {
                  return (
                    generic.includes(normQuery) ||
                    brand.includes(normQuery) ||
                    uses.includes(normQuery) ||
                    side.includes(normQuery)
                  );
                }
            });
        }
        setResults(searchedDrugs);
        setIsLoading(false);
    }, [query, allDrugs, searchType, activeTab]);

    // สำหรับค้นหาด้วยหมวดหมู่
    const filteredResults = useMemo(() => {
        if (activeTab === 'category') {
            if (activeFilter === 'ทั้งหมด') {
                return allDrugs;
            }
            return allDrugs.filter(drug => drug.รูปแบบยา === activeFilter);
        }
        // สำหรับ tab อื่น return results ปกติ
        return results;
    }, [results, allDrugs, activeFilter, activeTab]);

    return (
        <div className="search-page">
            <header className="page-header">
                <h1 className="header-title">ค้นหายา</h1>
            </header>

            {/* Tab Bar */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: 8, margin: '16px 0' }}>
                <button
                    className={`search-type-btn${activeTab === 'name' ? ' active' : ''}`}
                    onClick={() => setActiveTab('name')}
                >ค้นหาด้วยชื่อ</button>
                <button
                    className={`search-type-btn${activeTab === 'category' ? ' active' : ''}`}
                    onClick={() => setActiveTab('category')}
                >ค้นหาด้วยหมวดหมู่</button>
                <button
                    className={`search-type-btn${activeTab === 'image' ? ' active' : ''}`}
                    onClick={() => setActiveTab('image')}
                >ค้นหาด้วยภาพ</button>
            </div>

            {/* Tab Content */}
            {activeTab === 'name' && (
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
                        >ทั้งหมด</button>
                        <button 
                            className={`search-type-btn ${searchType === 'generic' ? 'active' : ''}`}
                            onClick={() => setSearchType('generic')}
                        >ชื่อสามัญ</button>
                        <button 
                            className={`search-type-btn ${searchType === 'brand' ? 'active' : ''}`}
                            onClick={() => setSearchType('brand')}
                        >ชื่อการค้า</button>
                    </div>
                </div>
            )}

            {activeTab === 'category' && (
                <div className="filters-section">
                    <div className="filters filters-chips">
                        {filters.map(filter => (
                            <button
                                key={filter.form}
                                className={`filter-btn chip ${activeFilter === filter.form ? 'active' : ''}`}
                                onClick={() => setActiveFilter(filter.form)}
                            >
                                {filter.form}
                                <span className="filter-count">({filter.count})</span>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {activeTab === 'image' && (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '48px 0' }}>
                    <button
                        className="search-type-btn active"
                        style={{ fontSize: 18, padding: '18px 32px' }}
                        onClick={() => navigate('/scan')}
                    >
                        📷 สแกนฉลากยา/ค้นหาด้วยภาพ
                    </button>
                    <div style={{ color: '#868e96', marginTop: 16, fontSize: 14 }}>ใช้กล้องมือถือถ่ายฉลากยาเพื่อค้นหา</div>
                </div>
            )}

            {/* ผลลัพธ์ */}
            {(activeTab === 'name' || activeTab === 'category') && (
                <div className="results-section compact">
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
                        <div className="drugs-grid compact">
                            {filteredResults.map(drug => (
                                <DrugCard key={drug.ชื่อการค้า} drug={drug} onClick={() => navigate(`/drugs/${encodeURIComponent(drug.ชื่อการค้า)}`)} />
                            ))}
                        </div>
                    ) : (
                        <div className="no-results">
                            <p>ไม่พบข้อมูลยา</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default SearchPage; 