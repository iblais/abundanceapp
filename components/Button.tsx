/**
 * Button Component - Premium styled buttons
 */

import React from 'react';
import styles from '../styles/components.module.css';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  fullWidth?: boolean;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

export const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  fullWidth = false,
  disabled = false,
  type = 'button',
}) => {
  const variantClass =
    variant === 'primary' ? styles.buttonPrimary :
    variant === 'secondary' ? styles.buttonSecondary :
    styles.buttonGhost;

  return (
    <button
      type={type}
      className={`${styles.button} ${variantClass} ${fullWidth ? styles.buttonFullWidth : ''}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;
