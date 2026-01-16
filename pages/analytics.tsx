/**
 * Analytics Page - Placeholder for Progress & Streaks (Phase 3)
 */

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { BottomNavBar, GlassCard, Icons } from '../components';
import { useUser } from '../context/UserContext';
import styles from '../styles/placeholder.module.css';

export default function Analytics() {
  const router = useRouter();
  const { user } = useUser();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!user.onboardingComplete) {
      router.replace('/');
    }
  }, [user.onboardingComplete, router]);

  if (!mounted || !user.onboardingComplete) {
    return null;
  }

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <header className={styles.header}>
          <h1>Analytics</h1>
          <p>Track your progress and growth</p>
        </header>

        <GlassCard className={styles.comingSoonCard}>
          <div className={styles.iconWrapper}>
            {Icons.analytics}
          </div>
          <h3>Coming in Phase 3</h3>
          <p>Detailed progress charts, streak tracking, coherence metrics, and insights will be available here.</p>
        </GlassCard>
      </main>

      <BottomNavBar />
    </div>
  );
}
