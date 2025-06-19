import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getUniqueDrugForms, DrugForm } from '../../api/drugData';
import './Home.css';

const navItems = [
  { to: '/', label: 'หน้าหลัก', icon: '🏠', active: true },
  { to: '/search', label: 'ค้นหา', icon: '🔍' },
  { to: '/categories', label: 'หมวดหมู่', icon: '📁' },
  { to: '/help', label: 'ช่วยเหลือ', icon: '❔' },
];

const getFormIcon = (form: string) => {
  if (form.includes('เม็ด')) return '💊';
  if (form.includes('น้ำ')) return '🧪';
  if (form.includes('ครีม') || form.includes('ขี้ผึ้ง')) return '🧴';
  if (form.includes('ฉีด')) return '💉';
  return '💊';
};

const HomePage: React.FC = () => {
  const [drugForms, setDrugForms] = useState<DrugForm[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchForms = async () => {
      try {
        const forms = await getUniqueDrugForms();
        setDrugForms(forms.slice(0, 6)); // Show top 6 forms
      } catch (error) {
        console.error("Failed to fetch drug forms:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchForms();
  }, []);

  return (
    <div className="home-page">
      {/* Header */}
      <header className="home-header">
        <h1 className="app-title">MedSearch</h1>
        <p className="app-subtitle">ค้นหาข้อมูลยาได้ง่ายๆ</p>
        <div className="header-underline" />
      </header>

      {/* Search Section */}
      <section className="search-section">
        <h2 className="section-title">ค้นหายาของคุณ</h2>
        <p className="section-subtitle">เลือกวิธีค้นหาที่สะดวกสำหรับคุณ</p>
        <div className="search-methods">
          <Link to="/search" className="search-method-card">
            <span className="method-icon">🔍</span>
            <div className="method-info">
              <h3>ค้นหาด้วยข้อความ</h3>
              <p>พิมพ์ชื่อยาหรือสรรพคุณที่ต้องการ</p>
            </div>
          </Link>
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
      </section>

      {/* Categories */}
      <section className="categories-section">
        <h2 className="section-title">
          <span className="title-bar" />
          หมวดหมู่ยอดนิยม
        </h2>
        {loading ? (
          <div className="loading-state">
            <div className="loading-spinner" />
            <p>กำลังโหลดหมวดหมู่...</p>
          </div>
        ) : (
          <div className="categories-grid">
            {drugForms.map(form => (
              <Link
                key={form.form}
                to={`/categories/${encodeURIComponent(form.form)}`}
                className="category-card"
              >
                <span className="category-icon">{getFormIcon(form.form)}</span>
                <h3 className="category-name">{form.form}</h3>
                <span className="category-count">{form.count} รายการ</span>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Bottom Navigation */}
      <nav className="bottom-nav">
        <div className="nav-items">
          {navItems.map(item => (
            <Link
              key={item.label}
              to={item.to}
              className={`nav-item ${item.active ? 'active' : ''}`}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
              {item.active && <span className="nav-active-bar" />}
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
};

export default HomePage; 