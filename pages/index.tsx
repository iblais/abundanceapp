/**
 * Abundance Recode - Main App Page
 * Premium visual design matching reference screens
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/router';
import styles from '../styles/Home.module.css';
import paywallStyles from '../styles/Paywall.module.css';
import { journalService, chatService, getAnonymousUserId, JournalEntry } from '../lib/supabase';
import { aiMentorService } from '../lib/ai-mentor';
import { revenueCatService, PLANS, PREMIUM_FEATURES, SubscriptionStatus } from '../lib/revenuecat';
import { CRYSTALS, Crystal } from '../components/AbundanceComponents';
import { GeodeCracker } from '../components/GeodeCracker';
import { UserProgress, DEFAULT_USER_PROGRESS, MAX_CRACK_LEVEL, TOTAL_GEODES } from '../src/types/journey';

// Types
type Screen = 'welcome' | 'arrival' | 'onboarding' | 'rhythm' | 'dashboard' | 'meditations' | 'journal' | 'progress' | 'mentor' | 'settings' | 'profile' | 'player' | 'board' | 'gratitude' | 'quickshifts' | 'breathing' | 'learn' | 'article' | 'visualizations' | 'visualizationPlayer' | 'emotionalReset' | 'soundscapes' | 'audiobooks' | 'paywall' | 'pricing' | 'reminders' | 'notifications' | 'energyMode' | 'voiceSelector';

interface UserState {
  onboardingComplete: boolean;
  displayName: string;
  isPremium: boolean;
  subscriptionPlan: 'monthly' | 'annual' | null;
  subscriptionExpiresAt: string | null;
  voicePreference: 'masculine' | 'feminine' | 'neutral';
  morningTime: string;
  eveningTime: string;
  alignmentScore: number;
  streak: number;
}

// Swirl Logo Component - matches reference design
const Logo: React.FC<{ size?: number }> = ({ size = 100 }) => (
  <div className={styles.logoWrapper}>
    <svg width={size} height={size} viewBox="0 0 100 100" className={styles.logo}>
      <defs>
        <linearGradient id="swirlGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="1" />
          <stop offset="100%" stopColor="#D4AF37" stopOpacity="0.9" />
        </linearGradient>
        <filter id="logoGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>
      <g filter="url(#logoGlow)">
        {/* Top swirl */}
        <path
          d="M50 15 C70 15, 85 30, 85 50 C85 60, 75 70, 60 65 C45 60, 45 45, 55 40 C65 35, 75 45, 70 55"
          stroke="url(#swirlGradient)"
          strokeWidth="5"
          fill="none"
          strokeLinecap="round"
        />
        {/* Bottom swirl */}
        <path
          d="M50 85 C30 85, 15 70, 15 50 C15 40, 25 30, 40 35 C55 40, 55 55, 45 60 C35 65, 25 55, 30 45"
          stroke="url(#swirlGradient)"
          strokeWidth="5"
          fill="none"
          strokeLinecap="round"
        />
      </g>
    </svg>
  </div>
);

// Progress Ring Component (Alignment Gauge)
const ProgressRing: React.FC<{ progress: number; size?: number; strokeWidth?: number; children?: React.ReactNode }> = ({
  progress,
  size = 200,
  strokeWidth = 12,
  children
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className={styles.progressRing} style={{ width: size, height: size }}>
      <svg width={size} height={size}>
        <defs>
          <linearGradient id="ringGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#D4AF37" />
            <stop offset="50%" stopColor="#E8C84A" />
            <stop offset="100%" stopColor="rgba(212, 175, 55, 0.3)" />
          </linearGradient>
          <filter id="ringGlow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(255,255,255,0.08)"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
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
          filter="url(#ringGlow)"
          style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%', transition: 'stroke-dashoffset 1s ease-out' }}
        />
      </svg>
      <div className={styles.progressContent}>
        {children}
      </div>
    </div>
  );
};

// Glass Card Component with tactile effects
const GlassCard: React.FC<{
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  variant?: 'default' | 'elevated';
}> = ({ children, className = '', onClick, variant = 'default' }) => {
  const handleClick = () => {
    if (onClick) {
      // Light haptic on card tap
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate(5);
      }
      onClick();
    }
  };

  return (
    <div
      className={`${styles.glassCard} ${variant === 'elevated' ? styles.glassCardElevated : ''} ${onClick ? styles.tactileCard : ''} ${className}`}
      onClick={handleClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      {children}
    </div>
  );
};

// Button Component with haptic feedback
const Button: React.FC<{
  children: React.ReactNode;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  fullWidth?: boolean;
  disabled?: boolean;
}> = ({ children, onClick, variant = 'primary', fullWidth = false, disabled = false }) => {
  const handleClick = () => {
    if (!disabled) {
      // Haptic feedback on tap
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate(variant === 'primary' ? 15 : 8);
      }
      onClick();
    }
  };

  return (
    <button
      className={`${styles.button} ${styles[`button${variant.charAt(0).toUpperCase() + variant.slice(1)}`]} ${fullWidth ? styles.buttonFullWidth : ''} ${styles.tactileButton}`}
      onClick={handleClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

// Icon Components
const Icons = {
  home: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  ),
  plus: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  ),
  grid: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  ),
  profile: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="4" />
      <path d="M20 21a8 8 0 10-16 0" />
    </svg>
  ),
  sparkle: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2l2.09 6.26L20 10l-5.91 1.74L12 18l-2.09-6.26L4 10l5.91-1.74L12 2z" />
    </svg>
  ),
  heart: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
    </svg>
  ),
  chart: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  ),
  play: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <polygon points="5,3 19,12 5,21" fill="currentColor" />
    </svg>
  ),
  playOutline: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="6,4 20,12 6,20" />
    </svg>
  ),
  pause: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <rect x="6" y="4" width="4" height="16" rx="1" />
      <rect x="14" y="4" width="4" height="16" rx="1" />
    </svg>
  ),
  chevronRight: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 5l7 7-7 7" />
    </svg>
  ),
  close: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 18L18 6M6 6l12 12" />
    </svg>
  ),
  check: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  warning: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  ),
  back: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 19l-7-7 7-7" />
    </svg>
  ),
  sun: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32l1.41 1.41M2 12h2m16 0h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
    </svg>
  ),
  moon: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
    </svg>
  ),
  send: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
    </svg>
  ),
  settings: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  ),
  user: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="4" />
      <path d="M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" />
    </svg>
  ),
  bell: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  ),
  mic: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
      <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
      <line x1="12" y1="19" x2="12" y2="23" />
      <line x1="8" y1="23" x2="16" y2="23" />
    </svg>
  ),
  palette: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="13.5" cy="6.5" r="0.5" fill="currentColor" />
      <circle cx="17.5" cy="10.5" r="0.5" fill="currentColor" />
      <circle cx="8.5" cy="7.5" r="0.5" fill="currentColor" />
      <circle cx="6.5" cy="12.5" r="0.5" fill="currentColor" />
      <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.555C21.965 6.012 17.461 2 12 2z" />
    </svg>
  ),
  shield: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  ),
  chat: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    </svg>
  ),
  mentorChat: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      <path d="M12 7l1.2 3.7h3.8l-3 2.3 1.15 3.5L12 14.2l-3.15 2.3 1.15-3.5-3-2.3h3.8z" fill="currentColor" strokeWidth="0"/>
    </svg>
  ),
  meditation: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="3" />
      <path d="M12 11v2m-4 7c0-4 2-6 4-6s4 2 4 6" />
    </svg>
  ),
  journal: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
  ),
  streak: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c-1.5-2-1.5-6-1.5-6s3.5 2 6 2c2.5 0 4.9-1.4 5.9-3.9C21 6 21 12 17.657 18.657z" />
    </svg>
  ),
  book: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </svg>
  ),
  eye: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ),
  music: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 18V5l12-2v13" />
      <circle cx="6" cy="18" r="3" />
      <circle cx="18" cy="16" r="3" />
    </svg>
  ),
  headphones: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
      <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
    </svg>
  ),
  volume: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
    </svg>
  ),
  clock: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  ),
  crown: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 4l3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14" />
    </svg>
  ),
  lock: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  ),
  externalLink: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  ),
};

// ==== Haptic Feedback Utility ====
const triggerHaptic = (pattern: 'light' | 'medium' | 'heavy' | 'success' | 'error' = 'light') => {
  if (typeof navigator !== 'undefined' && navigator.vibrate) {
    const patterns: Record<string, number | number[]> = {
      light: 5,
      medium: 15,
      heavy: 30,
      success: [15, 50, 15],
      error: [50, 30, 50, 30, 50]
    };
    navigator.vibrate(patterns[pattern]);
  }
};

// ==== Cinematic Splash Screen ====
const SplashScreen: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [isDissolving, setIsDissolving] = useState(false);
  const [particles] = useState(() =>
    Array.from({ length: 20 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 3,
      duration: 3 + Math.random() * 2
    }))
  );

  useEffect(() => {
    // Start dissolve after logo animation completes
    const dissolveTimer = setTimeout(() => {
      setIsDissolving(true);
      triggerHaptic('success');
    }, 2500);

    // Complete transition
    const completeTimer = setTimeout(() => {
      onComplete();
    }, 3700);

    return () => {
      clearTimeout(dissolveTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <div className={`${styles.splashScreen} ${isDissolving ? styles.splashDissolving : ''}`}>
      {/* Floating particles */}
      <div className={styles.splashParticles}>
        {particles.map((p) => (
          <div
            key={p.id}
            className={styles.splashParticle}
            style={{
              left: `${p.left}%`,
              animationDelay: `${p.delay}s`,
              animationDuration: `${p.duration}s`
            }}
          />
        ))}
      </div>

      {/* Logo with 3D reveal */}
      <div className={styles.splashLogo}>
        <div className={styles.splashLogoInner}>
          <svg width="60" height="60" viewBox="0 0 100 100">
            <defs>
              <linearGradient id="splashGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="100%" stopColor="#D4AF37" />
              </linearGradient>
            </defs>
            <g>
              <path
                d="M50 15 C70 15, 85 30, 85 50 C85 60, 75 70, 60 65 C45 60, 45 45, 55 40 C65 35, 75 45, 70 55"
                stroke="url(#splashGradient)"
                strokeWidth="5"
                fill="none"
                strokeLinecap="round"
              />
              <path
                d="M50 85 C30 85, 15 70, 15 50 C15 40, 25 30, 40 35 C55 40, 55 55, 45 60 C35 65, 25 55, 30 45"
                stroke="url(#splashGradient)"
                strokeWidth="5"
                fill="none"
                strokeLinecap="round"
              />
            </g>
          </svg>
        </div>
      </div>

      <h1 className={styles.splashTitle}>Abundance</h1>
      <p className={styles.splashSubtitle}>Recode Your Reality</p>
    </div>
  );
};

// ==== Daily Geode (Crystal Reveal Check-in) ====
const dailyAffirmations = [
  "I am worthy of abundance in all forms",
  "Today, I choose to see opportunities everywhere",
  "I am aligned with the energy of prosperity",
  "My potential is limitless",
  "I attract success effortlessly",
  "I am grateful for all that flows to me",
  "I release all resistance to receiving",
  "My thoughts create my reality",
  "I am becoming more abundant every day",
  "The universe supports my highest good"
];

const DailyGeode: React.FC<{ onCheckIn: (affirmation: string, points: number) => void }> = ({ onCheckIn }) => {
  const [tapCount, setTapCount] = useState(0);
  const [isRevealed, setIsRevealed] = useState(false);
  const [showParticles, setShowParticles] = useState(false);
  const [affirmation, setAffirmation] = useState('');
  const [hasCheckedIn, setHasCheckedIn] = useState(false);

  // Check if already checked in today
  useEffect(() => {
    const today = new Date().toDateString();
    const lastCheckIn = localStorage.getItem('lastGeodeCheckIn');
    if (lastCheckIn === today) {
      setHasCheckedIn(true);
      const savedAffirmation = localStorage.getItem('todayAffirmation') || dailyAffirmations[0];
      setAffirmation(savedAffirmation);
      setIsRevealed(true);
      setTapCount(3);
    }
  }, []);

  const handleTap = () => {
    if (isRevealed || hasCheckedIn) return;

    triggerHaptic(tapCount < 2 ? 'medium' : 'heavy');

    const newTapCount = tapCount + 1;
    setTapCount(newTapCount);

    if (newTapCount >= 3) {
      // Reveal the crystal!
      setShowParticles(true);
      triggerHaptic('success');

      setTimeout(() => {
        setIsRevealed(true);
        setShowParticles(false);

        // Pick random affirmation
        const randomAffirmation = dailyAffirmations[Math.floor(Math.random() * dailyAffirmations.length)];
        setAffirmation(randomAffirmation);

        // Save check-in
        const today = new Date().toDateString();
        localStorage.setItem('lastGeodeCheckIn', today);
        localStorage.setItem('todayAffirmation', randomAffirmation);
        setHasCheckedIn(true);

        // Award points
        onCheckIn(randomAffirmation, 25);
      }, 600);
    }
  };

  // Generate particle positions for explosion
  const particles = Array.from({ length: 12 }, (_, i) => {
    const angle = (i / 12) * Math.PI * 2;
    const distance = 80 + Math.random() * 40;
    return {
      id: i,
      tx: Math.cos(angle) * distance,
      ty: Math.sin(angle) * distance,
      delay: Math.random() * 0.2
    };
  });

  return (
    <div className={styles.geodeContainer}>
      <div className={styles.geodeTitle}>
        {hasCheckedIn ? "Today's Crystal" : "Daily Check-In"}
      </div>

      <div className={styles.geodeWrapper} onClick={handleTap}>
        {/* The rock */}
        {!isRevealed && (
          <div className={styles.geodeRock}>
            {/* Crack overlays */}
            <div className={`${styles.geodeCrack} ${styles.geodeCrack1} ${tapCount >= 1 ? styles.geodeCrackVisible : ''}`}>
              <svg viewBox="0 0 140 140">
                <path
                  d="M70 20 L75 50 L65 55 L70 70"
                  stroke="rgba(212, 175, 55, 0.6)"
                  strokeWidth="2"
                  fill="none"
                />
              </svg>
            </div>
            <div className={`${styles.geodeCrack} ${styles.geodeCrack2} ${tapCount >= 2 ? styles.geodeCrackVisible : ''}`}>
              <svg viewBox="0 0 140 140">
                <path
                  d="M70 20 L75 50 L65 55 L70 70 M55 40 L70 55 L85 45 M60 75 L70 70 L80 80"
                  stroke="rgba(212, 175, 55, 0.8)"
                  strokeWidth="2"
                  fill="none"
                />
              </svg>
            </div>

            {/* Glow through cracks */}
            <div className={`${styles.geodeGlow} ${tapCount >= 1 ? styles.geodeGlow1 : ''} ${tapCount >= 2 ? styles.geodeGlow2 : ''}`} />
          </div>
        )}

        {/* Explosion particles */}
        {showParticles && (
          <div className={styles.geodeParticles}>
            {particles.map((p) => (
              <div
                key={p.id}
                className={`${styles.geodeParticle} ${styles.geodeParticleExplode}`}
                style={{
                  '--tx': `${p.tx}px`,
                  '--ty': `${p.ty}px`,
                  animationDelay: `${p.delay}s`
                } as React.CSSProperties}
              />
            ))}
          </div>
        )}

        {/* Revealed crystal */}
        <div className={`${styles.geodeCrystal} ${isRevealed ? styles.geodeCrystalRevealed : ''}`}>
          <div className={styles.crystalShape}>
            <div className={styles.crystalInner} />
          </div>
        </div>
      </div>

      {/* Affirmation message */}
      <div className={`${styles.geodeMessage} ${isRevealed ? styles.geodeMessageVisible : ''}`}>
        {isRevealed && (
          <>
            <div className={styles.geodeAffirmation}>"{affirmation}"</div>
            {!hasCheckedIn && <div className={styles.geodePoints}>+25 Alignment Points</div>}
          </>
        )}
      </div>

      {/* Tap hint */}
      {!isRevealed && !hasCheckedIn && (
        <div className={styles.geodeTapHint}>
          Tap {3 - tapCount} more time{3 - tapCount !== 1 ? 's' : ''} to reveal
        </div>
      )}
    </div>
  );
};

// ==== Crystal Carousel (Compact Horizontal Selector) ====
const CrystalCarousel: React.FC<{
  onSelect?: (crystal: Crystal) => void;
  selectedId?: string;
}> = ({ onSelect, selectedId }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const handleScroll = () => {
    if (containerRef.current) {
      const scrollLeft = containerRef.current.scrollLeft;
      const itemWidth = 72; // w-16 (64px) + gap
      const index = Math.round(scrollLeft / itemWidth);
      setActiveIndex(Math.min(Math.max(index, 0), CRYSTALS.length - 1));
    }
  };

  const handleSelect = (crystal: Crystal, index: number) => {
    if (onSelect) onSelect(crystal);
    if (containerRef.current) {
      const itemWidth = 72;
      containerRef.current.scrollTo({
        left: index * itemWidth,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className={styles.crystalCarouselContainer}>
      <div className={styles.crystalCarouselHeader}>
        <span className={styles.crystalCarouselTitle}>Today's Focus</span>
      </div>
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className={styles.crystalCarouselScroll}
      >
        {CRYSTALS.map((crystal, index) => {
          const isActive = index === activeIndex || crystal.id === selectedId;
          return (
            <div
              key={crystal.id}
              onClick={() => handleSelect(crystal, index)}
              className={`${styles.crystalCarouselItem} ${isActive ? styles.crystalCarouselItemActive : ''}`}
            >
              <img
                src={crystal.image}
                alt={crystal.name}
                className={styles.crystalCarouselImage}
              />
              {isActive && (
                <span className={styles.crystalCarouselName}>{crystal.name}</span>
              )}
            </div>
          );
        })}
      </div>
      {/* Active crystal meaning */}
      <div className={styles.crystalCarouselMeaning}>
        {CRYSTALS[activeIndex].meaning}
      </div>
    </div>
  );
};

// Tab Bar Component - matches reference with 5 icons
const TabBar: React.FC<{ activeTab: string; onTabChange: (tab: Screen) => void }> = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'dashboard', icon: Icons.home, label: 'Home' },
    { id: 'meditations', icon: Icons.grid, label: 'Library' },
    { id: 'journal', icon: Icons.journal, label: 'Journal' },
    { id: 'progress', icon: Icons.chart, label: 'Analytics' },
    { id: 'profile', icon: Icons.profile, label: 'Profile' },
  ];

  return (
    <nav className={styles.tabBar}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={`${styles.tabItem} ${activeTab === tab.id ? styles.tabItemActive : ''}`}
          onClick={() => onTabChange(tab.id as Screen)}
        >
          <span className={styles.tabIcon}>{tab.icon}</span>
        </button>
      ))}
    </nav>
  );
};

// Welcome Screen - Landing Page with clear value communication
const WelcomeScreen: React.FC<{ onBegin: () => void }> = ({ onBegin }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className={`${styles.landingPage} ${visible ? styles.fadeIn : ''}`}>
      {/* Hero Section - Above the Fold */}
      <section className={styles.heroSection}>
        <div className={styles.heroContent}>
          <Logo size={80} />
          <h1 className={styles.heroTitle}>Abundance Recode</h1>
          <p className={styles.heroTagline}>Shift your state. Reshape your reality.</p>
          <p className={styles.heroValue}>
            Daily guided practices to help you embody abundance, calm, and confidence.
          </p>

          <ul className={styles.benefitsList}>
            <li>Morning Visioneering (7 min) to start your day aligned</li>
            <li>Guided meditations designed for embodiment, not just affirmations</li>
            <li>Scene-based visualization that is easy to picture and feel</li>
            <li>Calm, Focus, Confidence, Sleep, and Walking sessions</li>
          </ul>

          <div className={styles.heroCtas}>
            <Button onClick={onBegin} fullWidth>Begin</Button>
            <button
              className={styles.secondaryLink}
              onClick={() => scrollToSection('how-it-works')}
              type="button"
            >
              How it works
            </button>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className={styles.howItWorksSection}>
        <h2 className={styles.sectionTitle}>How It Works</h2>
        <div className={styles.stepsContainer}>
          <div className={styles.step}>
            <div className={styles.stepNumber}>1</div>
            <h3 className={styles.stepTitle}>Choose Your Focus</h3>
            <p className={styles.stepDescription}>
              Morning, Calm, Focus, Confidence, Sleep, or Walking
            </p>
          </div>
          <div className={styles.step}>
            <div className={styles.stepNumber}>2</div>
            <h3 className={styles.stepTitle}>Listen and Embody</h3>
            <p className={styles.stepDescription}>
              Feel the experience as if it is already true
            </p>
          </div>
          <div className={styles.step}>
            <div className={styles.stepNumber}>3</div>
            <h3 className={styles.stepTitle}>Carry the State</h3>
            <p className={styles.stepDescription}>
              Bring that aligned feeling into your day
            </p>
          </div>
        </div>
      </section>

      {/* Trust/Clarity Section */}
      <section className={styles.trustSection}>
        <div className={styles.trustContent}>
          <h2 className={styles.sectionTitle}>More Than Affirmations</h2>
          <p className={styles.trustDescription}>
            Guided embodiment designed to help you feel the state first, not repeat words.
          </p>

          <div className={styles.insideList}>
            <h3 className={styles.insideTitle}>What You Will Find Inside</h3>
            <ul>
              <li>
                <span className={styles.insideLabel}>Morning Visioneering</span>
                <span className={styles.insideMeta}>(7 min)</span>
              </li>
              <li>
                <span className={styles.insideLabel}>Calm Sessions</span>
                <span className={styles.insideMeta}>(5–15 min)</span>
              </li>
              <li>
                <span className={styles.insideLabel}>Focus Sessions</span>
                <span className={styles.insideMeta}>(8–12 min)</span>
              </li>
              <li>
                <span className={styles.insideLabel}>Confidence Sessions</span>
                <span className={styles.insideMeta}>(10–15 min)</span>
              </li>
              <li>
                <span className={styles.insideLabel}>Sleep Sessions</span>
                <span className={styles.insideMeta}>(15–20 min)</span>
              </li>
              <li>
                <span className={styles.insideLabel}>Walking Meditations</span>
                <span className={styles.insideMeta}>(10–15 min)</span>
              </li>
            </ul>
          </div>
        </div>

        <div className={styles.finalCta}>
          <Button onClick={onBegin} fullWidth>Begin Your Practice</Button>
        </div>
      </section>
    </div>
  );
};

