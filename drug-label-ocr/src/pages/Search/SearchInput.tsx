import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllDrugs, DrugData } from '../../api/drugData';

const SearchInput = () => {
    const navigate = useNavigate();
    const [query, setQuery] = useState('');
    const [searchHistory, setSearchHistory] = useState<string[]>(() => {
        const saved = localStorage.getItem('searchHistory');
        return saved ? JSON.parse(saved) : [];
    });
    const [allDrugs, setAllDrugs] = useState<DrugData[]>([]);
    const [suggestedDrugs, setSuggestedDrugs] = useState<DrugData[]>([]);
    const [randomSuggestions, setRandomSuggestions] = useState<string[]>([]);

    useEffect(() => {
        window.scrollTo(0, 0);
        getAllDrugs().then(drugs => {
            setAllDrugs(drugs);
            // สุ่มชื่อการค้า 5 รายการ (หรือถ้าไม่มีชื่อการค้า ให้ใช้ชื่อสามัญ)
            const names = drugs.map(d => d.ชื่อการค้า || d.ชื่อสามัญ).filter(Boolean);
            const picked: string[] = [];
            const used = new Set();
            while (picked.length < 5 && used.size < names.length) {
                const idx = Math.floor(Math.random() * names.length);
                if (!used.has(idx)) {
                    picked.push(names[idx]);
                    used.add(idx);
                }
            }
            setRandomSuggestions(picked);
        });
    }, []);

    useEffect(() => {
        localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
    }, [searchHistory]);

    useEffect(() => {
        if (query.trim().length === 0) {
            setSuggestedDrugs([]);
            return;
        }
        const normalized = query.trim().toLowerCase();
        const filtered = allDrugs.filter(drug =>
            drug.ชื่อการค้า.toLowerCase().includes(normalized) ||
            drug.ชื่อสามัญ.toLowerCase().includes(normalized)
        ).slice(0, 5);
        setSuggestedDrugs(filtered);
    }, [query, allDrugs]);

    const handleSuggestionClick = (text: string) => {
        setQuery(text);
        navigate(`/search/result?query=${encodeURIComponent(text)}`);
    };
    const handleClearQuery = () => setQuery('');
    const handleBack = () => navigate(-1);
    const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && query.trim()) {
            setSearchHistory(prev => {
                const newHistory = [query, ...prev.filter(q => q !== query)].slice(0, 10);
                return newHistory;
            });
            navigate(`/search/result?query=${encodeURIComponent(query)}`);
        }
    };
    const handleSearchBtn = () => {
        if (query.trim()) {
            setSearchHistory(prev => {
                const newHistory = [query, ...prev.filter(q => q !== query)].slice(0, 10);
                return newHistory;
            });
            navigate(`/search/result?query=${encodeURIComponent(query)}`);
        }
    };

    return (
        <div className="search-page">
            <header className="page-header" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <button onClick={handleBack} style={{ fontSize: 24, background: 'none', border: 'none', cursor: 'pointer', marginRight: 8 }}>←</button>
                <h1 className="header-title" style={{ flex: 1 }}>ค้นหายา</h1>
            </header>
            <div className="search-section">
                <div className="search-bar" style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                    <span className="search-icon" style={{ position: 'absolute', left: 16, fontSize: 20, color: '#4263eb' }}>🔍</span>
                    <input
                        type="text"
                        className="search-input"
                        placeholder="ค้นหาชื่อยา, สรรพคุณ หรือ อาการไม่พึงประสงค์"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        style={{ paddingLeft: 40, paddingRight: 40 }}
                        onKeyDown={handleInputKeyDown}
                        autoComplete="off"
                    />
                    {query && (
                        <button onClick={handleClearQuery} style={{ position: 'absolute', right: 10, background: 'none', border: 'none', fontSize: 18, cursor: 'pointer', color: '#888' }}>✕</button>
                    )}
                    {/* <button onClick={handleSearchBtn} style={{ marginLeft: 8, padding: '8px 16px', borderRadius: 20, border: 'none', background: '#4263eb', color: 'white', fontWeight: 500, cursor: 'pointer' }}>ค้นหา</button> */}
                    {suggestedDrugs.length > 0 && (
                        <ul style={{
                            position: 'absolute',
                            top: '100%',
                            left: 0,
                            right: 0,
                            background: 'white',
                            border: '1px solid #e0e0e0',
                            borderRadius: 12,
                            margin: 0,
                            padding: 0,
                            zIndex: 10,
                            boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
                        }}>
                            {suggestedDrugs.map((drug, idx) => (
                                <li key={drug.ชื่อการค้า + idx} style={{ listStyle: 'none', borderBottom: idx < suggestedDrugs.length-1 ? '1px solid #f0f0f0' : 'none' }}>
                                    <button
                                        onClick={() => handleSuggestionClick(drug.ชื่อการค้า)}
                                        style={{
                                            width: '100%',
                                            background: 'none',
                                            border: 'none',
                                            textAlign: 'left',
                                            padding: '12px 16px',
                                            fontSize: 15,
                                            cursor: 'pointer',
                                            color: '#212529'
                                        }}
                                    >
                                        <span style={{ color: '#4263eb', marginRight: 8 }}>🔍</span>
                                        <span>{drug.ชื่อการค้า}</span>
                                        <span style={{ color: '#888', marginLeft: 8, fontSize: 13 }}>{drug.ชื่อสามัญ}</span>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
                <div style={{ margin: '16px 0' }}>
                    {searchHistory.length > 0 && (
                        <div style={{ marginBottom: 8 }}>
                            <div style={{ fontWeight: 600, marginBottom: 4 }}>ประวัติการค้นหา</div>
                            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                                {searchHistory.map((item, idx) => (
                                    <li key={item+idx}>
                                        <button onClick={() => handleSuggestionClick(item)} style={{ background: 'none', border: 'none', color: '#4263eb', cursor: 'pointer', padding: '4px 0', fontSize: 15, textAlign: 'left' }}>{item}</button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                    <div style={{ fontWeight: 600, marginBottom: 4 }}>แนะนำให้ค้นหา</div>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                        {randomSuggestions.map((item, idx) => (
                            <li key={item+idx}>
                                <button onClick={() => handleSuggestionClick(item)} style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer', padding: '4px 0', fontSize: 15, textAlign: 'left' }}>{item}</button>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default SearchInput; 