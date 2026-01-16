/**
 * Profile Page - Placeholder for Settings & Account (Phase 3)
 */

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { BottomNavBar, GlassCard, Icons } from '../components';
import { useUser } from '../context/UserContext';
import styles from '../styles/placeholder.module.css';

export default function Profile() {
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
          <h1>Profile</h1>
          <p>Your account and settings</p>
        </header>

        {/* User Info Card */}
        <GlassCard className={styles.userCard}>
          <div className={styles.avatar}>
            {Icons.profile}
          </div>
          <h3>{user.displayName}</h3>
          <p className={styles.membershipBadge}>
            {user.isPremium ? 'Premium Member' : 'Free Member'}
          </p>
        </GlassCard>

        <GlassCard className={styles.comingSoonCard}>
          <div className={styles.iconWrapper}>
            {Icons.settings}
          </div>
          <h3>Coming in Phase 3</h3>
          <p>Account settings, preferences, voice selection, and subscription management will be available here.</p>
        </GlassCard>
      </main>

      <BottomNavBar />
    </div>
  );
}