// Arrival Screen - First launch immersive welcome experience
const ArrivalScreen: React.FC<{ onEnter: () => void }> = ({ onEnter }) => {
  const [visible, setVisible] = useState(false);
  const [exiting, setExiting] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Fade in on mount
    const timer = setTimeout(() => setVisible(true), 100);

    // Initialize ambient audio (stubbed - add actual audio file later)
    // Audio should be: no rhythm, no melody, spacious and expansive
    // Uncomment when audio file is available:
    // try {
    //   audioRef.current = new Audio('/sounds/ambient-arrival.mp3');
    //   audioRef.current.loop = true;
    //   audioRef.current.volume = 0.15; // Very low volume
    //   // Respect system mute/silent mode
    //   audioRef.current.play().catch(() => {
    //     // Audio autoplay blocked - that's fine
    //   });
    // } catch {
    //   // Audio not available
    // }

    return () => {
      clearTimeout(timer);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const handleEnter = () => {
    setExiting(true);
    // Mark arrival as seen
    localStorage.setItem('arrivalSeen', 'true');
    // Soft fade transition
    setTimeout(() => {
      onEnter();
    }, 600);
  };

  return (
    <div className={`${styles.arrivalScreen} ${visible ? styles.arrivalVisible : ''} ${exiting ? styles.arrivalExiting : ''}`}>
      <div className={styles.arrivalGradient} />
      <div className={`${styles.arrivalOrb} ${styles.arrivalOrb1}`} />
      <div className={`${styles.arrivalOrb} ${styles.arrivalOrb2}`} />
      <div className={styles.arrivalContent}>
        <h1 className={styles.arrivalTitle}>Abundance Recode</h1>

        <div className={styles.arrivalBody}>
          <p className={styles.arrivalLine}>Step out of the ordinary.</p>

          <p className={styles.arrivalPoem}>
            This is a space for alignment,
            <br />
            embodiment,
            <br />
            and remembering what&apos;s possible.
          </p>

          <p className={styles.arrivalLine}>
            When your inner state shifts,
            <br />
            reality responds.
          </p>

          <p className={styles.arrivalBreath}>Take a breath.</p>
        </div>

        <button className={styles.arrivalButton} onClick={handleEnter}>
          ENTER
        </button>
      </div>
    </div>
  );
};

// Wave Background Component for Onboarding/Player
const WaveBackground: React.FC = () => (
  <div className={styles.waveBackground}>
    <svg viewBox="0 0 400 400" className={styles.waveSvg}>
      <defs>
        <linearGradient id="waveGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#000000" stopOpacity="0.6" />
          <stop offset="50%" stopColor="#334155" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#D4AF37" stopOpacity="0.15" />
        </linearGradient>
        <linearGradient id="waveGrad2" x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#000000" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#D4AF37" stopOpacity="0.1" />
        </linearGradient>
      </defs>
      <ellipse cx="200" cy="350" rx="250" ry="150" fill="url(#waveGrad1)" className={styles.waveShape1} />
      <ellipse cx="250" cy="380" rx="200" ry="120" fill="url(#waveGrad2)" className={styles.waveShape2} />
    </svg>
  </div>
);

// Onboarding Screen - matches reference with wave background
const OnboardingScreen: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      title: 'Your Identity Signals Your Future',
      description: "You don't attract what you want—you attract what you are. Become the version of yourself who effortlessly receives abundance.",
    },
    {
      title: 'The Science of Transformation',
      description: 'Research suggests your brain can form new neural pathways at any age. Through consistent practice, you can reshape your patterns of thought and emotion.',
    },
    {
      title: 'Your Tools for Change',
      description: 'Guided meditations, journaling practices, and personalized insights designed to help you shift your internal state and align with your goals.',
    },
    {
      title: 'Your Daily Rhythm',
      description: 'Consistency creates transformation. Set your morning and evening practice times to build the habits that reshape your reality.',
    },
  ];

  const handleContinue = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      onComplete();
    }
  };

  return (
    <div className={styles.screen}>
      <WaveBackground />

      <div className={styles.onboardingHeader}>
        <div className={styles.progressDots}>
          {slides.map((_, index) => (
            <span
              key={index}
              className={`${styles.progressDot} ${index === currentSlide ? styles.progressDotActive : ''}`}
            />
          ))}
        </div>
      </div>

      <div className={styles.onboardingContent}>
        <div className={styles.onboardingSlide} key={currentSlide}>
          <h2 className={styles.onboardingTitle}>{slides[currentSlide].title}</h2>
          <p className={styles.onboardingDescription}>{slides[currentSlide].description}</p>
        </div>
      </div>

      <div className={styles.onboardingButton}>
        <Button onClick={handleContinue} fullWidth>CONTINUE</Button>
      </div>
    </div>
  );
};

// Format time to 12-hour format
const formatTime12h = (time24: string): string => {
  const [hours, minutes] = time24.split(':').map(Number);
  const period = hours >= 12 ? 'PM' : 'AM';
  const hours12 = hours % 12 || 12;
  return `${hours12}:${minutes.toString().padStart(2, '0')} ${period}`;
};

// Rhythm Scheduler Screen - matches reference
const RhythmScreen: React.FC<{ onComplete: (morning: string, evening: string) => void }> = ({ onComplete }) => {
  const [morningTime, setMorningTime] = useState('07:00');
  const [eveningTime, setEveningTime] = useState('21:00');
  const [selectedDays, setSelectedDays] = useState([0, 1, 2, 3, 4, 5, 6]);

  const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

  const toggleDay = (index: number) => {
    if (selectedDays.includes(index)) {
      setSelectedDays(selectedDays.filter(d => d !== index));
    } else {
      setSelectedDays([...selectedDays, index]);
    }
  };

  return (
    <div className={styles.screen}>
      <div className={styles.rhythmContent}>
        <h2 className={styles.rhythmTitle}>Set Your<br />Daily Rhythm</h2>

        <GlassCard className={styles.timeCard}>
          <div className={styles.timeCardHeader}>
            <span className={styles.timeIcon}>{Icons.sun}</span>
            <span>Morning Session</span>
          </div>
          <div className={styles.timeDisplay}>
            <input
              type="time"
              value={morningTime}
              onChange={(e) => setMorningTime(e.target.value)}
              className={styles.timeInputHidden}
            />
            <span className={styles.timeValue}>{formatTime12h(morningTime)}</span>
          </div>
        </GlassCard>

        <GlassCard className={styles.timeCard}>
          <div className={styles.timeCardHeader}>
            <span className={styles.timeIcon}>{Icons.moon}</span>
            <span>Evening Session</span>
          </div>
          <div className={styles.timeDisplay}>
            <input
              type="time"
              value={eveningTime}
              onChange={(e) => setEveningTime(e.target.value)}
              className={styles.timeInputHidden}
            />
            <span className={styles.timeValue}>{formatTime12h(eveningTime)}</span>
          </div>
        </GlassCard>

        <div className={styles.daysSelector}>
          {days.map((day, index) => (
            <button
              key={index}
              className={`${styles.dayButton} ${selectedDays.includes(index) ? styles.dayButtonActive : ''}`}
              onClick={() => toggleDay(index)}
            >
              {day}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.rhythmButton}>
        <Button
          onClick={() => onComplete(morningTime, eveningTime)}
          fullWidth
          disabled={selectedDays.length === 0}
        >
          Save Rhythm
        </Button>
      </div>
    </div>
  );
};

// Dashboard Screen - matches reference with action cards
const DashboardScreen: React.FC<{
  user: UserState;
  onNavigate: (screen: Screen) => void;
}> = ({ user, onNavigate }) => {
  const quickActions = [
    { title: 'Quick Shifts', subtitle: 'Instant reset exercises.', icon: Icons.heart, screen: 'quickshifts' as Screen },
    { title: 'Gratitude Journal', subtitle: 'Capture what you are grateful for.', icon: Icons.journal, screen: 'gratitude' as Screen },
    { title: 'Inner Mentor', subtitle: 'Consult your higher wisdom.', icon: Icons.mentorChat, screen: 'mentor' as Screen },
    { title: 'Reality Shift Board', subtitle: 'Visualize your new identity.', icon: Icons.grid, screen: 'board' as Screen },
    { title: 'Learn & Grow', subtitle: 'Articles for transformation.', icon: Icons.book, screen: 'learn' as Screen },
    { title: 'Meditations', subtitle: 'Guided sessions for every mood.', icon: Icons.headphones, screen: 'meditations' as Screen },
  ];

  return (
    <div className={styles.dashboardScreen}>
      {/* Breathing ambient background glow */}
      <div className={styles.dashboardGlow} />

      {/* Header with Streak */}
      <div className={styles.dashboardHeader}>
        <div className={styles.streakBadge}>
          <span className={styles.streakIcon}>🔥</span>
          <span className={styles.streakCount}>{user.streak}</span>
          <span className={styles.streakLabel}>day streak</span>
        </div>
      </div>

      {/* Featured: Morning Visioneering Card */}
      <div
        className={styles.featuredCard}
        onClick={() => onNavigate('player')}
      >
        <div className={styles.featuredGlow} />
        <div className={styles.featuredContent}>
          <div className={styles.featuredIcon}>{Icons.sparkle}</div>
          <div className={styles.featuredText}>
            <h2 className={styles.featuredTitle}>Morning Visioneering</h2>
            <p className={styles.featuredSubtitle}>7 min guided practice</p>
          </div>
          <div className={styles.featuredPlayButton}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Shift Your State Button */}
      <button
        className={`${styles.shiftStateButton} ${styles.tactileButton}`}
        onClick={() => {
          triggerHaptic('medium');
          onNavigate('quickshifts');
        }}
      >
        Shift Your State
      </button>


      {/* Alignment Score */}
      <div className={styles.scoreSection}>
        <ProgressRing progress={user.alignmentScore} size={180} strokeWidth={12}>
          <span className={styles.scoreValue}>{user.alignmentScore}</span>
          <span className={styles.scoreLabel}>Alignment</span>
        </ProgressRing>
      </div>

      {/* Quick Actions Grid */}
      <div className={styles.actionsSection}>
        {quickActions.map((action, index) => (
          <GlassCard
            key={index}
            className={styles.actionCard}
            onClick={() => onNavigate(action.screen)}
          >
            <div className={styles.actionIcon}>{action.icon}</div>
            <div className={styles.actionText}>
              <h4>{action.title}</h4>
              <p>{action.subtitle}</p>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
};

// Search Icon
const SearchIcon = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" />
    <path d="M21 21l-4.35-4.35" />
  </svg>
);

// Category Icons for Meditations
const CategoryIcons: Record<string, JSX.Element> = {
  focus: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="12" r="2" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="10" />
    </svg>
  ),
  calm: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M2 12h4l2-8 4 16 4-12 2 4h4" />
    </svg>
  ),
  confidence: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M12 2l2.4 7.4h7.6l-6 4.6 2.3 7-6.3-4.6-6.3 4.6 2.3-7-6-4.6h7.6z" />
    </svg>
  ),
  abundance: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 6v12M8 10h8M8 14h8" />
    </svg>
  ),
  sleep: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
    </svg>
  ),
  walking: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="4" r="2" />
      <path d="M15 22l-3-5m3 5v-8l-2-3m-2-2l-4 6m0 0v7m0-7l4 2" />
    </svg>
  ),
};

// Category gradient colors
const categoryGradients: Record<string, string> = {
  focus: 'linear-gradient(135deg, rgba(100, 150, 255, 0.3) 0%, rgba(100, 150, 255, 0.1) 100%)',
  calm: 'linear-gradient(135deg, rgba(100, 200, 180, 0.3) 0%, rgba(100, 200, 180, 0.1) 100%)',
  confidence: 'linear-gradient(135deg, rgba(255, 180, 100, 0.3) 0%, rgba(255, 180, 100, 0.1) 100%)',
  abundance: 'linear-gradient(135deg, rgba(244, 207, 119, 0.3) 0%, rgba(244, 207, 119, 0.1) 100%)',
  sleep: 'linear-gradient(135deg, rgba(147, 130, 255, 0.3) 0%, rgba(147, 130, 255, 0.1) 100%)',
  walking: 'linear-gradient(135deg, rgba(150, 220, 150, 0.3) 0%, rgba(150, 220, 150, 0.1) 100%)',
};

