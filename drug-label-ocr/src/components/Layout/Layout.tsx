import React from 'react';
import { Box, Container } from '@mui/material';
import Header from './Header';
import BottomNav from '../Navigation/BottomNav';

interface LayoutProps {
  children: React.ReactNode;
  hideHeader?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, hideHeader = false }) => {
  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      minHeight: '100vh',
      bgcolor: 'background.default',
    }}>
      {!hideHeader && <Header />}
      <Container 
        component="main" 
        maxWidth="sm"
        sx={{ 
          flex: 1,
          bgcolor: 'background.paper',
          boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
          pb: 'calc(80px + env(safe-area-inset-bottom, 20px))',
          px: 0,
        }}
      >
        {children}
      </Container>
      <BottomNav />
    </Box>
  );
};

export default Layout; 