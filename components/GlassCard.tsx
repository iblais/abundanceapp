/**
 * GlassCard Component - Glassmorphic card with premium styling
 */

import React from 'react';
import styles from '../styles/components.module.css';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  variant?: 'default' | 'elevated' | 'gold';
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className = '',
  onClick,
  variant = 'default',
}) => {
  const variantClass = variant === 'elevated'
    ? styles.glassCardElevated
    : variant === 'gold'
    ? styles.glassCardGold
    : '';

  return (
    <div
      className={`${styles.glassCard} ${variantClass} ${className}`}
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      {children}
    </div>
  );
};

export default GlassCard;
