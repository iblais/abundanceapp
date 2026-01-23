/**
 * Abundance Recode - Main App Page
 * Premium visual design matching reference screens
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import styles from '../styles/Home.module.css';
import paywallStyles from '../styles/Paywall.module.css';
import { journalService, chatService, getAnonymousUserId, JournalEntry } from '../lib/supabase';
import { aiMentorService } from '../lib/ai-mentor';
import { revenueCatService, PLANS, PREMIUM_FEATURES, SubscriptionStatus } from '../lib/revenuecat';

// Types
type Screen = 'welcome' | 'onboarding' | 'rhythm' | 'dashboard' | 'meditations' | 'journal' | 'progress' | 'mentor' | 'settings' | 'profile' | 'player' | 'board' | 'gratitude' | 'quickshifts' | 'breathing' | 'learn' | 'article' | 'visualizations' | 'visualizationPlayer' | 'emotionalReset' | 'soundscapes' | 'audiobooks' | 'paywall' | 'pricing' | 'reminders' | 'notifications' | 'energyMode' | 'voiceSelector';

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
          <stop offset="100%" stopColor="#C4B8E8" stopOpacity="0.9" />
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
            <stop offset="0%" stopColor="#F4CF77" />
            <stop offset="50%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#9382FF" />
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

// Glass Card Component
const GlassCard: React.FC<{
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  variant?: 'default' | 'elevated';
}> = ({ children, className = '', onClick, variant = 'default' }) => (
  <div
    className={`${styles.glassCard} ${variant === 'elevated' ? styles.glassCardElevated : ''} ${className}`}
    onClick={onClick}
    style={{ cursor: onClick ? 'pointer' : 'default' }}
  >
    {children}
  </div>
);

// Button Component
const Button: React.FC<{
  children: React.ReactNode;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  fullWidth?: boolean;
  disabled?: boolean;
}> = ({ children, onClick, variant = 'primary', fullWidth = false, disabled = false }) => (
  <button
    className={`${styles.button} ${styles[`button${variant.charAt(0).toUpperCase() + variant.slice(1)}`]} ${fullWidth ? styles.buttonFullWidth : ''}`}
    onClick={onClick}
    disabled={disabled}
  >
    {children}
  </button>
);

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

// Wave Background Component for Onboarding/Player
const WaveBackground: React.FC = () => (
  <div className={styles.waveBackground}>
    <svg viewBox="0 0 400 400" className={styles.waveSvg}>
      <defs>
        <linearGradient id="waveGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4A3F8C" stopOpacity="0.6" />
          <stop offset="50%" stopColor="#6B5BA7" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#8B7BC2" stopOpacity="0.2" />
        </linearGradient>
        <linearGradient id="waveGrad2" x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#3D3470" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#5C4D99" stopOpacity="0.3" />
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
  const router = useRouter();

  const quickActions = [
    { title: 'Morning Visioneering', subtitle: 'Guided meditation for 10 mins.', icon: Icons.sparkle, screen: 'player' as Screen, route: null },
    { title: 'Quick Shifts', subtitle: 'Instant reset exercises.', icon: Icons.heart, screen: 'quickshifts' as Screen, route: null },
    { title: 'Gratitude Journal', subtitle: 'Capture what you are grateful for.', icon: Icons.journal, screen: 'gratitude' as Screen, route: null },
    { title: 'Inner Mentor', subtitle: 'Chat with your higher self.', icon: Icons.chat, screen: 'mentor' as Screen, route: null },
    { title: 'Reality Shift Board', subtitle: 'Visualize your new identity.', icon: Icons.grid, screen: 'board' as Screen, route: null },
    { title: 'Learn & Grow', subtitle: 'Articles for transformation.', icon: Icons.book, screen: 'learn' as Screen, route: '/learn-grow' },
    { title: 'Visualization Tools', subtitle: 'See your future self.', icon: Icons.eye, screen: 'visualizations' as Screen, route: null },
    { title: 'Emotional Reset', subtitle: 'Process and release emotions.', icon: Icons.heart, screen: 'emotionalReset' as Screen, route: null },
    { title: 'Soundscapes', subtitle: 'Ambient sounds for focus.', icon: Icons.music, screen: 'soundscapes' as Screen, route: null },
    { title: 'Audiobooks', subtitle: 'Recommended reading.', icon: Icons.headphones, screen: 'audiobooks' as Screen, route: null },
  ];

  const handleCardClick = (action: typeof quickActions[0]) => {
    onNavigate(action.screen);
  };

  return (
    <div className={styles.dashboardScreen}>
      <div className={styles.scoreSection}>
        <ProgressRing progress={user.alignmentScore} size={220} strokeWidth={14}>
          <span className={styles.scoreValue}>{user.alignmentScore}</span>
          <span className={styles.scoreLabel}>Alignment Score</span>
        </ProgressRing>
      </div>

      <div className={styles.actionsSection}>
        {quickActions.map((action, index) => (
          <GlassCard
            key={index}
            className={styles.actionCard}
            onClick={() => handleCardClick(action)}
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
  onPlay: () => void;
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
      onPlay();
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
    ? ['#E8E0FF', '#C5B8F0']
    : ['#F4CF77', '#E9BB51'];

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
                  <stop offset="0%" stopColor="#9BA3C3" />
                  <stop offset="100%" stopColor="#E8E0FF" />
                </linearGradient>
                <linearGradient id="fillGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="rgba(200, 190, 240, 0.3)" />
                  <stop offset="100%" stopColor="rgba(200, 190, 240, 0)" />
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
                      <stop offset="0%" stopColor="#9BA3C3" />
                      <stop offset="100%" stopColor="#C5B8F0" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M0,35 Q25,30 50,20 T100,10"
                    fill="none"
                    stroke="url(#smallLineGrad)"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <circle cx="100" cy="10" r="3" fill="#C5B8F0" />
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
    { id: 1, role: 'mentor', content: "Welcome. I am the voice of your higher self. What clarity are you seeking today?" },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

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

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    const userMsgId = Date.now();

    // Add user message to UI immediately
    setMessages(prev => [...prev, { id: userMsgId, role: 'user', content: userMessage }]);
    setInput('');
    setIsTyping(true);

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

      setIsTyping(false);

      const mentorMsgId = Date.now();
      const mentorResponse = error ? "I'm here with you. Take a deep breath. What does your heart want to explore?" : response;

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
      setIsTyping(false);

      // Fallback response on error
      setMessages(prev => [...prev, {
        id: Date.now(),
        role: 'mentor',
        content: "I sense your energy seeking clarity. What truth is waiting to be acknowledged?",
      }]);
    }
  };

  return (
    <div className={styles.mentorScreen}>
      <header className={styles.mentorHeader}>
        <button onClick={onClose}>{Icons.close}</button>
        <div className={styles.mentorTitle}>
          <h3>Inner Mentor</h3>
          <p>The voice of your higher self</p>
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
              <div className={styles.mentorAvatar}>{Icons.sparkle}</div>
            )}
            <div className={styles.messageBubble}>
              {message.content}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className={`${styles.message} ${styles.messageMentor}`}>
            <div className={styles.mentorAvatar}>{Icons.sparkle}</div>
            <div className={`${styles.messageBubble} ${styles.typingIndicator}`}>
              <span className={styles.typingDot} />
              <span className={styles.typingDot} />
              <span className={styles.typingDot} />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className={styles.inputContainer}>
        <GlassCard className={styles.inputCard}>
          <input
            type="text"
            placeholder="Share your thoughts..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            className={styles.chatInput}
          />
          <button
            className={`${styles.sendButton} ${input.trim() ? styles.sendButtonActive : ''}`}
            onClick={sendMessage}
            disabled={isTyping}
          >
            {Icons.send}
          </button>
        </GlassCard>
      </div>
    </div>
  );
};

// Player Screen - matches reference with outlined play button
const PlayerScreen: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [selectedDuration, setSelectedDuration] = useState(5);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && progress < 100) {
      interval = setInterval(() => {
        setProgress(p => Math.min(p + 0.5, 100));
      }, (selectedDuration * 60 * 1000) / 200);
    }
    return () => clearInterval(interval);
  }, [isPlaying, selectedDuration, progress]);

  const formatTime = (percent: number) => {
    const totalSeconds = (selectedDuration * 60 * percent) / 100;
    const mins = Math.floor(totalSeconds / 60);
    const secs = Math.floor(totalSeconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className={styles.playerScreen}>
      {/* Aurora wave background */}
      <div className={styles.playerWaveBackground}>
        <svg viewBox="0 0 400 200" preserveAspectRatio="xMidYMid slice" className={styles.auroraWave}>
          <defs>
            <linearGradient id="aurora1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#4A3F8C" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#6B5BA7" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#8B7BC2" stopOpacity="0.3" />
            </linearGradient>
            <linearGradient id="aurora2" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#3D3470" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#5C4D99" stopOpacity="0.4" />
            </linearGradient>
          </defs>
          <path d="M0,100 Q100,50 200,100 T400,100 L400,200 L0,200 Z" fill="url(#aurora1)" className={styles.auroraPath1} />
          <path d="M0,120 Q150,70 300,120 T400,80 L400,200 L0,200 Z" fill="url(#aurora2)" className={styles.auroraPath2} />
        </svg>
      </div>

      <button className={styles.closeButton} onClick={onClose}>{Icons.close}</button>

      <div className={styles.playerContent}>
        <h2 className={styles.playerTitle}>Morning<br />Visioneering</h2>

        {/* Outlined play button */}
        <button
          className={styles.playButtonOutlined}
          onClick={() => setIsPlaying(!isPlaying)}
        >
          {isPlaying ? Icons.pause : Icons.playOutline}
        </button>

        {/* Progress bar */}
        <div className={styles.progressBar}>
          <div className={styles.progressTrack}>
            <div className={styles.progressFill} style={{ width: `${progress}%` }} />
          </div>
        </div>

        {/* Duration selector */}
        <div className={styles.durationSelector}>
          {[5, 8, 12].map((dur) => (
            <button
              key={dur}
              className={`${styles.durationPill} ${selectedDuration === dur ? styles.durationPillActive : ''}`}
              onClick={() => !isPlaying && setSelectedDuration(dur)}
            >
              {dur} min
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

// Profile Screen - Clean premium design matching reference
const ProfileScreen: React.FC<{ user: UserState; onClose: () => void; onSettings: () => void; onPricing?: () => void }> = ({ user, onClose, onSettings, onPricing }) => (
  <div className={styles.profileScreen}>
    <header className={styles.profileHeader}>
      <button onClick={onClose}>{Icons.back}</button>
      <button onClick={onSettings}>{Icons.settings}</button>
    </header>

    <div className={styles.profileContent}>
      <div className={styles.avatar}>
        {Icons.profile}
      </div>
      <h2>{user.displayName}</h2>
      <div className={styles.subscriptionStatus}>
        <span className={`${styles.subscriptionBadge} ${user.isPremium ? styles.subscriptionBadgePremium : styles.subscriptionBadgeFree}`}>
          {user.isPremium ? 'Premium Member' : 'Free Member'}
        </span>
        {user.isPremium && user.subscriptionPlan && (
          <div className={styles.subscriptionDetails}>
            <span className={styles.subscriptionPlanName}>
              {user.subscriptionPlan === 'annual' ? 'Annual Plan' : 'Monthly Plan'}
            </span>
          </div>
        )}
      </div>
      {!user.isPremium && onPricing && (
        <button className={styles.upgradeProfileButton} onClick={onPricing}>
          Upgrade to Premium
        </button>
      )}
    </div>

    <GlassCard className={styles.profileStatsCard}>
      <div className={styles.profileStatRow}>
        <span className={styles.profileStatNumber}>{user.streak}</span>
        <span className={styles.profileStatIcon}>{Icons.streak}</span>
        <span className={styles.profileStatLabel}>day streak</span>
      </div>

      <div className={styles.profileStatDivider} />

      <div className={styles.profileStatRow}>
        <span className={styles.profileStatNumber}>203</span>
        <span className={styles.profileStatLabel}>sessions completed</span>
      </div>

      <div className={styles.profileStatDivider} />

      <div className={styles.profileStatRow}>
        <span className={styles.profileStatLabel}>Alignment Score: {user.alignmentScore}</span>
      </div>
    </GlassCard>

    <button className={styles.editProfileButton}>Edit Profile</button>
  </div>
);

// Reality Shift Board - Bento grid vision board with add functionality
interface BoardItem {
  id: number;
  type: 'text' | 'image' | 'quote';
  content?: string;
  author?: string;
  large?: boolean;
  style?: React.CSSProperties;
}

const BoardScreen: React.FC = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [addType, setAddType] = useState<'text' | 'image' | 'quote' | null>(null);
  const [newContent, setNewContent] = useState('');
  const [newAuthor, setNewAuthor] = useState('');
  const [boardItems, setBoardItems] = useState<BoardItem[]>([
    { id: 1, type: 'text', content: 'I am abundant', large: true },
    { id: 2, type: 'image', style: { backgroundImage: 'linear-gradient(135deg, #F9A825 0%, #FF7043 50%, #7B1FA2 100%)' } },
    { id: 3, type: 'quote', content: 'Create the life you dream of.', author: 'Unknown' },
    { id: 4, type: 'text', content: 'My future is bright' },
    { id: 5, type: 'image', large: true, style: { backgroundImage: 'linear-gradient(135deg, #80DEEA 0%, #CE93D8 50%, #FFAB91 100%)' } },
  ]);

  const handleAddItem = () => {
    if (!addType) return;

    const newItem: BoardItem = {
      id: Date.now(),
      type: addType,
      content: newContent || undefined,
      author: newAuthor || undefined,
      large: boardItems.length % 3 === 0,
    };

    if (addType === 'image') {
      const gradients = [
        'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
        'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
        'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
      ];
      newItem.style = { backgroundImage: gradients[Math.floor(Math.random() * gradients.length)] };
    }

    setBoardItems([...boardItems, newItem]);
    setShowAddModal(false);
    setAddType(null);
    setNewContent('');
    setNewAuthor('');
  };

  return (
    <div className={styles.boardScreen}>
      <div className={styles.boardHeader}>
        <h1 className={styles.boardTitle}>Reality Shift Board</h1>
        <p className={styles.boardSubtitle}>Step into your new identity</p>
      </div>

      <div className={styles.bentoGrid}>
        {boardItems.map((item) => (
          <div
            key={item.id}
            className={`${styles.bentoCard} ${item.large ? styles.bentoCardLarge : ''} ${item.type === 'image' ? styles.bentoCardImage : styles.bentoCardText}`}
            style={item.style}
          >
            {item.type === 'text' && <span className={styles.bentoText}>{item.content}</span>}
            {item.type === 'quote' && (
              <div className={styles.bentoQuoteWrapper}>
                <span className={styles.bentoQuote}>&quot;{item.content}&quot;</span>
                {item.author && <span className={styles.bentoAuthor}>— {item.author}</span>}
              </div>
            )}
          </div>
        ))}
      </div>

      <button className={styles.fab} onClick={() => setShowAddModal(true)}>
        {Icons.plus}
      </button>

      {/* Add Card Modal */}
      {showAddModal && (
        <div className={styles.modalOverlay} onClick={() => { setShowAddModal(false); setAddType(null); }}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>{addType ? `Add ${addType.charAt(0).toUpperCase() + addType.slice(1)} Card` : 'Choose Card Type'}</h3>
              <button className={styles.modalClose} onClick={() => { setShowAddModal(false); setAddType(null); }}>
                {Icons.close}
              </button>
            </div>

            {!addType ? (
              <div className={styles.cardTypeOptions}>
                <button className={styles.cardTypeOption} onClick={() => setAddType('text')}>
                  <div className={styles.cardTypeIcon}>{Icons.journal}</div>
                  <span>Text</span>
                  <p>Simple affirmation or intention</p>
                </button>
                <button className={styles.cardTypeOption} onClick={() => setAddType('image')}>
                  <div className={styles.cardTypeIcon}>{Icons.grid}</div>
                  <span>Image</span>
                  <p>Vision board image</p>
                </button>
                <button className={styles.cardTypeOption} onClick={() => setAddType('quote')}>
                  <div className={styles.cardTypeIcon}>{Icons.sparkle}</div>
                  <span>Quote</span>
                  <p>Inspiring quote with attribution</p>
                </button>
              </div>
            ) : (
              <div className={styles.cardForm}>
                {addType === 'text' && (
                  <input
                    type="text"
                    placeholder="Enter your affirmation..."
                    value={newContent}
                    onChange={(e) => setNewContent(e.target.value)}
                    className={styles.modalInput}
                  />
                )}
                {addType === 'quote' && (
                  <>
                    <input
                      type="text"
                      placeholder="Enter the quote..."
                      value={newContent}
                      onChange={(e) => setNewContent(e.target.value)}
                      className={styles.modalInput}
                    />
                    <input
                      type="text"
                      placeholder="Author (optional)"
                      value={newAuthor}
                      onChange={(e) => setNewAuthor(e.target.value)}
                      className={styles.modalInput}
                    />
                  </>
                )}
                {addType === 'image' && (
                  <p className={styles.imagePlaceholder}>
                    A beautiful gradient image will be added to your board.
                  </p>
                )}
                <div className={styles.modalActions}>
                  <Button onClick={() => setAddType(null)} variant="ghost">Back</Button>
                  <Button onClick={handleAddItem} disabled={addType !== 'image' && !newContent}>Add Card</Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// Gratitude Journal Screen - with Firestore integration
const GratitudeJournalScreen: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [entry, setEntry] = useState('');
  const [showPastEntries, setShowPastEntries] = useState(false);
  const [entries, setEntries] = useState<Array<{ id: string; date: string; prompt: string; content: string }>>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  const today = new Date();
  const dateString = today.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const prompts = [
    'What are three things you are grateful for today?',
    'What moment brought you joy recently?',
    'Who in your life are you thankful for and why?',
    'What simple pleasure did you enjoy today?',
    'What challenge are you grateful for overcoming?',
  ];

  const todayPrompt = prompts[today.getDate() % prompts.length];

  // Load entries from Firestore on mount
  useEffect(() => {
    const loadEntries = async () => {
      try {
        const uid = await getAnonymousUserId();
        setUserId(uid);

        const { entries: firestoreEntries, error } = await journalService.getEntries(uid);
        if (!error && firestoreEntries.length > 0) {
          setEntries(firestoreEntries.map(e => ({
            id: e.id,
            date: e.date,
            prompt: e.prompt,
            content: e.content,
          })));
        } else {
          // Fallback to sample entries if no Firestore entries
          setEntries([
            { id: '1', date: '2026-01-17', prompt: 'What made you smile today?', content: 'The sunshine through my window this morning was beautiful. I felt grateful for a peaceful start to the day.' },
            { id: '2', date: '2026-01-16', prompt: 'What are three things you appreciate?', content: 'My health, my family, and the opportunity to grow every day.' },
          ]);
        }
      } catch (error) {
        console.error('Error loading entries:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadEntries();
  }, []);

  const handleSave = async () => {
    if (!entry.trim() || !userId) return;

    setIsSaving(true);
    try {
      const newEntry = {
        date: today.toISOString().split('T')[0],
        prompt: todayPrompt,
        content: entry.trim(),
        type: 'gratitude' as const,
      };

      // Save to Firestore
      const { id, error } = await journalService.saveEntry(userId, newEntry);

      if (!error) {
        setEntries([{ ...newEntry, id }, ...entries]);
        setEntry('');
        // Show success feedback
        const successMsg = document.createElement('div');
        successMsg.className = styles.successToast || '';
        successMsg.textContent = 'Entry saved!';
        document.body.appendChild(successMsg);
        setTimeout(() => successMsg.remove(), 2000);
      } else {
        // Fallback to local storage if Firestore fails
        const localId = Date.now().toString();
        setEntries([{ ...newEntry, id: localId }, ...entries]);
        setEntry('');
        console.log('Saved locally (Firestore unavailable)');
      }
    } catch (error) {
      console.error('Error saving entry:', error);
    } finally {
      setIsSaving(false);
    }
  };

  if (showPastEntries) {
    return (
      <div className={styles.screen}>
        <header className={styles.screenHeaderWithBack}>
          <button className={styles.backButtonSmall} onClick={() => setShowPastEntries(false)}>
            {Icons.back}
          </button>
          <div>
            <h2>Past Entries</h2>
            <p>{entries.length} entries</p>
          </div>
        </header>

        <div className={styles.pastEntriesList}>
          {isLoading ? (
            <div className={styles.loadingState}>Loading entries...</div>
          ) : entries.length === 0 ? (
            <div className={styles.emptyState}>
              <p>No entries yet. Start writing!</p>
            </div>
          ) : (
            entries.map((e) => (
              <GlassCard key={e.id} className={styles.pastEntryCard}>
                <span className={styles.pastEntryDate}>
                  {new Date(e.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
                <p className={styles.pastEntryPrompt}>{e.prompt}</p>
                <p className={styles.pastEntryText}>{e.content}</p>
              </GlassCard>
            ))
          )}
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
          <h2>Gratitude Journal</h2>
          <p>{dateString}</p>
        </div>
      </header>

      <div className={styles.gratitudeContent}>
        <GlassCard variant="elevated" className={styles.promptCard}>
          <p className={styles.promptLabel}>Today&apos;s Prompt</p>
          <p className={styles.promptText}>{todayPrompt}</p>
        </GlassCard>

        <div className={styles.journalEditor}>
          <textarea
            placeholder="Write your gratitude entry here..."
            value={entry}
            onChange={(e) => setEntry(e.target.value)}
            className={styles.journalTextarea}
          />
        </div>

        <div className={styles.journalActions}>
          <Button onClick={handleSave} fullWidth disabled={!entry.trim() || isSaving}>
            {isSaving ? 'Saving...' : 'Save Entry'}
          </Button>
          <button className={styles.textButton} onClick={() => setShowPastEntries(true)}>
            View Past Entries
          </button>
        </div>
      </div>
    </div>
  );
};

// Quick Shift Tools Screen
const QuickShiftToolsScreen: React.FC<{ onClose: () => void; onBreathing: () => void }> = ({ onClose, onBreathing }) => {
  const tools = [
    {
      id: 'breathing',
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
    },
    {
      id: 'bodyscan',
      title: 'Body Scan',
      description: 'A 5-minute guided audio practice to release tension.',
      duration: '5 min',
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="12" cy="5" r="3" />
          <path d="M12 8v4m-4 8l2-6h4l2 6m-8-4h8" />
        </svg>
      ),
      action: () => alert('Body Scan audio would play here'),
    },
    {
      id: 'affirmation',
      title: 'Affirmation Repetition',
      description: 'A 2-minute practice where you repeat a chosen affirmation.',
      duration: '2 min',
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M12 2l2.09 6.26L20 10l-5.91 1.74L12 18l-2.09-6.26L4 10l5.91-1.74L12 2z" />
        </svg>
      ),
      action: () => alert('Affirmation audio would play here'),
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
              <h4>{tool.title}</h4>
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
  const [phase, setPhase] = useState<'inhale' | 'exhale'>('inhale');
  const [timeLeft, setTimeLeft] = useState(180); // 3 minutes in seconds
  const [circleScale, setCircleScale] = useState(1);

  useEffect(() => {
    let breathingInterval: NodeJS.Timeout;
    let countdownInterval: NodeJS.Timeout;

    if (isActive && timeLeft > 0) {
      // Breathing animation: 6 seconds inhale, 6 seconds exhale
      let breathTime = 0;
      breathingInterval = setInterval(() => {
        breathTime += 100;
        const cycleTime = breathTime % 12000; // 12 second cycle

        if (cycleTime < 6000) {
          // Inhale phase
          setPhase('inhale');
          setCircleScale(1 + (cycleTime / 6000) * 0.5); // Scale from 1 to 1.5
        } else {
          // Exhale phase
          setPhase('exhale');
          setCircleScale(1.5 - ((cycleTime - 6000) / 6000) * 0.5); // Scale from 1.5 to 1
        }
      }, 100);

      countdownInterval = setInterval(() => {
        setTimeLeft((t) => {
          if (t <= 1) {
            setIsActive(false);
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    }

    return () => {
      clearInterval(breathingInterval);
      clearInterval(countdownInterval);
    };
  }, [isActive, timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className={styles.breathingScreen}>
      <button className={styles.closeButton} onClick={onClose}>{Icons.close}</button>

      <div className={styles.breathingContent}>
        <h2 className={styles.breathingTitle}>Coherent Breathing</h2>
        <p className={styles.breathingSubtitle}>6 seconds inhale, 6 seconds exhale</p>

        <div className={styles.breathingCircleContainer}>
          <div
            className={styles.breathingCircle}
            style={{
              transform: `scale(${circleScale})`,
              transition: 'transform 0.1s linear'
            }}
          />
          <div className={styles.breathingPhase}>
            {isActive ? (phase === 'inhale' ? 'Breathe In' : 'Breathe Out') : 'Ready'}
          </div>
        </div>

        <div className={styles.breathingTimer}>{formatTime(timeLeft)}</div>

        <Button
          onClick={() => {
            if (timeLeft === 0) {
              setTimeLeft(180);
            }
            setIsActive(!isActive);
          }}
          fullWidth
        >
          {isActive ? 'Pause' : (timeLeft === 0 ? 'Restart' : 'Start')}
        </Button>
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

// 1. Learn & Grow - Article Library Screen
const LearnAndGrowScreen: React.FC<{ onClose: () => void; onArticle: (article: any) => void }> = ({ onClose, onArticle }) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = [
    { id: 'mindset', title: 'Mindset', icon: Icons.sparkle, color: '#8B5CF6' },
    { id: 'energy', title: 'Energy', icon: Icons.streak, color: '#F59E0B' },
    { id: 'abundance', title: 'Abundance', icon: Icons.crown, color: '#10B981' },
    { id: 'neuroscience', title: 'Neuroscience', icon: Icons.chart, color: '#3B82F6' },
  ];

  const articles: Record<string, Array<{ id: string; title: string; description: string; content: string; imageUrl: string }>> = {
    mindset: [
      { id: '1', title: 'The Power of Belief', description: 'How your beliefs shape your reality', content: 'Your beliefs are the invisible architects of your life. Every thought you consistently think becomes a belief, and every belief shapes the actions you take. When you believe something is possible, your brain begins to find evidence to support that belief, creating a self-fulfilling prophecy.\n\nThe science behind this is fascinating. Your reticular activating system (RAS) filters information based on what you deem important. When you believe in abundance, you start noticing opportunities everywhere. When you believe in scarcity, you see only limitations.\n\nTo shift your beliefs, start by questioning the thoughts you accept as truth. Ask yourself: "Is this belief serving me?" If not, consciously choose a new belief and look for evidence to support it. Over time, this new belief will become your default operating system.', imageUrl: '' },
      { id: '2', title: 'Growth vs Fixed Mindset', description: 'Embrace challenges as opportunities', content: 'Carol Dweck\'s research on mindset has transformed how we understand human potential. A fixed mindset believes abilities are static—you either have them or you don\'t. A growth mindset understands that abilities can be developed through dedication and hard work.\n\nPeople with growth mindsets embrace challenges, persist through obstacles, learn from criticism, and find inspiration in others\' success. They understand that effort is the path to mastery.\n\nTo cultivate a growth mindset, replace "I can\'t" with "I can\'t yet." Celebrate your efforts, not just outcomes. View failures as valuable feedback rather than evidence of inadequacy.', imageUrl: '' },
    ],
    energy: [
      { id: '3', title: 'Morning Energy Rituals', description: 'Start your day with power', content: 'How you start your morning sets the tone for your entire day. The first hour after waking is when your brain is most receptive to programming. Use this time wisely.\n\nA powerful morning routine might include: 5 minutes of deep breathing to activate your parasympathetic nervous system, 10 minutes of movement to increase blood flow and release endorphins, 5 minutes of visualization to prime your mind for success, and 10 minutes of journaling to clarify your intentions.\n\nConsistency is key. Your morning ritual doesn\'t need to be elaborate—it needs to be sustainable. Start small and build from there.', imageUrl: '' },
      { id: '4', title: 'Energy Management', description: 'Protect and amplify your vital force', content: 'Energy is your most precious resource. Unlike time, which passes regardless of what you do, energy can be cultivated and protected.\n\nThere are four dimensions of energy: physical (sleep, nutrition, exercise), emotional (positive relationships, self-compassion), mental (focus, creativity), and spiritual (purpose, values). Neglecting any dimension affects the others.\n\nProtect your energy by setting boundaries, limiting exposure to negativity, and scheduling regular recovery time. Amplify your energy through practices that fill you up—nature, creativity, meaningful connection, and purposeful work.', imageUrl: '' },
    ],
    abundance: [
      { id: '5', title: 'The Abundance Frequency', description: 'Tune into unlimited possibility', content: 'Abundance is not just about money—it\'s a state of being. It\'s the recognition that the universe is infinitely generous and that there is always enough.\n\nWhen you operate from abundance, you give freely because you know more is coming. You celebrate others\' success because you understand that their win doesn\'t diminish yours. You take inspired action without desperation because you trust in the timing of your life.\n\nTo tune into the abundance frequency, practice gratitude daily. What you appreciate, appreciates. Notice the abundance already present in your life—the air you breathe, the relationships you have, the opportunities before you.', imageUrl: '' },
      { id: '6', title: 'Money Mindset Mastery', description: 'Transform your relationship with wealth', content: 'Your relationship with money often mirrors your relationship with yourself. If you feel unworthy of love, you likely feel unworthy of wealth. The inner work is the real work.\n\nCommon money blocks include: believing money is evil, feeling guilty about wanting more, fearing judgment from others, and associating wealth with negative characteristics.\n\nTo transform your money mindset, first become aware of your current beliefs. Journal about your earliest money memories. Notice the emotions that arise when you think about wealth. Then consciously choose new beliefs that align with who you want to become.', imageUrl: '' },
    ],
    neuroscience: [
      { id: '7', title: 'Neuroplasticity & Change', description: 'Your brain can rewire itself', content: 'For decades, scientists believed the adult brain was fixed. We now know this isn\'t true. Neuroplasticity—the brain\'s ability to reorganize itself by forming new neural connections—continues throughout life.\n\nEvery thought you think, every action you take, physically changes your brain. Neurons that fire together wire together. This means you can literally rewire your brain through consistent practice.\n\nThis is both empowering and sobering. It means change is always possible. It also means that negative thought patterns are constantly reinforcing themselves. Choose your mental habits wisely—they\'re building your brain.', imageUrl: '' },
      { id: '8', title: 'The Science of Habits', description: 'Automate your success', content: 'Habits are the brain\'s way of conserving energy. Once a behavior becomes habitual, it requires almost no conscious thought. This is why habits are so powerful—they operate on autopilot.\n\nThe habit loop consists of three parts: cue (trigger), routine (behavior), and reward (benefit). To change a habit, you need to identify the cue and reward, then insert a new routine.\n\nTo build new habits, start incredibly small. Want to meditate? Start with one minute. Want to exercise? Start with one pushup. Make it so easy you can\'t say no. Then gradually increase as the habit solidifies.', imageUrl: '' },
    ],
  };

  if (selectedCategory) {
    const categoryArticles = articles[selectedCategory] || [];
    return (
      <div className={styles.screen}>
        <header className={styles.screenHeaderWithBack}>
          <button className={styles.backButtonSmall} onClick={() => setSelectedCategory(null)}>
            {Icons.back}
          </button>
          <div>
            <h2>{categories.find(c => c.id === selectedCategory)?.title}</h2>
            <p>{categoryArticles.length} articles</p>
          </div>
        </header>
        <div className={styles.articleList}>
          {categoryArticles.map((article) => (
            <GlassCard key={article.id} className={styles.articleCard} onClick={() => onArticle(article)}>
              <h3 className={styles.articleTitle}>{article.title}</h3>
              <p className={styles.articleDescription}>{article.description}</p>
              <div className={styles.articleMeta}>
                <span>5 min read</span>
                {Icons.chevronRight}
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
          <p>Expand your awareness</p>
        </div>
      </header>
      <div className={styles.categoryGrid}>
        {categories.map((category) => (
          <GlassCard
            key={category.id}
            className={styles.categoryCard}
            onClick={() => setSelectedCategory(category.id)}
          >
            <div className={styles.categoryIcon} style={{ color: category.color }}>
              {category.icon}
            </div>
            <span className={styles.categoryTitle}>{category.title}</span>
          </GlassCard>
        ))}
      </div>
    </div>
  );
};

// Article Reader Screen
const ArticleReaderScreen: React.FC<{ article: any; onClose: () => void }> = ({ article, onClose }) => {
  return (
    <div className={styles.screen}>
      <header className={styles.screenHeaderWithBack}>
        <button className={styles.backButtonSmall} onClick={onClose}>
          {Icons.back}
        </button>
        <div>
          <h2>Article</h2>
        </div>
      </header>
      <div className={styles.articleReader}>
        <h1 className={styles.articleReaderTitle}>{article.title}</h1>
        <p className={styles.articleReaderMeta}>5 min read</p>
        <div className={styles.articleReaderContent}>
          {article.content.split('\n\n').map((paragraph: string, idx: number) => (
            <p key={idx}>{paragraph}</p>
          ))}
        </div>
      </div>
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
  const [currentScreen, setCurrentScreen] = useState<Screen>('welcome');
  const [user, setUser] = useState<UserState>({
    onboardingComplete: false,
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
  const [currentArticle, setCurrentArticle] = useState<any>(null);
  const [currentVisualization, setCurrentVisualization] = useState<any>(null);
  const [showEnergyMode, setShowEnergyMode] = useState(false);

  // Screen to URL path mapping
  const screenToPath: Record<Screen, string> = {
    'welcome': '/',
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

    const savedUser = localStorage.getItem('abundanceUser');
    if (savedUser) {
      const parsed = JSON.parse(savedUser);
      setUser(parsed);

      // If we have a valid path or initialScreen, go there directly
      if (screenFromPath) {
        setCurrentScreen(screenFromPath);
      } else if (initialScreen && pathToScreen[initialScreen]) {
        setCurrentScreen(pathToScreen[initialScreen]);
      } else if (parsed.onboardingComplete) {
        setCurrentScreen('dashboard');
      }
    } else if (screenFromPath) {
      // New user but accessing a direct route - create default user
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
      setCurrentScreen(screenFromPath);
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

  const renderScreen = () => {
    switch (currentScreen) {
      case 'welcome':
        return <WelcomeScreen onBegin={() => setCurrentScreen('onboarding')} />;
      case 'onboarding':
        return <OnboardingScreen onComplete={handleOnboardingComplete} />;
      case 'rhythm':
        return <RhythmScreen onComplete={handleRhythmComplete} />;
      case 'dashboard':
        return <DashboardScreen user={user} onNavigate={navigateToScreen} />;
      case 'meditations':
        return (
          <MeditationsScreen
            onPlay={() => setCurrentScreen('player')}
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
        return <PlayerScreen onClose={() => setCurrentScreen('dashboard')} />;
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
        return <QuickShiftToolsScreen onClose={() => setCurrentScreen('dashboard')} onBreathing={() => setCurrentScreen('breathing')} />;
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
          <ArticleReaderScreen article={currentArticle} onClose={() => setCurrentScreen('learn')} />
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
        return <DashboardScreen user={user} onNavigate={navigateToScreen} />;
    }
  };

  const showTabBar = ['dashboard', 'meditations', 'journal', 'progress', 'profile'].includes(currentScreen);

  return (
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
      </div>
    </main>
  );
}
