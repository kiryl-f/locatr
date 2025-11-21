import { useEffect, useRef } from 'react';
import { useMutation } from '@apollo/client';
import { REFRESH_TOKEN } from '../graphql/mutations/auth';
import { useAuthStore } from '../stores/authStore';

const REFRESH_INTERVAL = 12 * 60 * 1000; // 12 minutes (before 15 min expiry)

export const useTokenRefresh = () => {
  const { isAuthenticated, logout } = useAuthStore();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  
  const [refreshToken] = useMutation(REFRESH_TOKEN, {
    onCompleted: () => {
      // Dispatch event for UI feedback
      window.dispatchEvent(new Event('token-refreshed'));
    },
    onError: (error) => {
      console.error('Token refresh failed:', error);
      // If refresh fails, logout user
      logout();
    },
  });

  useEffect(() => {
    if (!isAuthenticated) {
      // Clear interval if user logs out
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    // Refresh token immediately on mount if authenticated
    refreshToken();

    // Set up periodic refresh
    intervalRef.current = setInterval(() => {
      refreshToken();
    }, REFRESH_INTERVAL);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isAuthenticated, refreshToken, logout]);
};
