/**
 * Welcome Page - Entry point for Abundance Flow
 * Redirects to dashboard if onboarding is complete
 */

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Logo, Button } from '../components';
import { useUser } from '../context/UserContext';
import styles from '../styles/welcome.module.css';

export default function Welcome() {
  const router = useRouter();
  const { user } = useUser();
  const [visible, setVisible] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Check if user has completed onboarding
    const checkOnboarding = () => {
      const savedUser = localStorage.getItem('abundanceUser');
      if (savedUser) {
        try {
          const parsed = JSON.parse(savedUser);
          if (parsed.onboardingComplete) {
            router.replace('/dashboard');
            return;
          }
        } catch (e) {
          console.error('Failed to parse saved user:', e);
        }
      }
      setIsChecking(false);
      setVisible(true);
    };

    // Small delay to ensure localStorage is accessible
    const timer = setTimeout(checkOnboarding, 100);
    return () => clearTimeout(timer);
  }, [router]);

  const handleBegin = () => {
    router.push('/onboarding');
  };

  // Show nothing while checking onboarding status
  if (isChecking) {
    return (
      <div className={styles.container}>
        <div className={styles.loading} />
      </div>
    );
  }

  return (
    <div className={`${styles.container} ${visible ? styles.fadeIn : ''}`}>
      <main className={styles.main}>
        <div className={styles.welcomeCard}>
          <div className={styles.welcomeCardInner}>
            <div className={styles.welcomeContent}>
              <Logo size={100} />
              <h1 className={styles.title}>Abundance Flow</h1>
              <p className={styles.tagline}>Shift your state. Reshape your reality.</p>
            </div>
            <Button onClick={handleBegin} fullWidth>
              Begin
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
