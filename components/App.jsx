/**
 * ABUNDANCE RECODE - OPAL DARK AESTHETIC
 * Pure Infinite Black + Glassmorphism + God Rays + Geode Progression
 * Hero's Journey: Rocks → Cracks → Crystal Revelation
 */

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  signInAnonymously,
  onAuthStateChanged,
  signInWithCustomToken
} from 'firebase/auth';
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDoc,
  onSnapshot,
  query,
  orderBy,
  updateDoc,
  deleteDoc
} from 'firebase/firestore';
import {
  Sparkles, Target, Heart, Brain, Flame, Trophy, Star,
  ChevronRight, ChevronLeft, Plus, Check, X, Trash2,
  TrendingUp, Calendar, Award, Zap, Sun, Moon, Crown,
  MessageCircle, BookOpen, Compass, Shield, Gem, Lightbulb,
  Clock, Send, RefreshCw, Play, Image, Volume2, Lock
} from 'lucide-react';

// ============================================================================
// FIREBASE CONFIGURATION (Safe parsing with fallbacks)
// ============================================================================

const appId = typeof __app_id !== 'undefined' ? __app_id : 'abundance-recode-app';

// Safe Firebase config - start with env vars as default
let firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || ""
};

// Try to use global config if available (with safe parsing)
if (typeof __firebase_config !== 'undefined' && __firebase_config) {
  try {
    const parsed = typeof __firebase_config === 'string'
      ? JSON.parse(__firebase_config)
      : __firebase_config;
    if (parsed && typeof parsed === 'object' && parsed.apiKey) {
      firebaseConfig = parsed;
    }
  } catch (e) {
    console.warn('Firebase config parse failed, using env vars:', e.message);
  }
}

const initialAuthToken = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;

let app, auth, db;
try {
  if (firebaseConfig.apiKey) {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
  }
} catch (e) {
  console.log('Firebase initialization deferred:', e.message);
}

const getPrivatePath = (userId, collectionName) => {
  return `artifacts/${appId}/users/${userId}/${collectionName}`;
};

// ============================================================================
// GEODE & CRYSTAL DATA (Hero's Journey System)
// ============================================================================

const GEODES = [
  {
    id: 'citrine',
    name: 'Citrine',
    domain: 'Wealth & Abundance',
    color: 'from-yellow-400 to-amber-500',
    glowClass: 'glow-citrine',
    description: 'Unlock unlimited financial abundance',
    stages: [
      { title: 'The Audit', task: 'List 5 limiting beliefs about money you inherited', prompt: 'What money stories did you absorb growing up?' },
      { title: 'The Release', task: 'Write a forgiveness letter to money itself', prompt: 'Dear Money, I forgive myself for...' },
      { title: 'The Vision', task: 'Describe your wealthy self in vivid detail', prompt: 'I am now living in complete financial abundance...' }
    ]
  },
  {
    id: 'rose-quartz',
    name: 'Rose Quartz',
    domain: 'Love & Connection',
    color: 'from-pink-400 to-rose-500',
    glowClass: 'glow-rose',
    description: 'Attract deep, fulfilling relationships',
    stages: [
      { title: 'The Mirror', task: 'List 5 ways you reject or abandon yourself', prompt: 'Where do I people-please at my expense?' },
      { title: 'The Healing', task: 'Write a love letter to your inner child', prompt: 'Dear little one, I want you to know...' },
      { title: 'The Radiance', task: 'List 10 ways you will love yourself this week', prompt: 'I commit to showing myself love by...' }
    ]
  },
  {
    id: 'emerald',
    name: 'Emerald',
    domain: 'Health & Vitality',
    color: 'from-emerald-400 to-green-500',
    glowClass: 'glow-emerald',
    description: 'Optimize your physical vitality',
    stages: [
      { title: 'The Awareness', task: 'List 5 ways you neglect your body', prompt: 'How do I dishonor my body?' },
      { title: 'The Gratitude', task: 'Write a thank you letter to your body', prompt: 'Dear Body, thank you for...' },
      { title: 'The Covenant', task: 'Create a sacred health covenant', prompt: 'I promise my body I will...' }
    ]
  },
  {
    id: 'amethyst',
    name: 'Amethyst',
    domain: 'Intuition & Peace',
    color: 'from-purple-400 to-violet-500',
    glowClass: 'glow-amethyst',
    description: 'Access your infinite inner wisdom',
    stages: [
      { title: 'The Silence', task: 'Document 5 times you ignored your intuition', prompt: 'When has my gut been right but I overrode it?' },
      { title: 'The Listening', task: 'Have a written dialogue with your Higher Self', prompt: 'Higher Self, what do you want me to know?' },
      { title: 'The Trust', task: 'Commit to one intuitive practice daily', prompt: 'I will strengthen my intuition by...' }
    ]
  },
  {
    id: 'ruby',
    name: 'Ruby',
    domain: 'Power & Passion',
    color: 'from-red-400 to-rose-600',
    glowClass: 'glow-ruby',
    description: 'Reclaim your authentic confidence',
    stages: [
      { title: 'The Excavation', task: 'Identify 5 moments you gave your power away', prompt: 'When have I dimmed my light?' },
      { title: 'The Reclamation', task: 'Write declarations of personal sovereignty', prompt: 'I reclaim my power by...' },
      { title: 'The Action', task: 'Commit to 3 power moves this week', prompt: 'I will demonstrate my power by...' }
    ]
  },
  {
    id: 'sapphire',
    name: 'Sapphire',
    domain: 'Wisdom & Truth',
    color: 'from-blue-400 to-indigo-500',
    glowClass: 'glow-sapphire',
    description: 'Speak and live your deepest truth',
    stages: [
      { title: 'The Inventory', task: 'List 5 truths you hide from the world', prompt: 'What am I afraid to say?' },
      { title: 'The Expression', task: 'Write your authentic manifesto', prompt: 'I believe in...' },
      { title: 'The Voice', task: 'Share one hidden truth with someone', prompt: 'I will speak my truth by...' }
    ]
  },
  {
    id: 'obsidian',
    name: 'Obsidian',
    domain: 'Shadow & Integration',
    color: 'from-slate-400 to-gray-600',
    glowClass: 'glow-obsidian',
    description: 'Transform darkness into power',
    stages: [
      { title: 'The Shadow', task: 'Identify 5 traits you deny in yourself', prompt: 'What parts of me do I reject?' },
      { title: 'The Embrace', task: 'Write acceptance letters to your shadows', prompt: 'I accept and integrate my...' },
      { title: 'The Alchemy', task: 'Find the gift in each shadow trait', prompt: 'My shadow serves me by...' }
    ]
  },
  {
    id: 'clear-quartz',
    name: 'Clear Quartz',
    domain: 'Clarity & Amplification',
    color: 'from-white to-gray-200',
    glowClass: 'glow-quartz',
    description: 'Amplify all your intentions',
    stages: [
      { title: 'The Purification', task: 'Clear 5 sources of mental clutter', prompt: 'What clouds my clarity?' },
      { title: 'The Focus', task: 'Define your one ultimate vision', prompt: 'My highest purpose is...' },
      { title: 'The Amplification', task: 'Create a master intention statement', prompt: 'I am becoming...' }
    ]
  }
];

