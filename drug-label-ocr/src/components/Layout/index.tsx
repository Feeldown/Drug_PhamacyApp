import React from 'react';
import BottomNav from '../BottomNav';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="app-container">
      <main className="main-content">{children}</main>
      <BottomNav />
    </div>
  );
};

export default Layout; 