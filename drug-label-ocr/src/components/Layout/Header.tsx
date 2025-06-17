import React from 'react';
import { Box, Typography, Container } from '@mui/material';

interface HeaderProps {
  title?: string;
  subtitle?: string;
}

const Header: React.FC<HeaderProps> = ({ 
  title = 'MedSearch',
  subtitle = 'ค้นหาข้อมูลยา'
}) => {
  return (
    <Box 
      component="header" 
      sx={{
        padding: '40px 24px',
        background: 'white',
        borderBottom: '1px solid',
        borderColor: 'divider',
        position: 'relative',
        textAlign: 'center',
        '&::after': {
          content: '""',
          position: 'absolute',
          bottom: -1,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 60,
          height: 4,
          bgcolor: 'primary.main',
          borderRadius: 2,
        }
      }}
    >
      <Container maxWidth="sm">
        <Typography 
          variant="h1" 
          sx={{
            fontSize: 36,
            fontWeight: 700,
            color: 'primary.main',
            mb: 1,
            letterSpacing: '-0.5px',
          }}
        >
          {title}
        </Typography>
        <Typography 
          variant="subtitle1"
          sx={{
            fontSize: 16,
            color: 'text.secondary',
            fontWeight: 500,
          }}
        >
          {subtitle}
        </Typography>
      </Container>
    </Box>
  );
};

export default Header; 