const ACHIEVEMENT_TIERS = [
  { name: 'Seeker', minPoints: 0, icon: '🌑', color: 'text-gray-400' },
  { name: 'Awakening', minPoints: 300, icon: '🌒', color: 'text-gray-300' },
  { name: 'Rising', minPoints: 800, icon: '🌓', color: 'text-yellow-400' },
  { name: 'Illuminated', minPoints: 1800, icon: '🌔', color: 'text-amber-400' },
  { name: 'Radiant', minPoints: 3500, icon: '🌕', color: 'text-white' }
];

const EMOTION_TAGS = [
  { id: 'fear', label: 'Fear', color: 'bg-red-500/20 text-red-300 border-red-500/30' },
  { id: 'doubt', label: 'Doubt', color: 'bg-orange-500/20 text-orange-300 border-orange-500/30' },
  { id: 'worry', label: 'Worry', color: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30' },
  { id: 'envy', label: 'Envy', color: 'bg-green-500/20 text-green-300 border-green-500/30' },
  { id: 'shame', label: 'Shame', color: 'bg-purple-500/20 text-purple-300 border-purple-500/30' },
  { id: 'anger', label: 'Anger', color: 'bg-rose-500/20 text-rose-300 border-rose-500/30' }
];

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

const getTimeGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good Morning';
  if (hour < 17) return 'Good Afternoon';
  return 'Good Evening';
};

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    weekday: 'short', month: 'short', day: 'numeric'
  });
};

const getDateKey = (date = new Date()) => date.toISOString().split('T')[0];

const getTier = (points) => {
  for (let i = ACHIEVEMENT_TIERS.length - 1; i >= 0; i--) {
    if (points >= ACHIEVEMENT_TIERS[i].minPoints) return ACHIEVEMENT_TIERS[i];
  }
  return ACHIEVEMENT_TIERS[0];
};

const calculateStreak = (entries) => {
  if (!entries || entries.length === 0) return 0;
  const sortedDates = [...new Set(entries.map(e => e.date))].sort().reverse();
  const today = getDateKey();
  const yesterday = getDateKey(new Date(Date.now() - 86400000));
  if (sortedDates[0] !== today && sortedDates[0] !== yesterday) return 0;
  let streak = 1;
  for (let i = 1; i < sortedDates.length; i++) {
    const current = new Date(sortedDates[i - 1]);
    const prev = new Date(sortedDates[i]);
    if (Math.floor((current - prev) / 86400000) === 1) streak++;
    else break;
  }
  return streak;
};

// ============================================================================
// AMBIENT BACKGROUND (Pure Black + Subtle Glows)
// ============================================================================

const AmbientBackground = ({ activeGeode }) => {
  const glowColor = activeGeode
    ? GEODES.find(g => g.id === activeGeode)?.color.split(' ')[0].replace('from-', '') || 'amber'
    : 'amber';

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0 bg-black">
      {/* Subtle top glow */}
      <div
        className={`absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] opacity-20`}
        style={{
          background: `radial-gradient(ellipse at center top, rgba(212, 175, 55, 0.15) 0%, transparent 70%)`
        }}
      />

      {/* Bottom ambient glow */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] opacity-10"
        style={{
          background: `radial-gradient(ellipse at center bottom, rgba(147, 51, 234, 0.2) 0%, transparent 70%)`
        }}
      />

      {/* Floating particles */}
      {[...Array(15)].map((_, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 rounded-full animate-float"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            background: `rgba(212, 175, 55, ${0.2 + Math.random() * 0.3})`,
            animationDelay: `${Math.random() * 8}s`,
            animationDuration: `${8 + Math.random() * 12}s`
          }}
        />
      ))}
    </div>
  );
};

// ============================================================================
// HEADER COMPONENT (Opal Dark Style)
// ============================================================================

