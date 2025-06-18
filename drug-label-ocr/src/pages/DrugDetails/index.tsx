import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getDrugByName, DrugData, getSimilarDrugs } from '../../api/drugData';
import './DrugDetails.css';

const InfoCard = ({ title, icon, content, type = '' }: { title: string, icon: string, content: string | string[], type?: string }) => {
    if (!content || (Array.isArray(content) && content.length === 0)) return null;

    const createMarkup = (text: string) => {
        return { __html: text.replace(/\n/g, '<br />') };
    };

    const renderContent = () => {
        if (Array.isArray(content)) {
            return (
                <ul className="info-list">
                    {content.map((item, index) => (
                        <li key={index} dangerouslySetInnerHTML={createMarkup(item)} />
                    ))}
                </ul>
            );
        }
        return <div className="info-content" dangerouslySetInnerHTML={createMarkup(content)} />;
    };

    return (
        <div className={`info-card ${type}`}>
            <h3 className="info-title">
                <span className="info-icon">{icon}</span>
                {title}
            </h3>
            {renderContent()}
        </div>
    );
};

const DrugCard = ({ drug, onClick }: { drug: DrugData, onClick: () => void }) => {
    const drugIcon = drug.รูปแบบยา.includes('เม็ด') ? '💊' : drug.รูปแบบยา.includes('น้ำ') ? '🧪' : '🩹';
    
    return (
        <div className="drug-card" onClick={onClick}>
            <div className="drug-card-image">{drugIcon}</div>
            <div className="drug-card-info">
                <h4>{drug.ชื่อการค้า}</h4>
                <p>{drug.ชื่อสามัญ}</p>
                <span className="drug-card-form">{drug.รูปแบบยา}</span>
            </div>
        </div>
    );
};

