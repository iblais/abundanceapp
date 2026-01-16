/**
 * Practices Page - Placeholder for Journals, Tools, etc. (Phase 2)
 */

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { BottomNavBar, GlassCard, Icons } from '../components';
import { useUser } from '../context/UserContext';
import styles from '../styles/placeholder.module.css';

export default function Practices() {
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
          <h1>Practices</h1>
          <p>Journal, shift tools, and more</p>
        </header>

        <GlassCard className={styles.comingSoonCard}>
          <div className={styles.iconWrapper}>
            {Icons.practices}
          </div>
          <h3>Coming in Phase 2</h3>
          <p>Gratitude journal, reality shift board, quick shift tools, and identity practices will be available here.</p>
        </GlassCard>
      </main>

      <BottomNavBar />
    </div>
  );
}
