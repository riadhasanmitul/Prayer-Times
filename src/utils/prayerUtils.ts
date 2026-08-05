import type { PrayerName } from '../types';
import dayjs from 'dayjs';

export const getAlarmId = (
  prayerName: PrayerName,
  date: Date,
  type: 'start' | 'end',
  windowId: string,
): string => `${prayerName}_${dayjs(date).format('YYYYMMDD')}_${type}_${windowId}`;

export const getPrayerDisplayName = (name: PrayerName): string => name;

export const isWithinWindow = (time: Date, start: Date, end: Date): boolean =>
  time >= start && time <= end;

export const generateId = (): string =>
  `${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 9)}`;
