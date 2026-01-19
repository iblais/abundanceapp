/**
 * Abundance Recode - App State Hook
 *
 * Tracks app foreground/background state
 */

import { useEffect, useRef, useState } from 'react';
import { AppState, AppStateStatus } from 'react-native';

export const useAppState = () => {
  const appState = useRef(AppState.currentState);
  const [currentState, setCurrentState] = useState<AppStateStatus>(appState.current);
  const [isActive, setIsActive] = useState(appState.current === 'active');

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      appState.current = nextAppState;
      setCurrentState(nextAppState);
      setIsActive(nextAppState === 'active');
    });

    return () => {
      subscription.remove();
    };
  }, []);

  return {
    currentState,
    isActive,
    isBackground: currentState === 'background',
    isInactive: currentState === 'inactive',
  };
};

export default useAppState;
