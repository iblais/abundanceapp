/**
 * PaywallGater Component
 * Restricts access to premium features for non-subscribed users
 */

import React, { useState } from 'react';
import { useRouter } from 'next/router';
import styles from '../styles/Paywall.module.css';

interface PaywallGaterProps {
  children: React.ReactNode;
  isSubscribed: boolean;
  featureName: string;
}

const PaywallGater: React.FC<PaywallGaterProps> = ({ children, isSubscribed, featureName }) => {
  const router = useRouter();
  const [showModal, setShowModal] = useState(!isSubscribed);

  // If user is subscribed, render the premium content
  if (isSubscribed) {
    return <>{children}</>;
  }

  // Lock icon SVG
  const LockIcon = (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );

  const handleUpgrade = () => {
    router.push('/pricing');
  };

  const handleClose = () => {
    router.back();
  };

  // Show paywall modal for non-subscribed users
  return (
    <div className={styles.paywallOverlay}>
      <div className={styles.paywallModal}>
        <button className={styles.closeButton} onClick={handleClose}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        <div className={styles.paywallContent}>
          <div className={styles.lockIconWrapper}>
            {LockIcon}
          </div>

          <h2 className={styles.paywallTitle}>Premium Feature</h2>

          <p className={styles.paywallFeatureName}>
            {featureName}
          </p>

          <p className={styles.paywallDescription}>
            Upgrade to Premium to unlock this feature and accelerate your transformation journey.
          </p>

          <div className={styles.paywallFeatures}>
            <div className={styles.featureItem}>
              <span className={styles.checkmark}>✓</span>
              <span>Access all 50+ guided meditations</span>
            </div>
            <div className={styles.featureItem}>
              <span className={styles.checkmark}>✓</span>
              <span>Unlimited Inner Mentor Chat</span>
            </div>
            <div className={styles.featureItem}>
              <span className={styles.checkmark}>✓</span>
              <span>Advanced analytics & insights</span>
            </div>
            <div className={styles.featureItem}>
              <span className={styles.checkmark}>✓</span>
              <span>Full audiobook library</span>
            </div>
          </div>

          <button className={styles.upgradeButton} onClick={handleUpgrade}>
            Upgrade to Premium
          </button>

          <button className={styles.maybeLaterButton} onClick={handleClose}>
            Maybe Later
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaywallGater;