const Header = ({ stats, tier, userName }) => (
  <header className="sticky top-0 z-40 glass border-b border-white/5">
    <div className="flex items-center justify-between px-5 py-4 max-w-lg mx-auto">
      {/* Greeting */}
      <div>
        <p className="text-xs text-amber-400/80 font-medium tracking-wider uppercase">
          {getTimeGreeting()}
        </p>
        <h1 className="text-xl font-display text-white">
          {userName || 'Creator'}
        </h1>
      </div>

      {/* Stats */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full glass-card border border-orange-500/20">
          <Flame className="w-4 h-4 text-orange-400" />
          <span className="text-sm font-semibold text-orange-300">{stats.streak}</span>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full glass-card border border-amber-500/20">
          <span className="text-base">{tier.icon}</span>
          <span className="text-sm font-semibold text-amber-300">{stats.totalPoints}</span>
        </div>
      </div>
    </div>
  </header>
);

// ============================================================================
// GEODE CAROUSEL (Hero's Journey Visual)
// ============================================================================

const GeodeCarousel = ({
  geodes,
  geodeProgress,
  selectedGeode,
  onSelectGeode,
  isSecondary
}) => {
  const getGeodeImage = (geode, progress) => {
    const stage = progress?.stage || 0;
    if (stage === 0) return '/images/geode-closed.png';
    if (stage === 1) return '/images/geode-cracked-1.png';
    if (stage === 2) return '/images/geode-cracked-2.png';
    if (stage >= 3) return `/images/gem-${geode.id}.png`;
    return '/images/geode-closed.png';
  };

  const isUnlocked = (index) => {
    if (index === 0) return true;
    // Unlock next geode when previous is mastered
    const prevGeode = geodes[index - 1];
    const prevProgress = geodeProgress[prevGeode.id];
    return prevProgress?.stage >= 3;
  };

  const activeIndex = selectedGeode
    ? geodes.findIndex(g => g.id === selectedGeode)
    : 0;

  if (isSecondary) {
    // Compact view when path is active
    return (
      <div className="flex justify-center gap-3 py-4">
        {geodes.slice(0, 4).map((geode, idx) => {
          const progress = geodeProgress[geode.id] || { stage: 0 };
          const unlocked = isUnlocked(idx);
          return (
            <button
              key={geode.id}
              onClick={() => unlocked && onSelectGeode(geode.id)}
              className={`relative w-12 h-12 rounded-xl transition-all ${
                unlocked ? 'opacity-100' : 'opacity-30 grayscale'
              } ${selectedGeode === geode.id ? 'ring-2 ring-amber-400' : ''}`}
            >
              <img
                src={getGeodeImage(geode, progress)}
                alt={geode.name}
                className="w-full h-full object-contain"
                onError={(e) => { e.target.src = '/images/geode-closed.png'; }}
              />
              {progress.stage >= 3 && (
                <Crown className="absolute -top-1 -right-1 w-4 h-4 text-amber-400" />
              )}
            </button>
          );
        })}
      </div>
    );
  }

  // Full carousel view
  return (
    <div className="relative py-8">
      {/* Hero Geode (Center) */}
      <div className="flex justify-center items-center mb-6">
        <div className={`relative geode-hero-glow ${geodes[activeIndex]?.glowClass || ''}`}>
          <button
            onClick={() => onSelectGeode(geodes[activeIndex]?.id)}
            className="geode-hero flex items-center justify-center transition-transform hover:scale-105"
          >
            <img
              src={getGeodeImage(geodes[activeIndex], geodeProgress[geodes[activeIndex]?.id])}
              alt={geodes[activeIndex]?.name}
              className={`w-full h-full object-contain ${
                (geodeProgress[geodes[activeIndex]?.id]?.stage || 0) > 0
                  ? 'animate-pulse-glow'
                  : ''
              }`}
              onError={(e) => { e.target.src = '/images/geode-closed.png'; }}
            />
          </button>

          {/* Light leak effect for cracked geodes */}
          {(geodeProgress[geodes[activeIndex]?.id]?.stage || 0) > 0 &&
           (geodeProgress[geodes[activeIndex]?.id]?.stage || 0) < 3 && (
            <div className={`absolute inset-0 rounded-full pointer-events-none ${
              geodeProgress[geodes[activeIndex]?.id]?.stage === 1
                ? 'light-leak-subtle'
                : 'light-leak-medium'
            }`} />
          )}
        </div>
      </div>

      {/* Geode Info */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-display text-white mb-1">
          {geodes[activeIndex]?.name || 'Select a Path'}
        </h2>
        <p className="text-amber-400/80 text-sm">
          {geodes[activeIndex]?.domain}
        </p>
        <p className="text-gray-400 text-xs mt-2">
          {geodes[activeIndex]?.description}
        </p>
      </div>

      {/* Side Geodes */}
      <div className="flex justify-center gap-4">
        {geodes.map((geode, idx) => {
          if (idx === activeIndex) return null;
          const progress = geodeProgress[geode.id] || { stage: 0 };
          const unlocked = isUnlocked(idx);

          return (
            <button
              key={geode.id}
              onClick={() => unlocked && onSelectGeode(geode.id)}
              className={`geode-side relative ${!unlocked ? 'geode-locked' : ''}`}
            >
              <img
                src={getGeodeImage(geode, progress)}
                alt={geode.name}
                className="w-full h-full object-contain"
                onError={(e) => { e.target.src = '/images/geode-closed.png'; }}
              />
              {!unlocked && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Lock className="w-6 h-6 text-gray-600" />
                </div>
              )}
              {progress.stage >= 3 && (
                <Crown className="absolute -top-1 -right-1 w-5 h-5 text-amber-400" />
              )}
            </button>
          );
        })}
      </div>

      {/* Progress Indicator */}
      <div className="flex justify-center gap-2 mt-6">
        {geodes.map((geode, idx) => {
          const progress = geodeProgress[geode.id] || { stage: 0 };
          return (
            <div
              key={geode.id}
              className={`w-2 h-2 rounded-full transition-all ${
                idx === activeIndex
                  ? 'w-6 bg-amber-400'
                  : progress.stage >= 3
                    ? 'bg-amber-400/60'
                    : 'bg-white/20'
              }`}
            />
          );
        })}
      </div>
    </div>
  );
};

// ============================================================================
// MORNING VISIONEERING CARD
// ============================================================================

const MorningVisioneeringCard = ({ isPriority, onStart }) => (
  <div className={`glass-card-elevated p-6 mx-4 ${isPriority ? 'glow-gold' : ''}`}>
    <div className="flex items-center gap-3 mb-4">
      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
        <Sun className="w-6 h-6 text-white" />
      </div>
      <div>
        <h3 className="font-display text-lg text-white">Morning Visioneering</h3>
        <p className="text-xs text-gray-400">7-minute guided visualization</p>
      </div>
    </div>
    <p className="text-gray-300 text-sm mb-4">
      Start your day by embodying your highest self through immersive visualization.
    </p>
    <button
      onClick={onStart}
      className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-amber-500/20 transition-all"
    >
      <Play className="w-5 h-5" />
      Begin Session
    </button>
  </div>
);

// ============================================================================
// REALITY SHIFT BOARD CARD
// ============================================================================

const RealityShiftBoardCard = ({ onNavigate }) => (
  <button
    onClick={onNavigate}
    className="glass-card p-5 mx-4 text-left hover:border-purple-500/30 transition-all group"
  >
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
          <Image className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="font-display text-white group-hover:text-purple-300 transition-colors">
            Reality Shift Board
          </h3>
          <p className="text-xs text-gray-400">Manifest your desires visually</p>
        </div>
      </div>
      <ChevronRight className="w-5 h-5 text-gray-500 group-hover:text-purple-400 transition-colors" />
    </div>
  </button>
);

// ============================================================================
// INNER MENTOR CARD
// ============================================================================

const InnerMentorCard = ({ onNavigate }) => (
  <button
    onClick={onNavigate}
    className="glass-card p-5 mx-4 text-left hover:border-cyan-500/30 transition-all group"
  >
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center">
          <MessageCircle className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="font-display text-white group-hover:text-cyan-300 transition-colors">
            Inner Mentor
          </h3>
          <p className="text-xs text-gray-400">AI-powered abundance guidance</p>
        </div>
      </div>
      <ChevronRight className="w-5 h-5 text-gray-500 group-hover:text-cyan-400 transition-colors" />
    </div>
  </button>
);

// ============================================================================
// TAB NAVIGATION (Opal Dark Style)
// ============================================================================

const TabNavigation = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'home', label: 'Home', icon: Sparkles },
    { id: 'journey', label: 'Journey', icon: Compass },
    { id: 'goals', label: 'Goals', icon: Target },
    { id: 'gratitude', label: 'Gratitude', icon: Heart },
    { id: 'tracker', label: 'Tracker', icon: Brain }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 glass border-t border-white/5 safe-area-pb">
      <div className="flex justify-around items-center h-16 max-w-lg mx-auto px-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center justify-center w-full h-full transition-all ${
                isActive ? 'text-amber-400' : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              <div className={`relative ${isActive ? 'glow-gold' : ''}`}>
                <Icon className={`w-6 h-6 ${isActive ? 'scale-110' : ''} transition-transform`} />
              </div>
              <span className="text-[10px] mt-1 font-medium">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

