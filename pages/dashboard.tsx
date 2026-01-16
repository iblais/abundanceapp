/**
 * Dashboard Page - Alignment Score Dashboard
 * Main screen showing the alignment score and quick action cards
 */

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { GlassCard, ProgressRing, BottomNavBar, Icons } from '../components';
import { useUser } from '../context/UserContext';
import styles from '../styles/dashboard.module.css';

// Quick action card data
const quickActions = [
  {
    id: 'morning',
    title: 'Morning Visioneering',
    subtitle: 'Start your day aligned',
    icon: Icons.sun,
    path: '/library',
  },
  {
    id: 'board',
    title: 'Reality Shift Board',
    subtitle: 'Visualize your goals',
    icon: Icons.star,
    path: '/practices',
  },
  {
    id: 'gratitude',
    title: 'Gratitude Journal',
    subtitle: 'Cultivate appreciation',
    icon: Icons.heart,
    path: '/practices',
  },
];

// Time-based greeting
const getGreeting = (): string => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good Morning';
  if (hour < 17) return 'Good Afternoon';
  return 'Good Evening';
};

export default function Dashboard() {
  const router = useRouter();
  const { user } = useUser();
  const [greeting, setGreeting] = useState('Welcome');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setGreeting(getGreeting());

    // Redirect if onboarding not complete
    if (!user.onboardingComplete) {
      router.replace('/');
    }
  }, [user.onboardingComplete, router]);

  if (!mounted || !user.onboardingComplete) {
    return null;
  }

  const handleActionClick = (path: string) => {
    router.push(path);
  };

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        {/* Header with greeting */}
        <header className={styles.header}>
          <p className={styles.greeting}>{greeting}</p>
          <h1 className={styles.userName}>{user.displayName}</h1>
        </header>

        {/* Alignment Score Section */}
        <section className={styles.scoreSection}>
          <ProgressRing progress={user.alignmentScore} size={220} strokeWidth={14}>
            <span className={styles.scoreValue}>{user.alignmentScore}</span>
            <span className={styles.scoreLabel}>Today&apos;s Alignment</span>
          </ProgressRing>
        </section>

        {/* Streak Counter */}
        {user.streak > 0 && (
          <div className={styles.streakContainer}>
            <span className={styles.streakIcon}>{Icons.streak}</span>
            <span className={styles.streakText}>{user.streak}</span>
            <span className={styles.streakDays}>day streak</span>
          </div>
        )}

        {/* Quick Action Cards */}
        <section className={styles.actionsSection}>
          {quickActions.map((action) => (
            <GlassCard
              key={action.id}
              className={styles.actionCard}
              onClick={() => handleActionClick(action.path)}
            >
              <div className={styles.actionIcon}>{action.icon}</div>
              <div className={styles.actionText}>
                <h4>{action.title}</h4>
                <p>{action.subtitle}</p>
              </div>
            </GlassCard>
          ))}
        </section>
      </main>

      <BottomNavBar />
    </div>
  );
}
