/**
 * ABUNDANCE RECODE - ULTRA ENHANCED VERSION
 * Single-file architecture with Firebase v11
 * 5 Tabs: Flow Coach, Abundance Paths, Goals, Gratitude, Neuro-Tracker
 * 6 Paths: Wealth, Love, Power, Wisdom, Health, Peace
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
  getDocs,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import {
  Sparkles, Target, Heart, Brain, Flame, Trophy, Star,
  ChevronRight, ChevronLeft, Plus, Check, X, Trash2,
  TrendingUp, Calendar, Award, Zap, Sun, Moon, Crown,
  MessageCircle, BookOpen, Compass, Shield, Gem, Lightbulb,
  BarChart3, Clock, Edit3, Send, RefreshCw, Volume2
} from 'lucide-react';

// ============================================================================
// GLOBAL CONFIGURATION
// ============================================================================

const appId = typeof __app_id !== 'undefined' ? __app_id : 'abundance-recode-app';
const firebaseConfig = typeof __firebase_config !== 'undefined'
  ? JSON.parse(__firebase_config)
  : {
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyDemo",
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "demo.firebaseapp.com",
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "abundance-recode",
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "demo.appspot.com",
      messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "123456789",
      appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:123:web:abc"
    };
const initialAuthToken = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;

// Initialize Firebase
let app, auth, db;
try {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
} catch (e) {
  console.log('Firebase initialization deferred or failed:', e.message);
}

// Secure Firestore paths
const getPrivatePath = (userId, collectionName) => {
  return `artifacts/${appId}/users/${userId}/${collectionName}`;
};

// ============================================================================
// CONSTANTS & DATA
// ============================================================================

const ABUNDANCE_PATHS = [
  {
    id: 'wealth',
    name: 'Wealth Consciousness',
    icon: Gem,
    color: 'from-yellow-400 to-amber-600',
    bgColor: 'bg-gradient-to-br from-yellow-400/20 to-amber-600/20',
    description: 'Unlock unlimited financial abundance',
    stages: [
      { title: 'The Audit', task: 'List 5 limiting beliefs about money you inherited from family', prompt: 'What money stories did you absorb growing up? Write them down to release their power.' },
      { title: 'The Release', task: 'Write a forgiveness letter to money itself', prompt: 'Dear Money, I forgive myself for... I release the belief that...' },
      { title: 'The Vision', task: 'Describe your wealthy self in vivid detail - daily routine, feelings, impact', prompt: 'I am now living in complete financial abundance. My typical day looks like...' },
      { title: 'The Integration', task: 'Create 3 "I AM" statements about wealth and repeat them for 21 days', prompt: 'I AM... (complete with powerful wealth affirmations)' }
    ]
  },
  {
    id: 'love',
    name: 'Love Magnetism',
    icon: Heart,
    color: 'from-pink-400 to-rose-600',
    bgColor: 'bg-gradient-to-br from-pink-400/20 to-rose-600/20',
    description: 'Attract deep, fulfilling relationships',
    stages: [
      { title: 'The Mirror', task: 'List 5 ways you reject or abandon yourself', prompt: 'How do I not show up for myself? Where do I people-please at my expense?' },
      { title: 'The Healing', task: 'Write a love letter to your inner child', prompt: 'Dear little [name], I want you to know that you are...' },
      { title: 'The Embodiment', task: 'Describe the love you deserve in specific detail', prompt: 'The love I deserve feels like... looks like... sounds like...' },
      { title: 'The Radiance', task: 'List 10 ways you will love yourself this week', prompt: 'I commit to showing myself love by...' }
    ]
  },
  {
    id: 'power',
    name: 'Personal Power',
    icon: Flame,
    color: 'from-orange-400 to-red-600',
    bgColor: 'bg-gradient-to-br from-orange-400/20 to-red-600/20',
    description: 'Reclaim your authentic confidence',
    stages: [
      { title: 'The Excavation', task: 'Identify 5 moments you gave your power away', prompt: 'When have I dimmed my light? Where do I seek approval instead of trust myself?' },
      { title: 'The Reclamation', task: 'Write declarations of personal sovereignty', prompt: 'I reclaim my power by... I no longer allow... I choose...' },
      { title: 'The Embodiment', task: 'Describe yourself operating at full power', prompt: 'When I am fully in my power, I... People experience me as...' },
      { title: 'The Action', task: 'Commit to 3 power moves this week', prompt: 'This week I will demonstrate my power by...' }
    ]
  },
  {
    id: 'wisdom',
    name: 'Inner Wisdom',
    icon: Lightbulb,
    color: 'from-purple-400 to-indigo-600',
    bgColor: 'bg-gradient-to-br from-purple-400/20 to-indigo-600/20',
    description: 'Access your infinite inner guidance',
    stages: [
      { title: 'The Silence', task: 'Document 5 times you ignored your intuition and regretted it', prompt: 'When has my gut been right but I overrode it? What happened?' },
      { title: 'The Listening', task: 'Have a written dialogue with your Higher Self', prompt: 'Higher Self, what do you want me to know right now? [then write the response]' },
      { title: 'The Trust', task: 'Describe a life guided by intuition', prompt: 'When I fully trust my inner wisdom, my decisions become... my life transforms into...' },
      { title: 'The Practice', task: 'Commit to one intuitive practice daily for 7 days', prompt: 'I will strengthen my intuition by...' }
    ]
  },
  {
    id: 'health',
    name: 'Vital Energy',
    icon: Zap,
    color: 'from-green-400 to-emerald-600',
    bgColor: 'bg-gradient-to-br from-green-400/20 to-emerald-600/20',
    description: 'Optimize your physical vitality',
    stages: [
      { title: 'The Awareness', task: 'List 5 ways you neglect or punish your body', prompt: 'How do I dishonor my body? What negative things do I say about it?' },
      { title: 'The Gratitude', task: 'Write a thank you letter to your body', prompt: 'Dear Body, thank you for... I appreciate how you...' },
      { title: 'The Vision', task: 'Describe your body at peak vitality', prompt: 'My body in perfect health feels... moves... looks... allows me to...' },
      { title: 'The Commitment', task: 'Create a sacred health covenant with yourself', prompt: 'I promise my body I will... I honor my vessel by...' }
    ]
  },
  {
    id: 'peace',
    name: 'Inner Peace',
    icon: Sun,
    color: 'from-cyan-400 to-teal-600',
    bgColor: 'bg-gradient-to-br from-cyan-400/20 to-teal-600/20',
    description: 'Cultivate unshakeable serenity',
    stages: [
      { title: 'The Inventory', task: 'List 5 things you resist, avoid, or fight against', prompt: 'What am I at war with? What drains my peace?' },
      { title: 'The Surrender', task: 'Write acceptance statements for each resistance', prompt: 'I accept... I release my need to control... I surrender...' },
      { title: 'The Vision', task: 'Describe a life of complete inner peace', prompt: 'Living in peace, I respond to challenges by... My nervous system feels...' },
      { title: 'The Anchor', task: 'Create a peace ritual for daily practice', prompt: 'My daily peace practice includes...' }
    ]
  }
];

const ACHIEVEMENT_TIERS = [
  { name: 'Awakening', minPoints: 0, icon: '🌱', color: 'text-green-400' },
  { name: 'Rising', minPoints: 500, icon: '🌟', color: 'text-yellow-400' },
  { name: 'Expanding', minPoints: 1500, icon: '💫', color: 'text-purple-400' },
  { name: 'Mastering', minPoints: 3500, icon: '👑', color: 'text-amber-400' },
  { name: 'Transcendent', minPoints: 7000, icon: '✨', color: 'text-white' }
];

const EMOTION_TAGS = [
  { id: 'fear', label: 'Fear', color: 'bg-red-500/20 text-red-300' },
  { id: 'doubt', label: 'Doubt', color: 'bg-orange-500/20 text-orange-300' },
  { id: 'worry', label: 'Worry', color: 'bg-yellow-500/20 text-yellow-300' },
  { id: 'envy', label: 'Envy', color: 'bg-green-500/20 text-green-300' },
  { id: 'shame', label: 'Shame', color: 'bg-purple-500/20 text-purple-300' },
  { id: 'anger', label: 'Anger', color: 'bg-rose-500/20 text-rose-300' }
];

const NLP_PROMPTS = {
  gratitude: [
    "What unexpected blessing showed up today?",
    "Who made you smile recently and why?",
    "What challenge are you secretly grateful for?",
    "What part of your body served you well today?",
    "What abundance did you notice that you usually overlook?",
    "What skill or talent are you grateful to possess?",
    "What simple pleasure brought you joy today?"
  ],
  reframe: [
    "What if this situation is actually working FOR you?",
    "How might your future self thank you for this experience?",
    "What strength is this challenge helping you build?",
    "If this was happening for a divine reason, what might it be?",
    "What would unconditional self-love say about this?"
  ]
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  });
};

const getDateKey = (date = new Date()) => {
  return date.toISOString().split('T')[0];
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
    const diffDays = Math.floor((current - prev) / 86400000);
    if (diffDays === 1) streak++;
    else break;
  }
  return streak;
};

const getTier = (points) => {
  for (let i = ACHIEVEMENT_TIERS.length - 1; i >= 0; i--) {
    if (points >= ACHIEVEMENT_TIERS[i].minPoints) return ACHIEVEMENT_TIERS[i];
  }
  return ACHIEVEMENT_TIERS[0];
};

const getRandomPrompt = (category) => {
  const prompts = NLP_PROMPTS[category] || NLP_PROMPTS.gratitude;
  return prompts[Math.floor(Math.random() * prompts.length)];
};

// ============================================================================
// ANIMATED BACKGROUND COMPONENT
// ============================================================================

const AnimatedBackground = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Base gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-purple-950/30 to-gray-950" />

      {/* Animated orbs */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl animate-pulse"
           style={{ animationDuration: '8s' }} />
      <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-amber-500/15 rounded-full blur-3xl animate-pulse"
           style={{ animationDuration: '6s', animationDelay: '2s' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-purple-600/10 to-amber-500/10 rounded-full blur-3xl animate-spin"
           style={{ animationDuration: '60s' }} />

      {/* Particle field */}
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 bg-amber-400/40 rounded-full animate-float"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${5 + Math.random() * 10}s`
          }}
        />
      ))}
    </div>
  );
};

