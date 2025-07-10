import React from 'react';
import { colors } from '../theme/colors';
import { fonts } from '../theme/fonts';
import { spacing } from '../theme/spacing';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
}

const MinimalButton: React.FC<ButtonProps> = ({ children, variant = 'primary', ...props }) => {
  return (
    <button
      style={{
        padding: `${spacing.sm} ${spacing.lg}`,
        borderRadius: '16px',
        border: 'none',
        fontFamily: fonts.main,
        fontWeight: fonts.weight.bold,
        fontSize: fonts.size.base,
        background: variant === 'primary' ? colors.primary : colors.backgroundAlt,
        color: variant === 'primary' ? '#fff' : colors.primary,
        cursor: 'pointer',
        boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
        transition: 'background 0.18s, color 0.18s, transform 0.18s',
      }}
      {...props}
    >
      {children}
    </button>
  );
};

export default MinimalButton; 