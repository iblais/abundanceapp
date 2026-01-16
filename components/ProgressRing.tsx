/**
 * ProgressRing Component - Circular progress indicator
 * Gradient from muted gold to soft lavender
 */

import React from 'react';
import styles from '../styles/components.module.css';

interface ProgressRingProps {
  progress: number;
  size?: number;
  strokeWidth?: number;
  children?: React.ReactNode;
  showGlow?: boolean;
}

export const ProgressRing: React.FC<ProgressRingProps> = ({
  progress,
  size = 220,
  strokeWidth = 14,
  children,
  showGlow = true,
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className={styles.progressRing} style={{ width: size, height: size }}>
      <svg width={size} height={size}>
        <defs>
          {/* Gradient from muted gold to soft lavender */}
          <linearGradient id="ringGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#C9A961" />
            <stop offset="50%" stopColor="#E8E0FF" />
            <stop offset="100%" stopColor="#9382FF" />
          </linearGradient>
          {showGlow && (
            <filter id="ringGlow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          )}
        </defs>
        {/* Background track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(255,255,255,0.08)"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        {/* Progress arc */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="url(#ringGradient)"
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          filter={showGlow ? "url(#ringGlow)" : undefined}
          style={{
            transform: 'rotate(-90deg)',
            transformOrigin: '50% 50%',
            transition: 'stroke-dashoffset 1s ease-out',
          }}
        />
      </svg>
      <div className={styles.progressContent}>
        {children}
      </div>
    </div>
  );
};

export default ProgressRing;