// ============================================================================
// TAB NAVIGATION COMPONENT
// ============================================================================

const TabNavigation = ({ activeTab, setActiveTab, stats }) => {
  const tabs = [
    { id: 'coach', label: 'Flow Coach', icon: MessageCircle },
    { id: 'paths', label: 'Paths', icon: Compass },
    { id: 'goals', label: 'Goals', icon: Target },
    { id: 'gratitude', label: 'Gratitude', icon: Heart },
    { id: 'tracker', label: 'Tracker', icon: Brain }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-gray-950/90 backdrop-blur-xl border-t border-white/10 safe-area-pb">
      <div className="flex justify-around items-center h-16 max-w-lg mx-auto px-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center justify-center w-full h-full transition-all duration-300 ${
                isActive
                  ? 'text-amber-400 scale-110'
                  : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              <div className={`relative ${isActive ? 'animate-bounce-subtle' : ''}`}>
                <Icon className="w-6 h-6" />
                {isActive && (
                  <div className="absolute -inset-2 bg-amber-400/20 rounded-full blur-lg -z-10" />
                )}
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
// HEADER COMPONENT
// ============================================================================

const Header = ({ stats, tier }) => {
  return (
    <header className="sticky top-0 z-40 bg-gray-950/80 backdrop-blur-xl border-b border-white/5">
      <div className="flex items-center justify-between px-4 py-3 max-w-lg mx-auto">
        {/* Logo & Title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-purple-600 flex items-center justify-center shadow-lg shadow-amber-500/20">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold bg-gradient-to-r from-amber-200 to-amber-400 bg-clip-text text-transparent">
              Abundance
            </h1>
            <p className="text-[10px] text-gray-500 -mt-0.5">Recode Your Reality</p>
          </div>
        </div>

        {/* Stats Badges */}
        <div className="flex items-center gap-2">
          {/* Streak */}
          <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-orange-500/20 border border-orange-500/30">
            <Flame className="w-3.5 h-3.5 text-orange-400" />
            <span className="text-xs font-bold text-orange-300">{stats.streak}</span>
          </div>

          {/* Points & Tier */}
          <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-amber-500/20 border border-amber-500/30">
            <span className="text-sm">{tier.icon}</span>
            <span className="text-xs font-bold text-amber-300">{stats.totalPoints}</span>
          </div>
        </div>
      </div>
    </header>
  );
};

// ============================================================================
// FLOW COACH TAB
// ============================================================================

const FlowCoachTab = ({ userId, db }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const coachResponses = [
    "Your awareness of this pattern is the first step to transformation. What would shift if you fully believed abundance is your birthright?",
    "Notice how that thought creates contraction in your body. Now imagine the opposite being true. Feel the expansion?",
    "The universe is always reflecting your dominant vibration. What frequency do you want to broadcast right now?",
    "Every limiting belief was installed by someone who was also limited. You have the power to uninstall it today.",
    "What if the obstacles you see are actually doorways? How might this challenge be redirecting you toward something greater?",
    "Your words create your world. Let's reframe that thought into one that serves your highest vision.",
    "The scarcity you perceive is a projection of the scarcity you were taught. Abundance is the truth of the universe.",
    "Feel into your body right now. Where is the resistance? Breathe into that space with love and watch it release."
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (messages.length === 0) {
      setMessages([{
        id: 'welcome',
        role: 'coach',
        content: "Welcome, beautiful soul. I'm your Abundance Flow Coach. Share what's on your mind - any fears, doubts, or limiting thoughts - and I'll help you transform them into empowering beliefs. What pattern would you like to release today?",
        timestamp: Date.now()
      }]);
    }
  }, []);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate coach thinking
    setTimeout(() => {
      const coachMessage = {
        id: (Date.now() + 1).toString(),
        role: 'coach',
        content: coachResponses[Math.floor(Math.random() * coachResponses.length)],
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, coachMessage]);
      setIsTyping(false);
    }, 1500 + Math.random() * 1500);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] max-w-lg mx-auto">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                msg.role === 'user'
                  ? 'bg-amber-500/20 border border-amber-500/30 text-amber-100'
                  : 'bg-purple-500/20 border border-purple-500/30 text-purple-100'
              }`}
            >
              {msg.role === 'coach' && (
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-400 to-indigo-600 flex items-center justify-center">
                    <Sparkles className="w-3 h-3 text-white" />
                  </div>
                  <span className="text-xs font-medium text-purple-300">Flow Coach</span>
                </div>
              )}
              <p className="text-sm leading-relaxed">{msg.content}</p>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-purple-500/20 border border-purple-500/30 rounded-2xl px-4 py-3">
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
                <span className="text-xs text-purple-300">Channeling wisdom...</span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-white/5 bg-gray-950/50">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Share your thoughts..."
            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50"
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim()}
            className="p-3 rounded-xl bg-gradient-to-r from-amber-500 to-purple-600 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:shadow-lg hover:shadow-amber-500/25"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// ABUNDANCE PATHS TAB
// ============================================================================

const AbundancePathsTab = ({ userId, db, progress, setProgress, addPoints }) => {
  const [selectedPath, setSelectedPath] = useState(null);
  const [activeStage, setActiveStage] = useState(0);
  const [journalEntry, setJournalEntry] = useState('');
  const [showCompletion, setShowCompletion] = useState(false);

  const getPathProgress = (pathId) => {
    const completed = Object.keys(progress.completed || {}).filter(
      key => key.startsWith(pathId)
    ).length;
    return completed;
  };

  const isStageCompleted = (pathId, stageIndex) => {
    return progress.completed?.[`${pathId}_${stageIndex}`] !== undefined;
  };

  const completeStage = async () => {
    if (!journalEntry.trim() || !selectedPath) return;

    const stageKey = `${selectedPath.id}_${activeStage}`;
    const newProgress = {
      ...progress,
      completed: {
        ...progress.completed,
        [stageKey]: Date.now()
      }
    };

    setProgress(newProgress);
    addPoints(100);

    // Save to Firebase
    if (db && userId) {
      try {
        const progressRef = doc(db, getPrivatePath(userId, 'progress'), 'main');
        await setDoc(progressRef, newProgress, { merge: true });
      } catch (e) {
        console.error('Error saving progress:', e);
      }
    }

    setShowCompletion(true);
    setTimeout(() => {
      setShowCompletion(false);
      setJournalEntry('');
      if (activeStage < selectedPath.stages.length - 1) {
        setActiveStage(activeStage + 1);
      } else {
        setSelectedPath(null);
        setActiveStage(0);
      }
    }, 2000);
  };

  if (showCompletion) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-8rem)] px-4">
        <div className="animate-bounce-in">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-amber-400 to-purple-600 flex items-center justify-center mb-6 shadow-2xl shadow-amber-500/30">
            <Trophy className="w-12 h-12 text-white" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Stage Complete!</h2>
        <p className="text-amber-400 font-medium">+100 Points</p>
        <div className="mt-4 flex items-center gap-2">
          <Star className="w-5 h-5 text-amber-400 animate-pulse" />
          <Star className="w-6 h-6 text-amber-400 animate-pulse" style={{ animationDelay: '100ms' }} />
          <Star className="w-5 h-5 text-amber-400 animate-pulse" style={{ animationDelay: '200ms' }} />
        </div>
      </div>
    );
  }

  if (selectedPath) {
    const stage = selectedPath.stages[activeStage];
    const Icon = selectedPath.icon;

    return (
      <div className="max-w-lg mx-auto px-4 py-6 pb-24">
        {/* Back Button */}
        <button
          onClick={() => { setSelectedPath(null); setActiveStage(0); setJournalEntry(''); }}
          className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
          <span>Back to Paths</span>
        </button>

        {/* Path Header */}
        <div className={`rounded-2xl p-6 ${selectedPath.bgColor} border border-white/10 mb-6`}>
          <div className="flex items-center gap-4">
            <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${selectedPath.color} flex items-center justify-center shadow-lg`}>
              <Icon className="w-7 h-7 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">{selectedPath.name}</h2>
              <p className="text-sm text-gray-300">Stage {activeStage + 1} of {selectedPath.stages.length}</p>
            </div>
          </div>

          {/* Stage Progress Dots */}
          <div className="flex gap-2 mt-4">
            {selectedPath.stages.map((_, idx) => (
              <div
                key={idx}
                className={`h-2 flex-1 rounded-full transition-all ${
                  isStageCompleted(selectedPath.id, idx)
                    ? 'bg-gradient-to-r from-amber-400 to-amber-500'
                    : idx === activeStage
                    ? 'bg-white/40'
                    : 'bg-white/10'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Stage Content */}
        <div className="bg-white/5 rounded-2xl p-6 border border-white/10 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center">
              <BookOpen className="w-4 h-4 text-amber-400" />
            </div>
            <h3 className="text-lg font-semibold text-white">{stage.title}</h3>
          </div>

          <p className="text-gray-300 mb-4">{stage.task}</p>

          <div className="bg-purple-500/10 rounded-xl p-4 border border-purple-500/20">
            <p className="text-sm text-purple-200 italic">"{stage.prompt}"</p>
          </div>
        </div>

        {/* Journal Entry */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Your Response
          </label>
          <textarea
            value={journalEntry}
            onChange={(e) => setJournalEntry(e.target.value)}
            placeholder="Write your transformation here..."
            rows={6}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50 resize-none"
          />
          <p className="text-xs text-gray-500 mt-2">{journalEntry.length} characters</p>
        </div>

        {/* Complete Button */}
        <button
          onClick={completeStage}
          disabled={journalEntry.length < 20}
          className="w-full py-4 rounded-xl bg-gradient-to-r from-amber-500 to-purple-600 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:shadow-lg hover:shadow-amber-500/25 flex items-center justify-center gap-2"
        >
          <Check className="w-5 h-5" />
          Complete Stage
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-6 pb-24">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">Abundance Paths</h2>
        <p className="text-gray-400">Choose a path to begin your transformation journey</p>
      </div>

      <div className="grid gap-4">
        {ABUNDANCE_PATHS.map((path) => {
          const Icon = path.icon;
          const completed = getPathProgress(path.id);
          const total = path.stages.length;
          const isComplete = completed === total;

          return (
            <button
              key={path.id}
              onClick={() => {
                setSelectedPath(path);
                // Find first incomplete stage
                for (let i = 0; i < path.stages.length; i++) {
                  if (!isStageCompleted(path.id, i)) {
                    setActiveStage(i);
                    break;
                  }
                }
              }}
              className={`${path.bgColor} rounded-2xl p-5 border border-white/10 text-left transition-all hover:scale-[1.02] hover:shadow-lg ${
                isComplete ? 'ring-2 ring-amber-400/50' : ''
              }`}
            >
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${path.color} flex items-center justify-center shadow-lg flex-shrink-0`}>
                  {isComplete ? (
                    <Crown className="w-6 h-6 text-white" />
                  ) : (
                    <Icon className="w-6 h-6 text-white" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-lg font-semibold text-white">{path.name}</h3>
                    {isComplete && <span className="text-amber-400 text-sm">✓ Mastered</span>}
                  </div>
                  <p className="text-sm text-gray-300 mb-3">{path.description}</p>

                  {/* Progress Bar */}
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className={`h-full bg-gradient-to-r ${path.color} transition-all duration-500`}
                        style={{ width: `${(completed / total) * 100}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-400 flex-shrink-0">
                      {completed}/{total}
                    </span>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

// ============================================================================
// GOALS TAB
// ============================================================================

const GoalsTab = ({ userId, db, goals, setGoals, addPoints }) => {
  const [newGoal, setNewGoal] = useState('');
  const [showInput, setShowInput] = useState(false);

  const addGoal = async () => {
    if (!newGoal.trim()) return;

    const goal = {
      id: Date.now().toString(),
      text: newGoal.trim(),
      isAchieved: false,
      createdAt: Date.now(),
      priority: 'normal'
    };

    const updatedGoals = [goal, ...goals];
    setGoals(updatedGoals);
    setNewGoal('');
    setShowInput(false);
    addPoints(10);

    // Save to Firebase
    if (db && userId) {
      try {
        const goalRef = doc(db, getPrivatePath(userId, 'goals'), goal.id);
        await setDoc(goalRef, goal);
      } catch (e) {
        console.error('Error saving goal:', e);
      }
    }
  };

  const toggleGoal = async (goalId) => {
    const updatedGoals = goals.map(g => {
      if (g.id === goalId) {
        const newAchieved = !g.isAchieved;
        if (newAchieved) addPoints(50);
        return { ...g, isAchieved: newAchieved, completedAt: newAchieved ? Date.now() : null };
      }
      return g;
    });
    setGoals(updatedGoals);

    // Update in Firebase
    if (db && userId) {
      const goal = updatedGoals.find(g => g.id === goalId);
      try {
        const goalRef = doc(db, getPrivatePath(userId, 'goals'), goalId);
        await updateDoc(goalRef, { isAchieved: goal.isAchieved, completedAt: goal.completedAt });
      } catch (e) {
        console.error('Error updating goal:', e);
      }
    }
  };

  const deleteGoal = async (goalId) => {
    setGoals(goals.filter(g => g.id !== goalId));

    if (db && userId) {
      try {
        const goalRef = doc(db, getPrivatePath(userId, 'goals'), goalId);
        await deleteDoc(goalRef);
      } catch (e) {
        console.error('Error deleting goal:', e);
      }
    }
  };

  const activeGoals = goals.filter(g => !g.isAchieved);
  const achievedGoals = goals.filter(g => g.isAchieved);

  return (
    <div className="max-w-lg mx-auto px-4 py-6 pb-24">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white">Abundance Goals</h2>
          <p className="text-gray-400 text-sm">{activeGoals.length} active, {achievedGoals.length} achieved</p>
        </div>
        <button
          onClick={() => setShowInput(!showInput)}
          className="w-12 h-12 rounded-xl bg-gradient-to-r from-amber-500 to-purple-600 flex items-center justify-center shadow-lg shadow-amber-500/25 transition-transform hover:scale-105"
        >
          <Plus className={`w-6 h-6 text-white transition-transform ${showInput ? 'rotate-45' : ''}`} />
        </button>
      </div>

      {/* Add Goal Input */}
      {showInput && (
        <div className="mb-6 animate-slide-down">
          <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
            <input
              type="text"
              value={newGoal}
              onChange={(e) => setNewGoal(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addGoal()}
              placeholder="What abundance are you calling in?"
              className="w-full bg-transparent text-white placeholder-gray-500 focus:outline-none text-lg mb-3"
              autoFocus
            />
            <div className="flex gap-2">
              <button
                onClick={addGoal}
                disabled={!newGoal.trim()}
                className="flex-1 py-2 rounded-xl bg-amber-500/20 text-amber-300 font-medium disabled:opacity-50 transition-colors hover:bg-amber-500/30"
              >
                Add Goal
              </button>
              <button
                onClick={() => { setShowInput(false); setNewGoal(''); }}
                className="px-4 py-2 rounded-xl bg-white/5 text-gray-400 transition-colors hover:bg-white/10"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Active Goals */}
      {activeGoals.length > 0 && (
        <div className="mb-8">
          <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-3">In Progress</h3>
          <div className="space-y-3">
            {activeGoals.map((goal) => (
              <div
                key={goal.id}
                className="bg-white/5 rounded-xl p-4 border border-white/10 flex items-center gap-3 group"
              >
                <button
                  onClick={() => toggleGoal(goal.id)}
                  className="w-6 h-6 rounded-full border-2 border-amber-400/50 flex items-center justify-center transition-colors hover:bg-amber-400/20"
                >
                  {goal.isAchieved && <Check className="w-4 h-4 text-amber-400" />}
                </button>
                <span className="flex-1 text-white">{goal.text}</span>
                <button
                  onClick={() => deleteGoal(goal.id)}
                  className="opacity-0 group-hover:opacity-100 p-2 text-gray-500 hover:text-red-400 transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Achieved Goals */}
      {achievedGoals.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-3">
            Manifested
          </h3>
          <div className="space-y-3">
            {achievedGoals.map((goal) => (
              <div
                key={goal.id}
                className="bg-amber-500/10 rounded-xl p-4 border border-amber-500/20 flex items-center gap-3 group"
              >
                <button
                  onClick={() => toggleGoal(goal.id)}
                  className="w-6 h-6 rounded-full bg-amber-500 flex items-center justify-center"
                >
                  <Check className="w-4 h-4 text-white" />
                </button>
                <span className="flex-1 text-amber-200 line-through opacity-75">{goal.text}</span>
                <Trophy className="w-4 h-4 text-amber-400" />
              </div>
            ))}
          </div>
        </div>
      )}

      {goals.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
            <Target className="w-8 h-8 text-gray-500" />
          </div>
          <p className="text-gray-400">No goals yet. What do you want to manifest?</p>
        </div>
      )}
    </div>
  );
};

// ============================================================================
// GRATITUDE TAB
// ============================================================================

const GratitudeTab = ({ userId, db, gratitudeEntries, setGratitudeEntries, addPoints, stats }) => {
  const [entry, setEntry] = useState('');
  const [currentPrompt, setCurrentPrompt] = useState(getRandomPrompt('gratitude'));
  const today = getDateKey();
  const todayEntry = gratitudeEntries.find(e => e.date === today);

  const saveGratitude = async () => {
    if (!entry.trim()) return;

    const gratitude = {
      id: today,
      date: today,
      entry: entry.trim(),
      timestamp: Date.now(),
      wordCount: entry.trim().split(/\s+/).length
    };

    const existing = gratitudeEntries.findIndex(e => e.date === today);
    let updated;
    if (existing >= 0) {
      updated = [...gratitudeEntries];
      updated[existing] = gratitude;
    } else {
      updated = [gratitude, ...gratitudeEntries];
      addPoints(25);
    }

    setGratitudeEntries(updated);
    setEntry('');

    // Save to Firebase
    if (db && userId) {
      try {
        const gratitudeRef = doc(db, getPrivatePath(userId, 'gratitude'), today);
        await setDoc(gratitudeRef, gratitude);
      } catch (e) {
        console.error('Error saving gratitude:', e);
      }
    }
  };

  const refreshPrompt = () => {
    setCurrentPrompt(getRandomPrompt('gratitude'));
  };

  return (
    <div className="max-w-lg mx-auto px-4 py-6 pb-24">
      {/* Header Stats */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white">Daily Gratitude</h2>
          <p className="text-gray-400 text-sm">Amplify your abundance frequency</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-orange-500/20 border border-orange-500/30">
          <Flame className="w-5 h-5 text-orange-400" />
          <span className="text-lg font-bold text-orange-300">{stats.streak}</span>
          <span className="text-xs text-orange-300/70">day streak</span>
        </div>
      </div>

      {/* Today's Entry Card */}
      <div className="bg-gradient-to-br from-amber-500/20 to-purple-600/20 rounded-2xl p-6 border border-white/10 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-amber-400" />
            <span className="text-white font-medium">{formatDate(new Date())}</span>
          </div>
          {todayEntry && (
            <span className="text-xs px-2 py-1 rounded-full bg-green-500/20 text-green-300">
              Completed
            </span>
          )}
        </div>

        {/* Prompt */}
        <div className="bg-white/5 rounded-xl p-4 mb-4">
          <div className="flex items-start justify-between gap-2">
            <p className="text-gray-300 italic flex-1">{currentPrompt}</p>
            <button
              onClick={refreshPrompt}
              className="p-2 text-gray-500 hover:text-amber-400 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Entry Input */}
        <textarea
          value={entry}
          onChange={(e) => setEntry(e.target.value)}
          placeholder={todayEntry ? "Add more gratitude..." : "I am grateful for..."}
          rows={4}
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50 resize-none mb-4"
        />

        <button
          onClick={saveGratitude}
          disabled={!entry.trim()}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-purple-600 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:shadow-lg hover:shadow-amber-500/25 flex items-center justify-center gap-2"
        >
          <Heart className="w-5 h-5" />
          {todayEntry ? 'Update Gratitude' : 'Save Gratitude'}
        </button>
      </div>

      {/* Previous Entries */}
      {gratitudeEntries.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-3">
            Gratitude History
          </h3>
          <div className="space-y-3">
            {gratitudeEntries.slice(0, 7).map((g) => (
              <div
                key={g.id}
                className="bg-white/5 rounded-xl p-4 border border-white/10"
              >
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
// NEURO-TRACKER TAB
// ============================================================================

const NeuroTrackerTab = ({ userId, db, lackThoughts, setLackThoughts, addPoints }) => {
  const [thought, setThought] = useState('');
  const [selectedEmotion, setSelectedEmotion] = useState(null);
  const [intensity, setIntensity] = useState(5);
  const [showReframe, setShowReframe] = useState(null);

  const addLackThought = async () => {
    if (!thought.trim() || !selectedEmotion) return;

    const entry = {
      id: Date.now().toString(),
      text: thought.trim(),
      emotion_tag: selectedEmotion,
      intensity,
      timestamp: Date.now(),
      transformed: false
    };

    setLackThoughts([entry, ...lackThoughts]);
    setThought('');
    setSelectedEmotion(null);
    setIntensity(5);
    addPoints(15);

    // Save to Firebase
    if (db && userId) {
      try {
        const thoughtRef = doc(db, getPrivatePath(userId, 'lack_thoughts'), entry.id);
        await setDoc(thoughtRef, entry);
      } catch (e) {
        console.error('Error saving lack thought:', e);
      }
    }
  };

  const transformThought = async (id) => {
    const updated = lackThoughts.map(t =>
      t.id === id ? { ...t, transformed: true } : t
    );
    setLackThoughts(updated);
    addPoints(30);
    setShowReframe(null);

    if (db && userId) {
      try {
        const thoughtRef = doc(db, getPrivatePath(userId, 'lack_thoughts'), id);
        await updateDoc(thoughtRef, { transformed: true });
      } catch (e) {
        console.error('Error updating lack thought:', e);
      }
    }
  };

  const untransformed = lackThoughts.filter(t => !t.transformed);
  const transformed = lackThoughts.filter(t => t.transformed);

  // Emotion breakdown
  const emotionStats = EMOTION_TAGS.map(emotion => ({
    ...emotion,
    count: lackThoughts.filter(t => t.emotion_tag === emotion.id).length
  })).filter(e => e.count > 0).sort((a, b) => b.count - a.count);

  return (
    <div className="max-w-lg mx-auto px-4 py-6 pb-24">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">Neuro-Tracker</h2>
        <p className="text-gray-400 text-sm">Track and transform scarcity patterns</p>
      </div>

      {/* Quick Stats */}
      {emotionStats.length > 0 && (
        <div className="grid grid-cols-3 gap-3 mb-6">
          {emotionStats.slice(0, 3).map((stat) => (
            <div key={stat.id} className={`${stat.color} rounded-xl p-3 text-center`}>
              <p className="text-2xl font-bold">{stat.count}</p>
              <p className="text-xs opacity-75">{stat.label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Add Thought Form */}
      <div className="bg-white/5 rounded-2xl p-5 border border-white/10 mb-6">
        <h3 className="text-white font-medium mb-3 flex items-center gap-2">
          <Brain className="w-5 h-5 text-purple-400" />
          Log Scarcity Pattern
        </h3>

        <textarea
          value={thought}
          onChange={(e) => setThought(e.target.value)}
          placeholder="What limiting thought arose? (e.g., 'I'll never have enough money')"
          rows={3}
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 mb-4 resize-none"
        />

        {/* Emotion Tags */}
        <p className="text-sm text-gray-400 mb-2">Primary emotion:</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {EMOTION_TAGS.map((emotion) => (
            <button
              key={emotion.id}
              onClick={() => setSelectedEmotion(emotion.id)}
              className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                selectedEmotion === emotion.id
                  ? emotion.color + ' ring-2 ring-white/30'
                  : 'bg-white/5 text-gray-400 hover:bg-white/10'
              }`}
            >
              {emotion.label}
            </button>
          ))}
        </div>

        {/* Intensity Slider */}
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
          onClick={addLackThought}
          disabled={!thought.trim() || !selectedEmotion}
          className="w-full py-3 rounded-xl bg-purple-500/20 text-purple-300 font-medium disabled:opacity-50 transition-colors hover:bg-purple-500/30"
        >
          Log Pattern
        </button>
      </div>

      {/* Untransformed Thoughts */}
      {untransformed.length > 0 && (
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-3">
            Awaiting Transformation ({untransformed.length})
          </h3>
          <div className="space-y-3">
            {untransformed.map((t) => {
              const emotion = EMOTION_TAGS.find(e => e.id === t.emotion_tag);
              return (
                <div key={t.id} className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <p className="text-white mb-2">{t.text}</p>
                      <div className="flex items-center gap-2">
                        {emotion && (
                          <span className={`${emotion.color} px-2 py-0.5 rounded-full text-xs`}>
                            {emotion.label}
                          </span>
                        )}
                        <span className="text-xs text-gray-500">
                          Intensity: {t.intensity}/10
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => setShowReframe(t.id)}
                      className="p-2 rounded-lg bg-amber-500/20 text-amber-400 hover:bg-amber-500/30 transition-colors"
                    >
                      <Lightbulb className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Reframe Modal */}
                  {showReframe === t.id && (
                    <div className="mt-4 bg-amber-500/10 rounded-xl p-4 border border-amber-500/20">
                      <p className="text-sm text-amber-200 italic mb-3">
                        {getRandomPrompt('reframe')}
                      </p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => transformThought(t.id)}
                          className="flex-1 py-2 rounded-lg bg-amber-500/20 text-amber-300 text-sm hover:bg-amber-500/30 transition-colors"
                        >
                          Mark as Transformed
                        </button>
                        <button
                          onClick={() => setShowReframe(null)}
                          className="px-3 py-2 rounded-lg bg-white/5 text-gray-400 text-sm hover:bg-white/10"
                        >
                          Later
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Transformed */}
      {transformed.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-3">
            Transformed ({transformed.length})
          </h3>
          <div className="space-y-2">
            {transformed.slice(0, 5).map((t) => (
              <div key={t.id} className="bg-green-500/10 rounded-xl p-3 border border-green-500/20 flex items-center gap-3">
                <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
                <p className="text-green-200 text-sm line-through opacity-75 flex-1">{t.text}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// ============================================================================
// MAIN APP COMPONENT
// ============================================================================

export default function App() {
  // Auth state
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // App state
  const [activeTab, setActiveTab] = useState('coach');
  const [stats, setStats] = useState({ streak: 0, totalPoints: 0, lastUpdated: null });
  const [progress, setProgress] = useState({ completed: {} });
  const [goals, setGoals] = useState([]);
  const [gratitudeEntries, setGratitudeEntries] = useState([]);
  const [lackThoughts, setLackThoughts] = useState([]);

  // Calculate tier
  const tier = useMemo(() => getTier(stats.totalPoints), [stats.totalPoints]);

  // Add points helper
  const addPoints = useCallback((points) => {
    setStats(prev => {
      const newStats = {
        ...prev,
        totalPoints: prev.totalPoints + points,
        lastUpdated: Date.now()
      };

      // Save to Firebase
      if (db && user?.uid) {
        const statsRef = doc(db, getPrivatePath(user.uid, 'stats'), 'main');
        setDoc(statsRef, newStats, { merge: true }).catch(console.error);
      }

      return newStats;
    });
  }, [user?.uid]);

  // Auth effect
  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
      } else {
        // Sign in anonymously or with custom token
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

    return () => unsubscribe();
  }, []);

  // Load data from Firebase
  useEffect(() => {
    if (!db || !user?.uid) return;

    const userId = user.uid;

    // Load stats
    const statsRef = doc(db, getPrivatePath(userId, 'stats'), 'main');
    getDoc(statsRef).then(snap => {
      if (snap.exists()) setStats(snap.data());
    }).catch(console.error);

    // Load progress
    const progressRef = doc(db, getPrivatePath(userId, 'progress'), 'main');
    getDoc(progressRef).then(snap => {
      if (snap.exists()) setProgress(snap.data());
    }).catch(console.error);

    // Load goals with real-time updates
    const goalsQuery = query(
      collection(db, getPrivatePath(userId, 'goals')),
      orderBy('createdAt', 'desc')
    );
    const unsubGoals = onSnapshot(goalsQuery, (snap) => {
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      setGoals(data);
    }, console.error);

    // Load gratitude with real-time updates
    const gratitudeQuery = query(
      collection(db, getPrivatePath(userId, 'gratitude')),
      orderBy('timestamp', 'desc')
    );
    const unsubGratitude = onSnapshot(gratitudeQuery, (snap) => {
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      setGratitudeEntries(data);
      // Update streak
      const newStreak = calculateStreak(data);
      if (newStreak !== stats.streak) {
        setStats(prev => ({ ...prev, streak: newStreak }));
      }
    }, console.error);

    // Load lack thoughts with real-time updates
    const thoughtsQuery = query(
      collection(db, getPrivatePath(userId, 'lack_thoughts')),
      orderBy('timestamp', 'desc')
    );
    const unsubThoughts = onSnapshot(thoughtsQuery, (snap) => {
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      setLackThoughts(data);
    }, console.error);

    return () => {
      unsubGoals();
      unsubGratitude();
      unsubThoughts();
    };
  }, [user?.uid]);

  // Recalculate streak when gratitude entries change
  useEffect(() => {
    const newStreak = calculateStreak(gratitudeEntries);
    if (newStreak !== stats.streak) {
      setStats(prev => ({ ...prev, streak: newStreak }));
    }
  }, [gratitudeEntries]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-purple-600 flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <p className="text-gray-400">Loading your abundance...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Animated Background */}
      <AnimatedBackground />

      {/* Header */}
      <Header stats={stats} tier={tier} />

      {/* Main Content */}
      <main className="relative z-10">
        {activeTab === 'coach' && (
          <FlowCoachTab userId={user?.uid} db={db} />
        )}
        {activeTab === 'paths' && (
          <AbundancePathsTab
            userId={user?.uid}
            db={db}
            progress={progress}
            setProgress={setProgress}
            addPoints={addPoints}
          />
        )}
        {activeTab === 'goals' && (
          <GoalsTab
            userId={user?.uid}
            db={db}
            goals={goals}
            setGoals={setGoals}
            addPoints={addPoints}
          />
        )}
        {activeTab === 'gratitude' && (
          <GratitudeTab
            userId={user?.uid}
            db={db}
            gratitudeEntries={gratitudeEntries}
            setGratitudeEntries={setGratitudeEntries}
            addPoints={addPoints}
            stats={stats}
          />
        )}
        {activeTab === 'tracker' && (
          <NeuroTrackerTab
            userId={user?.uid}
            db={db}
            lackThoughts={lackThoughts}
            setLackThoughts={setLackThoughts}
            addPoints={addPoints}
          />
        )}
      </main>

      {/* Bottom Navigation */}
      <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} stats={stats} />

      {/* Custom Styles */}
      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); opacity: 0.4; }
          50% { transform: translateY(-20px) rotate(180deg); opacity: 0.8; }
        }

        @keyframes bounce-subtle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-2px); }
        }

        @keyframes bounce-in {
          0% { transform: scale(0); opacity: 0; }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); opacity: 1; }
        }

        @keyframes slide-down {
          0% { opacity: 0; transform: translateY(-10px); }
          100% { opacity: 1; transform: translateY(0); }
        }

        .animate-float { animation: float linear infinite; }
        .animate-bounce-subtle { animation: bounce-subtle 1s ease-in-out infinite; }
        .animate-bounce-in { animation: bounce-in 0.5s ease-out; }
        .animate-slide-down { animation: slide-down 0.3s ease-out; }

        .safe-area-pb { padding-bottom: env(safe-area-inset-bottom, 0); }

        /* Hide scrollbar but allow scrolling */
        ::-webkit-scrollbar { width: 0; height: 0; }

        /* Better tap targets on mobile */
        button, a { -webkit-tap-highlight-color: transparent; }

        /* Smooth scroll */
        html { scroll-behavior: smooth; }
      `}</style>
    </div>
  );
}
