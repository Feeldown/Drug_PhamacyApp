import React from 'react';
import { Box, Container, Button } from '@mui/material';
import { Home, Search, Category, Camera, Help } from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

const navItems = [
  { icon: Home, label: 'หน้าแรก', path: '/' },
  { icon: Search, label: 'ค้นหา', path: '/search' },
  { icon: Camera, label: 'สแกน', path: '/scan' },
  { icon: Category, label: 'หมวดหมู่', path: '/categories' },
  { icon: Help, label: 'ช่วยเหลือ', path: '/help' },
];

const BottomNav: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Box
      component="nav"
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        background: 'rgba(255, 255, 255, 0.95)',
        borderTop: '1px solid',
        borderColor: 'divider',
        padding: '12px 0',
        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
        backdropFilter: 'blur(8px)',
        zIndex: 1000,
      }}
    >
      <Container 
        maxWidth="sm"
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 1,
        }}
      >
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <Button
              key={item.path}
              onClick={() => navigate(item.path)}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 0.5,
                minWidth: 64,
                flex: 1,
                color: isActive ? 'primary.main' : 'text.secondary',
                bgcolor: isActive ? 'primary.light' : 'transparent',
                '&:hover': {
                  bgcolor: isActive ? 'primary.light' : 'action.hover',
                },
                position: 'relative',
                '&::after': isActive ? {
                  content: '""',
                  position: 'absolute',
                  bottom: -12,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: 16,
                  height: 4,
                  bgcolor: 'primary.main',
                  borderRadius: 2,
                } : {},
              }}
            >
              <Icon sx={{ fontSize: 20, mb: 0.25 }} />
              <Box
                component="span"
                sx={{
                  fontSize: 11,
                  fontWeight: 500,
                  lineHeight: 1.2,
                  whiteSpace: 'nowrap',
                }}
              >
                {item.label}
              </Box>
            </Button>
          );
        })}
      </Container>
    </Box>
  );
};

export default BottomNav; 