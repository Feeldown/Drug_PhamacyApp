import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { searchDrugsEnhanced, getAllDrugs, DrugData, getUniqueDrugForms, DrugForm } from '../../api/drugData';
import './Search.css';
import SearchInput from './SearchInput';

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

const SUGGESTIONS = [
    'Paracetamol',
    'Amoxicillin',
    'Ibuprofen',
    'Cetirizine',
    'Omeprazole',
];

const SearchPage = () => {
    return <SearchInput />;
};

export default SearchPage;

export { default as SearchResult } from './SearchResult';