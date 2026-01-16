/**
 * Onboarding Page - Multi-step introduction to the app
 */

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Button } from '../components';
import styles from '../styles/onboarding.module.css';

const slides = [
  {
    title: 'Your Identity Signals Your Future',
    description: "You don't attract what you want—you attract what you are. Become the version of yourself who effortlessly receives abundance.",
  },
  {
    title: 'The Science of Transformation',
    description: 'Research suggests your brain can form new neural pathways at any age. Through consistent practice, you can reshape your patterns of thought and emotion.',
  },
  {
    title: 'Your Tools for Change',
    description: 'Guided meditations, journaling practices, and personalized insights designed to help you shift your internal state and align with your goals.',
  },
  {
    title: 'Your Daily Rhythm',
    description: 'Consistency creates transformation. Set your morning and evening practice times to build the habits that reshape your reality.',
  },
];

export default function Onboarding() {
  const router = useRouter();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleContinue = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      // Navigate to rhythm scheduler
      router.push('/rhythm');
    }
  };

  const handleSkip = () => {
    router.push('/rhythm');
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className={styles.container}>
      {/* Wave Background */}
      <div className={styles.waveBackground}>
        <svg viewBox="0 0 400 400" className={styles.waveSvg}>
          <defs>
            <linearGradient id="waveGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#4A3F8C" stopOpacity="0.6" />
              <stop offset="50%" stopColor="#6B5BA7" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#8B7BC2" stopOpacity="0.2" />
            </linearGradient>
            <linearGradient id="waveGrad2" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#3D3470" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#5C4D99" stopOpacity="0.3" />
            </linearGradient>
          </defs>
          <ellipse cx="200" cy="350" rx="250" ry="150" fill="url(#waveGrad1)" className={styles.waveShape1} />
          <ellipse cx="250" cy="380" rx="200" ry="120" fill="url(#waveGrad2)" className={styles.waveShape2} />
        </svg>
      </div>

      <main className={styles.main}>
        {/* Header with progress dots */}
        <header className={styles.header}>
          <button className={styles.skipButton} onClick={handleSkip}>
            Skip
          </button>
          <div className={styles.progressDots}>
            {slides.map((_, index) => (
              <span
                key={index}
                className={`${styles.progressDot} ${index === currentSlide ? styles.progressDotActive : ''}`}
              />
            ))}
          </div>
          <div className={styles.spacer} />
        </header>

        {/* Slide Content */}
        <div className={styles.content}>
          <div className={styles.slide} key={currentSlide}>
            <h1 className={styles.title}>{slides[currentSlide].title}</h1>
            <p className={styles.description}>{slides[currentSlide].description}</p>
          </div>
        </div>

        {/* Continue Button */}
        <div className={styles.buttonContainer}>
          <Button onClick={handleContinue} fullWidth>
            {currentSlide === slides.length - 1 ? 'Set Up Rhythm' : 'Continue'}
          </Button>
        </div>
      </main>
    </div>
  );
}