const DrugDetailsPage = () => {
    const { drugName } = useParams<{ drugName: string }>();
    const navigate = useNavigate();
    const [drug, setDrug] = useState<DrugData | null>(null);
    const [loading, setLoading] = useState(true);
    const [similarDrugs, setSimilarDrugs] = useState<DrugData[]>([]);
    const [recentlyViewed, setRecentlyViewed] = useState<DrugData[]>([]);

    useEffect(() => {
        const fetchDrug = async () => {
            if (drugName) {
                try {
                    const decodedName = decodeURIComponent(drugName);
                    const foundDrug = await getDrugByName(decodedName);
                    if (foundDrug) {
                        setDrug(foundDrug);
                        // Get similar drugs
                        const similar = getSimilarDrugs(foundDrug);
                        setSimilarDrugs(similar);
                        
                        // Update recently viewed
                        const recent = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
                        const updatedRecent = [
                            foundDrug,
                            ...recent.filter((d: DrugData) => d.ชื่อการค้า !== foundDrug.ชื่อการค้า)
                        ].slice(0, 5);
                        localStorage.setItem('recentlyViewed', JSON.stringify(updatedRecent));
                        setRecentlyViewed(updatedRecent);
                    } else {
                        setDrug(null);
                    }
                } catch (error) {
                    console.error("Error fetching drug details:", error);
                    setDrug(null);
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchDrug();
    }, [drugName]);

    if (loading) {
        return <div className="drug-details-page"><p>กำลังโหลด...</p></div>;
    }

    if (!drug) {
        return (
            <div className="drug-details-page">
                 <header className="header">
                    <button onClick={() => navigate(-1)} className="back-btn">←</button>
                    <h1 className="drug-title">ไม่พบข้อมูลยา</h1>
                </header>
                <p style={{textAlign: 'center', padding: '20px'}}>ขออภัย ไม่พบข้อมูลยาที่คุณค้นหา</p>
            </div>
        );
    }

    const drugIcon = drug.รูปแบบยา.includes('เม็ด') ? '💊' : drug.รูปแบบยา.includes('น้ำ') ? '🧪' : '🩹';

    return (
        <div className="drug-details-page">
            <header className="header">
                <button onClick={() => navigate(-1)} className="back-btn">←</button>
                <h1 className="drug-title">{drug.ชื่อการค้า}</h1>
                <p className="drug-subtitle">{drug.ชื่อสามัญ}</p>
            </header>

            <section className="drug-image-section">
                <div className="drug-image-placeholder">{drugIcon}</div>
            </section>

            <div className="drug-info">
                <section className="info-section">
                    <h2 className="section-title">ข้อมูลพื้นฐาน</h2>
                    <InfoCard
                        title="ข้อมูลทั่วไป"
                        icon="💊"
                        content={[`ชื่อสามัญ: ${drug.ชื่อสามัญ}`, `ชื่อการค้า: ${drug.ชื่อการค้า}`, `รูปแบบยา: ${drug.รูปแบบยา}`]}
                    />
                </section>

                <section className="info-section">
                    <h2 className="section-title">ข้อมูลการใช้ยา</h2>
                     <InfoCard
                        title="ยานี้ใช้สำหรับ"
                        icon="🎯"
                        content={drug['ยานี้ใช้สำหรับ']}
                        type="success"
                    />
                    <InfoCard
                        title="วิธีการใช้ยา"
                        icon="💉"
                        content={drug['วิธีการใช้ยา']}
                    />
                </section>

                 <section className="info-section">
                    <h2 className="section-title">ข้อควรระวังและอาการไม่พึงประสงค์</h2>
                     <InfoCard
                        title="สิ่งที่ควรแจ้งให้แพทย์หรือเภสัชกรทราบ"
                        icon="⚠️"
                        content={drug['สิ่งที่ควรแจ้งให้แพทย์หรือเภสัชกรทราบ']}
                        type="warning"
                    />
                     <InfoCard
                        title="อาการไม่พึงประสงค์ทั่วไป"
                        icon="ℹ️"
                        content={drug['อาการไม่พึงประสงค์ทั่วไป']}
                    />
                     <InfoCard
                        title="อาการที่ต้องแจ้งแพทย์ทันที"
                        icon="❗"
                        content={drug['อาการไม่พึงประสงค์ที่ต้องแจ้งแพทย์หรือเภสัชกรทันที']}
                        type="warning"
                    />
                </section>

                 <section className="info-section">
                    <h2 className="section-title">การจัดการยา</h2>
                    <InfoCard
                        title="ทำอย่างไรหากลืมรับประทานยา"
                        icon="⏰"
                        content={drug['ทำอย่างไรหากลืมรับประทานยาหรือใช้ยา']}
                    />
                     <InfoCard
                        title="การเก็บรักษายา"
                        icon="🏥"
                        content={drug['การเก็บรักษายา']}
                    />
                </section>
            </div>

            {similarDrugs.length > 0 && (
                <section className="similar-drugs-section">
                    <h2 className="section-title">ยาที่คล้ายกัน</h2>
                    <div className="similar-drugs-grid">
                        {similarDrugs.map(similarDrug => (
                            <DrugCard
                                key={similarDrug.ชื่อการค้า}
                                drug={similarDrug}
                                onClick={() => navigate(`/drugs/${encodeURIComponent(similarDrug.ชื่อการค้า)}`)}
                            />
                        ))}
                    </div>
                </section>
            )}

            {recentlyViewed.length > 0 && (
                <section className="recently-viewed-section">
                    <h2 className="section-title">ยาเพิ่งดูล่าสุด</h2>
                    <div className="recently-viewed-grid">
                        {recentlyViewed.map(recentDrug => (
                            <DrugCard
                                key={recentDrug.ชื่อการค้า}
                                drug={recentDrug}
                                onClick={() => navigate(`/drugs/${encodeURIComponent(recentDrug.ชื่อการค้า)}`)}
                            />
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
};

export default DrugDetailsPage; 