// Meditations Library Screen - Enhanced with search and category grid
const MeditationsScreen: React.FC<{
  onPlay: (session: AudioSession) => void;
  isPremium?: boolean;
  onUpgrade?: () => void;
}> = ({ onPlay, isPremium = false, onUpgrade }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showPaywall, setShowPaywall] = useState(false);
  const [selectedMeditation, setSelectedMeditation] = useState<string>('');

  const categories = [
    { id: 'focus', name: 'Focus', count: 4 },
    { id: 'calm', name: 'Calm', count: 5 },
    { id: 'confidence', name: 'Confidence', count: 4 },
    { id: 'abundance', name: 'Abundance', count: 6 },
    { id: 'sleep', name: 'Sleep', count: 5 },
    { id: 'walking', name: 'Walking', count: 3 },
  ];

  // FREE meditations available to all users
  const FREE_MEDITATIONS = ['Mindful Breathing', 'First Steps'];

  const allMeditations = [
    { id: 1, title: 'Morning Visioneering', description: 'Start your day by connecting with your highest potential.', duration: 12, category: 'focus', isFree: false },
    { id: 2, title: 'Mindful Breathing', description: 'A simple breathing practice to center your mind.', duration: 5, category: 'focus', isFree: true },
    { id: 3, title: 'Gratitude Expansion', description: 'Cultivate appreciation that attracts more abundance.', duration: 10, category: 'abundance', isFree: false },
    { id: 4, title: 'Confidence Activation', description: 'Awaken your inner certainty and calm assurance.', duration: 15, category: 'confidence', isFree: false },
    { id: 5, title: 'First Steps', description: 'A gentle introduction to meditation practice.', duration: 7, category: 'calm', isFree: true },
    { id: 6, title: 'Calm Reset', description: 'Return to peaceful clarity when life feels overwhelming.', duration: 8, category: 'calm', isFree: false },
    { id: 7, title: 'Focus Flow', description: 'Clear mental clutter and enter deep, productive focus.', duration: 12, category: 'focus', isFree: false },
    { id: 8, title: 'Abundance Alignment', description: 'Tune your energy to the frequency of abundance.', duration: 15, category: 'abundance', isFree: false },
    { id: 9, title: 'Deep Sleep Journey', description: 'Drift into restful sleep with guided relaxation.', duration: 20, category: 'sleep', isFree: false },
    { id: 10, title: 'Walking Meditation', description: 'Find peace and presence in every step.', duration: 15, category: 'walking', isFree: false },
    { id: 11, title: 'Stress Release', description: 'Let go of tension and find your center.', duration: 10, category: 'calm', isFree: false },
    { id: 12, title: 'Wealthy Mindset', description: 'Reprogram your relationship with abundance.', duration: 18, category: 'abundance', isFree: false },
    { id: 13, title: 'Inner Strength', description: 'Connect with your core power and resilience.', duration: 12, category: 'confidence', isFree: false },
    { id: 14, title: 'Laser Focus', description: 'Sharpen your concentration and mental clarity.', duration: 8, category: 'focus', isFree: false },
  ];

  const handleMeditationClick = (meditation: typeof allMeditations[0]) => {
    if (meditation.isFree || isPremium) {
      // Find matching audio session
      const audioSession = getMeditationAudioSession(meditation.title);
      if (audioSession) {
        onPlay(audioSession);
      } else {
        // Create a temporary session if no audio mapping exists - use working public audio
        const tempSession: AudioSession = {
          id: meditation.title.toLowerCase().replace(/\s+/g, '-'),
          title: meditation.title,
          description: meditation.description,
          duration: meditation.duration * 60,
          category: 'meditation',
          audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
          thumbnailGradient: categoryGradients[meditation.category] || 'linear-gradient(135deg, #D4AF37 0%, #8B6914 100%)',
          isFree: meditation.isFree
        };
        onPlay(tempSession);
      }
    } else {
      setSelectedMeditation(meditation.title);
      setShowPaywall(true);
    }
  };

  // Paywall modal for premium meditations
  if (showPaywall && !isPremium) {
    return (
      <div className={paywallStyles.paywallOverlay}>
        <div className={paywallStyles.paywallModal}>
          <button className={paywallStyles.closeButton} onClick={() => setShowPaywall(false)}>
            {Icons.close}
          </button>
          <div className={paywallStyles.paywallContent}>
            <div className={paywallStyles.lockIconWrapper}>
              {Icons.lock}
            </div>
            <h2 className={paywallStyles.paywallTitle}>Premium Meditation</h2>
            <p className={paywallStyles.paywallFeatureName}>{selectedMeditation}</p>
            <p className={paywallStyles.paywallDescription}>
              Upgrade to Premium to unlock all 50+ guided meditations and transform your practice.
            </p>
            <div className={paywallStyles.paywallFeatures}>
              <div className={paywallStyles.featureItem}>
                <span className={paywallStyles.checkmark}>✓</span>
                <span>Access all 50+ guided meditations</span>
              </div>
              <div className={paywallStyles.featureItem}>
                <span className={paywallStyles.checkmark}>✓</span>
                <span>New meditations added weekly</span>
              </div>
              <div className={paywallStyles.featureItem}>
                <span className={paywallStyles.checkmark}>✓</span>
                <span>Downloadable for offline use</span>
              </div>
            </div>
            <button className={paywallStyles.upgradeButton} onClick={onUpgrade}>
              Upgrade to Premium
            </button>
            <button className={paywallStyles.maybeLaterButton} onClick={() => setShowPaywall(false)}>
              Maybe Later
            </button>
          </div>
        </div>
      </div>
    );
  }

  const filteredMeditations = allMeditations.filter(m => {
    const matchesSearch = m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         m.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory ? m.category === selectedCategory : true;
    return matchesSearch && matchesCategory;
  });

  // If a category is selected, show meditation list for that category
  if (selectedCategory) {
    return (
      <div className={styles.meditationsScreen}>
        <header className={styles.screenHeaderWithBack}>
          <button className={styles.backButtonSmall} onClick={() => setSelectedCategory(null)}>
            {Icons.back}
          </button>
          <div>
            <h2>{categories.find(c => c.id === selectedCategory)?.name}</h2>
            <p>{filteredMeditations.length} meditations</p>
          </div>
        </header>

        <div className={styles.meditationsList}>
          {filteredMeditations.map((meditation) => (
            <GlassCard key={meditation.id} className={styles.meditationCard} onClick={() => handleMeditationClick(meditation)}>
              <div className={styles.meditationIcon} style={{ background: categoryGradients[meditation.category] }}>
                {CategoryIcons[meditation.category] || Icons.meditation}
              </div>
              <div className={styles.meditationInfo}>
                <div className={styles.meditationTitleRow}>
                  <h4>{meditation.title}</h4>
                  {!meditation.isFree && !isPremium && (
                    <span className={styles.premiumTag}>{Icons.lock}</span>
                  )}
                  {meditation.isFree && (
                    <span className={styles.freeTag}>FREE</span>
                  )}
                </div>
                <p>{meditation.description}</p>
                <div className={styles.meditationMeta}>
                  <span className={styles.durationTag}>{meditation.duration} min</span>
                </div>
              </div>
              <button className={styles.playIconButton}>{Icons.play}</button>
            </GlassCard>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.meditationsScreen}>
      <header className={styles.screenHeader}>
        <h2>Meditations</h2>
        <p>Rewire your mind for abundance.</p>
      </header>

      {/* Search Bar */}
      <div className={styles.searchBar}>
        <span className={styles.searchIcon}>{SearchIcon}</span>
        <input
          type="text"
          placeholder="Search meditations..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={styles.searchInput}
        />
      </div>

      {/* If searching, show results list */}
      {searchQuery && (
        <div className={styles.meditationsList}>
          {filteredMeditations.length > 0 ? (
            filteredMeditations.map((meditation) => (
              <GlassCard key={meditation.id} className={styles.meditationCard} onClick={() => handleMeditationClick(meditation)}>
                <div className={styles.meditationIcon} style={{ background: categoryGradients[meditation.category] }}>
                  {CategoryIcons[meditation.category] || Icons.meditation}
                </div>
                <div className={styles.meditationInfo}>
                  <div className={styles.meditationTitleRow}>
                    <h4>{meditation.title}</h4>
                    {!meditation.isFree && !isPremium && (
                      <span className={styles.premiumTag}>{Icons.lock}</span>
                    )}
                    {meditation.isFree && (
                      <span className={styles.freeTag}>FREE</span>
                    )}
                  </div>
                  <p>{meditation.description}</p>
                  <div className={styles.meditationMeta}>
                    <span className={styles.durationTag}>{meditation.duration} min</span>
                  </div>
                </div>
                <button className={styles.playIconButton}>{Icons.play}</button>
              </GlassCard>
            ))
          ) : (
            <div className={styles.emptyState}>
              <p>No meditations found for &quot;{searchQuery}&quot;</p>
            </div>
          )}
        </div>
      )}

      {/* Category Grid - Show when not searching */}
      {!searchQuery && (
        <div className={styles.categoryGrid}>
          {categories.map((category) => (
            <div
              key={category.id}
              className={styles.categoryCard}
              style={{ background: categoryGradients[category.id] }}
              onClick={() => setSelectedCategory(category.id)}
            >
              <div className={styles.categoryCardIcon}>
                {CategoryIcons[category.id]}
              </div>
              <span className={styles.categoryCardName}>{category.name}</span>
              <span className={styles.categoryCardCount}>{category.count} sessions</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Journal Screen
const JournalScreen: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState('all');

  const tabs = ['All', 'Gratitude', 'Identity', 'Freeform'];

  const prompts = [
    "What is one small piece of evidence today that things are moving in the right direction?",
    "If your Future Self could give you one piece of advice today, what would it be?",
    "What are you grateful for right now?",
  ];

  return (
    <div className={styles.journalScreen}>
      <header className={styles.screenHeader}>
        <h2>Journal</h2>
        <p>Capture your thoughts and transformations</p>
      </header>

      <div className={styles.quickActions}>
        <GlassCard className={styles.quickActionCard}>
          <div className={styles.quickActionIcon} style={{ background: 'rgba(201, 169, 97, 0.2)' }}>
            {Icons.heart}
          </div>
          <h4>Gratitude</h4>
          <p>What are you grateful for?</p>
        </GlassCard>
        <GlassCard className={styles.quickActionCard}>
          <div className={styles.quickActionIcon} style={{ background: 'rgba(139, 123, 184, 0.2)' }}>
            {Icons.sparkle}
          </div>
          <h4>Identity</h4>
          <p>Embody your future self</p>
        </GlassCard>
      </div>

      <div className={styles.journalTabs}>
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`${styles.journalTab} ${selectedTab === tab.toLowerCase() ? styles.journalTabActive : ''}`}
            onClick={() => setSelectedTab(tab.toLowerCase())}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className={styles.promptCard}>
        <GlassCard variant="elevated">
          <p className={styles.promptLabel}>Today&apos;s Prompt</p>
          <p className={styles.promptText}>{prompts[0]}</p>
        </GlassCard>
      </div>

      <div className={styles.emptyState}>
        <div className={styles.emptyIcon}>{Icons.journal}</div>
        <p>No entries yet.<br />Start by creating your first journal entry.</p>
        <Button onClick={() => {}}>Start Writing</Button>
      </div>
    </div>
  );
};

// Circular Gauge Component - for Progress screen
const CircularGauge: React.FC<{
  value: number;
  label: string;
  color: 'coherence' | 'consistency';
  size?: number;
}> = ({ value, label, color, size = 110 }) => {
  const strokeWidth = 10;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (value / 100) * circumference;

  const gradientId = `gauge-${color}`;
  const gradientColors = color === 'coherence'
    ? ['#E8C84A', '#D4AF37']
    : ['#D4AF37', '#B8962E'];

  return (
    <GlassCard className={styles.gaugeCard}>
      <div className={styles.gaugeWrapper} style={{ width: size, height: size }}>
        <svg className={styles.gaugeSvg} width={size} height={size}>
          <defs>
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={gradientColors[0]} />
              <stop offset="100%" stopColor={gradientColors[1]} />
            </linearGradient>
          </defs>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            className={styles.gaugeTrack}
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            className={styles.gaugeProgress}
            stroke={`url(#${gradientId})`}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            style={{ filter: `drop-shadow(0 0 8px ${gradientColors[0]})` }}
          />
        </svg>
        <div className={styles.gaugeCenter}>
          <span className={styles.gaugeLabelInside}>{label}:</span>
          <span className={styles.gaugePercent}>{value}%</span>
        </div>
      </div>
    </GlassCard>
  );
};

// Progress Screen - Premium design with curved line chart
const ProgressScreen: React.FC<{ user: UserState }> = ({ user }) => {
  // Data for line chart (4 weeks)
  const lineData = [45, 52, 58, 55, 62, 68, 65, 72, 75, 78, 80, user.alignmentScore];

  // Create smooth curve path
  const createCurvePath = (data: number[], width: number, height: number) => {
    const maxVal = Math.max(...data);
    const minVal = Math.min(...data);
    const range = maxVal - minVal || 1;
    const padding = 10;
    const usableHeight = height - padding * 2;
    const usableWidth = width;

    const points = data.map((val, i) => ({
      x: (i / (data.length - 1)) * usableWidth,
      y: padding + usableHeight - ((val - minVal) / range) * usableHeight
    }));

    // Create smooth bezier curve
    let path = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      const prev = points[i - 1];
      const curr = points[i];
      const cpx = (prev.x + curr.x) / 2;
      path += ` Q ${cpx} ${prev.y} ${curr.x} ${curr.y}`;
    }

    // Create fill path
    const fillPath = `${path} L ${points[points.length - 1].x} ${height} L 0 ${height} Z`;

    return { linePath: path, fillPath };
  };

  return (
    <div className={styles.progressScreen}>
      <h2 className={styles.progressTitle}>Your Progress</h2>

      {/* Main Line Chart */}
      <GlassCard className={styles.lineChartCard}>
        <div className={styles.chartWithLabel}>
          <span className={styles.chartYLabel}>Alignment Score</span>
          <div className={styles.lineChart}>
            <svg className={styles.lineChartSvg} viewBox="0 0 280 80" preserveAspectRatio="none">
              <defs>
                <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#94A3B8" />
                  <stop offset="100%" stopColor="#D4AF37" />
                </linearGradient>
                <linearGradient id="fillGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="rgba(212, 175, 55, 0.25)" />
                  <stop offset="100%" stopColor="rgba(212, 175, 55, 0)" />
                </linearGradient>
              </defs>
              <path
                d={createCurvePath(lineData, 280, 80).fillPath}
                fill="url(#fillGradient)"
              />
              <path
                d={createCurvePath(lineData, 280, 80).linePath}
                fill="none"
                stroke="url(#lineGradient)"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>
        <p className={styles.chartSubtitle}>Last 4 Weeks</p>
      </GlassCard>

      {/* Small Charts Row */}
      <div className={styles.smallChartsRow}>
        {/* Last Week Line Chart */}
        <GlassCard className={styles.smallChartCard}>
          <div className={styles.smallChartIcon}>{Icons.heart}</div>
          <div className={styles.smallChartInner}>
            <span className={styles.smallChartYLabel}>Alignment Score</span>
            <div className={styles.smallChartContent}>
              <div className={styles.smallChartGraph}>
                <svg width="100%" height="100%" viewBox="0 0 100 40" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="smallLineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#94A3B8" />
                      <stop offset="100%" stopColor="#D4AF37" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M0,35 Q25,30 50,20 T100,10"
                    fill="none"
                    stroke="url(#smallLineGrad)"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <circle cx="100" cy="10" r="3" fill="#D4AF37" />
                </svg>
              </div>
              <span className={styles.smallChartXLabel}>Last Week</span>
            </div>
          </div>
        </GlassCard>

        {/* Color Bars Chart */}
        <GlassCard className={styles.smallChartCard}>
          <div className={styles.smallChartInner}>
            <span className={styles.smallChartYLabel}>Practices Completed</span>
            <div className={styles.smallChartContent}>
              <div className={styles.smallChartGraph}>
                <div className={styles.colorBars}>
                  <div className={`${styles.colorBar} ${styles.colorBarMint}`} style={{ height: '60%' }} />
                  <div className={`${styles.colorBar} ${styles.colorBarLavender}`} style={{ height: '80%' }} />
                  <div className={`${styles.colorBar} ${styles.colorBarPeach}`} style={{ height: '45%' }} />
                  <div className={`${styles.colorBar} ${styles.colorBarBlue}`} style={{ height: '90%' }} />
                  <div className={`${styles.colorBar} ${styles.colorBarYellow}`} style={{ height: '70%' }} />
                </div>
              </div>
              <span className={styles.smallChartXLabel}>Week</span>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Gauges Row */}
      <div className={styles.gaugesRow}>
        <CircularGauge value={85} label="Coherence" color="coherence" />
        <CircularGauge value={72} label="Consistency" color="consistency" />
      </div>
    </div>
  );
};

// Inner Mentor Chat Screen - AI-powered guidance with Firestore persistence
const MentorScreen: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [messages, setMessages] = useState<Array<{ id: number; role: string; content: string }>>([
    { id: 1, role: 'mentor', content: "I am here. What is on your mind, Creator?" },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  // Floating particles for mystical atmosphere
  const [dustParticles] = useState(() =>
    Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 2 + Math.random() * 3,
      duration: 15 + Math.random() * 20,
      delay: Math.random() * 10,
      opacity: 0.2 + Math.random() * 0.3,
    }))
  );

  // Wisdom snippets for simulated responses
  const wisdomSnippets = [
    "The answer you seek is already vibrating within your heart's frequency.",
    "Abundance is not something you acquire. It is something you tune into.",
    "What would your most courageous self do in this situation?",
    "Trust the timing of your life. The universe is orchestrating a masterpiece.",
    "Your thoughts are seeds. What garden are you planting today?",
    "The resistance you feel is the doorway to your next expansion.",
    "You are not broken. You are breaking open to receive more light.",
    "Every ending is a beginning wearing a different costume.",
    "The universe doesn't give you what you ask for. It gives you what you vibrate.",
    "Your future self is already celebrating this moment of awakening.",
    "Surrender is not giving up. It is opening up to infinite possibilities.",
    "The wound is where the light enters. Honor your tender places.",
  ];

  // Initialize user ID and load chat history
  useEffect(() => {
    const initChat = async () => {
      try {
        const uid = await getAnonymousUserId();
        setUserId(uid);

        // Load chat history from Firestore
        const { messages: history, error } = await chatService.getHistory(uid);
        if (!error && history.length > 0) {
          setMessages(history.map(m => ({
            id: parseInt(m.id) || Date.now(),
            role: m.role,
            content: m.content,
          })));
        }
      } catch (error) {
        console.error('Error initializing chat:', error);
      }
    };

    initChat();
  }, []);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Get random wisdom snippet
  const getWisdomSnippet = () => {
    return wisdomSnippets[Math.floor(Math.random() * wisdomSnippets.length)];
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    const userMsgId = Date.now();

    // Add user message to UI immediately
    setMessages(prev => [...prev, { id: userMsgId, role: 'user', content: userMessage }]);
    setInput('');
    setIsTyping(true);

    // Haptic feedback
    if (navigator.vibrate) navigator.vibrate(30);

    // Save user message to Firestore
    if (userId) {
      chatService.saveMessage(userId, { role: 'user', content: userMessage });
    }

    try {
      // Get AI response
      const conversationHistory = messages.slice(-10).map(m => ({
        role: m.role,
        content: m.content,
      }));

      const { response, error } = await aiMentorService.getResponse(userMessage, conversationHistory);

      // Add slight delay for contemplative feel (min 2 seconds)
      await new Promise(resolve => setTimeout(resolve, 2000));

      setIsTyping(false);

      const mentorMsgId = Date.now();
      // Use wisdom snippet if AI fails, otherwise use AI response
      const mentorResponse = error ? getWisdomSnippet() : response;

      // Add mentor response to UI
      setMessages(prev => [...prev, {
        id: mentorMsgId,
        role: 'mentor',
        content: mentorResponse,
      }]);

      // Save mentor response to Firestore
      if (userId) {
        chatService.saveMessage(userId, { role: 'mentor', content: mentorResponse });
      }
    } catch (error) {
      console.error('Error getting AI response:', error);

      // Add delay before fallback response
      await new Promise(resolve => setTimeout(resolve, 2500));
      setIsTyping(false);

      // Fallback with wisdom snippet
      setMessages(prev => [...prev, {
        id: Date.now(),
        role: 'mentor',
        content: getWisdomSnippet(),
      }]);
    }
  };

  return (
    <div className={styles.mentorScreen}>
      {/* Floating dust particles for mystical atmosphere */}
      <div className={styles.mentorParticles}>
        {dustParticles.map((particle) => (
          <div
            key={particle.id}
            className={styles.dustMote}
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: particle.size,
              height: particle.size,
              opacity: particle.opacity,
              animationDuration: `${particle.duration}s`,
              animationDelay: `${particle.delay}s`,
            }}
          />
        ))}
      </div>

      <header className={styles.mentorHeader}>
        <button onClick={onClose} aria-label="Close">{Icons.close}</button>
        <div className={styles.mentorTitle}>
          <h3>Inner Mentor</h3>
          <p>Consult your higher wisdom</p>
        </div>
        <div style={{ width: 24 }} />
      </header>

      <div className={styles.messagesContainer}>
        {messages.map((message) => (
          <div
            key={message.id}
            className={`${styles.message} ${message.role === 'user' ? styles.messageUser : styles.messageMentor}`}
          >
            {message.role === 'mentor' && (
              <div className={styles.mentorAvatar}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2L14.09 8.26L20 9.27L15.55 13.97L16.91 20L12 16.9L7.09 20L8.45 13.97L4 9.27L9.91 8.26L12 2Z" fill="currentColor"/>
                </svg>
              </div>
            )}
            <div className={styles.messageBubble}>
              {message.content}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className={`${styles.message} ${styles.messageMentor}`}>
            <div className={styles.mentorAvatar}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L14.09 8.26L20 9.27L15.55 13.97L16.91 20L12 16.9L7.09 20L8.45 13.97L4 9.27L9.91 8.26L12 2Z" fill="currentColor"/>
              </svg>
            </div>
            <div className={`${styles.messageBubble} ${styles.typingIndicator}`}>
              <span className={styles.tuningText}>Tuning in</span>
              <span className={styles.typingDot} />
              <span className={styles.typingDot} />
              <span className={styles.typingDot} />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className={styles.inputContainer}>
        <div className={styles.mentorInputCard}>
          <input
            type="text"
            placeholder="Ask your Inner Mentor..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            className={styles.chatInput}
          />
          <button
            className={`${styles.sendButton} ${input.trim() ? styles.sendButtonActive : ''}`}
            onClick={sendMessage}
            disabled={isTyping}
            aria-label="Send message"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="currentColor" opacity="0.3"/>
              <path d="M22 2L2 11L11 13L13 22L22 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

// Player Screen - matches reference with outlined play button
// Meditation Player Props
interface MeditationPlayerProps {
  session: AudioSession | null;
  onClose: () => void;
  onComplete?: () => void;
}

const PlayerScreen: React.FC<MeditationPlayerProps> = ({ session, onClose, onComplete }) => {
  // Use default session if none provided (backwards compatibility)
  const activeSession = session || getAudioSession('morning-visioneering') || {
    id: 'default',
    title: 'Morning Visioneering',
    description: 'Start your day by connecting with your highest potential.',
    duration: 720,
    category: 'meditation' as const,
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    thumbnailGradient: 'linear-gradient(135deg, #D4AF37 0%, #8B6914 100%)',
    instructor: 'Sarah Chen',
    isFree: false
  };

  const {
    audioRef,
    isPlaying,
    isLoading,
    error,
    currentTime,
    duration: audioDuration,
    progress,
    isBuffering,
    toggle,
    seekByPercent,
    reset
  } = useAudio(activeSession.audioUrl);

  // Use audio duration if available, otherwise use session duration
  const totalDuration = audioDuration > 0 ? audioDuration : activeSession.duration;

  // Handle seek via progress bar click
  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percent = (x / rect.width) * 100;
    seekByPercent(percent);
  };

  // Handle completion
  useEffect(() => {
    if (progress >= 100 && totalDuration > 0) {
      // Track session completion
      const completedSessions = parseInt(localStorage.getItem('completedSessions') || '0');
      localStorage.setItem('completedSessions', (completedSessions + 1).toString());

      // Award alignment points
      const currentPoints = parseInt(localStorage.getItem('alignmentPoints') || '0');
      const pointsEarned = Math.floor(totalDuration / 60) * 10; // 10 points per minute
      localStorage.setItem('alignmentPoints', (currentPoints + pointsEarned).toString());

      // Haptic feedback
      if (navigator.vibrate) {
        navigator.vibrate([100, 50, 100]);
      }

      if (onComplete) {
        onComplete();
      }
    }
  }, [progress, totalDuration, onComplete]);

  // Parse title for multi-line display
  const titleParts = activeSession.title.split(' ');
  const titleDisplay = titleParts.length > 1
    ? `${titleParts.slice(0, Math.ceil(titleParts.length / 2)).join(' ')}\n${titleParts.slice(Math.ceil(titleParts.length / 2)).join(' ')}`
    : activeSession.title;

  return (
    <div className={styles.playerScreen}>
      {/* Hidden audio element */}
      <audio ref={audioRef} preload="metadata" />

      {/* Aurora wave background with session gradient */}
      <div className={styles.playerWaveBackground} style={{ background: activeSession.thumbnailGradient }}>
        <svg viewBox="0 0 400 200" preserveAspectRatio="xMidYMid slice" className={styles.auroraWave}>
          <defs>
            <linearGradient id="aurora1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#000000" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#334155" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#D4AF37" stopOpacity="0.2" />
            </linearGradient>
            <linearGradient id="aurora2" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#000000" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#D4AF37" stopOpacity="0.15" />
            </linearGradient>
          </defs>
          <path d="M0,100 Q100,50 200,100 T400,100 L400,200 L0,200 Z" fill="url(#aurora1)" className={styles.auroraPath1} />
          <path d="M0,120 Q150,70 300,120 T400,80 L400,200 L0,200 Z" fill="url(#aurora2)" className={styles.auroraPath2} />
        </svg>
      </div>

      <button className={styles.closeButton} onClick={onClose}>{Icons.close}</button>

      <div className={styles.playerContent}>
        {/* Category badge */}
        <span className={styles.playerCategory}>
          {activeSession.category === 'meditation' ? 'Guided Meditation' : 'Quick Shift'}
        </span>

        <h2 className={styles.playerTitle}>
          {titleDisplay.split('\n').map((line, i) => (
            <span key={i}>{line}{i === 0 && titleDisplay.includes('\n') ? <br /> : null}</span>
          ))}
        </h2>

        {activeSession.instructor && (
          <p className={styles.playerInstructor}>with {activeSession.instructor}</p>
        )}

        {/* Error message */}
        {error && (
          <div className={styles.playerError}>
            <span>{Icons.warning}</span>
            <span>{error}</span>
          </div>
        )}

        {/* Outlined play button with loading state */}
        <button
          className={`${styles.playButtonOutlined} ${isLoading || isBuffering ? styles.playButtonLoading : ''}`}
          onClick={toggle}
          disabled={isLoading}
        >
          {isLoading || isBuffering ? (
            <div className={styles.audioSpinner} />
          ) : isPlaying ? (
            Icons.pause
          ) : (
            Icons.playOutline
          )}
        </button>

        {/* Time display */}
        <div className={styles.playerTimeDisplay}>
          <span>{formatAudioTime(currentTime)}</span>
          <span>{formatAudioTime(totalDuration)}</span>
        </div>

        {/* Progress bar - clickable for seeking */}
        <div className={styles.progressBar} onClick={handleProgressClick}>
          <div className={styles.progressTrack}>
            <div className={styles.progressFill} style={{ width: `${progress}%` }} />
            <div
              className={styles.progressKnob}
              style={{ left: `${progress}%` }}
            />
          </div>
        </div>

        {/* Session description */}
        <p className={styles.playerDescription}>{activeSession.description}</p>
      </div>
    </div>
  );
};

// Profile Screen - Clean premium design matching reference
const ProfileScreen: React.FC<{ user: UserState; onClose: () => void; onSettings: () => void; onPricing?: () => void }> = ({ user, onClose, onSettings, onPricing }) => {
  const [iAmStatement, setIAmStatement] = useState('');
  const [isEditingStatement, setIsEditingStatement] = useState(false);
  const [morningReminders, setMorningReminders] = useState(true);
  const [eveningCheckins, setEveningCheckins] = useState(false);
  const [totalSessions, setTotalSessions] = useState(0);
  const [anchorsDropped, setAnchorsDropped] = useState(0);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  // Load data from localStorage
  useEffect(() => {
    // Load I AM statement
    const savedStatement = localStorage.getItem('iAmStatement');
    if (savedStatement) {
      setIAmStatement(savedStatement);
    } else {
      setIAmStatement('I am a powerful creator of my reality');
    }

    // Load notification settings
    const savedMorning = localStorage.getItem('morningReminders');
    const savedEvening = localStorage.getItem('eveningCheckins');
    if (savedMorning !== null) setMorningReminders(savedMorning === 'true');
    if (savedEvening !== null) setEveningCheckins(savedEvening === 'true');

    // Calculate stats
    const gratitudeEntries = localStorage.getItem('gratitudeEntries');
    if (gratitudeEntries) {
      try {
        const entries = JSON.parse(gratitudeEntries);
        setAnchorsDropped(entries.length);
      } catch (e) {
        console.error('Error parsing gratitude entries:', e);
      }
    }

    // Mock total sessions (could be tracked more precisely)
    const sessions = localStorage.getItem('totalSessions');
    setTotalSessions(sessions ? parseInt(sessions) : Math.floor(user.streak * 1.5));
  }, [user.streak]);

  // Save I AM statement
  const saveStatement = () => {
    localStorage.setItem('iAmStatement', iAmStatement);
    setIsEditingStatement(false);
    if (navigator.vibrate) navigator.vibrate(30);
  };

  // Toggle notification settings
  const toggleMorningReminders = () => {
    const newValue = !morningReminders;
    setMorningReminders(newValue);
    localStorage.setItem('morningReminders', String(newValue));
  };

  const toggleEveningCheckins = () => {
    const newValue = !eveningCheckins;
    setEveningCheckins(newValue);
    localStorage.setItem('eveningCheckins', String(newValue));
  };

  // Clear all data
  const handleClearAllData = () => {
    localStorage.removeItem('gratitudeEntries');
    localStorage.removeItem('realityShiftBoard');
    localStorage.removeItem('iAmStatement');
    localStorage.removeItem('morningReminders');
    localStorage.removeItem('eveningCheckins');
    localStorage.removeItem('totalSessions');
    localStorage.removeItem('abundanceUser');
    localStorage.removeItem('lastStreakDate');

    setIAmStatement('I am a powerful creator of my reality');
    setAnchorsDropped(0);
    setTotalSessions(0);
    setShowClearConfirm(false);

    if (navigator.vibrate) navigator.vibrate([50, 50, 50]);
    alert('All data has been cleared. You have a fresh start!');
  };

  return (
    <div className={styles.profileScreen}>
      <header className={styles.profileHeader}>
        <button onClick={onClose}>{Icons.back}</button>
        <button onClick={onSettings}>{Icons.settings}</button>
      </header>

      {/* Creator Profile Card */}
      <div className={styles.profileContent}>
        <div className={styles.avatar}>
          {Icons.profile}
        </div>
        <h2>{user.displayName || 'Creator'}</h2>
        <div className={styles.subscriptionStatus}>
          <span className={`${styles.subscriptionBadge} ${user.isPremium ? styles.subscriptionBadgePremium : styles.subscriptionBadgeFree}`}>
            {user.isPremium ? 'Premium Member' : 'Free Member'}
          </span>
        </div>
        {!user.isPremium && onPricing && (
          <button className={styles.upgradeProfileButton} onClick={onPricing}>
            Upgrade to Premium
          </button>
        )}
      </div>

      {/* I AM Statement Section */}
      <div className={styles.identitySection}>
        <div className={styles.identitySectionHeader}>
          <h3>My Identity Statement</h3>
          {!isEditingStatement && (
            <button className={styles.editButton} onClick={() => setIsEditingStatement(true)}>
              Edit
            </button>
          )}
        </div>
        {isEditingStatement ? (
          <div className={styles.statementEditor}>
            <textarea
              className={styles.statementTextarea}
              value={iAmStatement}
              onChange={(e) => setIAmStatement(e.target.value)}
              placeholder="I am..."
              rows={3}
            />
            <div className={styles.statementActions}>
              <button className={styles.cancelButton} onClick={() => setIsEditingStatement(false)}>
                Cancel
              </button>
              <button className={styles.saveButton} onClick={saveStatement}>
                Save
              </button>
            </div>
          </div>
        ) : (
          <div className={styles.statementDisplay}>
            <span className={styles.statementQuote}>&ldquo;{iAmStatement}&rdquo;</span>
          </div>
        )}
      </div>

      {/* Stats Overview */}
      <GlassCard className={styles.profileStatsCard}>
        <div className={styles.statsGrid}>
          <div className={styles.statItem}>
            <span className={styles.statNumber}>{user.streak}</span>
            <span className={styles.statLabel}>Day Streak</span>
            <span className={styles.statIcon}>🔥</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statNumber}>{totalSessions}</span>
            <span className={styles.statLabel}>Sessions</span>
            <span className={styles.statIcon}>🧘</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statNumber}>{anchorsDropped}</span>
            <span className={styles.statLabel}>Anchors</span>
            <span className={styles.statIcon}>⚓</span>
          </div>
        </div>
        <div className={styles.alignmentRow}>
          <span className={styles.alignmentLabel}>Alignment Score</span>
          <span className={styles.alignmentValue}>{user.alignmentScore}%</span>
        </div>
      </GlassCard>

      {/* Quick Settings */}
      <div className={styles.quickSettingsSection}>
        <h3 className={styles.sectionTitle}>Notifications</h3>

        <div className={styles.settingToggleRow}>
          <div className={styles.settingInfo}>
            <span className={styles.settingIcon}>🌅</span>
            <div>
              <span className={styles.settingName}>Morning Reminders</span>
              <span className={styles.settingDesc}>Start your day aligned</span>
            </div>
          </div>
          <button
            className={`${styles.toggleSwitch} ${morningReminders ? styles.toggleSwitchOn : ''}`}
            onClick={toggleMorningReminders}
          >
            <span className={styles.toggleKnob} />
          </button>
        </div>

        <div className={styles.settingToggleRow}>
          <div className={styles.settingInfo}>
            <span className={styles.settingIcon}>🌙</span>
            <div>
              <span className={styles.settingName}>Evening Check-ins</span>
              <span className={styles.settingDesc}>Reflect on your day</span>
            </div>
          </div>
          <button
            className={`${styles.toggleSwitch} ${eveningCheckins ? styles.toggleSwitchOn : ''}`}
            onClick={toggleEveningCheckins}
          >
            <span className={styles.toggleKnob} />
          </button>
        </div>
      </div>

      {/* Data Management */}
      <div className={styles.dataManagementSection}>
        <h3 className={styles.sectionTitle}>Data Management</h3>

        {!showClearConfirm ? (
          <button className={styles.clearDataButton} onClick={() => setShowClearConfirm(true)}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6" />
            </svg>
            Clear All Data
          </button>
        ) : (
          <div className={styles.clearConfirmBox}>
            <p>Are you sure? This will delete all your data including gratitude entries and vision board.</p>
            <div className={styles.clearConfirmActions}>
              <button className={styles.cancelButton} onClick={() => setShowClearConfirm(false)}>
                Cancel
              </button>
              <button className={styles.confirmDeleteButton} onClick={handleClearAllData}>
                Yes, Clear All
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Reality Shift Board - Bento grid vision board with add functionality
interface BoardItem {
  id: number;
  type: 'text' | 'image' | 'affirmation';
  content?: string;
  imageUrl?: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation?: number;
}

// Asset Library Items
const ASSET_IMAGES = [
  { id: 'img1', url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400', label: 'Mountain Peak' },
  { id: 'img2', url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400', label: 'Tropical Beach' },
  { id: 'img3', url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400', label: 'Dream Home' },
  { id: 'img4', url: 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=400', label: 'Luxury Car' },
  { id: 'img5', url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400', label: 'Healthy Living' },
  { id: 'img6', url: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=400', label: 'World Travel' },
  { id: 'img7', url: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=400', label: 'Success' },
  { id: 'img8', url: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=400', label: 'Modern Office' },
];

const ASSET_AFFIRMATIONS = [
  'I am abundant',
  'I attract success effortlessly',
  'I am worthy of all good things',
  'Money flows to me easily',
  'I create my own reality',
  'I am living my dream life',
  'Everything works in my favor',
  'I am powerful beyond measure',
  'I deserve happiness and love',
  'My potential is limitless',
];

const BoardScreen: React.FC = () => {
  const [boardItems, setBoardItems] = useState<BoardItem[]>([]);
  const [showAssetDrawer, setShowAssetDrawer] = useState(false);
  const [assetTab, setAssetTab] = useState<'upload' | 'ai' | 'images' | 'affirmations'>('upload');
  const [shiftMode, setShiftMode] = useState(false);
  const [shiftIndex, setShiftIndex] = useState(0);
  const [selectedItem, setSelectedItem] = useState<number | null>(null);
  const [draggingItemId, setDraggingItemId] = useState<number | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isUploading, setIsUploading] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generateError, setGenerateError] = useState<string | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load board from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('realityShiftBoard');
    if (saved) {
      try {
        setBoardItems(JSON.parse(saved));
      } catch (e) {
        console.error('Error loading board:', e);
      }
    }
  }, []);

  // Save board to localStorage
  useEffect(() => {
    if (boardItems.length > 0) {
      localStorage.setItem('realityShiftBoard', JSON.stringify(boardItems));
    }
  }, [boardItems]);

  // Shift Mode cycling
  useEffect(() => {
    if (shiftMode && boardItems.length > 0) {
      const interval = setInterval(() => {
        setShiftIndex((prev) => (prev + 1) % boardItems.length);
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [shiftMode, boardItems.length]);

  // Handle image upload from device
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image must be less than 5MB');
      return;
    }

    setIsUploading(true);

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;

      // Add uploaded image to board
      const x = 10 + Math.random() * 60;
      const y = 10 + Math.random() * 50;

      const newItem: BoardItem = {
        id: Date.now(),
        type: 'image',
        imageUrl: base64,
        x,
        y,
        width: 28,
        height: 28,
      };

      setBoardItems(prev => [...prev, newItem]);
      setShowAssetDrawer(false);
      setIsUploading(false);

      // Haptic feedback
      if (navigator.vibrate) navigator.vibrate(50);
    };

    reader.onerror = () => {
      alert('Failed to read image file');
      setIsUploading(false);
    };

    reader.readAsDataURL(file);

    // Reset input so the same file can be selected again
    e.target.value = '';
  };

  // Trigger file input click
  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  // Generate AI image
  const handleGenerateImage = async () => {
    if (!aiPrompt.trim()) return;

    setIsGenerating(true);
    setGenerateError(null);

    try {
      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: aiPrompt.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate image');
      }

      if (data.imageUrl) {
        // Add AI-generated image to board
        const x = 10 + Math.random() * 60;
        const y = 10 + Math.random() * 50;

        const newItem: BoardItem = {
          id: Date.now(),
          type: 'image',
          imageUrl: data.imageUrl,
          x,
          y,
          width: 30,
          height: 30,
        };

        setBoardItems(prev => [...prev, newItem]);
        setShowAssetDrawer(false);
        setAiPrompt('');

        // Haptic feedback
        if (navigator.vibrate) navigator.vibrate([50, 50, 50]);
      }
    } catch (error) {
      console.error('AI generation error:', error);
      setGenerateError(error instanceof Error ? error.message : 'Failed to generate image');
    } finally {
      setIsGenerating(false);
    }
  };

  // Add item directly (tap-to-add for mobile support)
  const addItemToBoard = (type: 'image' | 'affirmation', content: string, imageUrl?: string) => {
    // Place item at a random position in the center area
    const x = 10 + Math.random() * 60;
    const y = 10 + Math.random() * 50;

    const newItem: BoardItem = {
      id: Date.now(),
      type,
      content: type === 'affirmation' ? content : undefined,
      imageUrl: type === 'image' ? imageUrl : undefined,
      x,
      y,
      width: type === 'image' ? 25 : 28,
      height: type === 'image' ? 25 : 12,
    };

    setBoardItems(prev => [...prev, newItem]);
    setShowAssetDrawer(false);

    // Haptic feedback
    if (navigator.vibrate) navigator.vibrate(30);
  };

  // Handle touch/mouse drag for moving items
  const handleItemPointerDown = (e: React.PointerEvent, item: BoardItem) => {
    e.preventDefault();
    e.stopPropagation();
    setDraggingItemId(item.id);
    setSelectedItem(item.id);

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const pointerX = ((e.clientX - rect.left) / rect.width) * 100;
    const pointerY = ((e.clientY - rect.top) / rect.height) * 100;

    setDragOffset({
      x: pointerX - item.x,
      y: pointerY - item.y,
    });
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (draggingItemId === null) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const pointerX = ((e.clientX - rect.left) / rect.width) * 100;
    const pointerY = ((e.clientY - rect.top) / rect.height) * 100;

    const newX = pointerX - dragOffset.x;
    const newY = pointerY - dragOffset.y;

    setBoardItems(prev => prev.map(item =>
      item.id === draggingItemId
        ? {
            ...item,
            x: Math.max(0, Math.min(newX, 100 - item.width)),
            y: Math.max(0, Math.min(newY, 100 - item.height)),
          }
        : item
    ));
  };

  const handlePointerUp = () => {
    setDraggingItemId(null);
  };

  // Legacy drag-and-drop for desktop (from asset drawer)
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    const assetType = e.dataTransfer.getData('assetType');
    const assetContent = e.dataTransfer.getData('assetContent');
    const assetUrl = e.dataTransfer.getData('assetUrl');

    if (assetType === 'image' && assetUrl) {
      const newItem: BoardItem = {
        id: Date.now(),
        type: 'image',
        imageUrl: assetUrl,
        x: Math.max(0, Math.min(x - 12, 75)),
        y: Math.max(0, Math.min(y - 12, 75)),
        width: 25,
        height: 25,
      };
      setBoardItems(prev => [...prev, newItem]);
    } else if (assetType === 'affirmation' && assetContent) {
      const newItem: BoardItem = {
        id: Date.now(),
        type: 'affirmation',
        content: assetContent,
        x: Math.max(0, Math.min(x - 14, 72)),
        y: Math.max(0, Math.min(y - 6, 88)),
        width: 28,
        height: 12,
      };
      setBoardItems(prev => [...prev, newItem]);
    }

    setShowAssetDrawer(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  };

  const handleDeleteItem = (id: number) => {
    setBoardItems(prev => prev.filter(item => item.id !== id));
    setSelectedItem(null);
    // Haptic feedback
    if (navigator.vibrate) navigator.vibrate(50);
  };

  const handleResizeItem = (id: number, delta: number) => {
    setBoardItems(prev => prev.map(item =>
      item.id === id
        ? {
            ...item,
            width: Math.max(15, Math.min(item.width + delta, 50)),
            height: Math.max(15, Math.min(item.height + delta, 50)),
          }
        : item
    ));
  };

  // Shift Mode View
  if (shiftMode) {
    const currentItem = boardItems[shiftIndex];
    return (
      <div className={styles.shiftModeScreen}>
        <div className={styles.shiftModeBackground} />
        <div className={styles.shiftModeParticles}>
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className={styles.shiftParticle}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${10 + Math.random() * 10}s`,
              }}
            />
          ))}
        </div>

        <button className={styles.shiftModeClose} onClick={() => setShiftMode(false)}>
          {Icons.close}
        </button>

        <div className={styles.shiftModeContent}>
          {currentItem?.type === 'image' && currentItem.imageUrl && (
            <div
              className={styles.shiftModeImage}
              style={{ backgroundImage: `url(${currentItem.imageUrl})` }}
            />
          )}
          {currentItem?.type === 'affirmation' && (
            <h1 className={styles.shiftModeAffirmation}>{currentItem.content}</h1>
          )}
        </div>

        <div className={styles.shiftModeProgress}>
          {boardItems.map((_, i) => (
            <div
              key={i}
              className={`${styles.shiftProgressDot} ${i === shiftIndex ? styles.shiftProgressDotActive : ''}`}
            />
          ))}
        </div>

        <p className={styles.shiftModeInstruction}>Breathe deeply and visualize...</p>
      </div>
    );
  }

  return (
    <div className={styles.visionBoardScreen}>
      {/* Grid Background */}
      <div className={styles.visionBoardGrid} />

      {/* Header */}
      <div className={styles.visionBoardHeader}>
        <div>
          <h1 className={styles.visionBoardTitle}>Reality Shift Board</h1>
          <p className={styles.visionBoardSubtitle}>Design your new reality</p>
        </div>
        <div className={styles.visionBoardActions}>
          <button
            className={styles.shiftModeButton}
            onClick={() => { setShiftMode(true); setShiftIndex(0); }}
            disabled={boardItems.length === 0}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z" />
            </svg>
            Shift Mode
          </button>
        </div>
      </div>

      {/* Canvas */}
      <div
        ref={canvasRef}
        className={styles.visionBoardCanvas}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        onClick={() => setSelectedItem(null)}
        style={{ touchAction: 'none' }}
      >
        {boardItems.length === 0 && (
          <div className={styles.canvasEmpty}>
            <div className={styles.canvasEmptyIcon}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <path d="M3 9h18M9 21V9" />
              </svg>
            </div>
            <p>Tap the + button to add images and affirmations</p>
          </div>
        )}

        {boardItems.map((item) => (
          <div
            key={item.id}
            className={`${styles.boardCanvasItem} ${selectedItem === item.id ? styles.boardCanvasItemSelected : ''} ${draggingItemId === item.id ? styles.boardCanvasItemDragging : ''}`}
            style={{
              left: `${item.x}%`,
              top: `${item.y}%`,
              width: `${item.width}%`,
              height: item.type === 'affirmation' ? 'auto' : `${item.height}%`,
            }}
            onPointerDown={(e) => handleItemPointerDown(e, item)}
            onClick={(e) => { e.stopPropagation(); setSelectedItem(item.id); }}
          >
            {item.type === 'image' && item.imageUrl && (
              <div
                className={styles.boardItemImage}
                style={{ backgroundImage: `url(${item.imageUrl})` }}
              />
            )}
            {item.type === 'affirmation' && (
              <div className={styles.boardItemAffirmation}>
                {item.content}
              </div>
            )}

            {/* Item Controls */}
            {selectedItem === item.id && (
              <div className={styles.itemControls}>
                <button onClick={() => handleResizeItem(item.id, -2)} title="Smaller">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14" />
                  </svg>
                </button>
                <button onClick={() => handleResizeItem(item.id, 2)} title="Larger">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                </button>
                <button onClick={() => handleDeleteItem(item.id)} className={styles.deleteButton} title="Delete">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* FAB to open asset drawer */}
      <button className={styles.visionBoardFab} onClick={() => setShowAssetDrawer(true)}>
        {Icons.plus}
      </button>

      {/* Hidden file input for image upload */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        style={{ display: 'none' }}
      />

      {/* Asset Library Drawer */}
      {showAssetDrawer && (
        <div className={styles.assetDrawerOverlay} onClick={() => setShowAssetDrawer(false)}>
          <div className={styles.assetDrawer} onClick={(e) => e.stopPropagation()}>
            <div className={styles.assetDrawerHeader}>
              <h3>Add to Board</h3>
              <button onClick={() => setShowAssetDrawer(false)}>{Icons.close}</button>
            </div>

            <div className={styles.assetTabs}>
              <button
                className={`${styles.assetTab} ${assetTab === 'upload' ? styles.assetTabActive : ''}`}
                onClick={() => setAssetTab('upload')}
              >
                Upload
              </button>
              <button
                className={`${styles.assetTab} ${styles.assetTabAi} ${assetTab === 'ai' ? styles.assetTabActive : ''}`}
                onClick={() => setAssetTab('ai')}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
                </svg>
                AI
              </button>
              <button
                className={`${styles.assetTab} ${assetTab === 'images' ? styles.assetTabActive : ''}`}
                onClick={() => setAssetTab('images')}
              >
                Gallery
              </button>
              <button
                className={`${styles.assetTab} ${assetTab === 'affirmations' ? styles.assetTabActive : ''}`}
                onClick={() => setAssetTab('affirmations')}
              >
                Words
              </button>
            </div>

            <div className={styles.assetContent}>
              {/* Upload Tab */}
              {assetTab === 'upload' && (
                <div className={styles.uploadSection}>
                  <button
                    className={styles.uploadButton}
                    onClick={triggerFileUpload}
                    disabled={isUploading}
                  >
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" />
                    </svg>
                    <span>{isUploading ? 'Uploading...' : 'Upload from Device'}</span>
                    <p>Add your own photos to visualize your dreams</p>
                  </button>

                  <div className={styles.uploadTips}>
                    <h4>Vision Board Tips</h4>
                    <ul>
                      <li>Add images that represent your goals</li>
                      <li>Include photos of your dream lifestyle</li>
                      <li>Mix images with powerful affirmations</li>
                    </ul>
                  </div>
                </div>
              )}

              {/* AI Generate Tab */}
              {assetTab === 'ai' && (
                <div className={styles.aiGenerateSection}>
                  <div className={styles.aiGenerateHeader}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
                    </svg>
                    <h4>Manifest with AI</h4>
                    <p>Describe your vision and let AI create it</p>
                  </div>

                  <textarea
                    className={styles.aiPromptInput}
                    placeholder="Describe your desired reality...&#10;&#10;Example: A beautiful beach house with sunset view, representing financial freedom and peace"
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                    rows={4}
                    disabled={isGenerating}
                  />

                  {generateError && (
                    <div className={styles.aiError}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10"/>
                        <path d="M12 8v4M12 16h.01"/>
                      </svg>
                      {generateError}
                    </div>
                  )}

                  <button
                    className={styles.aiGenerateButton}
                    onClick={handleGenerateImage}
                    disabled={!aiPrompt.trim() || isGenerating}
                  >
                    {isGenerating ? (
                      <>
                        <div className={styles.aiSpinner} />
                        Manifesting...
                      </>
                    ) : (
                      <>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
                        </svg>
                        Manifest Image
                      </>
                    )}
                  </button>

                  <div className={styles.aiExamples}>
                    <p>Try these prompts:</p>
                    <div className={styles.aiExampleChips}>
                      <button onClick={() => setAiPrompt('A golden key floating in a cosmic nebula, symbolizing unlocking infinite possibilities')}>
                        Golden Key
                      </button>
                      <button onClick={() => setAiPrompt('A peaceful mountain retreat cabin with morning mist, representing tranquility and success')}>
                        Dream Retreat
                      </button>
                      <button onClick={() => setAiPrompt('A thriving garden with golden coins growing like flowers, abundance and growth')}>
                        Abundance Garden
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Images Gallery Tab */}
              {assetTab === 'images' && (
                <div className={styles.assetGrid}>
                  {ASSET_IMAGES.map((img) => (
                    <div
                      key={img.id}
                      className={styles.assetImageItem}
                      draggable
                      onClick={() => addItemToBoard('image', img.label, img.url)}
                      onDragStart={(e) => {
                        e.dataTransfer.setData('assetType', 'image');
                        e.dataTransfer.setData('assetUrl', img.url);
                      }}
                    >
                      <div
                        className={styles.assetImageThumb}
                        style={{ backgroundImage: `url(${img.url})` }}
                      />
                      <span>{img.label}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Affirmations Tab */}
              {assetTab === 'affirmations' && (
                <div className={styles.assetGrid}>
                  {ASSET_AFFIRMATIONS.map((text, i) => (
                    <div
                      key={i}
                      className={styles.assetAffirmationItem}
                      draggable
                      onClick={() => addItemToBoard('affirmation', text)}
                      onDragStart={(e) => {
                        e.dataTransfer.setData('assetType', 'affirmation');
                        e.dataTransfer.setData('assetContent', text);
                      }}
                    >
                      <span>&ldquo;{text}&rdquo;</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <p className={styles.assetDrawerHint}>
              {assetTab === 'upload' && 'Your photos stay private on your device'}
              {assetTab === 'ai' && 'AI-generated images are created just for you'}
              {(assetTab === 'images' || assetTab === 'affirmations') && 'Tap to add or drag onto canvas'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

// Gratitude Journal Screen - with Firestore integration
const GratitudeJournalScreen: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [entry, setEntry] = useState('');
  const [showHistory, setShowHistory] = useState(false);
  const [entries, setEntries] = useState<Array<{ id: string; date: string; content: string; timestamp: number }>>([]);
  const [isAnchoring, setIsAnchoring] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [buttonPulse, setButtonPulse] = useState(false);
  const [particles, setParticles] = useState<Array<{
    id: number;
    x: number;
    y: number;
    size: number;
    color: string;
    shape: 'circle' | 'star';
    velocityX: number;
    velocityY: number;
    rotation: number;
    delay: number;
    duration: number;
  }>>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Load entries from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('gratitudeEntries');
    if (saved) {
      try {
        setEntries(JSON.parse(saved));
      } catch (e) {
        console.error('Error loading entries:', e);
      }
    }
  }, []);

  // Check if user has logged today
  const hasLoggedToday = () => {
    const today = new Date().toDateString();
    return entries.some(e => new Date(e.timestamp).toDateString() === today);
  };

  // Increment streak on first daily entry
  const incrementStreak = () => {
    const savedUser = localStorage.getItem('abundanceUser');
    if (savedUser) {
      const user = JSON.parse(savedUser);
      const lastStreakDate = localStorage.getItem('lastStreakDate');
      const today = new Date().toDateString();

      if (lastStreakDate !== today) {
        user.streak = (user.streak || 0) + 1;
        localStorage.setItem('abundanceUser', JSON.stringify(user));
        localStorage.setItem('lastStreakDate', today);
      }
    }
  };

  // Trigger haptic feedback - stronger burst
  const triggerHaptic = () => {
    if ('vibrate' in navigator) {
      navigator.vibrate([100, 50, 100, 50, 150]);
    }
  };

  // Generate UPLIFTING particle burst - particles float UP toward the sky
  const generateParticles = () => {
    const colors = ['#D4AF37', '#D4AF37', '#D4AF37', '#FFFFFF', '#FFFFFF', '#00E5FF', '#E8C84A'];
    const shapes = ['circle', 'circle', 'circle', 'star', 'star'] as const;
    const newParticles = Array.from({ length: 55 }, (_, i) => {
      // Wide horizontal spread, strong upward velocity
      const spreadX = (Math.random() - 0.5) * 60; // Wide horizontal spread
      const upwardVelocity = -(15 + Math.random() * 25); // Strong negative Y = UP
      return {
        id: Date.now() + i,
        x: 50 + spreadX * 0.3, // Start spread around center
        y: 75 + Math.random() * 5, // Start near button area
        size: 3 + Math.random() * 9, // Varying sizes 3-12px
        color: colors[Math.floor(Math.random() * colors.length)],
        shape: shapes[Math.floor(Math.random() * shapes.length)],
        velocityX: spreadX * 0.8, // Horizontal drift
        velocityY: upwardVelocity, // Always UP (negative)
        rotation: Math.random() * 360,
        delay: Math.random() * 0.2,
        duration: 2 + Math.random() * 1, // 2-3 second lifetime
      };
    });
    setParticles(newParticles);
  };

  // Handle the "Anchor It" action with recoil effect
  const handleAnchor = async () => {
    if (!entry.trim()) return;

    // Trigger button recoil (scale down, then release particles)
    setButtonPulse(true);

    // Small delay for recoil feel, then explode
    await new Promise(resolve => setTimeout(resolve, 100));

    setIsAnchoring(true);
    generateParticles();
    triggerHaptic();

    setTimeout(() => setButtonPulse(false), 500);

    // Save entry
    const newEntry = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      content: entry.trim(),
      timestamp: Date.now(),
    };

    const updatedEntries = [newEntry, ...entries];
    setEntries(updatedEntries);
    localStorage.setItem('gratitudeEntries', JSON.stringify(updatedEntries));

    // Increment streak if first entry today
    if (!hasLoggedToday()) {
      incrementStreak();
    }

    // Wait for particle animation
    await new Promise(resolve => setTimeout(resolve, 2000));

    setEntry('');
    setIsAnchoring(false);
    setParticles([]);
    setShowSuccess(true);

    // Hide success message after 3 seconds
    setTimeout(() => setShowSuccess(false), 3000);
  };

  // Format date for display
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  // History Drawer
  if (showHistory) {
    return (
      <div className={styles.gratitudeScreen}>
        <div className={styles.gratitudeGlow} />

        <header className={styles.gratitudeHeader}>
          <button className={styles.backButtonSmall} onClick={() => setShowHistory(false)}>
            {Icons.back}
          </button>
          <div className={styles.gratitudeHeaderText}>
            <h1 className={styles.gratitudeTitle}>Anchor History</h1>
            <p className={styles.gratitudeSubtitle}>{entries.length} gratitudes anchored</p>
          </div>
          <div style={{ width: 40 }} />
        </header>

        <div className={styles.historyList}>
          {entries.length === 0 ? (
            <div className={styles.emptyHistory}>
              <p>No anchors yet.</p>
              <p className={styles.emptyHistoryHint}>Start by anchoring your first gratitude.</p>
            </div>
          ) : (
            entries.map((e) => (
              <div key={e.id} className={styles.historyCard}>
                <span className={styles.historyDate}>{formatDate(e.date)}</span>
                <p className={styles.historyContent}>{e.content}</p>
              </div>
            ))
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.gratitudeScreen}>
      {/* Ambient breathing glow */}
      <div className={styles.gratitudeGlow} />

      {/* Explosive particle burst during anchor */}
      {isAnchoring && (
        <div className={styles.particleContainer}>
          {particles.map((p) => (
            p.shape === 'star' ? (
              <svg
                key={p.id}
                className={styles.particleStar}
                width={p.size * 1.5}
                height={p.size * 1.5}
                viewBox="0 0 24 24"
                style={{
                  left: `${p.x}%`,
                  top: `${p.y}%`,
                  fill: p.color,
                  filter: `drop-shadow(0 0 ${p.size}px ${p.color})`,
                  '--velocity-x': `${p.velocityX}vw`,
                  '--velocity-y': `${p.velocityY}vh`,
                  '--rotation': `${p.rotation}deg`,
                  '--duration': `${p.duration}s`,
                  animationDelay: `${p.delay}s`,
                } as React.CSSProperties}
              >
                <path d="M12 2l2.4 7.4h7.6l-6 4.6 2.3 7-6.3-4.6-6.3 4.6 2.3-7-6-4.6h7.6z" />
              </svg>
            ) : (
              <div
                key={p.id}
                className={styles.particle}
                style={{
                  left: `${p.x}%`,
                  top: `${p.y}%`,
                  width: `${p.size}px`,
                  height: `${p.size}px`,
                  backgroundColor: p.color,
                  boxShadow: `0 0 ${p.size * 2}px ${p.color}`,
                  '--velocity-x': `${p.velocityX}vw`,
                  '--velocity-y': `${p.velocityY}vh`,
                  '--rotation': `${p.rotation}deg`,
                  '--duration': `${p.duration}s`,
                  animationDelay: `${p.delay}s`,
                } as React.CSSProperties}
              />
            )
          ))}
        </div>
      )}

      {/* Success message overlay */}
      {showSuccess && (
        <div className={styles.successOverlay}>
          <div className={styles.successContent}>
            <div className={styles.successIcon}>✦</div>
            <h2 className={styles.successTitle}>Frequency Shifted</h2>
            <p className={styles.successSubtitle}>Anchor Logged</p>
          </div>
        </div>
      )}

      <header className={styles.gratitudeHeader}>
        <button className={styles.backButtonSmall} onClick={onClose}>
          {Icons.back}
        </button>
        <div className={styles.gratitudeHeaderText}>
          <h1 className={styles.gratitudeTitle}>Gratitude Anchor</h1>
          <p className={styles.gratitudeSubtitle}>Shift your frequency</p>
        </div>
        <button className={styles.historyButton} onClick={() => setShowHistory(true)}>
          {Icons.clock}
        </button>
      </header>

      <div className={styles.gratitudeBody}>
        {/* Main input area */}
        <div className={`${styles.anchorInputContainer} ${isAnchoring ? styles.anchoring : ''}`}>
          <textarea
            ref={textareaRef}
            className={styles.anchorTextarea}
            placeholder="I am truly grateful for…"
            value={entry}
            onChange={(e) => setEntry(e.target.value)}
            disabled={isAnchoring}
          />
        </div>

        {/* Anchor button with pulse effect */}
        <button
          className={`${styles.anchorButton} ${buttonPulse ? styles.anchorButtonPulse : ''}`}
          onClick={handleAnchor}
          disabled={!entry.trim() || isAnchoring}
        >
          {isAnchoring ? (
            <span className={styles.anchoringText}>Anchoring...</span>
          ) : (
            <>
              <span className={styles.anchorIcon}>⚓</span>
              <span>ANCHOR IT</span>
            </>
          )}
        </button>

        {/* Quick prompts */}
        <div className={styles.promptSuggestions}>
          <p className={styles.promptLabel}>Need inspiration?</p>
          <div className={styles.promptChips}>
            <button
              className={styles.promptChip}
              onClick={() => setEntry('I am truly grateful for the gift of ')}
            >
              A gift
            </button>
            <button
              className={styles.promptChip}
              onClick={() => setEntry('I am truly grateful for the person who ')}
            >
              A person
            </button>
            <button
              className={styles.promptChip}
              onClick={() => setEntry('I am truly grateful for the moment when ')}
            >
              A moment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Quick Shift Tools Screen
const QuickShiftToolsScreen: React.FC<{
  onClose: () => void;
  onBreathing: () => void;
  onPlayQuickShift?: (session: AudioSession) => void;
}> = ({ onClose, onBreathing, onPlayQuickShift }) => {
  const tools = [
    {
      id: 'coherent-breathing',
      title: 'Coherent Breathing',
      description: 'A 3-minute guided breathing exercise to reset your nervous system.',
      duration: '3 min',
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="12" cy="12" r="10" />
          <circle cx="12" cy="12" r="6" />
          <circle cx="12" cy="12" r="2" />
        </svg>
      ),
      action: onBreathing,
      hasAudio: false, // Uses visual-only breathing exercise
    },
    {
      id: 'body-scan',
      title: 'Body Scan',
      description: 'A 5-minute guided audio practice to release tension.',
      duration: '5 min',
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="12" cy="5" r="3" />
          <path d="M12 8v4m-4 8l2-6h4l2 6m-8-4h8" />
        </svg>
      ),
      action: () => {
        const session = getAudioSession('body-scan');
        if (session && onPlayQuickShift) {
          onPlayQuickShift(session);
        }
      },
      hasAudio: true,
    },
    {
      id: 'affirmation-repetition',
      title: 'Affirmation Repetition',
      description: 'A 2-minute practice where you repeat powerful affirmations.',
      duration: '2 min',
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M12 2l2.09 6.26L20 10l-5.91 1.74L12 18l-2.09-6.26L4 10l5.91-1.74L12 2z" />
        </svg>
      ),
      action: () => {
        const session = getAudioSession('affirmation-repetition');
        if (session && onPlayQuickShift) {
          onPlayQuickShift(session);
        }
      },
      hasAudio: true,
    },
    {
      id: 'energy-boost',
      title: 'Energy Boost',
      description: 'A quick energizing practice to elevate your state.',
      duration: '3 min',
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
        </svg>
      ),
      action: () => {
        const session = getAudioSession('energy-boost');
        if (session && onPlayQuickShift) {
          onPlayQuickShift(session);
        }
      },
      hasAudio: true,
    },
    {
      id: 'stress-release',
      title: 'Stress Release',
      description: 'Let go of tension in just a few minutes.',
      duration: '4 min',
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      ),
      action: () => {
        const session = getAudioSession('stress-release');
        if (session && onPlayQuickShift) {
          onPlayQuickShift(session);
        }
      },
      hasAudio: true,
    },
  ];

  return (
    <div className={styles.screen}>
      <header className={styles.screenHeaderWithBack}>
        <button className={styles.backButtonSmall} onClick={onClose}>
          {Icons.back}
        </button>
        <div>
          <h2>Quick Shifts</h2>
          <p>Instant reset exercises.</p>
        </div>
      </header>

      <div className={styles.quickShiftsList}>
        {tools.map((tool) => (
          <GlassCard key={tool.id} className={styles.quickShiftCard} onClick={tool.action}>
            <div className={styles.quickShiftIcon}>
              {tool.icon}
            </div>
            <div className={styles.quickShiftInfo}>
              <div className={styles.quickShiftTitleRow}>
                <h4>{tool.title}</h4>
                {tool.hasAudio && (
                  <span className={styles.audioIndicator}>
                    {Icons.headphones}
                  </span>
                )}
              </div>
              <p>{tool.description}</p>
              <span className={styles.quickShiftDuration}>{tool.duration}</span>
            </div>
            <div className={styles.quickShiftArrow}>{Icons.chevronRight}</div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
};

// Breathing Exercise Screen (Coherent Breathing)
const BreathingExerciseScreen: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [phaseProgress, setPhaseProgress] = useState(0);
  const [timeLeft, setTimeLeft] = useState(180); // 3 minutes in seconds
  const [cycleCount, setCycleCount] = useState(0);
  const [useAudioCues, setUseAudioCues] = useState(false);

  // Audio for breathing cues (optional)
  const audioSession = getAudioSession('coherent-breathing');
  const {
    audioRef,
    isPlaying: isAudioPlaying,
    toggle: toggleAudio,
    reset: resetAudio
  } = useAudio(useAudioCues && audioSession ? audioSession.audioUrl : null);

  // Breathing phase timing (in ms)
  const INHALE_DURATION = 6000; // 6 seconds
  const EXHALE_DURATION = 6000; // 6 seconds
  const CYCLE_DURATION = INHALE_DURATION + EXHALE_DURATION;

  useEffect(() => {
    let countdownInterval: NodeJS.Timeout;
    let progressInterval: NodeJS.Timeout;
    let cycleStartTime: number;

    if (isActive && timeLeft > 0) {
      cycleStartTime = Date.now();

      // Update phase progress every 50ms for smooth animation
      progressInterval = setInterval(() => {
        const elapsed = (Date.now() - cycleStartTime) % CYCLE_DURATION;
        const cycleProgress = (elapsed / CYCLE_DURATION) * 100;

        if (elapsed < INHALE_DURATION) {
          setPhase('inhale');
          setPhaseProgress((elapsed / INHALE_DURATION) * 100);
        } else {
          setPhase('exhale');
          setPhaseProgress(((elapsed - INHALE_DURATION) / EXHALE_DURATION) * 100);
        }

        // Count cycles
        const totalElapsed = 180 - timeLeft;
        const newCycleCount = Math.floor((totalElapsed * 1000) / CYCLE_DURATION);
        if (newCycleCount !== cycleCount) {
          setCycleCount(newCycleCount);
          // Haptic feedback on cycle completion
          if (navigator.vibrate) {
            navigator.vibrate(30);
          }
        }
      }, 50);

      countdownInterval = setInterval(() => {
        setTimeLeft((t) => {
          if (t <= 1) {
            setIsActive(false);
            // Session complete - award points
            const currentPoints = parseInt(localStorage.getItem('alignmentPoints') || '0');
            localStorage.setItem('alignmentPoints', (currentPoints + 30).toString());
            // Haptic celebration
            if (navigator.vibrate) {
              navigator.vibrate([100, 50, 100, 50, 100]);
            }
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    }

    return () => {
      clearInterval(countdownInterval);
      clearInterval(progressInterval);
    };
  }, [isActive, timeLeft, cycleCount]);

  // Sync audio with exercise
  useEffect(() => {
    if (useAudioCues && audioSession) {
      if (isActive && !isAudioPlaying) {
        toggleAudio();
      } else if (!isActive && isAudioPlaying) {
        toggleAudio();
      }
    }
  }, [isActive, useAudioCues, audioSession, isAudioPlaying, toggleAudio]);

  const handleStartPause = () => {
    if (!isActive) {
      setPhase('inhale');
      setPhaseProgress(0);
    }
    if (timeLeft === 0) {
      setTimeLeft(180);
      setCycleCount(0);
      if (useAudioCues) {
        resetAudio();
      }
    }
    setIsActive(!isActive);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Calculate circle scale based on phase
  const getCircleScale = () => {
    if (!isActive) return 1;
    if (phase === 'inhale') {
      return 1 + (phaseProgress / 100) * 0.5; // Scale from 1 to 1.5
    } else {
      return 1.5 - (phaseProgress / 100) * 0.5; // Scale from 1.5 to 1
    }
  };

  return (
    <div className={styles.breathingScreen}>
      {/* Hidden audio element for audio cues */}
      <audio ref={audioRef} />

      <button className={styles.closeButton} onClick={onClose}>{Icons.close}</button>

      <div className={styles.breathingContent}>
        <h2 className={styles.breathingTitle}>Coherent Breathing</h2>
        <p className={styles.breathingSubtitle}>6 seconds inhale, 6 seconds exhale</p>

        {/* Cycle counter */}
        {isActive && (
          <div className={styles.breathingCycleCount}>
            Cycle {cycleCount + 1} of 15
          </div>
        )}

        <div className={styles.breathingCircleContainer}>
          <div
            className={`${styles.breathingCircle} ${isActive ? styles.breathingCircleActive : ''}`}
            style={{
              transform: `scale(${getCircleScale()})`,
              transition: 'transform 0.05s linear'
            }}
          />
          <div className={styles.breathingPhase}>
            {isActive ? (phase === 'inhale' ? 'Breathe In' : 'Breathe Out') : 'Ready'}
          </div>
          {isActive && (
            <div className={styles.breathingPhaseTimer}>
              {Math.ceil((phase === 'inhale' ? INHALE_DURATION : EXHALE_DURATION) * (1 - phaseProgress / 100) / 1000)}s
            </div>
          )}
        </div>

        <div className={styles.breathingTimer}>{formatTime(timeLeft)}</div>

        {/* Audio toggle */}
        <button
          className={`${styles.audioToggleButton} ${useAudioCues ? styles.audioToggleActive : ''}`}
          onClick={() => setUseAudioCues(!useAudioCues)}
        >
          {Icons.headphones}
          <span>{useAudioCues ? 'Audio On' : 'Audio Off'}</span>
        </button>

        <Button
          onClick={handleStartPause}
          fullWidth
        >
          {isActive ? 'Pause' : (timeLeft === 0 ? 'Restart' : 'Start')}
        </Button>

        {timeLeft === 0 && (
          <div className={styles.breathingComplete}>
            <span className={styles.breathingCompleteIcon}>{Icons.check}</span>
            <span>Session Complete! +30 points</span>
          </div>
        )}
      </div>
    </div>
  );
};

// Settings Screen - matches reference design
const SettingsScreen: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const settingsItems = [
    { id: 'account', label: 'Account', icon: Icons.user },
    { id: 'notifications', label: 'Notifications', icon: Icons.bell },
    { id: 'voice', label: 'Voice Selection', icon: Icons.mic },
    { id: 'theme', label: 'Theme', icon: Icons.palette },
    { id: 'privacy', label: 'Data & Privacy', icon: Icons.shield },
  ];

  return (
    <div className={styles.screen}>
      <header className={styles.profileHeader}>
        <button onClick={onClose}>{Icons.back}</button>
        <div style={{ width: 48 }} />
      </header>

      <h1 className={styles.settingsTitle}>Settings</h1>

      <div className={styles.settingsGroup}>
        {settingsItems.map((item) => (
          <GlassCard key={item.id} className={styles.settingsItem}>
            <div className={styles.settingsItemLeft}>
              <div className={styles.settingsIcon}>{item.icon}</div>
              <span className={styles.settingsLabel}>{item.label}</span>
            </div>
            <div className={styles.settingsChevron}>{Icons.chevronRight}</div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
};

// ============================================
// PART 1: CONTENT LIBRARIES
// ============================================

// Article Data - High-quality transformative content
interface Article {
  id: string;
  title: string;
  description: string;
  content: string;
  category: string;
  readTime: number;
  heroGradient: string;
  author: string;
}

const articlesLibrary: Article[] = [
  {
    id: 'science-of-recoding',
    title: 'The Science of Recoding',
    description: 'Understanding neuroplasticity and how this app transforms your mind',
    category: 'neuroscience',
    readTime: 8,
    heroGradient: 'linear-gradient(135deg, #000000 0%, #0a0a0a 50%, #000000 100%)',
    author: 'Abundance Recode',
    content: `Your brain is not fixed. This single truth is the foundation of everything we do at Abundance Recode, and it changes everything about what's possible for you.

For most of the 20th century, neuroscientists believed the adult brain was essentially hardwired—that after a certain age, you were stuck with what you had. This belief was wrong. Profoundly wrong.

THE DISCOVERY THAT CHANGED EVERYTHING

In the 1990s, researchers made a discovery that revolutionized our understanding of the brain: neuroplasticity. Your brain is constantly rewiring itself based on your thoughts, experiences, and actions. Every single thing you do—every thought you think, every emotion you feel, every action you take—physically changes the structure of your brain.

This isn't metaphor. This is biology.

When neurons fire together repeatedly, they form stronger connections. As neuroscientist Donald Hebb famously said, "Neurons that fire together, wire together." This means that your habitual thoughts literally become hardwired into your brain architecture.

WHY THIS MATTERS FOR ABUNDANCE

Here's where it gets exciting. If negative thought patterns—scarcity, self-doubt, fear—have been wired into your brain through repetition, then positive patterns—abundance, confidence, possibility—can be wired in the exact same way.

This is not wishful thinking. This is the science.

When you practice gratitude consistently, you strengthen the neural pathways associated with noticing good things. When you visualize success, you activate the same brain regions that would fire if you were actually experiencing that success. When you affirm your worth, you gradually overwrite the old programming that told you otherwise.

HOW ABUNDANCE RECODE WORKS WITH YOUR BRAIN

Every feature in this app is designed with neuroplasticity in mind:

The Gratitude Journal creates new neural pathways for appreciation. Each entry strengthens your brain's ability to notice abundance.

The Affirmation Engine uses repetition and emotional engagement to rewire limiting beliefs. We're not just reading words—we're installing new mental software.

The Reality Shift Board leverages the brain's inability to distinguish between vivid imagination and actual experience. When you visualize your goals with emotion, your brain literally prepares you for that reality.

The Inner Mentor provides the corrective voice that rewires your internal dialogue. Over time, that compassionate voice becomes your default.

THE 66-DAY PRINCIPLE

Research suggests it takes an average of 66 days to form a new habit—to create neural pathways strong enough that a behavior becomes automatic. This is why consistency matters more than intensity.

You don't need to overhaul your life in a day. You need to show up, every day, and let the compound effect of small practices reshape your brain.

YOUR BRAIN IS WAITING

Right now, as you read these words, your brain is changing. The question isn't whether you'll be different tomorrow—the question is whether you'll direct that change intentionally.

That's what Abundance Recode is for. Not to give you the answers, but to help you literally build a new brain—one thought, one practice, one day at a time.

Your recode begins now.`
  },
  {
    id: 'quantum-observation',
    title: 'Quantum Observation',
    description: 'How your focus literally shifts reality',
    category: 'mindset',
    readTime: 7,
    heroGradient: 'linear-gradient(135deg, #000000 0%, #0a0a0a 50%, #000000 100%)',
    author: 'Abundance Recode',
    content: `In the strange world of quantum physics, scientists discovered something that sounds impossible: the act of observation changes what is being observed. This isn't philosophy—it's physics. And it has profound implications for how you create your reality.

THE DOUBLE-SLIT EXPERIMENT

In one of the most famous experiments in physics, scientists fired particles through two slits toward a screen. When unobserved, the particles behaved like waves, creating an interference pattern. But when scientists observed which slit the particle went through, it suddenly behaved like a particle, creating a different pattern.

The act of observation collapsed infinite possibilities into a single reality.

Read that again. Let it sink in.

WHAT THIS MEANS FOR YOU

While quantum effects operate at the subatomic level, the principle offers a powerful metaphor—and perhaps more than metaphor—for how consciousness interacts with reality.

What you focus on, you bring into being. What you observe, you collapse from possibility into actuality. What you expect, you tend to experience.

This isn't magic. It's how your brain works.

THE RETICULAR ACTIVATING SYSTEM

Your brain processes approximately 11 million bits of information per second. Your conscious mind can handle about 50. That means your brain is constantly filtering, deciding what to bring to your attention and what to ignore.

What determines the filter? What you focus on. What you believe is important.

Have you ever bought a new car and suddenly seen that same model everywhere? The cars were always there—but now your brain considers them relevant. Your observation changed your experience of reality.

APPLIED QUANTUM LIVING

When you set an intention, you're telling your brain what to observe. When you visualize a goal, you're collapsing possibility waves into probability. When you affirm "I am abundant," you're not lying to yourself—you're selecting which version of reality to bring into focus.

The Abundance Recode app works on this principle:

Every morning, you set your intention—you choose what to observe. Throughout the day, your brain filters reality to match. Every evening, you review evidence—you reinforce the observation.

FOCUS IS CREATIVE

This is perhaps the most empowering idea in human history: your focus is not passive. You are not merely witnessing reality. You are participating in its creation.

What you consistently observe, you consistently experience. What you refuse to observe loses power over you. Where attention goes, energy flows.

THE OBSERVER EFFECT IN DAILY LIFE

Try this experiment: For one day, look for evidence that the universe is supporting you. Look for coincidences, small kindnesses, unexpected help. Count them. Write them down.

The next day, notice how many more you see.

You didn't change the universe. You changed your observation. And in doing so, you changed your experience of reality.

This is the power you have. Use it wisely.`
  },
  {
    id: 'art-of-letting-go',
    title: 'The Art of Letting Go',
    description: 'Releasing resistance to allow abundance to flow',
    category: 'abundance',
    readTime: 6,
    heroGradient: 'linear-gradient(135deg, #000000 0%, #0a0a0a 50%, #000000 100%)',
    author: 'Abundance Recode',
    content: `There is a paradox at the heart of manifestation: the tighter you grip, the more slips through your fingers. The more you chase, the more eludes you. The secret to receiving is learning to let go.

THE PHYSICS OF RESISTANCE

Imagine trying to catch water by clenching your fist. The harder you squeeze, the more escapes. Now imagine holding your hands open, allowing the water to pool in your palms. This is the difference between resistance and allowing.

Resistance creates tension. Tension blocks flow. And abundance, by its nature, flows.

WHY WE HOLD ON

We grip tightly because we're afraid. Afraid that if we don't control every outcome, things will fall apart. Afraid that relaxing our vigilance means inviting disaster. Afraid that letting go means giving up.

But here's what fear doesn't understand: control is largely an illusion. And the energy spent maintaining that illusion could be used for creation.

THE PRACTICE OF RELEASE

Letting go is not passive. It's not giving up or not caring. It's an active practice of releasing attachment to specific outcomes while maintaining commitment to your intention.

Here's the distinction:
• Attachment: "I need this specific job by this specific date or I'll be devastated."
• Intention with release: "I intend to work that fulfills me and trusts the path to unfold."

One creates desperate, grasping energy. The other creates magnetic, attracting energy.

TECHNIQUES FOR RELEASING

The Breath Release: Breathe deeply. With each exhale, consciously release one worry, one fear, one need to control. Feel it leaving your body with the breath.

The Water Visualization: Imagine your attachment as an object in your hands. Now visualize holding it under running water. Watch as the water slowly dissolves it, carrying it away. You're not fighting it. You're simply allowing it to go.

The "What If" Flip: When you catch yourself thinking, "What if this doesn't work out?" flip it: "What if it works out better than I imagined?" Your brain doesn't know the difference—but your body does. Feel the shift.

The Surrender Statement: Write down what you're holding onto. Then write: "I release my attachment to [this outcome]. I trust that what is meant for me will find me. I am open to receiving."

THE ABUNDANCE PARADOX

Here's what's strange but true: when you release your desperate grip on abundance, it comes more easily. When you trust that there is enough, you make room to receive. When you stop chasing, you become magnetic.

This isn't about being passive. Take action. Work toward your goals. Do the practices. But do them from a place of inspired action rather than desperate grasping.

YOUR ASSIGNMENT

Today, identify one thing you're gripping too tightly. One outcome you're trying to force. One fear you're letting drive your actions.

Then, consciously, with full awareness, practice letting it go.

Not forever. Just for today. Just to see what happens when you trust.

The river of abundance is always flowing. Your only job is to stop damming it up.`
  },
  {
    id: 'morning-rituals',
    title: 'Morning Rituals',
    description: 'Why the first 20 minutes of your day matter most',
    category: 'energy',
    readTime: 5,
    heroGradient: 'linear-gradient(135deg, #000000 0%, #1a1409 50%, #000000 100%)',
    author: 'Abundance Recode',
    content: `The first 20 minutes of your day are not created equal. They are, in fact, the most neurologically significant minutes you'll experience until you sleep again. What you do with them shapes everything that follows.

THE SCIENCE OF MORNING BRAIN STATES

When you first wake up, your brain is in a unique state. You're transitioning from theta waves (associated with dreams and deep relaxation) to alpha waves (relaxed alertness) to beta waves (normal waking consciousness).

During this transition—roughly the first 20 minutes—your subconscious mind is exceptionally receptive. The critical filter that usually guards your beliefs is still drowsy. This is when you can most easily install new programming.

Most people waste this window by immediately checking their phones, flooding their receptive minds with other people's agendas, news designed to trigger anxiety, and notifications that scatter their focus.

THE COST OF A REACTIVE MORNING

When you start your day reactively, you tell your brain: "Other things are more important than my intentions. I am not in control. The world happens to me."

Your brain believes you. And it creates a day to match.

THE ABUNDANCE MORNING PROTOCOL

Here's a simple but powerful morning ritual designed to leverage your brain's receptive state:

MINUTE 0-5: CONSCIOUS AWAKENING
• Keep your eyes closed for a moment after waking
• Take three deep breaths
• Before any other thought, say internally: "Today is full of possibility"
• Feel your body—notice that you're alive, that you have another day

MINUTE 5-10: GRATITUDE ACTIVATION
• While still in bed or sitting quietly, think of three things you're grateful for
• But don't just think them—feel them. Let the gratitude expand in your chest
• This isn't a checklist. This is a feeling practice

MINUTE 10-15: INTENTION SETTING
• Ask yourself: "Who do I want to be today?"
• Visualize yourself moving through your day as that person
• See yourself handling challenges with grace, noticing opportunities, feeling abundant

MINUTE 15-20: AFFIRMATION ANCHORING
• Speak or think your core affirmations
• "I am worthy of abundance"
• "I attract opportunities easily"
• "I am becoming more [quality] every day"
• Feel these as true, not as wishes

WHY THIS WORKS

This ritual works because it:
• Leverages your brain's most receptive state
• Sets an intentional rather than reactive tone
• Activates positive emotion early (which affects your entire day)
• Programs your reticular activating system to notice abundance
• Creates consistency, which builds neural pathways

THE 1% RULE

You don't have to do this perfectly. You don't even have to do the full 20 minutes. Even 5 minutes of intentional morning practice creates ripples throughout your day.

But here's the key: you must do it before you check your phone. Before you read the news. Before you let the world in.

Those first minutes belong to you. Protect them fiercely.

YOUR MORNING, YOUR LIFE

How you start your day is how you live your day. How you live your days is how you live your life.

Tomorrow morning, before the world rushes in, take those 20 minutes. Program your mind with intention. Set the tone consciously.

Your abundant day—and life—begins with your abundant morning.`
  }
];

// ============================================
// AUDIO CONTENT INTEGRATION
// ============================================

// Audio Session Interface
interface AudioSession {
  id: string;
  title: string;
  description: string;
  duration: number; // in seconds
  category: 'meditation' | 'quickshift' | 'soundscape' | 'affirmation';
  audioUrl: string;
  thumbnailGradient: string;
  instructor?: string;
  isFree: boolean;
}

// Audio Sessions Library - URLs point to public audio files for testing
// Using publicly available royalty-free ambient/meditation audio samples
const audioSessionsLibrary: AudioSession[] = [
  // Meditations - Using SoundHelix sample audio for testing
  {
    id: 'morning-visioneering',
    title: 'Morning Visioneering',
    description: 'Start your day by connecting with your highest potential.',
    duration: 720, // 12 min
    category: 'meditation',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    thumbnailGradient: 'linear-gradient(135deg, #D4AF37 0%, #8B6914 100%)',
    instructor: 'Sarah Chen',
    isFree: false
  },
  {
    id: 'mindful-breathing',
    title: 'Mindful Breathing',
    description: 'A simple breathing practice to center your mind.',
    duration: 300, // 5 min
    category: 'meditation',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    thumbnailGradient: 'linear-gradient(135deg, #10B981 0%, #065F46 100%)',
    instructor: 'Sarah Chen',
    isFree: true
  },
  {
    id: 'gratitude-expansion',
    title: 'Gratitude Expansion',
    description: 'Cultivate appreciation that attracts more abundance.',
    duration: 600, // 10 min
    category: 'meditation',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    thumbnailGradient: 'linear-gradient(135deg, #F59E0B 0%, #B45309 100%)',
    instructor: 'Michael Rivers',
    isFree: false
  },
  {
    id: 'confidence-activation',
    title: 'Confidence Activation',
    description: 'Awaken your inner certainty and calm assurance.',
    duration: 900, // 15 min
    category: 'meditation',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
    thumbnailGradient: 'linear-gradient(135deg, #8B5CF6 0%, #5B21B6 100%)',
    instructor: 'Sarah Chen',
    isFree: false
  },
  {
    id: 'first-steps',
    title: 'First Steps',
    description: 'A gentle introduction to meditation practice.',
    duration: 420, // 7 min
    category: 'meditation',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
    thumbnailGradient: 'linear-gradient(135deg, #06B6D4 0%, #0E7490 100%)',
    instructor: 'Sarah Chen',
    isFree: true
  },
  {
    id: 'calm-reset',
    title: 'Calm Reset',
    description: 'Return to peaceful clarity when life feels overwhelming.',
    duration: 480, // 8 min
    category: 'meditation',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3',
    thumbnailGradient: 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)',
    instructor: 'Michael Rivers',
    isFree: false
  },
  {
    id: 'focus-flow',
    title: 'Focus Flow',
    description: 'Clear mental clutter and enter deep, productive focus.',
    duration: 720, // 12 min
    category: 'meditation',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3',
    thumbnailGradient: 'linear-gradient(135deg, #EC4899 0%, #BE185D 100%)',
    instructor: 'Sarah Chen',
    isFree: false
  },
  {
    id: 'abundance-alignment',
    title: 'Abundance Alignment',
    description: 'Tune your energy to the frequency of abundance.',
    duration: 900, // 15 min
    category: 'meditation',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3',
    thumbnailGradient: 'linear-gradient(135deg, #D4AF37 0%, #92702E 100%)',
    instructor: 'Michael Rivers',
    isFree: false
  },
  {
    id: 'deep-sleep-journey',
    title: 'Deep Sleep Journey',
    description: 'Drift into restful sleep with guided relaxation.',
    duration: 1200, // 20 min
    category: 'meditation',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3',
    thumbnailGradient: 'linear-gradient(135deg, #000000 0%, #000000 100%)',
    instructor: 'Sarah Chen',
    isFree: false
  },
  {
    id: 'walking-meditation',
    title: 'Walking Meditation',
    description: 'Find peace and presence in every step.',
    duration: 900, // 15 min
    category: 'meditation',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3',
    thumbnailGradient: 'linear-gradient(135deg, #22C55E 0%, #15803D 100%)',
    instructor: 'Michael Rivers',
    isFree: false
  },
  // Quick Shifts
  {
    id: 'coherent-breathing',
    title: 'Coherent Breathing',
    description: 'A 3-minute guided breathing exercise to reset your nervous system.',
    duration: 180, // 3 min
    category: 'quickshift',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-11.mp3',
    thumbnailGradient: 'linear-gradient(135deg, #06B6D4 0%, #0891B2 100%)',
    isFree: true
  },
  {
    id: 'body-scan',
    title: 'Body Scan',
    description: 'A 5-minute guided audio practice to release tension.',
    duration: 300, // 5 min
    category: 'quickshift',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-12.mp3',
    thumbnailGradient: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)',
    isFree: true
  },
  {
    id: 'affirmation-repetition',
    title: 'Affirmation Repetition',
    description: 'A 2-minute practice where you repeat powerful affirmations.',
    duration: 120, // 2 min
    category: 'quickshift',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-13.mp3',
    thumbnailGradient: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
    isFree: true
  },
  {
    id: 'energy-boost',
    title: 'Energy Boost',
    description: 'A quick energizing practice to elevate your state.',
    duration: 180, // 3 min
    category: 'quickshift',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-14.mp3',
    thumbnailGradient: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
    isFree: false
  },
  {
    id: 'stress-release',
    title: 'Stress Release',
    description: 'Let go of tension in just a few minutes.',
    duration: 240, // 4 min
    category: 'quickshift',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-15.mp3',
    thumbnailGradient: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
    isFree: false
  }
];

// Helper function to get audio session by ID
const getAudioSession = (id: string): AudioSession | undefined => {
  return audioSessionsLibrary.find(session => session.id === id);
};

// Helper to map meditation title to audio session
const getMeditationAudioSession = (title: string): AudioSession | undefined => {
  const normalizedTitle = title.toLowerCase().replace(/\s+/g, '-');
  return audioSessionsLibrary.find(session =>
    session.id === normalizedTitle ||
    session.title.toLowerCase() === title.toLowerCase()
  );
};

// useAudio Hook - Manages audio playback with loading, error handling, and background support
interface UseAudioState {
  isPlaying: boolean;
  isLoading: boolean;
  error: string | null;
  currentTime: number;
  duration: number;
  progress: number;
  isBuffering: boolean;
}

interface UseAudioActions {
  play: () => void;
  pause: () => void;
  toggle: () => void;
  seek: (time: number) => void;
  seekByPercent: (percent: number) => void;
  setVolume: (volume: number) => void;
  reset: () => void;
}

type UseAudioReturn = UseAudioState & UseAudioActions & { audioRef: React.RefObject<HTMLAudioElement> };

const useAudio = (audioUrl: string | null, options?: { autoPlay?: boolean; loop?: boolean }): UseAudioReturn => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isBuffering, setIsBuffering] = useState(false);

  // Calculate progress percentage
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  // Initialize audio element
  useEffect(() => {
    if (!audioUrl) return;

    const audio = audioRef.current;
    if (!audio) return;

    setIsLoading(true);
    setError(null);
    audio.src = audioUrl;
    audio.load();

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
      setIsLoading(false);
      if (options?.autoPlay) {
        audio.play().catch(e => setError('Autoplay blocked. Tap to play.'));
      }
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      if (!options?.loop) {
        setCurrentTime(0);
      }
    };

    const handleError = () => {
      setIsLoading(false);
      setError('Unable to load audio. Please try again.');
    };

    const handleWaiting = () => setIsBuffering(true);
    const handleCanPlay = () => {
      setIsBuffering(false);
      setIsLoading(false);
    };

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);
    audio.addEventListener('waiting', handleWaiting);
    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
      audio.removeEventListener('waiting', handleWaiting);
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
    };
  }, [audioUrl, options?.autoPlay, options?.loop]);

  // Set loop property
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.loop = options?.loop || false;
    }
  }, [options?.loop]);

  const play = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.play().catch(e => {
        console.error('Play failed:', e);
        setError('Playback failed. Please try again.');
      });
    }
  }, []);

  const pause = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
  }, []);

  const toggle = useCallback(() => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  }, [isPlaying, play, pause]);

  const seek = useCallback((time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.max(0, Math.min(time, duration));
    }
  }, [duration]);

  const seekByPercent = useCallback((percent: number) => {
    if (audioRef.current && duration > 0) {
      const time = (percent / 100) * duration;
      audioRef.current.currentTime = time;
    }
  }, [duration]);

  const setVolume = useCallback((volume: number) => {
    if (audioRef.current) {
      audioRef.current.volume = Math.max(0, Math.min(1, volume));
    }
  }, []);

  const reset = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      setCurrentTime(0);
    }
  }, []);

  return {
    audioRef,
    isPlaying,
    isLoading,
    error,
    currentTime,
    duration,
    progress,
    isBuffering,
    play,
    pause,
    toggle,
    seek,
    seekByPercent,
    setVolume,
    reset
  };
};

// Format time helper (seconds to MM:SS)
const formatAudioTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

// 1. Learn & Grow - Article Library Screen
const LearnAndGrowScreen: React.FC<{ onClose: () => void; onArticle: (article: Article) => void }> = ({ onClose, onArticle }) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [readArticles, setReadArticles] = useState<string[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('readArticles');
    if (saved) {
      setReadArticles(JSON.parse(saved));
    }
  }, []);

  const categories = [
    { id: 'mindset', title: 'Mindset', icon: Icons.sparkle, color: '#8B5CF6', description: 'Transform your thinking' },
    { id: 'energy', title: 'Energy', icon: Icons.streak, color: '#F59E0B', description: 'Optimize your vitality' },
    { id: 'abundance', title: 'Abundance', icon: Icons.crown, color: '#10B981', description: 'Attract prosperity' },
    { id: 'neuroscience', title: 'Neuroscience', icon: Icons.chart, color: '#3B82F6', description: 'Understand your brain' },
  ];

  const getArticlesByCategory = (categoryId: string): Article[] => {
    return articlesLibrary.filter(article => article.category === categoryId);
  };

  const getAllArticles = (): Article[] => articlesLibrary;

  const featuredArticle = articlesLibrary[0]; // The Science of Recoding

  if (selectedCategory) {
    const categoryArticles = getArticlesByCategory(selectedCategory);
    const category = categories.find(c => c.id === selectedCategory);
    return (
      <div className={styles.screen}>
        <header className={styles.screenHeaderWithBack}>
          <button className={styles.backButtonSmall} onClick={() => setSelectedCategory(null)}>
            {Icons.back}
          </button>
          <div>
            <h2>{category?.title}</h2>
            <p>{categoryArticles.length} article{categoryArticles.length !== 1 ? 's' : ''}</p>
          </div>
        </header>
        <div className={styles.articleList}>
          {categoryArticles.map((article) => (
            <GlassCard key={article.id} className={styles.articleCardEnhanced} onClick={() => onArticle(article)}>
              <div className={styles.articleCardHero} style={{ background: article.heroGradient }}>
                <div className={styles.articleCardOverlay} />
              </div>
              <div className={styles.articleCardContent}>
                <h3 className={styles.articleTitle}>{article.title}</h3>
                <p className={styles.articleDescription}>{article.description}</p>
                <div className={styles.articleMeta}>
                  <span>{article.readTime} min read</span>
                  {readArticles.includes(article.id) && (
                    <span className={styles.articleReadBadge}>
                      {Icons.check} Read
                    </span>
                  )}
                  {Icons.chevronRight}
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.screen}>
      <header className={styles.screenHeaderWithBack}>
        <button className={styles.backButtonSmall} onClick={onClose}>
          {Icons.back}
        </button>
        <div>
          <h2>Learn & Grow</h2>
          <p>Transform your understanding</p>
        </div>
      </header>

      {/* Featured Article */}
      <div className={styles.featuredSection}>
        <h3 className={styles.sectionLabel}>Featured</h3>
        <GlassCard className={styles.featuredArticleCard} onClick={() => onArticle(featuredArticle)}>
          <div className={styles.featuredHero} style={{ background: featuredArticle.heroGradient }}>
            <div className={styles.featuredOverlay} />
            <div className={styles.featuredContent}>
              <span className={styles.featuredBadge}>Start Here</span>
              <h3 className={styles.featuredTitle}>{featuredArticle.title}</h3>
              <p className={styles.featuredDescription}>{featuredArticle.description}</p>
              <span className={styles.featuredReadTime}>{featuredArticle.readTime} min read</span>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Categories */}
      <div className={styles.categoriesSection}>
        <h3 className={styles.sectionLabel}>Explore Topics</h3>
        <div className={styles.categoryGrid}>
          {categories.map((category) => {
            const categoryArticles = getArticlesByCategory(category.id);
            const unreadCount = categoryArticles.filter(a => !readArticles.includes(a.id)).length;
            return (
              <GlassCard
                key={category.id}
                className={styles.categoryCardEnhanced}
                onClick={() => setSelectedCategory(category.id)}
              >
                <div className={styles.categoryIcon} style={{ color: category.color }}>
                  {category.icon}
                </div>
                <span className={styles.categoryTitle}>{category.title}</span>
                <span className={styles.categoryDescription}>{category.description}</span>
                {unreadCount > 0 && (
                  <span className={styles.categoryBadge} style={{ background: category.color }}>
                    {unreadCount} new
                  </span>
                )}
              </GlassCard>
            );
          })}
        </div>
      </div>

      {/* All Articles Quick Access */}
      <div className={styles.allArticlesSection}>
        <h3 className={styles.sectionLabel}>All Articles</h3>
        <div className={styles.articleList}>
          {getAllArticles().map((article) => (
            <GlassCard key={article.id} className={styles.articleCardCompact} onClick={() => onArticle(article)}>
              <div className={styles.articleCardDot} style={{ background: categories.find(c => c.id === article.category)?.color }} />
              <div className={styles.articleCardInfo}>
                <h4 className={styles.articleTitleCompact}>{article.title}</h4>
                <span className={styles.articleMetaCompact}>{article.readTime} min</span>
              </div>
              {readArticles.includes(article.id) ? (
                <span className={styles.articleCheckmark}>{Icons.check}</span>
              ) : (
                <span className={styles.articleChevron}>{Icons.chevronRight}</span>
              )}
            </GlassCard>
          ))}
        </div>
      </div>
    </div>
  );
};

// Article Reader Screen - Enhanced with progress bar, hero, and mark as read
const ArticleReaderScreen: React.FC<{ article: Article; onClose: () => void; onMarkRead?: (articleId: string, points: number) => void }> = ({ article, onClose, onMarkRead }) => {
  const [readProgress, setReadProgress] = useState(0);
  const [isRead, setIsRead] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const savedReadArticles = localStorage.getItem('readArticles');
    if (savedReadArticles) {
      const readList = JSON.parse(savedReadArticles);
      setIsRead(readList.includes(article.id));
    }
  }, [article.id]);

  useEffect(() => {
    const handleScroll = () => {
      if (contentRef.current) {
        const element = contentRef.current;
        const scrollTop = element.scrollTop;
        const scrollHeight = element.scrollHeight - element.clientHeight;
        const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
        setReadProgress(Math.min(progress, 100));
      }
    };

    const element = contentRef.current;
    if (element) {
      element.addEventListener('scroll', handleScroll);
      return () => element.removeEventListener('scroll', handleScroll);
    }
  }, []);

  const handleMarkAsRead = () => {
    if (isRead) return;

    const savedReadArticles = localStorage.getItem('readArticles');
    const readList = savedReadArticles ? JSON.parse(savedReadArticles) : [];

    if (!readList.includes(article.id)) {
      readList.push(article.id);
      localStorage.setItem('readArticles', JSON.stringify(readList));
      setIsRead(true);
      setShowCelebration(true);

      // Award alignment points
      const currentPoints = parseInt(localStorage.getItem('alignmentPoints') || '0');
      const newPoints = currentPoints + 50;
      localStorage.setItem('alignmentPoints', newPoints.toString());

      if (onMarkRead) {
        onMarkRead(article.id, 50);
      }

      // Haptic feedback
      if (navigator.vibrate) {
        navigator.vibrate([50, 30, 50]);
      }

      setTimeout(() => setShowCelebration(false), 3000);
    }
  };

  // Format content with special handling for headers (ALL CAPS lines)
  const formatContent = (content: string) => {
    return content.split('\n\n').map((paragraph, idx) => {
      // Check if this is a header (ALL CAPS or starts with specific phrases)
      const isHeader = paragraph === paragraph.toUpperCase() && paragraph.length < 100;

      if (isHeader) {
        return (
          <h3 key={idx} className={styles.articleSectionHeader}>
            {paragraph}
          </h3>
        );
      }

      // Check for bullet points
      if (paragraph.includes('\n•') || paragraph.startsWith('•')) {
        const lines = paragraph.split('\n');
        return (
          <ul key={idx} className={styles.articleBulletList}>
            {lines.map((line, lineIdx) => {
              if (line.startsWith('•')) {
                return <li key={lineIdx}>{line.substring(1).trim()}</li>;
              }
              return <p key={lineIdx} className={styles.articleParagraph}>{line}</p>;
            })}
          </ul>
        );
      }

      return (
        <p key={idx} className={styles.articleParagraph}>
          {paragraph}
        </p>
      );
    });
  };

  return (
    <div className={styles.articleReaderScreen}>
      {/* Reading Progress Bar */}
      <div className={styles.readingProgressBar}>
        <div
          className={styles.readingProgressFill}
          style={{ width: `${readProgress}%` }}
        />
      </div>

      {/* Floating Back Button */}
      <button className={styles.articleBackButton} onClick={onClose}>
        {Icons.back}
      </button>

      <div className={styles.articleReaderScrollable} ref={contentRef}>
        {/* Hero Section */}
        <div className={styles.articleHero} style={{ background: article.heroGradient || 'linear-gradient(135deg, #000000 0%, #0a0a0a 100%)' }}>
          <div className={styles.articleHeroOverlay} />
          <div className={styles.articleHeroContent}>
            <span className={styles.articleCategory}>
              {article.category.charAt(0).toUpperCase() + article.category.slice(1)}
            </span>
            <h1 className={styles.articleHeroTitle}>{article.title}</h1>
            <div className={styles.articleHeroMeta}>
              <span>{article.readTime} min read</span>
              <span className={styles.articleMetaDot}>•</span>
              <span>{article.author || 'Abundance Recode'}</span>
            </div>
          </div>
        </div>

        {/* Article Body */}
        <div className={styles.articleBody}>
          <p className={styles.articleLead}>{article.description}</p>
          <div className={styles.articleDivider} />
          <div className={styles.articleContent}>
            {formatContent(article.content)}
          </div>

          {/* Mark as Read Section */}
          <div className={styles.articleFooter}>
            <div className={styles.articleDivider} />
            {isRead ? (
              <div className={styles.articleReadComplete}>
                <span className={styles.articleReadIcon}>{Icons.check}</span>
                <span>You've completed this article</span>
                <span className={styles.articlePointsEarned}>+50 Alignment Points earned</span>
              </div>
            ) : (
              <button className={styles.markAsReadButton} onClick={handleMarkAsRead}>
                <span className={styles.markAsReadIcon}>{Icons.check}</span>
                <span>Mark as Read</span>
                <span className={styles.markAsReadPoints}>+50 pts</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Celebration Overlay */}
      {showCelebration && (
        <div className={styles.articleCelebration}>
          <div className={styles.celebrationContent}>
            <span className={styles.celebrationIcon}>{Icons.sparkle}</span>
            <h3>Knowledge Absorbed!</h3>
            <p>+50 Alignment Points</p>
          </div>
        </div>
      )}
    </div>
  );
};

// 2. Visualization Tools Screen
const VisualizationsScreen: React.FC<{ onClose: () => void; onPlay: (viz: any) => void }> = ({ onClose, onPlay }) => {
  const visualizations = [
    { id: '1', title: 'Future Self Visualization', duration: '10 min', description: 'Meet your highest potential self', prompts: ['Close your eyes and take three deep breaths...', 'Imagine yourself one year from now, having achieved all your goals...', 'Notice how you carry yourself. What do you see?', 'How do you feel in your body?', 'What does your daily life look like?', 'What beliefs do you hold about yourself?', 'What message does your future self have for you today?', 'Carry this vision with you as you open your eyes...'] },
    { id: '2', title: 'Abundance Visualization', duration: '8 min', description: 'Tune into unlimited prosperity', prompts: ['Breathe deeply and relax your body...', 'Imagine a golden light surrounding you, representing infinite abundance...', 'Feel the energy of prosperity flowing through you...', 'See yourself receiving unexpected blessings...', 'Notice how it feels to have more than enough...', 'Express gratitude for all the abundance in your life...', 'Know that you are worthy of all that you desire...', 'Carry this feeling of abundance with you...'] },
    { id: '3', title: 'Healing Light Visualization', duration: '12 min', description: 'Restore and rejuvenate', prompts: ['Find a comfortable position and close your eyes...', 'Imagine a warm, healing light above your head...', 'Let this light slowly descend through your body...', 'Feel it dissolving any tension or discomfort...', 'Allow it to heal any emotional wounds...', 'Let it fill every cell with vibrant energy...', 'You are whole, healed, and complete...', 'Open your eyes when you are ready...'] },
    { id: '4', title: 'Confidence Activation', duration: '7 min', description: 'Embody unshakable self-belief', prompts: ['Stand or sit tall with your shoulders back...', 'Remember a time when you felt completely confident...', 'Let that feeling expand throughout your body...', 'See yourself succeeding in your current challenges...', 'Notice how powerful and capable you feel...', 'This confidence is always available to you...', 'You are ready for whatever comes your way...', 'Carry this confidence into your day...'] },
  ];

  return (
    <div className={styles.screen}>
      <header className={styles.screenHeaderWithBack}>
        <button className={styles.backButtonSmall} onClick={onClose}>
          {Icons.back}
        </button>
        <div>
          <h2>Visualization Tools</h2>
          <p>See your future self</p>
        </div>
      </header>
      <div className={styles.visualizationList}>
        {visualizations.map((viz) => (
          <GlassCard key={viz.id} className={styles.visualizationCard} onClick={() => onPlay(viz)}>
            <div className={styles.visualizationIcon}>{Icons.eye}</div>
            <div className={styles.visualizationInfo}>
              <h3>{viz.title}</h3>
              <p>{viz.description}</p>
              <span className={styles.visualizationDuration}>{viz.duration}</span>
            </div>
            <div className={styles.playIconSmall}>{Icons.play}</div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
};

// Visualization Player Screen
const VisualizationPlayerScreen: React.FC<{ visualization: any; onClose: () => void }> = ({ visualization, onClose }) => {
  const [currentPromptIndex, setCurrentPromptIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setCurrentPromptIndex((prev) => {
        if (prev >= visualization.prompts.length - 1) {
          setIsPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, 30000); // 30 seconds per prompt

    return () => clearInterval(interval);
  }, [isPlaying, visualization.prompts.length]);

  return (
    <div className={styles.visualizationPlayer}>
      <button className={styles.closeButton} onClick={onClose}>{Icons.close}</button>
      <div className={styles.visualizationContent}>
        <h2 className={styles.visualizationTitle}>{visualization.title}</h2>
        <div className={styles.promptContainer}>
          <p className={styles.promptText}>{visualization.prompts[currentPromptIndex]}</p>
        </div>
        <div className={styles.promptProgress}>
          {visualization.prompts.map((_: any, idx: number) => (
            <div
              key={idx}
              className={`${styles.promptDot} ${idx === currentPromptIndex ? styles.promptDotActive : ''} ${idx < currentPromptIndex ? styles.promptDotComplete : ''}`}
            />
          ))}
        </div>
        <div className={styles.visualizationControls}>
          <button
            className={styles.vizControlButton}
            onClick={() => setCurrentPromptIndex(Math.max(0, currentPromptIndex - 1))}
          >
            {Icons.back}
          </button>
          <button
            className={styles.vizPlayButton}
            onClick={() => setIsPlaying(!isPlaying)}
          >
            {isPlaying ? Icons.pause : Icons.play}
          </button>
          <button
            className={styles.vizControlButton}
            onClick={() => setCurrentPromptIndex(Math.min(visualization.prompts.length - 1, currentPromptIndex + 1))}
          >
            <div style={{ transform: 'rotate(180deg)' }}>{Icons.back}</div>
          </button>
        </div>
      </div>
    </div>
  );
};

// 3. Emotional Reset Screen
const EmotionalResetScreen: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [playing, setPlaying] = useState<string | null>(null);

  const practices = [
    { id: '1', title: 'Releasing Anxiety', duration: '5 min', description: 'Calm your nervous system' },
    { id: '2', title: 'Processing Frustration', duration: '7 min', description: 'Transform anger into clarity' },
    { id: '3', title: 'Healing Sadness', duration: '10 min', description: 'Honor and release grief' },
    { id: '4', title: 'Overcoming Fear', duration: '8 min', description: 'Face fear with courage' },
    { id: '5', title: 'Letting Go', duration: '6 min', description: 'Release what no longer serves you' },
  ];

  return (
    <div className={styles.screen}>
      <header className={styles.screenHeaderWithBack}>
        <button className={styles.backButtonSmall} onClick={onClose}>
          {Icons.back}
        </button>
        <div>
          <h2>Emotional Reset</h2>
          <p>Process and release</p>
        </div>
      </header>
      <div className={styles.emotionalResetList}>
        {practices.map((practice) => (
          <GlassCard
            key={practice.id}
            className={`${styles.emotionalResetCard} ${playing === practice.id ? styles.emotionalResetCardActive : ''}`}
            onClick={() => setPlaying(playing === practice.id ? null : practice.id)}
          >
            <div className={styles.emotionalResetIcon}>{Icons.heart}</div>
            <div className={styles.emotionalResetInfo}>
              <h3>{practice.title}</h3>
              <p>{practice.description}</p>
              <span className={styles.emotionalResetDuration}>{practice.duration}</span>
            </div>
            <button className={styles.playIconSmall}>
              {playing === practice.id ? Icons.pause : Icons.play}
            </button>
          </GlassCard>
        ))}
      </div>
      {playing && (
        <div className={styles.audioPlayerBar}>
          <div className={styles.audioPlayerInfo}>
            <span>{practices.find(p => p.id === playing)?.title}</span>
            <span className={styles.audioPlayerTime}>0:00 / {practices.find(p => p.id === playing)?.duration}</span>
          </div>
          <div className={styles.audioPlayerProgress}>
            <div className={styles.audioPlayerProgressBar} style={{ width: '30%' }} />
          </div>
        </div>
      )}
    </div>
  );
};

// 4. Soundscapes Screen
const SoundscapesScreen: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [playing, setPlaying] = useState<string | null>(null);
  const [volume, setVolume] = useState(80);

  const soundscapes = [
    { id: '1', title: 'Rainfall', description: 'Gentle rain on leaves', icon: '🌧️' },
    { id: '2', title: 'Ocean Waves', description: 'Soothing coastal sounds', icon: '🌊' },
    { id: '3', title: 'Forest Ambience', description: 'Birds and rustling leaves', icon: '🌲' },
    { id: '4', title: 'Binaural Beats', description: 'Focus enhancement (40Hz)', icon: '🧠' },
    { id: '5', title: 'Tibetan Bowls', description: 'Healing sound frequencies', icon: '🔔' },
    { id: '6', title: 'White Noise', description: 'Consistent ambient sound', icon: '📻' },
  ];

  return (
    <div className={styles.screen}>
      <header className={styles.screenHeaderWithBack}>
        <button className={styles.backButtonSmall} onClick={onClose}>
          {Icons.back}
        </button>
        <div>
          <h2>Soundscapes</h2>
          <p>Ambient sounds for focus</p>
        </div>
      </header>
      <div className={styles.soundscapeGrid}>
        {soundscapes.map((sound) => (
          <GlassCard
            key={sound.id}
            className={`${styles.soundscapeCard} ${playing === sound.id ? styles.soundscapeCardActive : ''}`}
            onClick={() => setPlaying(playing === sound.id ? null : sound.id)}
          >
            <span className={styles.soundscapeEmoji}>{sound.icon}</span>
            <h3 className={styles.soundscapeTitle}>{sound.title}</h3>
            <p className={styles.soundscapeDesc}>{sound.description}</p>
            {playing === sound.id && (
              <div className={styles.soundscapePlaying}>
                <span className={styles.soundWave} />
                <span className={styles.soundWave} />
                <span className={styles.soundWave} />
              </div>
            )}
          </GlassCard>
        ))}
      </div>
      {playing && (
        <div className={styles.soundscapeControls}>
          <div className={styles.volumeControl}>
            {Icons.volume}
            <input
              type="range"
              min="0"
              max="100"
              value={volume}
              onChange={(e) => setVolume(Number(e.target.value))}
              className={styles.volumeSlider}
            />
          </div>
        </div>
      )}
    </div>
  );
};

// 5. Audiobooks Screen
const AudiobooksScreen: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const audiobooks = [
    { id: '1', title: 'The Power of Now', author: 'Eckhart Tolle', cover: '📘', audibleUrl: 'https://www.audible.com/pd/The-Power-of-Now-Audiobook/B002V0PN36' },
    { id: '2', title: 'Atomic Habits', author: 'James Clear', cover: '📗', audibleUrl: 'https://www.audible.com/pd/Atomic-Habits-Audiobook/1524779261' },
    { id: '3', title: 'Think and Grow Rich', author: 'Napoleon Hill', cover: '📙', audibleUrl: 'https://www.audible.com/pd/Think-and-Grow-Rich-Audiobook/B002V5D950' },
    { id: '4', title: 'Breaking The Habit of Being Yourself', author: 'Dr. Joe Dispenza', cover: '📕', audibleUrl: 'https://www.audible.com/pd/Breaking-the-Habit-of-Being-Yourself-Audiobook/B007CLYA9C' },
    { id: '5', title: 'The Untethered Soul', author: 'Michael A. Singer', cover: '📓', audibleUrl: 'https://www.audible.com/pd/The-Untethered-Soul-Audiobook/B006LSZUK8' },
    { id: '6', title: 'You Are a Badass', author: 'Jen Sincero', cover: '📔', audibleUrl: 'https://www.audible.com/pd/You-Are-a-Badass-Audiobook/B00BW240I6' },
  ];

  return (
    <div className={styles.screen}>
      <header className={styles.screenHeaderWithBack}>
        <button className={styles.backButtonSmall} onClick={onClose}>
          {Icons.back}
        </button>
        <div>
          <h2>Recommended Audiobooks</h2>
          <p>Transform through listening</p>
        </div>
      </header>
      <div className={styles.audiobookList}>
        {audiobooks.map((book) => (
          <GlassCard key={book.id} className={styles.audiobookCard}>
            <div className={styles.audiobookCover}>{book.cover}</div>
            <div className={styles.audiobookInfo}>
              <h3 className={styles.audiobookTitle}>{book.title}</h3>
              <p className={styles.audiobookAuthor}>by {book.author}</p>
            </div>
            <a
              href={book.audibleUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.audibleButton}
            >
              Listen on Audible {Icons.externalLink}
            </a>
          </GlassCard>
        ))}
      </div>
    </div>
  );
};

// ============================================
// PART 2: PREMIUM & PERSONALIZATION FEATURES
// ============================================

// 6. Subscription Paywall Screen
const PaywallScreen: React.FC<{ onClose: () => void; onSubscribe: () => void }> = ({ onClose, onSubscribe }) => {
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'annual'>('annual');

  const features = [
    'Unlock All Meditations',
    'AI Inner Mentor Chat',
    'Advanced Analytics',
    'All visualization tools',
    'Complete article library',
    'Emotional reset practices',
    'Premium soundscapes',
    'Priority support',
  ];

  // RevenueCat integration placeholder
  const handleSubscribe = async () => {
    try {
      // TODO: Implement RevenueCat SDK integration
      // import Purchases from 'react-native-purchases';
      // const offerings = await Purchases.getOfferings();
      // const selectedPackage = selectedPlan === 'monthly'
      //   ? offerings.current?.monthly
      //   : offerings.current?.annual;
      // if (selectedPackage) {
      //   const { customerInfo } = await Purchases.purchasePackage(selectedPackage);
      //   if (customerInfo.entitlements.active['premium']) {
      //     onSubscribe();
      //   }
      // }

      // For now, simulate successful subscription
      console.log(`RevenueCat: Initiating ${selectedPlan} subscription`);
      onSubscribe();
    } catch (error) {
      console.error('Subscription error:', error);
    }
  };

  return (
    <div className={styles.paywallScreen}>
      <button className={styles.closeButton} onClick={onClose}>{Icons.close}</button>
      <div className={styles.paywallContent}>
        <div className={styles.paywallHeader}>
          <div className={styles.crownIcon}>{Icons.crown}</div>
          <h1>Unlock Your Full Potential</h1>
          <p>Choose your plan to begin the journey.</p>
        </div>

        <div className={styles.planCards}>
          <GlassCard
            className={`${styles.planCard} ${selectedPlan === 'monthly' ? styles.planCardSelected : ''}`}
            onClick={() => setSelectedPlan('monthly')}
          >
            <h3>Monthly</h3>
            <div className={styles.planPrice}>
              <span className={styles.currency}>$</span>
              <span className={styles.amount}>14.99</span>
              <span className={styles.period}>/month</span>
            </div>
            <div className={styles.planFeatures}>
              {features.slice(0, 4).map((feature, idx) => (
                <div key={idx} className={styles.planFeatureItem}>
                  <span className={styles.checkIcon}>✓</span>
                  <span>{feature}</span>
                </div>
              ))}
            </div>
            <Button onClick={handleSubscribe} fullWidth variant={selectedPlan === 'monthly' ? 'primary' : 'secondary'}>
              Start 7-Day Free Trial
            </Button>
          </GlassCard>

          <GlassCard
            className={`${styles.planCard} ${selectedPlan === 'annual' ? styles.planCardSelected : ''}`}
            onClick={() => setSelectedPlan('annual')}
          >
            <div className={styles.bestValueBadge}>Best Value</div>
            <h3>Annual</h3>
            <div className={styles.planPrice}>
              <span className={styles.currency}>$</span>
              <span className={styles.amount}>99.99</span>
              <span className={styles.period}>/year</span>
            </div>
            <p className={styles.planSavings}>Save 44%</p>
            <div className={styles.planFeatures}>
              {features.slice(0, 4).map((feature, idx) => (
                <div key={idx} className={styles.planFeatureItem}>
                  <span className={styles.checkIcon}>✓</span>
                  <span>{feature}</span>
                </div>
              ))}
            </div>
            <Button onClick={handleSubscribe} fullWidth variant={selectedPlan === 'annual' ? 'primary' : 'secondary'}>
              Start 7-Day Free Trial
            </Button>
          </GlassCard>
        </div>

        <p className={styles.paywallDisclaimer}>
          Cancel anytime during your free trial. No charge until trial ends.
        </p>
      </div>
    </div>
  );
};

// 7 & 8. Enhanced Settings Screen (replaces existing)
const EnhancedSettingsScreen: React.FC<{
  onClose: () => void;
  user: UserState;
  onUpdateUser: (updates: Partial<UserState>) => void;
  onReminders: () => void;
  onVoiceSelector: () => void;
  onPricing: () => void;
}> = ({ onClose, user, onUpdateUser, onReminders, onVoiceSelector, onPricing }) => {
  const [darkMode, setDarkMode] = useState(false);

  const handleManageSubscription = async () => {
    await revenueCatService.manageSubscription();
  };

  const settingsSections = [
    {
      title: 'Account',
      items: [
        { icon: Icons.user, label: 'Profile', action: () => {} },
        { icon: Icons.bell, label: 'Notifications', action: onReminders },
      ],
    },
    {
      title: 'Preferences',
      items: [
        { icon: Icons.mic, label: 'Voice Selection', action: onVoiceSelector, value: user.voicePreference },
        { icon: Icons.palette, label: 'Dark Mode', action: () => setDarkMode(!darkMode), toggle: true, value: darkMode },
      ],
    },
    {
      title: 'Support',
      items: [
        { icon: Icons.shield, label: 'Data & Privacy', action: () => {} },
        { icon: Icons.chat, label: 'Help & Feedback', action: () => {} },
      ],
    },
  ];

  return (
    <div className={styles.screen}>
      <header className={styles.screenHeaderWithBack}>
        <button className={styles.backButtonSmall} onClick={onClose}>
          {Icons.back}
        </button>
        <div>
          <h2>Settings</h2>
        </div>
      </header>

      {/* Subscription Section */}
      <div className={styles.subscriptionSection}>
        <h3 className={styles.settingsSectionTitle}>Subscription</h3>
        <GlassCard className={styles.subscriptionCard}>
          {user.isPremium ? (
            <>
              <div className={styles.subscriptionCardHeader}>
                <span className={styles.subscriptionCardTitle}>Premium Member</span>
                <button className={styles.manageButton} onClick={handleManageSubscription}>
                  Manage
                </button>
              </div>
              <div className={styles.subscriptionCardInfo}>
                <span className={styles.subscriptionPlanName}>
                  Current Plan: {user.subscriptionPlan === 'annual' ? 'Annual' : 'Monthly'}
                </span>
                {user.subscriptionExpiresAt && (
                  <span className={styles.subscriptionExpiry}>
                    Renews on {new Date(user.subscriptionExpiresAt).toLocaleDateString()}
                  </span>
                )}
              </div>
            </>
          ) : (
            <>
              <div className={styles.subscriptionCardHeader}>
                <span className={styles.subscriptionCardTitle}>Free Member</span>
              </div>
              <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', marginBottom: '16px' }}>
                Upgrade to unlock all premium features
              </p>
              <Button onClick={onPricing} fullWidth>
                Upgrade to Premium
              </Button>
            </>
          )}
        </GlassCard>
      </div>

      <div className={styles.settingsSections}>
        {settingsSections.map((section, sIdx) => (
          <div key={sIdx} className={styles.settingsSection}>
            <h3 className={styles.settingsSectionTitle}>{section.title}</h3>
            {section.items.map((item, iIdx) => (
              <GlassCard key={iIdx} className={styles.settingsItem} onClick={item.action}>
                <div className={styles.settingsItemLeft}>
                  <div className={styles.settingsIcon}>{item.icon}</div>
                  <span className={styles.settingsLabel}>{item.label}</span>
                </div>
                <div className={styles.settingsItemRight}>
                  {'toggle' in item && item.toggle ? (
                    <div className={`${styles.toggle} ${'value' in item && item.value ? styles.toggleActive : ''}`}>
                      <div className={styles.toggleKnob} />
                    </div>
                  ) : 'value' in item && item.value ? (
                    <span className={styles.settingsValue}>{String(item.value)}</span>
                  ) : (
                    Icons.chevronRight
                  )}
                </div>
              </GlassCard>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

// 9. Enhanced Progress & Analytics Screen
const EnhancedProgressScreen: React.FC<{ user: UserState }> = ({ user }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'calendar'>('overview');

  // Mock data for charts
  const weeklyScores = [72, 75, 78, 82, 80, 85, user.alignmentScore];
  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const sessionData = [
    { day: 'Mon', sessions: 2 },
    { day: 'Tue', sessions: 3 },
    { day: 'Wed', sessions: 1 },
    { day: 'Thu', sessions: 2 },
    { day: 'Fri', sessions: 3 },
    { day: 'Sat', sessions: 2 },
    { day: 'Sun', sessions: 1 },
  ];

  // Calendar data
  const today = new Date();
  const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1).getDay();
  const streakDays = Array.from({ length: user.streak }, (_, i) => today.getDate() - i).filter(d => d > 0);

  return (
    <div className={styles.screen}>
      <header className={styles.screenHeader}>
        <h2>Progress & Analytics</h2>
        <p>Your transformation journey</p>
      </header>

      <div className={styles.tabSelector}>
        <button
          className={`${styles.tabButton} ${activeTab === 'overview' ? styles.tabButtonActive : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button
          className={`${styles.tabButton} ${activeTab === 'calendar' ? styles.tabButtonActive : ''}`}
          onClick={() => setActiveTab('calendar')}
        >
          Calendar
        </button>
      </div>

      {activeTab === 'overview' ? (
        <div className={styles.analyticsContent}>
          <GlassCard className={styles.statsRow}>
            <div className={styles.statItem}>
              <span className={styles.statValue}>{user.streak}</span>
              <span className={styles.statLabel}>Day Streak</span>
            </div>
            <div className={styles.statDivider} />
            <div className={styles.statItem}>
              <span className={styles.statValue}>42</span>
              <span className={styles.statLabel}>Sessions</span>
            </div>
            <div className={styles.statDivider} />
            <div className={styles.statItem}>
              <span className={styles.statValue}>{user.alignmentScore}</span>
              <span className={styles.statLabel}>Score</span>
            </div>
          </GlassCard>

          <GlassCard className={styles.chartCard}>
            <h3>Alignment Score</h3>
            <div className={styles.lineChart}>
              <div className={styles.chartLine}>
                {weeklyScores.map((score, idx) => (
                  <div
                    key={idx}
                    className={styles.chartPoint}
                    style={{
                      left: `${(idx / 6) * 100}%`,
                      bottom: `${((score - 60) / 40) * 100}%`,
                    }}
                  >
                    <div className={styles.chartDot} />
                    <span className={styles.chartLabel}>{weekDays[idx]}</span>
                  </div>
                ))}
              </div>
            </div>
          </GlassCard>

          <GlassCard className={styles.chartCard}>
            <h3>Session Consistency</h3>
            <div className={styles.barChart}>
              {sessionData.map((data, idx) => (
                <div key={idx} className={styles.barContainer}>
                  <div
                    className={styles.bar}
                    style={{ height: `${(data.sessions / 3) * 100}%` }}
                  />
                  <span className={styles.barLabel}>{data.day}</span>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      ) : (
        <div className={styles.calendarContent}>
          <GlassCard className={styles.calendarCard}>
            <h3>{today.toLocaleString('default', { month: 'long', year: 'numeric' })}</h3>
            <div className={styles.calendarGrid}>
              {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, idx) => (
                <div key={idx} className={styles.calendarDayHeader}>{day}</div>
              ))}
              {Array.from({ length: firstDayOfMonth }).map((_, idx) => (
                <div key={`empty-${idx}`} className={styles.calendarDayEmpty} />
              ))}
              {Array.from({ length: daysInMonth }).map((_, idx) => {
                const dayNum = idx + 1;
                const isStreak = streakDays.includes(dayNum);
                const isToday = dayNum === today.getDate();
                return (
                  <div
                    key={dayNum}
                    className={`${styles.calendarDay} ${isStreak ? styles.calendarDayStreak : ''} ${isToday ? styles.calendarDayToday : ''}`}
                  >
                    {dayNum}
                  </div>
                );
              })}
            </div>
          </GlassCard>
        </div>
      )}
    </div>
  );
};

// 11. Custom Reminders Screen
const RemindersScreen: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [reminders, setReminders] = useState([
    { id: '1', time: '07:00', message: 'Morning meditation time', enabled: true },
    { id: '2', time: '12:00', message: 'Midday gratitude check-in', enabled: true },
    { id: '3', time: '21:00', message: 'Evening reflection', enabled: true },
  ]);

  const toggleReminder = (id: string) => {
    setReminders(reminders.map(r =>
      r.id === id ? { ...r, enabled: !r.enabled } : r
    ));
  };

  return (
    <div className={styles.screen}>
      <header className={styles.screenHeaderWithBack}>
        <button className={styles.backButtonSmall} onClick={onClose}>
          {Icons.back}
        </button>
        <div>
          <h2>Reminders</h2>
          <p>Stay on track</p>
        </div>
      </header>
      <div className={styles.remindersList}>
        {reminders.map((reminder) => (
          <GlassCard key={reminder.id} className={styles.reminderCard}>
            <div className={styles.reminderInfo}>
              <div className={styles.reminderTime}>{reminder.time}</div>
              <div className={styles.reminderMessage}>{reminder.message}</div>
            </div>
            <div
              className={`${styles.toggle} ${reminder.enabled ? styles.toggleActive : ''}`}
              onClick={() => toggleReminder(reminder.id)}
            >
              <div className={styles.toggleKnob} />
            </div>
          </GlassCard>
        ))}
        <Button variant="secondary" fullWidth onClick={() => {}}>
          + Add Reminder
        </Button>
      </div>
    </div>
  );
};

// Enhanced Notifications Screen with Custom Reminders
const NotificationsScreen: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [showAddReminder, setShowAddReminder] = useState(false);
  const [notifications, setNotifications] = useState({
    morningVisioneering: true,
    eveningReflection: true,
    dailyGratitude: false,
    weeklyProgress: true,
  });

  const [customReminders, setCustomReminders] = useState([
    { id: '1', label: 'Midday check-in', time: '12:00', days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'], enabled: true },
  ]);

  const [newReminder, setNewReminder] = useState({
    label: '',
    time: '09:00',
    days: [] as string[],
  });

  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const toggleNotification = (key: keyof typeof notifications) => {
    setNotifications({ ...notifications, [key]: !notifications[key] });
  };

  const toggleCustomReminder = (id: string) => {
    setCustomReminders(customReminders.map(r =>
      r.id === id ? { ...r, enabled: !r.enabled } : r
    ));
  };

  const toggleDay = (day: string) => {
    if (newReminder.days.includes(day)) {
      setNewReminder({ ...newReminder, days: newReminder.days.filter(d => d !== day) });
    } else {
      setNewReminder({ ...newReminder, days: [...newReminder.days, day] });
    }
  };

  const saveReminder = () => {
    if (newReminder.label && newReminder.days.length > 0) {
      setCustomReminders([
        ...customReminders,
        {
          id: Date.now().toString(),
          ...newReminder,
          enabled: true,
        },
      ]);
      setNewReminder({ label: '', time: '09:00', days: [] });
      setShowAddReminder(false);
    }
  };

  const deleteReminder = (id: string) => {
    setCustomReminders(customReminders.filter(r => r.id !== id));
  };

  return (
    <div className={styles.screen}>
      <header className={styles.screenHeaderWithBack}>
        <button className={styles.backButtonSmall} onClick={onClose}>
          {Icons.back}
        </button>
        <div>
          <h2>Notifications</h2>
          <p>Manage your reminders</p>
        </div>
      </header>

      <div className={styles.notificationsContent}>
        {/* Pre-defined Notifications Section */}
        <div className={styles.notificationSection}>
          <h3 className={styles.notificationSectionTitle}>Daily Reminders</h3>

          <GlassCard className={styles.notificationItem}>
            <div className={styles.notificationInfo}>
              <div className={styles.notificationIcon}>{Icons.sun}</div>
              <div className={styles.notificationText}>
                <span className={styles.notificationLabel}>Morning Visioneering</span>
                <span className={styles.notificationTime}>7:00 AM</span>
              </div>
            </div>
            <div
              className={`${styles.toggle} ${notifications.morningVisioneering ? styles.toggleActive : ''}`}
              onClick={() => toggleNotification('morningVisioneering')}
            >
              <div className={styles.toggleKnob} />
            </div>
          </GlassCard>

          <GlassCard className={styles.notificationItem}>
            <div className={styles.notificationInfo}>
              <div className={styles.notificationIcon}>{Icons.moon}</div>
              <div className={styles.notificationText}>
                <span className={styles.notificationLabel}>Evening Reflection</span>
                <span className={styles.notificationTime}>9:00 PM</span>
              </div>
            </div>
            <div
              className={`${styles.toggle} ${notifications.eveningReflection ? styles.toggleActive : ''}`}
              onClick={() => toggleNotification('eveningReflection')}
            >
              <div className={styles.toggleKnob} />
            </div>
          </GlassCard>

          <GlassCard className={styles.notificationItem}>
            <div className={styles.notificationInfo}>
              <div className={styles.notificationIcon}>{Icons.heart}</div>
              <div className={styles.notificationText}>
                <span className={styles.notificationLabel}>Daily Gratitude</span>
                <span className={styles.notificationTime}>12:00 PM</span>
              </div>
            </div>
            <div
              className={`${styles.toggle} ${notifications.dailyGratitude ? styles.toggleActive : ''}`}
              onClick={() => toggleNotification('dailyGratitude')}
            >
              <div className={styles.toggleKnob} />
            </div>
          </GlassCard>

          <GlassCard className={styles.notificationItem}>
            <div className={styles.notificationInfo}>
              <div className={styles.notificationIcon}>{Icons.chart}</div>
              <div className={styles.notificationText}>
                <span className={styles.notificationLabel}>Weekly Progress</span>
                <span className={styles.notificationTime}>Sundays at 10:00 AM</span>
              </div>
            </div>
            <div
              className={`${styles.toggle} ${notifications.weeklyProgress ? styles.toggleActive : ''}`}
              onClick={() => toggleNotification('weeklyProgress')}
            >
              <div className={styles.toggleKnob} />
            </div>
          </GlassCard>
        </div>

        {/* Custom Reminders Section */}
        <div className={styles.notificationSection}>
          <h3 className={styles.notificationSectionTitle}>Custom Reminders</h3>

          {customReminders.map((reminder) => (
            <GlassCard key={reminder.id} className={styles.customReminderCard}>
              <div className={styles.customReminderMain}>
                <div className={styles.customReminderInfo}>
                  <div className={styles.notificationIcon}>{Icons.clock}</div>
                  <div className={styles.notificationText}>
                    <span className={styles.notificationLabel}>{reminder.label}</span>
                    <span className={styles.notificationTime}>
                      {reminder.time} - {reminder.days.join(', ')}
                    </span>
                  </div>
                </div>
                <div
                  className={`${styles.toggle} ${reminder.enabled ? styles.toggleActive : ''}`}
                  onClick={() => toggleCustomReminder(reminder.id)}
                >
                  <div className={styles.toggleKnob} />
                </div>
              </div>
              <button
                className={styles.deleteReminderBtn}
                onClick={() => deleteReminder(reminder.id)}
              >
                Remove
              </button>
            </GlassCard>
          ))}

          <Button variant="secondary" fullWidth onClick={() => setShowAddReminder(true)}>
            + Add Custom Reminder
          </Button>
        </div>
      </div>

      {/* Add Reminder Modal */}
      {showAddReminder && (
        <div className={styles.modalOverlay}>
          <GlassCard className={styles.addReminderModal}>
            <div className={styles.modalHeader}>
              <h3>Add Custom Reminder</h3>
              <button className={styles.closeButtonSmall} onClick={() => setShowAddReminder(false)}>
                {Icons.close}
              </button>
            </div>

            <div className={styles.modalContent}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Reminder Name</label>
                <input
                  type="text"
                  className={styles.formInput}
                  placeholder="e.g., Mid-day check-in"
                  value={newReminder.label}
                  onChange={(e) => setNewReminder({ ...newReminder, label: e.target.value })}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Time</label>
                <input
                  type="time"
                  className={styles.formInput}
                  value={newReminder.time}
                  onChange={(e) => setNewReminder({ ...newReminder, time: e.target.value })}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Repeat on</label>
                <div className={styles.daySelector}>
                  {weekDays.map((day) => (
                    <button
                      key={day}
                      className={`${styles.dayButton} ${newReminder.days.includes(day) ? styles.dayButtonActive : ''}`}
                      onClick={() => toggleDay(day)}
                    >
                      {day.charAt(0)}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className={styles.modalActions}>
              <Button variant="ghost" onClick={() => setShowAddReminder(false)}>
                Cancel
              </Button>
              <Button onClick={saveReminder}>
                Save Reminder
              </Button>
            </div>
          </GlassCard>
        </div>
      )}
    </div>
  );
};

// 12. Energy Mode Selector Screen
const EnergyModeScreen: React.FC<{ onClose: () => void; onSelect: (mode: string) => void }> = ({ onClose, onSelect }) => {
  const moods = [
    { id: 'energized', label: 'Energized', emoji: '⚡', color: '#F59E0B', suggestion: 'visualization' },
    { id: 'calm', label: 'Calm', emoji: '🧘', color: '#10B981', suggestion: 'meditation' },
    { id: 'anxious', label: 'Anxious', emoji: '😰', color: '#EF4444', suggestion: 'breathing' },
    { id: 'tired', label: 'Tired', emoji: '😴', color: '#6366F1', suggestion: 'energizing' },
    { id: 'focused', label: 'Focused', emoji: '🎯', color: '#3B82F6', suggestion: 'soundscape' },
    { id: 'grateful', label: 'Grateful', emoji: '🙏', color: '#EC4899', suggestion: 'gratitude' },
  ];

  return (
    <div className={styles.energyModeOverlay}>
      <GlassCard className={styles.energyModeCard}>
        <button className={styles.closeButtonSmall} onClick={onClose}>{Icons.close}</button>
        <h2>How are you feeling?</h2>
        <p>We&apos;ll suggest content based on your energy</p>
        <div className={styles.moodGrid}>
          {moods.map((mood) => (
            <button
              key={mood.id}
              className={styles.moodButton}
              onClick={() => onSelect(mood.id)}
              style={{ '--mood-color': mood.color } as React.CSSProperties}
            >
              <span className={styles.moodEmoji}>{mood.emoji}</span>
              <span className={styles.moodLabel}>{mood.label}</span>
            </button>
          ))}
        </div>
      </GlassCard>
    </div>
  );
};

// 13. Voice Selector Screen
const VoiceSelectorScreen: React.FC<{
  onClose: () => void;
  currentVoice: string;
  onSelect: (voice: 'masculine' | 'feminine' | 'neutral') => void;
}> = ({ onClose, currentVoice, onSelect }) => {
  const voices = [
    { id: 'masculine', label: 'Masculine', description: 'Deep, grounding voice' },
    { id: 'feminine', label: 'Feminine', description: 'Warm, nurturing voice' },
    { id: 'neutral', label: 'Neutral', description: 'Balanced, calm voice' },
  ];

  return (
    <div className={styles.screen}>
      <header className={styles.screenHeaderWithBack}>
        <button className={styles.backButtonSmall} onClick={onClose}>
          {Icons.back}
        </button>
        <div>
          <h2>Voice Selection</h2>
          <p>Choose your guide&apos;s voice</p>
        </div>
      </header>
      <div className={styles.voiceList}>
        {voices.map((voice) => (
          <GlassCard
            key={voice.id}
            className={`${styles.voiceCard} ${currentVoice === voice.id ? styles.voiceCardSelected : ''}`}
            onClick={() => onSelect(voice.id as 'masculine' | 'feminine' | 'neutral')}
          >
            <div className={styles.voiceInfo}>
              <h3>{voice.label}</h3>
              <p>{voice.description}</p>
            </div>
            {currentVoice === voice.id && (
              <div className={styles.checkmark}>✓</div>
            )}
          </GlassCard>
        ))}
      </div>
      <div className={styles.voicePreview}>
        <Button variant="secondary" fullWidth onClick={() => {}}>
          Preview Voice
        </Button>
      </div>
    </div>
  );
};

// ============================================
// SUBSCRIPTION & PAYWALL COMPONENTS
// ============================================

// Pricing Screen - Full subscription pricing page
const PricingScreen: React.FC<{
  onClose: () => void;
  user: UserState;
  onSubscribe: (plan: 'monthly' | 'annual') => void;
}> = ({ onClose, user, onSubscribe }) => {
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'annual'>('annual');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isRestoring, setIsRestoring] = useState(false);

  const handlePurchase = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await revenueCatService.purchasePackage(selectedPlan);
      if (result.success) {
        onSubscribe(selectedPlan);
      } else {
        setError(result.error || 'Purchase failed. Please try again.');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRestore = async () => {
    setIsRestoring(true);
    setError(null);
    try {
      const result = await revenueCatService.restorePurchases();
      if (result.success) {
        // Check subscription status and update
        const status = await revenueCatService.checkSubscriptionStatus();
        if (status.isSubscribed && status.plan) {
          onSubscribe(status.plan);
        }
      } else {
        setError(result.error || 'No previous purchases found.');
      }
    } catch (err) {
      setError('Failed to restore purchases. Please try again.');
    } finally {
      setIsRestoring(false);
    }
  };

  if (user.isPremium) {
    return (
      <div className={styles.pricingScreen}>
        <button className={styles.closeButton} onClick={onClose}>{Icons.close}</button>
        <div className={styles.pricingContent}>
          <div className={styles.pricingHeader}>
            <div className={styles.crownIcon}>{Icons.crown}</div>
            <h1>You&apos;re a Premium Member!</h1>
            <p>Thank you for being part of our community.</p>
          </div>
          <GlassCard className={styles.premiumStatusCard}>
            <div className={styles.premiumBadge}>
              <span className={styles.premiumBadgeIcon}>{Icons.crown}</span>
              <span>Premium Active</span>
            </div>
            <p className={styles.planInfo}>
              {user.subscriptionPlan === 'annual' ? 'Annual Plan' : 'Monthly Plan'}
            </p>
            {user.subscriptionExpiresAt && (
              <p className={styles.expiresInfo}>
                Renews on {new Date(user.subscriptionExpiresAt).toLocaleDateString()}
              </p>
            )}
          </GlassCard>
          <Button onClick={onClose} fullWidth>
            Continue to App
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.pricingScreen}>
      <button className={styles.closeButton} onClick={onClose}>{Icons.close}</button>
      <div className={styles.pricingContent}>
        <div className={styles.pricingHeader}>
          <div className={styles.crownIcon}>{Icons.crown}</div>
          <h1>Unlock Your Full Potential</h1>
          <p>Choose a plan to access all premium features and accelerate your transformation.</p>
        </div>

        <div className={styles.pricingCards}>
          {/* Monthly Plan */}
          <GlassCard
            className={`${styles.pricingCard} ${selectedPlan === 'monthly' ? styles.pricingCardSelected : ''}`}
            onClick={() => setSelectedPlan('monthly')}
          >
            <div className={styles.planHeader}>
              <h3>Monthly</h3>
              <div className={styles.planPriceDisplay}>
                <span className={styles.priceCurrency}>$</span>
                <span className={styles.priceAmount}>14.99</span>
                <span className={styles.pricePeriod}>per month</span>
              </div>
            </div>
            <div className={styles.planFeaturesList}>
              {PREMIUM_FEATURES.map((feature, idx) => (
                <div key={idx} className={styles.planFeature}>
                  <span className={styles.featureCheck}>✓</span>
                  <span>{feature}</span>
                </div>
              ))}
            </div>
            <Button
              onClick={handlePurchase}
              fullWidth
              variant={selectedPlan === 'monthly' ? 'primary' : 'secondary'}
              disabled={isLoading}
            >
              {isLoading && selectedPlan === 'monthly' ? 'Processing...' : 'Start 7-Day Free Trial'}
            </Button>
          </GlassCard>

          {/* Annual Plan */}
          <GlassCard
            className={`${styles.pricingCard} ${selectedPlan === 'annual' ? styles.pricingCardSelected : ''}`}
            onClick={() => setSelectedPlan('annual')}
          >
            <div className={styles.savingsBadge}>Save 30%</div>
            <div className={styles.planHeader}>
              <h3>Annual</h3>
              <div className={styles.planPriceDisplay}>
                <span className={styles.priceCurrency}>$</span>
                <span className={styles.priceAmount}>99.99</span>
                <span className={styles.pricePeriod}>per year</span>
              </div>
            </div>
            <div className={styles.planFeaturesList}>
              {PREMIUM_FEATURES.map((feature, idx) => (
                <div key={idx} className={styles.planFeature}>
                  <span className={styles.featureCheck}>✓</span>
                  <span>{feature}</span>
                </div>
              ))}
            </div>
            <Button
              onClick={handlePurchase}
              fullWidth
              variant={selectedPlan === 'annual' ? 'primary' : 'secondary'}
              disabled={isLoading}
            >
              {isLoading && selectedPlan === 'annual' ? 'Processing...' : 'Start 7-Day Free Trial'}
            </Button>
          </GlassCard>
        </div>

        {error && (
          <div className={styles.errorMessage}>
            {error}
          </div>
        )}

        <button
          className={styles.restoreLink}
          onClick={handleRestore}
          disabled={isRestoring}
        >
          {isRestoring ? 'Restoring...' : 'Already a subscriber? Restore Purchase'}
        </button>
      </div>
    </div>
  );
};

// PaywallGate Component - Wraps premium content
const PaywallGate: React.FC<{
  children: React.ReactNode;
  isPremium: boolean;
  featureName: string;
  onUpgrade: () => void;
  onClose: () => void;
}> = ({ children, isPremium, featureName, onUpgrade, onClose }) => {
  if (isPremium) {
    return <>{children}</>;
  }

  return (
    <div className={paywallStyles.paywallOverlay}>
      <div className={paywallStyles.paywallModal}>
        <button className={paywallStyles.closeButton} onClick={onClose}>
          {Icons.close}
        </button>
        <div className={paywallStyles.paywallContent}>
          <div className={paywallStyles.lockIconWrapper}>
            {Icons.lock}
          </div>
          <h2 className={paywallStyles.paywallTitle}>Premium Feature</h2>
          <p className={paywallStyles.paywallFeatureName}>{featureName}</p>
          <p className={paywallStyles.paywallDescription}>
            Upgrade to Premium to unlock this feature and accelerate your transformation journey.
          </p>
          <div className={paywallStyles.paywallFeatures}>
            <div className={paywallStyles.featureItem}>
              <span className={paywallStyles.checkmark}>✓</span>
              <span>Access all 50+ guided meditations</span>
            </div>
            <div className={paywallStyles.featureItem}>
              <span className={paywallStyles.checkmark}>✓</span>
              <span>Unlimited Inner Mentor Chat</span>
            </div>
            <div className={paywallStyles.featureItem}>
              <span className={paywallStyles.checkmark}>✓</span>
              <span>Advanced analytics & insights</span>
            </div>
            <div className={paywallStyles.featureItem}>
              <span className={paywallStyles.checkmark}>✓</span>
              <span>Full audiobook library</span>
            </div>
          </div>
          <button className={paywallStyles.upgradeButton} onClick={onUpgrade}>
            Upgrade to Premium
          </button>
          <button className={paywallStyles.maybeLaterButton} onClick={onClose}>
            Maybe Later
          </button>
        </div>
      </div>
    </div>
  );
};

// Main App Component
export default function Home() {
  // Cinematic splash screen state
  const [showSplash, setShowSplash] = useState(true);

  // Default directly to dashboard - feels like a tool, not a website
  const [currentScreen, setCurrentScreen] = useState<Screen>('dashboard');
  const [user, setUser] = useState<UserState>({
    onboardingComplete: true,
    displayName: 'Abundance Seeker',
    isPremium: true,
    subscriptionPlan: null,
    subscriptionExpiresAt: null,
    voicePreference: 'neutral',
    morningTime: '07:00',
    eveningTime: '21:00',
    alignmentScore: 82,
    streak: 7,
  });
  const [currentArticle, setCurrentArticle] = useState<Article | null>(null);
  const [currentVisualization, setCurrentVisualization] = useState<any>(null);
  const [currentAudioSession, setCurrentAudioSession] = useState<AudioSession | null>(null);
  const [showEnergyMode, setShowEnergyMode] = useState(false);

  // Journey Progress State (Hero's Path System)
  const [userProgress, setUserProgress] = useState<UserProgress>(DEFAULT_USER_PROGRESS);
  const [showGeodeCracker, setShowGeodeCracker] = useState(false);
  const [selectedJourneyCrystal, setSelectedJourneyCrystal] = useState<Crystal | null>(null);

  // Screen to URL path mapping
  const screenToPath: Record<Screen, string> = {
    'welcome': '/',
    'arrival': '/',
    'onboarding': '/',
    'rhythm': '/',
    'dashboard': '/dashboard',
    'meditations': '/meditations',
    'journal': '/journal',
    'progress': '/progress',
    'mentor': '/mentor',
    'settings': '/settings',
    'profile': '/profile',
    'player': '/player',
    'board': '/board',
    'gratitude': '/gratitude',
    'quickshifts': '/quickshifts',
    'breathing': '/breathing',
    'learn': '/learn-grow',
    'article': '/learn-grow',
    'visualizations': '/visualizations',
    'visualizationPlayer': '/visualizations',
    'emotionalReset': '/emotional-reset',
    'soundscapes': '/soundscapes',
    'audiobooks': '/audiobooks',
    'paywall': '/subscribe',
    'pricing': '/pricing',
    'reminders': '/reminders',
    'notifications': '/settings/notifications',
    'energyMode': '/dashboard',
    'voiceSelector': '/voice',
  };

  // Navigate to screen and update URL
  const navigateToScreen = (screen: Screen) => {
    setCurrentScreen(screen);
    const path = screenToPath[screen] || '/dashboard';
    window.history.pushState({}, '', path);
  };

  const updateUser = (updates: Partial<UserState>) => {
    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);
    localStorage.setItem('abundanceUser', JSON.stringify(updatedUser));
  };

  // Journey Progress Functions
  const updateProgress = (updates: Partial<UserProgress>) => {
    const updatedProgress = { ...userProgress, ...updates };
    setUserProgress(updatedProgress);
    localStorage.setItem('abundanceJourneyProgress', JSON.stringify(updatedProgress));
  };

  // Handler: When user selects a geode to begin journey
  const handleSelectGeode = (crystal: Crystal) => {
    updateProgress({
      journeyStatus: 'IN_PROGRESS',
      activeGeodeId: crystal.id,
      currentCrackLevel: 0,
    });
    // Open the GeodeCracker modal
    setSelectedJourneyCrystal(crystal);
    setShowGeodeCracker(true);
  };

  // Handler: When user taps to continue cracking active geode
  const handleContinueJourney = (crystal: Crystal) => {
    setSelectedJourneyCrystal(crystal);
    setShowGeodeCracker(true);
  };

  // Handler: When the GeodeCracker completes a cracking session
  const handleGeodeCrackComplete = () => {
    const newCrackLevel = userProgress.currentCrackLevel + 1;

    if (newCrackLevel >= MAX_CRACK_LEVEL) {
      // Geode is fully cracked - mastery achieved!
      const newMasteredIds = [...userProgress.masteredGeodeIds, userProgress.activeGeodeId!];
      const allMastered = newMasteredIds.length >= TOTAL_GEODES;

      updateProgress({
        journeyStatus: allMastered ? 'ALL_MASTERED' : 'SELECTING',
        activeGeodeId: null,
        masteredGeodeIds: newMasteredIds,
        currentCrackLevel: 0,
      });

      // Update alignment score bonus
      updateUser({
        alignmentScore: Math.min(100, user.alignmentScore + 10),
      });
    } else {
      // Increment crack level
      updateProgress({
        currentCrackLevel: newCrackLevel,
      });
    }

    setShowGeodeCracker(false);
    setSelectedJourneyCrystal(null);
  };

  // Handler: Deepen practice for mastered crystals (Sage Mode)
  const handleDeepenPractice = (crystal: Crystal) => {
    setSelectedJourneyCrystal(crystal);
    // For mastered crystals, go directly to a special practice mode
    // For now, just navigate to meditations with that crystal's theme
    navigateToScreen('meditations');
  };

  useEffect(() => {
    // Check URL path for direct routing
    const path = window.location.pathname.replace('/', '');

    // Map URL paths to screen names
    const pathToScreen: Record<string, Screen> = {
      'dashboard': 'dashboard',
      'meditations': 'meditations',
      'library': 'meditations',
      'gratitude': 'gratitude',
      'quickshifts': 'quickshifts',
      'quick-shifts': 'quickshifts',
      'mentor': 'mentor',
      'board': 'board',
      'reality-shift-board': 'board',
      'progress': 'progress',
      'analytics': 'progress',
      'profile': 'profile',
      'journal': 'journal',
      'learn': 'learn',
      'learn-grow': 'learn',
      'visualizations': 'visualizations',
      'emotional-reset': 'emotionalReset',
      'soundscapes': 'soundscapes',
      'audiobooks': 'audiobooks',
      'settings': 'settings',
      'reminders': 'reminders',
      'notifications': 'notifications',
      'settings/notifications': 'notifications',
      'subscribe': 'paywall',
      'pricing': 'pricing',
      'voice': 'voiceSelector',
    };

    const screenFromPath = pathToScreen[path];

    // Check sessionStorage for initial screen (set by route pages)
    const initialScreen = sessionStorage.getItem('initialScreen');
    if (initialScreen) {
      sessionStorage.removeItem('initialScreen');
    }

    // Load journey progress
    const savedProgress = localStorage.getItem('abundanceJourneyProgress');
    if (savedProgress) {
      const parsedProgress = JSON.parse(savedProgress);
      setUserProgress(parsedProgress);
    }

    const savedUser = localStorage.getItem('abundanceUser');
    if (savedUser) {
      const parsed = JSON.parse(savedUser);
      setUser(parsed);

      // If we have a valid path or initialScreen, go there directly
      if (screenFromPath) {
        setCurrentScreen(screenFromPath);
      } else if (initialScreen && pathToScreen[initialScreen]) {
        setCurrentScreen(pathToScreen[initialScreen]);
      } else {
        // Always default to dashboard - feels like a tool
        setCurrentScreen('dashboard');
      }
    } else {
      // New user - create default user and go directly to dashboard
      const defaultUser: UserState = {
        onboardingComplete: true,
        displayName: 'Abundance Seeker',
        isPremium: true,
        subscriptionPlan: null,
        subscriptionExpiresAt: null,
        voicePreference: 'neutral',
        morningTime: '07:00',
        eveningTime: '21:00',
        alignmentScore: 82,
        streak: 7,
      };
      setUser(defaultUser);
      localStorage.setItem('abundanceUser', JSON.stringify(defaultUser));
      // Go to specific path if provided, otherwise dashboard
      setCurrentScreen(screenFromPath || 'dashboard');
    }
  }, []);

  const handleOnboardingComplete = () => {
    setCurrentScreen('rhythm');
  };

  const handleRhythmComplete = (morning: string, evening: string) => {
    const updatedUser = {
      ...user,
      onboardingComplete: true,
      morningTime: morning,
      eveningTime: evening,
    };
    setUser(updatedUser);
    localStorage.setItem('abundanceUser', JSON.stringify(updatedUser));
    setCurrentScreen('dashboard');
  };

  // Check if arrival has been seen (for first-launch detection)
  const handleBeginFromWelcome = () => {
    const arrivalSeen = localStorage.getItem('arrivalSeen');
    if (arrivalSeen === 'true') {
      setCurrentScreen('onboarding');
    } else {
      setCurrentScreen('arrival');
    }
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'welcome':
        return <WelcomeScreen onBegin={handleBeginFromWelcome} />;
      case 'arrival':
        return <ArrivalScreen onEnter={() => setCurrentScreen('onboarding')} />;
      case 'onboarding':
        return <OnboardingScreen onComplete={handleOnboardingComplete} />;
      case 'rhythm':
        return <RhythmScreen onComplete={handleRhythmComplete} />;
      case 'dashboard':
        return (
          <DashboardScreen
            user={user}
            onNavigate={navigateToScreen}
          />
        );
      case 'meditations':
        return (
          <MeditationsScreen
            onPlay={(session) => {
              setCurrentAudioSession(session);
              setCurrentScreen('player');
            }}
            isPremium={user.isPremium}
            onUpgrade={() => setCurrentScreen('pricing')}
          />
        );
      case 'journal':
        return <JournalScreen />;
      case 'progress':
        return (
          <PaywallGate
            isPremium={user.isPremium}
            featureName="Advanced Analytics"
            onUpgrade={() => setCurrentScreen('pricing')}
            onClose={() => setCurrentScreen('dashboard')}
          >
            <EnhancedProgressScreen user={user} />
          </PaywallGate>
        );
      case 'board':
        return <BoardScreen />;
      case 'mentor':
        return (
          <PaywallGate
            isPremium={user.isPremium}
            featureName="Inner Mentor Chat"
            onUpgrade={() => setCurrentScreen('pricing')}
            onClose={() => setCurrentScreen('dashboard')}
          >
            <MentorScreen onClose={() => setCurrentScreen('dashboard')} />
          </PaywallGate>
        );
      case 'player':
        return (
          <PlayerScreen
            session={currentAudioSession}
            onClose={() => {
              setCurrentScreen('meditations');
              setCurrentAudioSession(null);
            }}
            onComplete={() => {
              // Update streak if completing morning meditation
              if (currentAudioSession?.title.toLowerCase().includes('morning')) {
                setUser(prev => ({ ...prev, streak: prev.streak + 1 }));
              }
            }}
          />
        );
      case 'profile':
        return <ProfileScreen user={user} onClose={() => setCurrentScreen('dashboard')} onSettings={() => setCurrentScreen('settings')} onPricing={() => setCurrentScreen('pricing')} />;
      case 'settings':
        return <EnhancedSettingsScreen
          onClose={() => setCurrentScreen('profile')}
          user={user}
          onUpdateUser={updateUser}
          onReminders={() => setCurrentScreen('reminders')}
          onVoiceSelector={() => setCurrentScreen('voiceSelector')}
          onPricing={() => setCurrentScreen('pricing')}
        />;
      case 'gratitude':
        return <GratitudeJournalScreen onClose={() => setCurrentScreen('dashboard')} />;
      case 'quickshifts':
        return (
          <QuickShiftToolsScreen
            onClose={() => setCurrentScreen('dashboard')}
            onBreathing={() => setCurrentScreen('breathing')}
            onPlayQuickShift={(session) => {
              setCurrentAudioSession(session);
              setCurrentScreen('player');
            }}
          />
        );
      case 'breathing':
        return <BreathingExerciseScreen onClose={() => setCurrentScreen('quickshifts')} />;
      // New Phase 4 screens
      case 'learn':
        return <LearnAndGrowScreen
          onClose={() => setCurrentScreen('dashboard')}
          onArticle={(article) => { setCurrentArticle(article); setCurrentScreen('article'); }}
        />;
      case 'article':
        return currentArticle ? (
          <ArticleReaderScreen
            article={currentArticle}
            onClose={() => setCurrentScreen('learn')}
            onMarkRead={(articleId, points) => {
              // Update user state or trigger celebration
              console.log(`Article ${articleId} marked as read! +${points} points`);
            }}
          />
        ) : (
          <LearnAndGrowScreen onClose={() => setCurrentScreen('dashboard')} onArticle={(article) => { setCurrentArticle(article); setCurrentScreen('article'); }} />
        );
      case 'visualizations':
        return (
          <PaywallGate
            isPremium={user.isPremium}
            featureName="Visualization Tools"
            onUpgrade={() => setCurrentScreen('pricing')}
            onClose={() => setCurrentScreen('dashboard')}
          >
            <VisualizationsScreen
              onClose={() => setCurrentScreen('dashboard')}
              onPlay={(viz) => { setCurrentVisualization(viz); setCurrentScreen('visualizationPlayer'); }}
            />
          </PaywallGate>
        );
      case 'visualizationPlayer':
        return currentVisualization ? (
          <PaywallGate
            isPremium={user.isPremium}
            featureName="Visualization Tools"
            onUpgrade={() => setCurrentScreen('pricing')}
            onClose={() => setCurrentScreen('dashboard')}
          >
            <VisualizationPlayerScreen visualization={currentVisualization} onClose={() => setCurrentScreen('visualizations')} />
          </PaywallGate>
        ) : (
          <VisualizationsScreen onClose={() => setCurrentScreen('dashboard')} onPlay={(viz) => { setCurrentVisualization(viz); setCurrentScreen('visualizationPlayer'); }} />
        );
      case 'emotionalReset':
        return <EmotionalResetScreen onClose={() => setCurrentScreen('dashboard')} />;
      case 'soundscapes':
        return <SoundscapesScreen onClose={() => setCurrentScreen('dashboard')} />;
      case 'audiobooks':
        return (
          <PaywallGate
            isPremium={user.isPremium}
            featureName="Audiobook Library"
            onUpgrade={() => setCurrentScreen('pricing')}
            onClose={() => setCurrentScreen('dashboard')}
          >
            <AudiobooksScreen onClose={() => setCurrentScreen('dashboard')} />
          </PaywallGate>
        );
      case 'paywall':
        return <PaywallScreen onClose={() => setCurrentScreen('dashboard')} onSubscribe={() => { updateUser({ isPremium: true }); setCurrentScreen('dashboard'); }} />;
      case 'pricing':
        return <PricingScreen
          onClose={() => setCurrentScreen('dashboard')}
          user={user}
          onSubscribe={(plan) => {
            const expiresAt = new Date();
            expiresAt.setFullYear(expiresAt.getFullYear() + (plan === 'annual' ? 1 : 0));
            expiresAt.setMonth(expiresAt.getMonth() + (plan === 'monthly' ? 1 : 0));
            updateUser({
              isPremium: true,
              subscriptionPlan: plan,
              subscriptionExpiresAt: expiresAt.toISOString(),
            });
            setCurrentScreen('dashboard');
          }}
        />;
      case 'reminders':
        return <RemindersScreen onClose={() => setCurrentScreen('settings')} />;
      case 'notifications':
        return <NotificationsScreen onClose={() => setCurrentScreen('settings')} />;
      case 'voiceSelector':
        return <VoiceSelectorScreen
          onClose={() => setCurrentScreen('settings')}
          currentVoice={user.voicePreference}
          onSelect={(voice) => { updateUser({ voicePreference: voice }); setCurrentScreen('settings'); }}
        />;
      case 'energyMode':
        return null; // Handled as overlay
      default:
        return (
          <DashboardScreen
            user={user}
            onNavigate={navigateToScreen}
          />
        );
    }
  };

  const showTabBar = ['dashboard', 'meditations', 'journal', 'progress', 'profile'].includes(currentScreen);

  // Handle geode crack complete
  const handleCrackComplete = () => {
    setUser(prev => ({
      ...prev,
      alignmentScore: Math.min(100, prev.alignmentScore + 2),
      streak: prev.streak + 1
    }));
  };

  return (
    <>
      {/* Atmospheric noise overlay */}
      <div className={styles.atmosphericOverlay} />

      {/* Cinematic Splash Screen */}
      {showSplash && (
        <SplashScreen onComplete={() => setShowSplash(false)} />
      )}

      <main className={styles.main}>
        <div className={styles.phoneFrame}>
          {renderScreen()}
          {showTabBar && <TabBar activeTab={currentScreen} onTabChange={setCurrentScreen} />}
          {showEnergyMode && (
            <EnergyModeScreen
              onClose={() => setShowEnergyMode(false)}
              onSelect={(mode) => { setShowEnergyMode(false); /* Handle mode selection */ }}
            />
          )}

          {/* GeodeCracker Modal (Journey System) */}
          {showGeodeCracker && selectedJourneyCrystal && (
            <div className={styles.modalOverlay}>
              <div className={styles.modalContent}>
                <button
                  className={styles.closeButton}
                  onClick={() => {
                    setShowGeodeCracker(false);
                    setSelectedJourneyCrystal(null);
                  }}
                >
                  ×
                </button>
                <GeodeCracker onCrackComplete={handleGeodeCrackComplete} />
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
