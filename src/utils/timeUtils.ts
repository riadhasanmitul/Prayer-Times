import dayjs from 'dayjs';
import type { TimeFormat } from '../types';

export const formatTime = (date: Date | string, format: TimeFormat): string => {
  const d = dayjs(date);
  return format === '12h' ? d.format('h:mm A') : d.format('HH:mm');
};

export const formatCountdown = (targetDate: Date): string => {
  const now = new Date();
  const diffMs = Math.max(0, targetDate.getTime() - now.getTime());
  const totalSeconds = Math.floor(diffMs / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

export const formatRemainingMinutes = (endTime: Date): number => {
  const diffMs = Math.max(0, endTime.getTime() - Date.now());
  return Math.ceil(diffMs / 60000);
};

export const getStartOfDay = (date: Date = new Date()): Date => dayjs(date).startOf('day').toDate();

export const addMinutes = (date: Date, minutes: number): Date =>
  dayjs(date).add(minutes, 'minute').toDate();

export const isSameDay = (a: Date, b: Date): boolean =>
  dayjs(a).isSame(dayjs(b), 'day');

export const formatDate = (date: Date): string => dayjs(date).format('dddd, MMMM D, YYYY');
