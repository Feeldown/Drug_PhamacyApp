import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Layout from './components/Layout';
import HomePage from './pages/Home';
import SearchPage from './pages/Search';
import ScanPage from './pages/Scan';
import CategoriesPage from './pages/Categories';
import CategoryResultPage from './pages/CategoryResult';
import HelpPage from './pages/Help';
import DrugDetailsPage from './pages/DrugDetails';

import './styles/global.css';

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/scan" element={<ScanPage />} />
          <Route path="/categories" element={<CategoriesPage />} />
          <Route path="/categories/:form" element={<CategoryResultPage />} />
          <Route path="/help" element={<HelpPage />} />
          <Route path="/drugs/:drugName" element={<DrugDetailsPage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