// ============================================================================
// HOME TAB (Selection Mode vs Active Mode)
// ============================================================================

const HomeTab = ({
  isPathChosen,
  geodes,
  geodeProgress,
  selectedGeode,
  setSelectedGeode,
  setActiveTab
}) => {
  if (!isPathChosen) {
    // SELECTION MODE - Geode Carousel is hero
    return (
      <div className="pb-24 space-y-8 pt-6">
        <div className="text-center mb-2">
          <h2 className="text-xl font-display text-amber-400/90 tracking-wide">Choose Your Path</h2>
          <p className="text-sm text-gray-500 mt-1">Select a crystal to begin your transformation</p>
        </div>
        <GeodeCarousel
          geodes={geodes}
          geodeProgress={geodeProgress}
          selectedGeode={selectedGeode}
          onSelectGeode={(id) => {
            setSelectedGeode(id);
            setActiveTab('journey');
          }}
          isSecondary={false}
        />
        <MorningVisioneeringCard isPriority={false} onStart={() => {}} />
        <RealityShiftBoardCard onNavigate={() => window.location.href = '/board'} />
        <InnerMentorCard onNavigate={() => window.location.href = '/mentor'} />
      </div>
    );
  }

  // ACTIVE MODE - Morning Visioneering is hero
  const activeGeode = geodes.find(g => g.id === selectedGeode);
  return (
    <div className="pb-24 space-y-6 pt-4">
      <MorningVisioneeringCard isPriority={true} onStart={() => {}} />
      <div className="mx-4 text-center">
        <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Your Active Path</p>
        <p className="text-sm text-amber-400/80 font-medium">{activeGeode?.name} • {activeGeode?.domain}</p>
      </div>
      <GeodeCarousel
        geodes={geodes}
        geodeProgress={geodeProgress}
        selectedGeode={selectedGeode}
        onSelectGeode={(id) => {
          setSelectedGeode(id);
          setActiveTab('journey');
        }}
        isSecondary={true}
      />
      <RealityShiftBoardCard onNavigate={() => window.location.href = '/board'} />
      <InnerMentorCard onNavigate={() => window.location.href = '/mentor'} />
    </div>
  );
};

// ============================================================================
// JOURNEY TAB (Geode Stage Progression)
// ============================================================================

