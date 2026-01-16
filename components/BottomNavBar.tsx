/**
 * BottomNavBar Component - Floating pill-shaped glassmorphic navigation
 * Five icons with soft pastel colors and glow on active state
 */

import React from 'react';
import { useRouter } from 'next/router';
import styles from '../styles/components.module.css';
import { Icons } from './Icons';

interface NavItem {
  id: string;
  path: string;
  icon: React.ReactNode;
  label: string;
}

const navItems: NavItem[] = [
  { id: 'dashboard', path: '/dashboard', icon: Icons.home, label: 'Home' },
  { id: 'library', path: '/library', icon: Icons.library, label: 'Library' },
  { id: 'practices', path: '/practices', icon: Icons.practices, label: 'Practices' },
  { id: 'analytics', path: '/analytics', icon: Icons.analytics, label: 'Analytics' },
  { id: 'profile', path: '/profile', icon: Icons.profile, label: 'Profile' },
];

export const BottomNavBar: React.FC = () => {
  const router = useRouter();
  const currentPath = router.pathname;

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  return (
    <nav className={styles.bottomNavBar}>
      <div className={styles.navPill}>
        {navItems.map((item) => {
          const isActive = currentPath === item.path;
          return (
            <button
              key={item.id}
              className={`${styles.navItem} ${isActive ? styles.navItemActive : ''}`}
              onClick={() => handleNavigation(item.path)}
              aria-label={item.label}
            >
              <span className={styles.navIcon}>{item.icon}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNavBar;
