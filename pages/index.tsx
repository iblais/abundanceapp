/**
 * Abundance Recode - Main App Page
 * Premium visual design matching reference screens
 */

import React, { useState, useEffect } from 'react';
import styles from '../styles/Home.module.css';

// Types
type Screen = 'welcome' | 'onboarding' | 'rhythm' | 'dashboard' | 'meditations' | 'journal' | 'progress' | 'mentor' | 'settings' | 'profile' | 'player' | 'board' | 'gratitude' | 'quickshifts' | 'breathing';

interface UserState {
  onboardingComplete: boolean;
  displayName: string;
  isPremium: boolean;
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
};

// Tab Bar Component - matches reference with 5 icons
const TabBar: React.FC<{ activeTab: string; onTabChange: (tab: Screen) => void }> = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'dashboard', icon: Icons.home, label: 'Home' },
    { id: 'board', icon: Icons.grid, label: 'Board' },
    { id: 'meditations', icon: Icons.meditation, label: 'Meditate' },
    { id: 'progress', icon: Icons.chart, label: 'Goals' },
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

// Welcome Screen - with glass card container like reference
const WelcomeScreen: React.FC<{ onBegin: () => void }> = ({ onBegin }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
  }, []);

  return (
    <div className={`${styles.screen} ${styles.welcomeScreen} ${visible ? styles.fadeIn : ''}`}>
      <div className={styles.welcomeCard}>
        <div className={styles.welcomeCardInner}>
          <div className={styles.welcomeContent}>
            <Logo size={100} />
            <h1 className={styles.welcomeTitle}>Abundance Recode</h1>
            <p className={styles.welcomeTagline}>Shift your state. Reshape your reality.</p>
          </div>
          <Button onClick={onBegin} fullWidth>Begin</Button>
        </div>
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

  const quickActions = [
    { title: 'Morning Visioneering', subtitle: 'Guided meditation for 10 mins.', icon: Icons.sparkle, screen: 'player' as Screen },
    { title: 'Quick Shifts', subtitle: 'Instant reset exercises.', icon: Icons.heart, screen: 'quickshifts' as Screen },
    { title: 'Gratitude Journal', subtitle: 'Capture what you are grateful for.', icon: Icons.journal, screen: 'gratitude' as Screen },
    { title: 'Reality Shift Board', subtitle: 'Visualize your new identity.', icon: Icons.grid, screen: 'board' as Screen },
  ];

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
const MeditationsScreen: React.FC<{ onPlay: () => void }> = ({ onPlay }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = [
    { id: 'focus', name: 'Focus', count: 4 },
    { id: 'calm', name: 'Calm', count: 5 },
    { id: 'confidence', name: 'Confidence', count: 4 },
    { id: 'abundance', name: 'Abundance', count: 6 },
    { id: 'sleep', name: 'Sleep', count: 5 },
    { id: 'walking', name: 'Walking', count: 3 },
  ];

  const allMeditations = [
    { id: 1, title: 'Morning Visioneering', description: 'Start your day by connecting with your highest potential.', duration: 12, category: 'focus' },
    { id: 2, title: 'Gratitude Expansion', description: 'Cultivate appreciation that attracts more abundance.', duration: 10, category: 'abundance' },
    { id: 3, title: 'Confidence Activation', description: 'Awaken your inner certainty and calm assurance.', duration: 15, category: 'confidence' },
    { id: 4, title: 'Calm Reset', description: 'Return to peaceful clarity when life feels overwhelming.', duration: 8, category: 'calm' },
    { id: 5, title: 'Focus Flow', description: 'Clear mental clutter and enter deep, productive focus.', duration: 12, category: 'focus' },
    { id: 6, title: 'Abundance Alignment', description: 'Tune your energy to the frequency of abundance.', duration: 15, category: 'abundance' },
    { id: 7, title: 'Deep Sleep Journey', description: 'Drift into restful sleep with guided relaxation.', duration: 20, category: 'sleep' },
    { id: 8, title: 'Walking Meditation', description: 'Find peace and presence in every step.', duration: 15, category: 'walking' },
    { id: 9, title: 'Stress Release', description: 'Let go of tension and find your center.', duration: 10, category: 'calm' },
    { id: 10, title: 'Wealthy Mindset', description: 'Reprogram your relationship with abundance.', duration: 18, category: 'abundance' },
    { id: 11, title: 'Inner Strength', description: 'Connect with your core power and resilience.', duration: 12, category: 'confidence' },
    { id: 12, title: 'Laser Focus', description: 'Sharpen your concentration and mental clarity.', duration: 8, category: 'focus' },
  ];

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
            <GlassCard key={meditation.id} className={styles.meditationCard} onClick={onPlay}>
              <div className={styles.meditationIcon} style={{ background: categoryGradients[meditation.category] }}>
                {CategoryIcons[meditation.category] || Icons.meditation}
              </div>
              <div className={styles.meditationInfo}>
                <h4>{meditation.title}</h4>
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
              <GlassCard key={meditation.id} className={styles.meditationCard} onClick={onPlay}>
                <div className={styles.meditationIcon} style={{ background: categoryGradients[meditation.category] }}>
                  {CategoryIcons[meditation.category] || Icons.meditation}
                </div>
                <div className={styles.meditationInfo}>
                  <h4>{meditation.title}</h4>
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

// Mentor Chat Screen
const MentorScreen: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [messages, setMessages] = useState([
    { id: 1, role: 'mentor', content: "Welcome back. I'm here to support your journey. What's on your mind today?" },
  ]);
  const [input, setInput] = useState('');

  const sendMessage = () => {
    if (!input.trim()) return;

    setMessages([...messages, { id: Date.now(), role: 'user', content: input }]);
    setInput('');

    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: Date.now(),
        role: 'mentor',
        content: "Thank you for sharing that. Let's explore it together. What feels most important about this for you right now?"
      }]);
    }, 1500);
  };

  return (
    <div className={styles.mentorScreen}>
      <header className={styles.mentorHeader}>
        <button onClick={onClose}>{Icons.close}</button>
        <div className={styles.mentorTitle}>
          <h3>Inner Mentor</h3>
          <p>Your personal guide</p>
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
const ProfileScreen: React.FC<{ user: UserState; onClose: () => void; onSettings: () => void }> = ({ user, onClose, onSettings }) => (
  <div className={styles.profileScreen}>
    <header className={styles.profileHeader}>
      <button onClick={onClose}>{Icons.back}</button>
      <button onClick={onSettings}>{Icons.settings}</button>
    </header>

    <div className={styles.profileContent}>
      <div className={styles.avatar}>
        {Icons.profile}
      </div>
      <h2>Alex Rivera</h2>
      <p className={styles.membershipText}>Premium Member</p>
    </div>

    <GlassCard className={styles.profileStatsCard}>
      <div className={styles.profileStatRow}>
        <span className={styles.profileStatNumber}>42</span>
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

// Gratitude Journal Screen
const GratitudeJournalScreen: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [entry, setEntry] = useState('');
  const [showPastEntries, setShowPastEntries] = useState(false);
  const [entries, setEntries] = useState<{ date: string; prompt: string; entry: string }[]>([
    { date: '2026-01-17', prompt: 'What made you smile today?', entry: 'The sunshine through my window this morning was beautiful. I felt grateful for a peaceful start to the day.' },
    { date: '2026-01-16', prompt: 'What are three things you appreciate?', entry: 'My health, my family, and the opportunity to grow every day.' },
  ]);

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

  const handleSave = () => {
    if (entry.trim()) {
      const newEntry = {
        date: today.toISOString().split('T')[0],
        prompt: todayPrompt,
        entry: entry.trim(),
      };
      setEntries([newEntry, ...entries]);
      setEntry('');
      alert('Entry saved!');
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
          {entries.map((e, idx) => (
            <GlassCard key={idx} className={styles.pastEntryCard}>
              <span className={styles.pastEntryDate}>
                {new Date(e.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </span>
              <p className={styles.pastEntryPrompt}>{e.prompt}</p>
              <p className={styles.pastEntryText}>{e.entry}</p>
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
          <Button onClick={handleSave} fullWidth disabled={!entry.trim()}>
            Save Entry
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

// Main App Component
export default function Home() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('welcome');
  const [user, setUser] = useState<UserState>({
    onboardingComplete: false,
    displayName: 'Abundance Seeker',
    isPremium: false,
    voicePreference: 'neutral',
    morningTime: '07:00',
    eveningTime: '21:00',
    alignmentScore: 82,
    streak: 7,
  });

  useEffect(() => {
    const savedUser = localStorage.getItem('abundanceUser');
    if (savedUser) {
      const parsed = JSON.parse(savedUser);
      setUser(parsed);
      if (parsed.onboardingComplete) {
        setCurrentScreen('dashboard');
      }
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
        return <DashboardScreen user={user} onNavigate={setCurrentScreen} />;
      case 'meditations':
        return <MeditationsScreen onPlay={() => setCurrentScreen('player')} />;
      case 'journal':
        return <JournalScreen />;
      case 'progress':
        return <ProgressScreen user={user} />;
      case 'board':
        return <BoardScreen />;
      case 'mentor':
        return <MentorScreen onClose={() => setCurrentScreen('dashboard')} />;
      case 'player':
        return <PlayerScreen onClose={() => setCurrentScreen('dashboard')} />;
      case 'profile':
        return <ProfileScreen user={user} onClose={() => setCurrentScreen('dashboard')} onSettings={() => setCurrentScreen('settings')} />;
      case 'settings':
        return <SettingsScreen onClose={() => setCurrentScreen('profile')} />;
      case 'gratitude':
        return <GratitudeJournalScreen onClose={() => setCurrentScreen('dashboard')} />;
      case 'quickshifts':
        return <QuickShiftToolsScreen onClose={() => setCurrentScreen('dashboard')} onBreathing={() => setCurrentScreen('breathing')} />;
      case 'breathing':
        return <BreathingExerciseScreen onClose={() => setCurrentScreen('quickshifts')} />;
      default:
        return <DashboardScreen user={user} onNavigate={setCurrentScreen} />;
    }
  };

  const showTabBar = ['dashboard', 'meditations', 'board', 'progress', 'profile'].includes(currentScreen);

  return (
    <main className={styles.main}>
      <div className={styles.phoneFrame}>
        {renderScreen()}
        {showTabBar && <TabBar activeTab={currentScreen} onTabChange={setCurrentScreen} />}
      </div>
    </main>
  );
}
