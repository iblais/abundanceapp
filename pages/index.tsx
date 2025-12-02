/**
 * Abundance Flow - Main App Page
 *
 * Full web implementation with same premium aesthetic
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

// Logo Component
const Logo: React.FC<{ size?: number }> = ({ size = 120 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" className={styles.logo}>
    <defs>
      <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FFFFFF" stopOpacity="1" />
        <stop offset="100%" stopColor="#A99DD4" stopOpacity="0.8" />
      </linearGradient>
      <linearGradient id="glowGradient" x1="50%" y1="0%" x2="50%" y2="100%">
        <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.3" />
        <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
      </linearGradient>
    </defs>
    <circle cx="50" cy="50" r="48" fill="url(#glowGradient)" />
    <g transform="translate(15, 15) scale(0.7)">
      <path
        d="M50 10 C80 10, 90 40, 70 60 C50 80, 30 70, 30 50 C30 30, 50 20, 70 30"
        stroke="url(#logoGradient)"
        strokeWidth="4"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M50 90 C20 90, 10 60, 30 40 C50 20, 70 30, 70 50 C70 70, 50 80, 30 70"
        stroke="url(#logoGradient)"
        strokeWidth="4"
        fill="none"
        strokeLinecap="round"
      />
      <circle cx="50" cy="50" r="8" fill="url(#logoGradient)" />
    </g>
  </svg>
);

// Progress Ring Component
const ProgressRing: React.FC<{ progress: number; size?: number; children?: React.ReactNode }> = ({
  progress,
  size = 200,
  children
}) => {
  const strokeWidth = 12;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className={styles.progressRing} style={{ width: size, height: size }}>
      <svg width={size} height={size}>
        <defs>
          <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#C9A961" />
            <stop offset="100%" stopColor="#8B7BB8" />
          </linearGradient>
        </defs>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(255,255,255,0.1)"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="url(#progressGradient)"
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
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
  variant?: 'default' | 'accent';
}> = ({ children, className = '', onClick, variant = 'default' }) => (
  <div
    className={`${styles.glassCard} ${variant === 'accent' ? styles.glassCardAccent : ''} ${className}`}
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
  chart: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  ),
  profile: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="4" />
      <path d="M20 21a8 8 0 10-16 0" />
    </svg>
  ),
  settings: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065zM15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  play: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <path d="M8 5v14l11-7z" />
    </svg>
  ),
  pause: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <rect x="6" y="4" width="4" height="16" rx="1" />
      <rect x="14" y="4" width="4" height="16" rx="1" />
    </svg>
  ),
  chevronRight: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 5l7 7-7 7" />
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
  chat: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
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
  streak: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c-1.5-2-1.5-6-1.5-6s3.5 2 6 2c2.5 0 4.9-1.4 5.9-3.9C21 6 21 12 17.657 18.657z" />
    </svg>
  ),
  sun: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32l1.41 1.41M2 12h2m16 0h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
    </svg>
  ),
  moon: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
    </svg>
  ),
  send: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
    </svg>
  ),
  volume: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
    </svg>
  ),
};

// Tab Bar Component
const TabBar: React.FC<{ activeTab: string; onTabChange: (tab: Screen) => void }> = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'dashboard', icon: Icons.home, label: 'Home' },
    { id: 'meditations', icon: Icons.meditation, label: 'Meditate' },
    { id: 'journal', icon: Icons.journal, label: 'Journal' },
    { id: 'progress', icon: Icons.chart, label: 'Progress' },
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
          {activeTab === tab.id && <span className={styles.tabIndicator} />}
        </button>
      ))}
    </nav>
  );
};

// Welcome Screen
const WelcomeScreen: React.FC<{ onBegin: () => void }> = ({ onBegin }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
  }, []);

  return (
    <div className={`${styles.screen} ${styles.welcomeScreen} ${visible ? styles.fadeIn : ''}`}>
      <div className={styles.welcomeContent}>
        <div className={styles.logoContainer}>
          <Logo size={120} />
        </div>
        <h1 className={styles.welcomeTitle}>Abundance Flow</h1>
        <p className={styles.welcomeTagline}>Shift your state. Reshape your reality.</p>
      </div>
      <div className={styles.welcomeButton}>
        <Button onClick={onBegin} fullWidth>Begin</Button>
      </div>
    </div>
  );
};

// Onboarding Screen
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
        <div className={styles.onboardingSlide}>
          <div className={styles.onboardingIcon}>
            <GlassCard variant="accent" className={styles.iconCard}>
              {Icons.sparkle}
            </GlassCard>
          </div>
          <h2 className={styles.onboardingTitle}>{slides[currentSlide].title}</h2>
          <p className={styles.onboardingDescription}>{slides[currentSlide].description}</p>
        </div>
      </div>

      <div className={styles.onboardingButton}>
        <Button onClick={handleContinue} fullWidth>Continue</Button>
      </div>
    </div>
  );
};

// Rhythm Scheduler Screen
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
            {Icons.sun}
            <span>Morning Session</span>
          </div>
          <input
            type="time"
            value={morningTime}
            onChange={(e) => setMorningTime(e.target.value)}
            className={styles.timeInput}
          />
        </GlassCard>

        <GlassCard className={styles.timeCard}>
          <div className={styles.timeCardHeader}>
            {Icons.moon}
            <span>Evening Session</span>
          </div>
          <input
            type="time"
            value={eveningTime}
            onChange={(e) => setEveningTime(e.target.value)}
            className={styles.timeInput}
          />
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

// Dashboard Screen
const DashboardScreen: React.FC<{
  user: UserState;
  onNavigate: (screen: Screen) => void;
}> = ({ user, onNavigate }) => {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const quickActions = [
    { title: 'Morning Visioneering', subtitle: 'Guided Focus for 10 mins.', icon: Icons.sparkle, screen: 'player' as Screen },
    { title: 'Quick Shifts', subtitle: 'Instant reset exercises.', icon: Icons.heart, screen: 'meditations' as Screen },
    { title: 'Reality Shift Board', subtitle: 'Track your progress & insights.', icon: Icons.chart, screen: 'journal' as Screen },
    { title: 'Inner Mentor', subtitle: 'Chat with your AI guide.', icon: Icons.chat, screen: 'mentor' as Screen },
  ];

  return (
    <div className={styles.dashboardScreen}>
      <header className={styles.dashboardHeader}>
        <div>
          <p className={styles.greeting}>{getGreeting()}</p>
          <h2 className={styles.userName}>{user.displayName || 'Welcome back'}</h2>
        </div>
        <button className={styles.profileButton} onClick={() => onNavigate('profile')}>
          {Icons.profile}
        </button>
      </header>

      <div className={styles.scoreSection}>
        <GlassCard variant="accent" className={styles.scoreCard}>
          <ProgressRing progress={user.alignmentScore} size={200}>
            <span className={styles.scoreValue}>{user.alignmentScore}</span>
            <span className={styles.scoreLabel}>Alignment Score</span>
          </ProgressRing>
        </GlassCard>
      </div>

      <GlassCard className={styles.streakBadge}>
        <span className={styles.streakIcon}>{Icons.streak}</span>
        <span>{user.streak} day streak</span>
      </GlassCard>

      <div className={styles.actionsSection}>
        {quickActions.map((action, index) => (
          <GlassCard
            key={index}
            className={styles.actionCard}
            onClick={() => onNavigate(action.screen)}
          >
            <div className={styles.actionContent}>
              <div className={styles.actionIcon}>{action.icon}</div>
              <div className={styles.actionText}>
                <h4>{action.title}</h4>
                <p>{action.subtitle}</p>
              </div>
            </div>
            {Icons.chevronRight}
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
        <GlassCard variant="accent">
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
        <p className={styles.chartSubtitle}>Last 4 Weeks</p>
      </GlassCard>

      <div className={styles.metricsRow}>
        <GlassCard className={styles.metricCard}>
          <ProgressRing progress={85} size={80}>
            <span className={styles.metricValue}>85%</span>
          </ProgressRing>
          <span className={styles.metricLabel}>Coherence</span>
        </GlassCard>
        <GlassCard className={styles.metricCard}>
          <ProgressRing progress={72} size={80}>
            <span className={styles.metricValue}>72%</span>
          </ProgressRing>
          <span className={styles.metricLabel}>Consistency</span>
        </GlassCard>
      </div>

      <h3 className={styles.sectionTitle}>Streaks</h3>
      <GlassCard className={styles.streakCard}>
        <div className={styles.streakInfo}>
          <div className={styles.streakIcon} style={{ background: 'rgba(201, 169, 97, 0.2)' }}>
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

    // Simulate mentor response
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

// Player Screen
const PlayerScreen: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [selectedDuration, setSelectedDuration] = useState(8);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && progress < 100) {
      interval = setInterval(() => {
        setProgress(p => Math.min(p + 0.5, 100));
      }, (selectedDuration * 60 * 1000) / 200);
    }
    return () => clearInterval(interval);
  }, [isPlaying, selectedDuration]);

  const formatTime = (percent: number) => {
    const totalSeconds = (selectedDuration * 60 * percent) / 100;
    const mins = Math.floor(totalSeconds / 60);
    const secs = Math.floor(totalSeconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className={styles.playerScreen}>
      <button className={styles.closeButton} onClick={onClose}>{Icons.close}</button>

      <div className={styles.waveContainer}>
        <div className={`${styles.wave} ${isPlaying ? styles.waveAnimating : ''}`} />
        <div className={`${styles.wave} ${styles.wave2} ${isPlaying ? styles.waveAnimating : ''}`} />
        <div className={`${styles.wave} ${styles.wave3} ${isPlaying ? styles.waveAnimating : ''}`} />
      </div>

      <div className={styles.playerContent}>
        <h2>Morning Visioneering</h2>
        <p>Start your day by connecting with your highest potential.</p>

        <div className={styles.durationSelector}>
          {[5, 8, 12].map((dur) => (
            <button
              key={dur}
              className={`${styles.durationButton} ${selectedDuration === dur ? styles.durationButtonActive : ''}`}
              onClick={() => !isPlaying && setSelectedDuration(dur)}
            >
              {dur} min
            </button>
          ))}
        </div>

        <div className={styles.progressBar}>
          <div className={styles.progressTrack}>
            <div className={styles.progressFill} style={{ width: `${progress}%` }} />
          </div>
          <div className={styles.timeLabels}>
            <span>{formatTime(progress)}</span>
            <span>{selectedDuration}:00</span>
          </div>
        </div>

        <div className={styles.controls}>
          <button className={styles.controlButton}>
            {Icons.back}
          </button>
          <button
            className={styles.playButton}
            onClick={() => setIsPlaying(!isPlaying)}
          >
            {isPlaying ? Icons.pause : Icons.play}
          </button>
          <button className={styles.controlButton}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14m0 0l-7-7m7 7l-7 7" />
            </svg>
          </button>
        </div>

        <GlassCard className={styles.soundSelector}>
          <span>{Icons.volume}</span>
          <span>Background Sound: Gentle Rain</span>
          {Icons.chevronRight}
        </GlassCard>
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
      <GlassCard variant="accent" className={styles.upgradeCard}>
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

  // Check localStorage for saved state
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
        return <PlayerScreen onClose={() => setCurrentScreen('meditations')} />;
      case 'profile':
        return <ProfileScreen user={user} onClose={() => setCurrentScreen('dashboard')} onSettings={() => setCurrentScreen('settings')} />;
      default:
        return <DashboardScreen user={user} onNavigate={setCurrentScreen} />;
    }
  };

  const showTabBar = ['dashboard', 'meditations', 'journal', 'progress'].includes(currentScreen);

  return (
    <main className={styles.main}>
      <div className={styles.phoneFrame}>
        {renderScreen()}
        {showTabBar && <TabBar activeTab={currentScreen} onTabChange={setCurrentScreen} />}
      </div>
    </main>
  );
}
