/**
 * Library Page - Placeholder for Meditations & Content (Phase 2)
 */

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { BottomNavBar, GlassCard, Icons } from '../components';
import { useUser } from '../context/UserContext';
import styles from '../styles/placeholder.module.css';

export default function Library() {
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
          <h1>Library</h1>
          <p>Guided practices for transformation</p>
        </header>

        <GlassCard className={styles.comingSoonCard}>
          <div className={styles.iconWrapper}>
            {Icons.library}
          </div>
          <h3>Coming in Phase 2</h3>
          <p>Guided meditations, visualization exercises, and audio content will be available here.</p>
        </GlassCard>
      </main>

      <BottomNavBar />
    </div>
  );
}
