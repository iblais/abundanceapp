/**
 * Abundance Flow - Main App Page
 * Premium visual design matching reference screens
 */

import React, { useState, useEffect } from 'react';
import styles from '../styles/Home.module.css';

// Types
type Screen = 'welcome' | 'onboarding' | 'rhythm' | 'dashboard' | 'meditations' | 'journal' | 'progress' | 'mentor' | 'settings' | 'profile' | 'player';

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

// Tab Bar Component - matches reference with 4 icons
const TabBar: React.FC<{ activeTab: string; onTabChange: (tab: Screen) => void }> = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'dashboard', icon: Icons.home },
    { id: 'meditations', icon: Icons.plus },
    { id: 'journal', icon: Icons.grid },
    { id: 'profile', icon: Icons.profile },
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
            <h1 className={styles.welcomeTitle}>Abundance Flow</h1>
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

// Dashboard Screen - matches reference with 3 cards
const DashboardScreen: React.FC<{
  user: UserState;
  onNavigate: (screen: Screen) => void;
}> = ({ user, onNavigate }) => {

  const quickActions = [
    { title: 'Morning Visioneering', subtitle: 'Guided Focus for 10 mins.', icon: Icons.sparkle, screen: 'player' as Screen },
    { title: 'Quick Shifts', subtitle: 'Instant reset exercises.', icon: Icons.heart, screen: 'meditations' as Screen },
    { title: 'Reality Shift Board', subtitle: 'Track your progress & insights.', icon: Icons.chart, screen: 'journal' as Screen },
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

// Meditations Screen
const MeditationsScreen: React.FC<{ onPlay: () => void }> = ({ onPlay }) => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = ['All', 'Gratitude', 'Confidence', 'Calm', 'Focus', 'Abundance'];

  const meditations = [
    { id: 1, title: 'Morning Visioneering', description: 'Start your day by connecting with your highest potential.', durations: [5, 8, 12], category: 'morning' },
    { id: 2, title: 'Gratitude Expansion', description: 'Cultivate appreciation that attracts more abundance.', durations: [5, 8, 12], category: 'gratitude' },
    { id: 3, title: 'Confidence Activation', description: 'Awaken your inner certainty and calm assurance.', durations: [5, 8, 12], category: 'confidence' },
    { id: 4, title: 'Calm Reset', description: 'Return to peaceful clarity when life feels overwhelming.', durations: [5, 8, 12], category: 'calm' },
    { id: 5, title: 'Focus Flow', description: 'Clear mental clutter and enter deep, productive focus.', durations: [5, 8, 12], category: 'focus', isPremium: true },
    { id: 6, title: 'Abundance Alignment', description: 'Tune your energy to the frequency of abundance.', durations: [5, 8, 12], category: 'abundance', isPremium: true },
  ];

  return (
    <div className={styles.meditationsScreen}>
      <header className={styles.screenHeader}>
        <h2>Meditations</h2>
        <p>Guided practices for transformation</p>
      </header>

      <div className={styles.categoryFilter}>
        {categories.map((cat) => (
          <button
            key={cat}
            className={`${styles.categoryChip} ${selectedCategory === cat.toLowerCase() ? styles.categoryChipActive : ''}`}
            onClick={() => setSelectedCategory(cat.toLowerCase())}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className={styles.meditationsList}>
        {meditations.map((meditation) => (
          <GlassCard key={meditation.id} className={styles.meditationCard} onClick={onPlay}>
            <div className={styles.meditationIcon}>
              {Icons.meditation}
            </div>
            <div className={styles.meditationInfo}>
              <h4>{meditation.title}</h4>
              <p>{meditation.description}</p>
              <div className={styles.meditationMeta}>
                {meditation.durations.map((dur) => (
                  <span key={dur} className={styles.durationTag}>{dur} min</span>
                ))}
                {meditation.isPremium && <span className={styles.premiumBadge}>Premium</span>}
              </div>
            </div>
            <button className={styles.favoriteButton}>{Icons.heart}</button>
          </GlassCard>
        ))}
      </div>
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
          <p className={styles.promptLabel}>Today's Prompt</p>
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

// Progress Screen
const ProgressScreen: React.FC<{ user: UserState }> = ({ user }) => {
  const weekData = [65, 72, 68, 80, 75, 82, user.alignmentScore];
  const maxValue = Math.max(...weekData);

  return (
    <div className={styles.progressScreen}>
      <header className={styles.screenHeader}>
        <h2>Your Progress</h2>
      </header>

      <GlassCard className={styles.chartCard}>
        <p className={styles.chartLabel}>Alignment Score</p>
        <div className={styles.barChart}>
          {weekData.map((value, index) => (
            <div key={index} className={styles.barContainer}>
              <div
                className={styles.bar}
                style={{ height: `${(value / maxValue) * 100}%` }}
              />
              <span className={styles.barLabel}>
                {['M', 'T', 'W', 'T', 'F', 'S', 'S'][index]}
              </span>
            </div>
          ))}
        </div>
        <p className={styles.chartSubtitle}>Last 7 Days</p>
      </GlassCard>

      <div className={styles.metricsRow}>
        <GlassCard className={styles.metricCard}>
          <ProgressRing progress={85} size={80} strokeWidth={6}>
            <span className={styles.metricValue}>85%</span>
          </ProgressRing>
          <span className={styles.metricLabel}>Coherence</span>
        </GlassCard>
        <GlassCard className={styles.metricCard}>
          <ProgressRing progress={72} size={80} strokeWidth={6}>
            <span className={styles.metricValue}>72%</span>
          </ProgressRing>
          <span className={styles.metricLabel}>Consistency</span>
        </GlassCard>
      </div>

      <h3 className={styles.sectionTitle}>Streaks</h3>
      <GlassCard className={styles.streakCard}>
        <div className={styles.streakInfo}>
          <div className={styles.streakIconBox}>
            {Icons.streak}
          </div>
          <div>
            <h4>Overall</h4>
            <p>Best: 14 days</p>
          </div>
        </div>
        <div className={styles.streakValue}>
          <span className={styles.bigNumber}>{user.streak}</span>
          <span>day streak</span>
        </div>
      </GlassCard>
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

// Profile Screen
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
      <h2>{user.displayName}</h2>
      <p className={styles.email}>user@abundanceflow.app</p>

      <div className={styles.membershipBadge}>
        {Icons.sparkle}
        <span>{user.isPremium ? 'Premium Member' : 'Free Member'}</span>
      </div>
    </div>

    <GlassCard className={styles.statsCard}>
      <div className={styles.statsRow}>
        <div className={styles.statItem}>
          <span className={styles.statValue}>{user.streak}</span>
          <span className={styles.statLabel}>Day Streak</span>
        </div>
        <div className={styles.statDivider} />
        <div className={styles.statItem}>
          <span className={styles.statValue}>24</span>
          <span className={styles.statLabel}>Meditations</span>
        </div>
        <div className={styles.statDivider} />
        <div className={styles.statItem}>
          <span className={styles.statValue}>3h</span>
          <span className={styles.statLabel}>Practice</span>
        </div>
      </div>
    </GlassCard>

    {!user.isPremium && (
      <GlassCard variant="elevated" className={styles.upgradeCard}>
        <div className={styles.upgradeContent}>
          {Icons.sparkle}
          <div>
            <h4>Unlock Full Potential</h4>
            <p>Get unlimited meditations, identity exercises, and more.</p>
          </div>
        </div>
        <Button onClick={() => {}}>Upgrade</Button>
      </GlassCard>
    )}
  </div>
);

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
      case 'mentor':
        return <MentorScreen onClose={() => setCurrentScreen('dashboard')} />;
      case 'player':
        return <PlayerScreen onClose={() => setCurrentScreen('dashboard')} />;
      case 'profile':
        return <ProfileScreen user={user} onClose={() => setCurrentScreen('dashboard')} onSettings={() => setCurrentScreen('settings')} />;
      default:
        return <DashboardScreen user={user} onNavigate={setCurrentScreen} />;
    }
  };

  const showTabBar = ['dashboard', 'meditations', 'journal', 'profile'].includes(currentScreen);

  return (
    <main className={styles.main}>
      <div className={styles.phoneFrame}>
        {renderScreen()}
        {showTabBar && <TabBar activeTab={currentScreen} onTabChange={setCurrentScreen} />}
      </div>
    </main>
  );
}
