import React from 'react';
import { NavLink } from 'react-router-dom';
import './BottomNav.css';

const navItems = [
    { path: '/', label: 'หน้าหลัก', icon: '🏠' },
    { path: '/search', label: 'ค้นหา', icon: '🔍' },
    { path: '/categories', label: 'หมวดหมู่', icon: '📁' },
    { path: '/help', label: 'ช่วยเหลือ', icon: '❔' }
];

const BottomNav = () => {
    return (
        <nav className="bottom-nav">
            <div className="nav-items">
                {navItems.map(item => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        end={item.path === '/'}
                        className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                    >
                        <span className="nav-icon">{item.icon}</span>
                        <span className="nav-label">{item.label}</span>
                    </NavLink>
                ))}
            </div>
        </nav>
    );
};

export default BottomNav; 