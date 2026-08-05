import { useEffect, useRef, useState } from 'react';
import { AppState } from 'react-native';
import { usePrayerStore } from '../store';
import { formatCountdown } from '../utils';
import type { PrayerName, DailyPrayerTimes } from '../types';

interface UsePrayerTimesReturn {
  dailyTimes: DailyPrayerTimes | null;
  nextPrayer: { name: PrayerName; time: Date } | null;
  countdown: string;
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export const usePrayerTimes = (): UsePrayerTimesReturn => {
  const { dailyTimes, nextPrayer, isLoading, error, loadPrayerTimes, refreshLocation } = usePrayerStore();
  const [countdown, setCountdown] = useState('--:--:--');
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    loadPrayerTimes();
  }, []);

  useEffect(() => {
    if (!nextPrayer) {
      setCountdown('--:--:--');
      return;
    }

    const updateCountdown = () => {
      setCountdown(formatCountdown(nextPrayer.time));
    };

    updateCountdown();
    intervalRef.current = setInterval(updateCountdown, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [nextPrayer?.time.getTime()]);

  useEffect(() => {
    const sub = AppState.addEventListener('change', state => {
      if (state === 'active') loadPrayerTimes();
    });
    return () => sub.remove();
  }, []);

  return {
    dailyTimes,
    nextPrayer,
    countdown,
    isLoading,
    error,
    refresh: refreshLocation,
  };
};