const JourneyTab = ({
  geodes,
  geodeProgress,
  selectedGeode,
  setSelectedGeode,
  onCompleteStage,
  addPoints
}) => {
  const [journalEntry, setJournalEntry] = useState('');
  const [showCompletion, setShowCompletion] = useState(false);

  const geode = geodes.find(g => g.id === selectedGeode);
  const progress = geodeProgress[selectedGeode] || { stage: 0 };
  const currentStage = Math.min(progress.stage, (geode?.stages.length || 3) - 1);
  const stage = geode?.stages[currentStage];
  const isComplete = progress.stage >= 3;

  const handleComplete = () => {
    if (!journalEntry.trim() || journalEntry.length < 20) return;

    onCompleteStage(selectedGeode, progress.stage + 1);
    addPoints(progress.stage === 2 ? 200 : 100); // Bonus for mastery
    setShowCompletion(true);

    setTimeout(() => {
      setShowCompletion(false);
      setJournalEntry('');
    }, 2500);
  };

  if (showCompletion) {
    const isMastery = progress.stage === 2;
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-12rem)] px-4">
        <div className={`${geode?.glowClass || ''} animate-reveal-crystal`}>
          <div className="w-32 h-32 rounded-full bg-gradient-to-br from-amber-400 to-purple-600 flex items-center justify-center mb-6 shadow-2xl">
            {isMastery ? (
              <Crown className="w-16 h-16 text-white" />
            ) : (
              <Trophy className="w-14 h-14 text-white" />
            )}
          </div>
        </div>
        <h2 className="text-2xl font-display text-white mb-2">
          {isMastery ? 'Crystal Revealed!' : 'Stage Complete!'}
        </h2>
        <p className="text-amber-400 font-semibold">
          +{isMastery ? 200 : 100} Points
        </p>
        {isMastery && (
          <p className="text-gray-400 text-sm mt-2">
            {geode?.name} has been mastered
          </p>
        )}
      </div>
    );
  }

  if (!selectedGeode) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-12rem)] px-4 text-center">
        <Compass className="w-16 h-16 text-gray-600 mb-4" />
        <h2 className="text-xl font-display text-white mb-2">Choose Your Path</h2>
        <p className="text-gray-400 text-sm">
          Select a geode from the Home tab to begin your transformation journey.
        </p>
      </div>
    );
  }

  if (isComplete) {
    return (
      <div className="pb-24 px-4 pt-6">
        <div className="text-center mb-8">
          <div className={`inline-block ${geode?.glowClass || ''}`}>
            <img
              src={`/images/gem-${geode?.id}.png`}
              alt={geode?.name}
              className="w-32 h-32 object-contain mx-auto animate-pulse-glow"
              onError={(e) => { e.target.style.display = 'none'; }}
            />
          </div>
          <h2 className="text-2xl font-display text-white mt-4 mb-2">
            {geode?.name} Mastered
          </h2>
          <p className="text-amber-400">{geode?.domain}</p>
        </div>

        <div className="glass-card p-6 text-center">
          <Crown className="w-12 h-12 text-amber-400 mx-auto mb-4" />
          <p className="text-gray-300 mb-4">
            You have fully integrated the wisdom of {geode?.name}.
            The crystal's power now flows through you.
          </p>
          <button
            onClick={() => setSelectedGeode(null)}
            className="px-6 py-3 rounded-xl bg-amber-500/20 text-amber-300 font-medium hover:bg-amber-500/30 transition-colors"
          >
            Choose Another Path
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-24 px-4 pt-6 space-y-6">
      {/* Back Button */}
      <button
        onClick={() => setSelectedGeode(null)}
        className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
      >
        <ChevronLeft className="w-5 h-5" />
        <span>Back</span>
      </button>

      {/* Geode Header */}
      <div className={`glass-card-elevated p-6 ${geode?.glowClass || ''}`}>
        <div className="flex items-center gap-4 mb-4">
          <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${geode?.color} flex items-center justify-center`}>
            <Gem className="w-8 h-8 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-display text-white">{geode?.name}</h2>
            <p className="text-sm text-gray-400">
              Stage {currentStage + 1} of {geode?.stages.length}
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="flex gap-2">
          {geode?.stages.map((_, idx) => (
            <div
              key={idx}
              className={`h-2 flex-1 rounded-full transition-all ${
                idx < progress.stage
                  ? `bg-gradient-to-r ${geode?.color}`
                  : idx === progress.stage
                  ? 'bg-white/40'
                  : 'bg-white/10'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Stage Content */}
      <div className="glass-card p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-amber-400" />
          </div>
          <h3 className="font-display text-lg text-white">{stage?.title}</h3>
        </div>

        <p className="text-gray-300 mb-4">{stage?.task}</p>

        <div className="bg-purple-500/10 rounded-xl p-4 border border-purple-500/20">
          <p className="text-sm text-purple-200 italic">"{stage?.prompt}"</p>
        </div>
      </div>

      {/* Journal Entry */}
      <div className="glass-card p-6">
        <label className="block text-sm font-medium text-gray-300 mb-3">
          Your Response
        </label>
        <textarea
          value={journalEntry}
          onChange={(e) => setJournalEntry(e.target.value)}
          placeholder="Write your transformation here..."
          rows={6}
          className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50 resize-none"
        />
        <p className="text-xs text-gray-500 mt-2">{journalEntry.length} characters (min 20)</p>
      </div>

      {/* Complete Button */}
      <button
        onClick={handleComplete}
        disabled={journalEntry.length < 20}
        className="w-full py-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold disabled:opacity-40 disabled:cursor-not-allowed transition-all hover:shadow-lg hover:shadow-amber-500/20 flex items-center justify-center gap-2"
      >
        <Check className="w-5 h-5" />
        Complete Stage
      </button>
    </div>
  );
};

// ============================================================================
// GOALS TAB
// ============================================================================

