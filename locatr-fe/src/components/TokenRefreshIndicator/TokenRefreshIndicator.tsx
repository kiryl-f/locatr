import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../../stores/authStore';
import styles from './TokenRefreshIndicator.module.scss';

export const TokenRefreshIndicator: React.FC = () => {
  const { isAuthenticated } = useAuthStore();
  const [showIndicator, setShowIndicator] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) return;

    // Listen for token refresh events
    const handleRefresh = () => {
      setShowIndicator(true);
      setTimeout(() => setShowIndicator(false), 2000);
    };

    window.addEventListener('token-refreshed', handleRefresh);
    return () => window.removeEventListener('token-refreshed', handleRefresh);
  }, [isAuthenticated]);

  if (!showIndicator) return null;

  return (
    <div className={styles.indicator}>
      <span className={styles.icon}>🔄</span>
      <span>Session refreshed</span>
    </div>
  );
};
