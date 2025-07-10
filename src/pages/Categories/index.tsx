import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getUniqueDrugForms, DrugForm } from '../../api/drugData';
import './Categories.css';

const CategoryCard = ({ form, count }: DrugForm) => {
    const getCategoryIcon = (form: string) => {
        if (form.includes('เม็ด')) return '💊';
        if (form.includes('น้ำ')) return '🧪';
        if (form.includes('ครีม')) return '🧴';
        if (form.includes('ผง')) return '📦';
        if (form.includes('ฉีด')) return '💉';
        return '💊';
    };

    return (
        <Link to={`/categories/${encodeURIComponent(form)}`} className="category-card">
            <div className="category-icon">{getCategoryIcon(form)}</div>
            <div className="category-info">
                <h3 className="category-title">{form}</h3>
                <p className="category-count">{count} รายการ</p>
            </div>
        </Link>
    );
};

const CategoriesPage = () => {
    const [categories, setCategories] = useState<DrugForm[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const forms = await getUniqueDrugForms();
                setCategories(forms);
            } catch (error) {
                console.error('Error fetching categories:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchCategories();
    }, []);

    return (
        <div className="categories-page">
            <header className="page-header">
                <h1 className="header-title">หมวดหมู่ยา</h1>
                <p className="header-subtitle">ค้นหายาตามรูปแบบยา</p>
            </header>

            <div className="categories-content">
                <section className="categories-section">
                    <h2 className="section-title">
                        <span className="title-bar" />
                        รูปแบบยา
                    </h2>

                    {isLoading ? (
                        <div className="loading-state">
                            <div className="loading-spinner" />
                            <p>กำลังโหลดข้อมูล...</p>
                        </div>
                    ) : (
                        <div className="categories-grid">
                            {categories.map(category => (
                                <CategoryCard
                                    key={category.form}
                                    form={category.form}
                                    count={category.count}
                                />
                            ))}
                        </div>
                    )}
                </section>

                <section className="categories-section">
                    <h2 className="section-title">
                        <span className="title-bar" />
                        วิธีการค้นหา
                    </h2>
                    <div className="search-methods">
                        <Link to="/search" className="search-method-card">
                            <span className="method-icon">🔍</span>
                            <div className="method-info">
                                <h3>ค้นหาด้วยชื่อ</h3>
                                <p>ค้นหาด้วยชื่อยา, สรรพคุณ หรือ อาการไม่พึงประสงค์</p>
                            </div>
                        </Link>
                        <Link to="/scan" className="search-method-card">
                            <span className="method-icon">📷</span>
                            <div className="method-info">
                                <h3>สแกนด้วยกล้อง</h3>
                                <p>ถ่ายภาพยาหรืออัปโหลดรูปภาพยา</p>
                            </div>
                        </Link>
                    </div>
                </section>
            </div>

            <div className="categories-footer">
                <Link to="/" className="back-button">
                    <span className="back-icon">←</span>
                    กลับหน้าหลัก
                </Link>
            </div>
        </div>
    );
};

export default CategoriesPage; 