const GoalsTab = ({ goals, setGoals, addPoints, userId, db }) => {
  const [newGoal, setNewGoal] = useState('');
  const [showInput, setShowInput] = useState(false);

  const addGoal = async () => {
    if (!newGoal.trim()) return;
    const goal = {
      id: Date.now().toString(),
      text: newGoal.trim(),
      isAchieved: false,
      createdAt: Date.now()
    };
    setGoals([goal, ...goals]);
    setNewGoal('');
    setShowInput(false);
    addPoints(10);

    if (db && userId) {
      try {
        await setDoc(doc(db, getPrivatePath(userId, 'goals'), goal.id), goal);
      } catch (e) { console.error(e); }
    }
  };

  const toggleGoal = async (id) => {
    const updated = goals.map(g => {
      if (g.id === id) {
        if (!g.isAchieved) addPoints(50);
        return { ...g, isAchieved: !g.isAchieved, completedAt: !g.isAchieved ? Date.now() : null };
      }
      return g;
    });
    setGoals(updated);

    if (db && userId) {
      const goal = updated.find(g => g.id === id);
      try {
        await updateDoc(doc(db, getPrivatePath(userId, 'goals'), id), {
          isAchieved: goal.isAchieved,
          completedAt: goal.completedAt
        });
      } catch (e) { console.error(e); }
    }
  };

  const active = goals.filter(g => !g.isAchieved);
  const achieved = goals.filter(g => g.isAchieved);

  return (
    <div className="pb-24 px-4 pt-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-display text-white">Abundance Goals</h2>
          <p className="text-gray-400 text-sm">{active.length} active, {achieved.length} achieved</p>
        </div>
        <button
          onClick={() => setShowInput(!showInput)}
          className="w-12 h-12 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/20"
        >
          <Plus className={`w-6 h-6 text-white transition-transform ${showInput ? 'rotate-45' : ''}`} />
        </button>
      </div>

      {showInput && (
        <div className="glass-card p-4 mb-6">
          <input
            type="text"
            value={newGoal}
            onChange={(e) => setNewGoal(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addGoal()}
            placeholder="What abundance are you calling in?"
            className="w-full bg-transparent text-white placeholder-gray-500 focus:outline-none text-lg mb-3"
            autoFocus
          />
          <button
            onClick={addGoal}
            disabled={!newGoal.trim()}
            className="w-full py-2 rounded-xl bg-amber-500/20 text-amber-300 font-medium disabled:opacity-50"
          >
            Add Goal
          </button>
        </div>
      )}

      {active.length > 0 && (
        <div className="mb-8">
          <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">In Progress</h3>
          <div className="space-y-3">
            {active.map(goal => (
              <div key={goal.id} className="glass-card p-4 flex items-center gap-3">
                <button
                  onClick={() => toggleGoal(goal.id)}
                  className="w-6 h-6 rounded-full border-2 border-amber-400/50 flex-shrink-0"
                />
                <span className="text-white flex-1">{goal.text}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {achieved.length > 0 && (
        <div>
          <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">Manifested</h3>
          <div className="space-y-3">
            {achieved.map(goal => (
              <div key={goal.id} className="glass-card p-4 flex items-center gap-3 border-amber-500/20">
                <button
                  onClick={() => toggleGoal(goal.id)}
                  className="w-6 h-6 rounded-full bg-amber-500 flex items-center justify-center flex-shrink-0"
                >
                  <Check className="w-4 h-4 text-white" />
                </button>
                <span className="text-amber-200/70 line-through flex-1">{goal.text}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {goals.length === 0 && (
        <div className="text-center py-12">
          <Target className="w-16 h-16 text-gray-700 mx-auto mb-4" />
          <p className="text-gray-500">No goals yet. What do you want to manifest?</p>
        </div>
      )}
    </div>
  );
};

// ============================================================================
// GRATITUDE TAB
// ============================================================================

const GratitudeTab = ({ gratitude, setGratitude, stats, addPoints, userId, db }) => {
  const [entry, setEntry] = useState('');
  const today = getDateKey();
  const todayEntry = gratitude.find(e => e.date === today);

  const prompts = [
    "What unexpected blessing showed up today?",
    "Who made you smile recently and why?",
    "What challenge are you secretly grateful for?",
    "What part of your body served you well today?",
    "What abundance did you notice that you usually overlook?"
  ];
  const [prompt] = useState(prompts[Math.floor(Math.random() * prompts.length)]);

  const saveGratitude = async () => {
    if (!entry.trim()) return;
    const g = {
      id: today,
      date: today,
      entry: entry.trim(),
      timestamp: Date.now(),
      wordCount: entry.trim().split(/\s+/).length
    };

    const existing = gratitude.findIndex(e => e.date === today);
    let updated;
    if (existing >= 0) {
      updated = [...gratitude];
      updated[existing] = g;
    } else {
      updated = [g, ...gratitude];
      addPoints(25);
    }
    setGratitude(updated);
    setEntry('');

    if (db && userId) {
      try {
        await setDoc(doc(db, getPrivatePath(userId, 'gratitude'), today), g);
      } catch (e) { console.error(e); }
    }
  };

  return (
    <div className="pb-24 px-4 pt-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-display text-white">Daily Gratitude</h2>
          <p className="text-gray-400 text-sm">Amplify your abundance frequency</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl glass-card border border-orange-500/20">
          <Flame className="w-5 h-5 text-orange-400" />
          <span className="font-semibold text-orange-300">{stats.streak}</span>
          <span className="text-xs text-orange-300/60">day</span>
        </div>
      </div>

      <div className="glass-card-elevated p-6 glow-gold mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="w-5 h-5 text-amber-400" />
          <span className="text-white font-medium">{formatDate(new Date())}</span>
          {todayEntry && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/20 text-green-300 ml-auto">
              Completed
            </span>
          )}
        </div>

        <div className="bg-black/30 rounded-xl p-4 mb-4">
          <p className="text-gray-300 italic text-sm">{prompt}</p>
        </div>

        <textarea
          value={entry}
          onChange={(e) => setEntry(e.target.value)}
          placeholder="I am grateful for..."
          rows={4}
          className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-amber-500/50 resize-none mb-4"
        />

        <button
          onClick={saveGratitude}
          disabled={!entry.trim()}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold disabled:opacity-40 flex items-center justify-center gap-2"
        >
          <Heart className="w-5 h-5" />
          {todayEntry ? 'Update' : 'Save'} Gratitude
        </button>
      </div>

      {gratitude.length > 0 && (
        <div>
          <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">History</h3>
          <div className="space-y-3">
            {gratitude.slice(0, 7).map(g => (
              <div key={g.id} className="glass-card p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-400">{formatDate(g.date)}</span>
                  <span className="text-xs text-gray-500">{g.wordCount} words</span>
                </div>
                <p className="text-gray-300 text-sm">{g.entry}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// ============================================================================
// TRACKER TAB
// ============================================================================

const TrackerTab = ({ lackThoughts, setLackThoughts, addPoints, userId, db }) => {
  const [thought, setThought] = useState('');
  const [emotion, setEmotion] = useState(null);
  const [intensity, setIntensity] = useState(5);

  const addThought = async () => {
    if (!thought.trim() || !emotion) return;
    const t = {
      id: Date.now().toString(),
      text: thought.trim(),
      emotion_tag: emotion,
      intensity,
      timestamp: Date.now(),
      transformed: false
    };
    setLackThoughts([t, ...lackThoughts]);
    setThought('');
    setEmotion(null);
    setIntensity(5);
    addPoints(15);

    if (db && userId) {
      try {
        await setDoc(doc(db, getPrivatePath(userId, 'lack_thoughts'), t.id), t);
      } catch (e) { console.error(e); }
    }
  };

  const untransformed = lackThoughts.filter(t => !t.transformed);
  const transformed = lackThoughts.filter(t => t.transformed);

  return (
    <div className="pb-24 px-4 pt-6">
      <div className="mb-6">
        <h2 className="text-2xl font-display text-white">Neuro-Tracker</h2>
        <p className="text-gray-400 text-sm">Track and transform scarcity patterns</p>
      </div>

      <div className="glass-card p-5 mb-6">
        <h3 className="text-white font-medium mb-3 flex items-center gap-2">
          <Brain className="w-5 h-5 text-purple-400" />
          Log Scarcity Pattern
        </h3>

        <textarea
          value={thought}
          onChange={(e) => setThought(e.target.value)}
          placeholder="What limiting thought arose?"
          rows={3}
          className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 resize-none mb-4"
        />

        <p className="text-sm text-gray-400 mb-2">Primary emotion:</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {EMOTION_TAGS.map(e => (
            <button
              key={e.id}
              onClick={() => setEmotion(e.id)}
              className={`px-3 py-1.5 rounded-full text-sm border transition-all ${
                emotion === e.id ? e.color + ' ring-1 ring-white/20' : 'bg-black/30 text-gray-400 border-white/10'
              }`}
            >
              {e.label}
            </button>
          ))}
        </div>

        <div className="mb-4">
          <div className="flex justify-between text-sm text-gray-400 mb-2">
            <span>Intensity</span>
            <span>{intensity}/10</span>
          </div>
          <input
            type="range"
            min="1"
            max="10"
            value={intensity}
            onChange={(e) => setIntensity(parseInt(e.target.value))}
            className="w-full accent-purple-500"
          />
        </div>

        <button
          onClick={addThought}
          disabled={!thought.trim() || !emotion}
          className="w-full py-3 rounded-xl bg-purple-500/20 text-purple-300 font-medium disabled:opacity-40"
        >
          Log Pattern
        </button>
      </div>

      {untransformed.length > 0 && (
        <div className="mb-6">
          <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">
            Awaiting Transformation ({untransformed.length})
          </h3>
          <div className="space-y-3">
            {untransformed.slice(0, 5).map(t => {
              const emo = EMOTION_TAGS.find(e => e.id === t.emotion_tag);
              return (
                <div key={t.id} className="glass-card p-4">
                  <p className="text-white mb-2">{t.text}</p>
                  <div className="flex items-center gap-2">
                    {emo && <span className={`${emo.color} px-2 py-0.5 rounded-full text-xs border`}>{emo.label}</span>}
                    <span className="text-xs text-gray-500">Intensity: {t.intensity}/10</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {transformed.length > 0 && (
        <div>
          <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">
            Transformed ({transformed.length})
          </h3>
          <div className="space-y-2">
            {transformed.slice(0, 3).map(t => (
              <div key={t.id} className="glass-card p-3 flex items-center gap-3 border-green-500/20">
                <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
                <p className="text-green-200/60 text-sm line-through">{t.text}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// ============================================================================
// INNER MENTOR TAB
// ============================================================================

const InnerMentorTab = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const responses = [
    "Your awareness of this pattern is the first step to transformation. What would shift if you fully believed abundance is your birthright?",
    "Notice how that thought creates contraction. Now imagine the opposite being true. Feel the expansion?",
    "The universe is always reflecting your dominant vibration. What frequency do you want to broadcast?",
    "Every limiting belief was installed by someone who was also limited. You have the power to uninstall it.",
    "What if this obstacle is actually a doorway? How might this challenge redirect you toward something greater?"
  ];

  useEffect(() => {
    if (messages.length === 0) {
      setMessages([{
        id: 'welcome',
        role: 'mentor',
        content: "Welcome, beautiful soul. I'm your Inner Mentor. Share what's on your mind - fears, doubts, or limiting thoughts - and I'll help transform them. What pattern would you like to release?",
        timestamp: Date.now()
      }]);
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const send = () => {
    if (!input.trim()) return;
    setMessages(prev => [...prev, { id: Date.now().toString(), role: 'user', content: input.trim(), timestamp: Date.now() }]);
    setInput('');
    setIsTyping(true);
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'mentor',
        content: responses[Math.floor(Math.random() * responses.length)],
        timestamp: Date.now()
      }]);
      setIsTyping(false);
    }, 1500 + Math.random() * 1000);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.map(msg => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] rounded-2xl px-4 py-3 ${
              msg.role === 'user'
                ? 'bg-amber-500/20 border border-amber-500/30 text-amber-100'
                : 'glass-card text-gray-100'
            }`}>
              {msg.role === 'mentor' && (
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center">
                    <Sparkles className="w-3 h-3 text-white" />
                  </div>
                  <span className="text-xs font-medium text-cyan-300">Inner Mentor</span>
                </div>
              )}
              <p className="text-sm leading-relaxed">{msg.content}</p>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="glass-card rounded-2xl px-4 py-3">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 glass border-t border-white/5">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && send()}
            placeholder="Share your thoughts..."
            className="flex-1 bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50"
          />
          <button
            onClick={send}
            disabled={!input.trim()}
            className="p-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white disabled:opacity-40"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// MAIN APP COMPONENT
// ============================================================================

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('home');
  const [selectedGeode, setSelectedGeode] = useState(null);
  const [geodeProgress, setGeodeProgress] = useState({});
  const [stats, setStats] = useState({ streak: 0, totalPoints: 0 });
  const [goals, setGoals] = useState([]);
  const [gratitude, setGratitude] = useState([]);
  const [lackThoughts, setLackThoughts] = useState([]);

  const tier = useMemo(() => getTier(stats.totalPoints), [stats.totalPoints]);
  const isPathChosen = selectedGeode !== null;

  // Offline data fallback - load from localStorage on mount
  useEffect(() => {
    if (!user?.uid) {
      try {
        const offlineStats = localStorage.getItem('abundance-offline-stats');
        const offlineGoals = localStorage.getItem('abundance-offline-goals');
        const offlineGratitude = localStorage.getItem('abundance-offline-gratitude');
        const offlineProgress = localStorage.getItem('abundance-offline-progress');

        if (offlineStats) setStats(JSON.parse(offlineStats));
        if (offlineGoals) setGoals(JSON.parse(offlineGoals));
        if (offlineGratitude) setGratitude(JSON.parse(offlineGratitude));
        if (offlineProgress) setGeodeProgress(JSON.parse(offlineProgress));
      } catch (e) {
        console.log('No offline data available');
      }
    }
  }, [user?.uid]);

  // Save to localStorage as backup when data changes
  useEffect(() => {
    if (stats.totalPoints > 0) {
      localStorage.setItem('abundance-offline-stats', JSON.stringify(stats));
    }
  }, [stats]);

  useEffect(() => {
    if (goals.length > 0) {
      localStorage.setItem('abundance-offline-goals', JSON.stringify(goals));
    }
  }, [goals]);

  useEffect(() => {
    if (gratitude.length > 0) {
      localStorage.setItem('abundance-offline-gratitude', JSON.stringify(gratitude));
    }
  }, [gratitude]);

  useEffect(() => {
    if (Object.keys(geodeProgress).length > 0) {
      localStorage.setItem('abundance-offline-progress', JSON.stringify(geodeProgress));
    }
  }, [geodeProgress]);

  const addPoints = useCallback((pts) => {
    setStats(prev => {
      const newStats = { ...prev, totalPoints: prev.totalPoints + pts };
      if (db && user?.uid) {
        setDoc(doc(db, getPrivatePath(user.uid, 'stats'), 'main'), newStats, { merge: true }).catch(console.error);
      }
      return newStats;
    });
  }, [user?.uid]);

  const onCompleteStage = useCallback((geodeId, newStage) => {
    setGeodeProgress(prev => {
      const updated = { ...prev, [geodeId]: { stage: newStage, updatedAt: Date.now() } };
      if (db && user?.uid) {
        setDoc(doc(db, getPrivatePath(user.uid, 'progress'), 'geodes'), updated, { merge: true }).catch(console.error);
      }
      return updated;
    });
  }, [user?.uid]);

  // Auth with timeout safety net
  useEffect(() => {
    // Timeout safety net - show app even if auth fails/hangs
    const timeoutId = setTimeout(() => {
      console.warn('Auth timeout reached - loading app without auth');
      setLoading(false);
    }, 5000);

    if (!auth) {
      clearTimeout(timeoutId);
      setLoading(false);
      return;
    }

    const unsub = onAuthStateChanged(auth, async (u) => {
      clearTimeout(timeoutId);
      if (u) {
        setUser(u);
      } else {
        try {
          if (initialAuthToken) {
            await signInWithCustomToken(auth, initialAuthToken);
          } else {
            await signInAnonymously(auth);
          }
        } catch (e) {
          console.error('Auth error:', e);
        }
      }
      setLoading(false);
    });

    return () => {
      clearTimeout(timeoutId);
      unsub();
    };
  }, []);

  // Load data
  useEffect(() => {
    if (!db || !user?.uid) return;
    const uid = user.uid;

    getDoc(doc(db, getPrivatePath(uid, 'stats'), 'main')).then(s => {
      if (s.exists()) setStats(s.data());
    }).catch(console.error);

    getDoc(doc(db, getPrivatePath(uid, 'progress'), 'geodes')).then(p => {
      if (p.exists()) setGeodeProgress(p.data());
    }).catch(console.error);

    const goalsQ = query(collection(db, getPrivatePath(uid, 'goals')), orderBy('createdAt', 'desc'));
    const unsubGoals = onSnapshot(goalsQ, s => setGoals(s.docs.map(d => ({ id: d.id, ...d.data() }))), console.error);

    const gratQ = query(collection(db, getPrivatePath(uid, 'gratitude')), orderBy('timestamp', 'desc'));
    const unsubGrat = onSnapshot(gratQ, s => {
      const data = s.docs.map(d => ({ id: d.id, ...d.data() }));
      setGratitude(data);
      setStats(prev => ({ ...prev, streak: calculateStreak(data) }));
    }, console.error);

    const thoughtsQ = query(collection(db, getPrivatePath(uid, 'lack_thoughts')), orderBy('timestamp', 'desc'));
    const unsubThoughts = onSnapshot(thoughtsQ, s => setLackThoughts(s.docs.map(d => ({ id: d.id, ...d.data() }))), console.error);

    return () => { unsubGoals(); unsubGrat(); unsubThoughts(); };
  }, [user?.uid]);

  // Recalculate streak
  useEffect(() => {
    const newStreak = calculateStreak(gratitude);
    if (newStreak !== stats.streak) {
      setStats(prev => ({ ...prev, streak: newStreak }));
    }
  }, [gratitude]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-400 to-purple-600 flex items-center justify-center mx-auto mb-4 animate-pulse glow-gold">
            <Sparkles className="w-10 h-10 text-white" />
          </div>
          <p className="text-gray-400 font-display">Loading your journey...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <AmbientBackground activeGeode={selectedGeode} />
      <Header stats={stats} tier={tier} userName="Creator" />

      <main className="relative z-10">
        {activeTab === 'home' && (
          <HomeTab
            isPathChosen={isPathChosen}
            geodes={GEODES}
            geodeProgress={geodeProgress}
            selectedGeode={selectedGeode}
            setSelectedGeode={setSelectedGeode}
            setActiveTab={setActiveTab}
          />
        )}
        {activeTab === 'journey' && (
          <JourneyTab
            geodes={GEODES}
            geodeProgress={geodeProgress}
            selectedGeode={selectedGeode}
            setSelectedGeode={setSelectedGeode}
            onCompleteStage={onCompleteStage}
            addPoints={addPoints}
          />
        )}
        {activeTab === 'goals' && (
          <GoalsTab goals={goals} setGoals={setGoals} addPoints={addPoints} userId={user?.uid} db={db} />
        )}
        {activeTab === 'gratitude' && (
          <GratitudeTab gratitude={gratitude} setGratitude={setGratitude} stats={stats} addPoints={addPoints} userId={user?.uid} db={db} />
        )}
        {activeTab === 'tracker' && (
          <TrackerTab lackThoughts={lackThoughts} setLackThoughts={setLackThoughts} addPoints={addPoints} userId={user?.uid} db={db} />
        )}
        {activeTab === 'mentor' && <InnerMentorTab />}
      </main>

      <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
}
