import { MMKVStorage } from '../storage/MMKVStorage';
import { STORAGE_KEYS } from '../../constants';
import { PRAYER_NAMES } from '../../constants';
import type { PrayerSchedule, ActiveSchedule, DailyPrayerTimes, PrayerName } from '../../types';

export class PrayerRepository {
  // Prayer time cache
  getCachedPrayerTimes(dateKey: string): DailyPrayerTimes | null {
    const cache = MMKVStorage.get<Record<string, DailyPrayerTimes>>(STORAGE_KEYS.PRAYER_TIMES_CACHE) ?? {};
    return cache[dateKey] ?? null;
  }

  cachePrayerTimes(dateKey: string, times: DailyPrayerTimes): void {
    const cache = MMKVStorage.get<Record<string, DailyPrayerTimes>>(STORAGE_KEYS.PRAYER_TIMES_CACHE) ?? {};
    // Keep only last 7 days
    const keys = Object.keys(cache);
    if (keys.length > 7) {
      const oldest = keys.sort()[0];
      delete cache[oldest];
    }
    cache[dateKey] = times;
    MMKVStorage.set(STORAGE_KEYS.PRAYER_TIMES_CACHE, cache);
  }

  // Schedules
  getAllSchedules(): PrayerSchedule[] {
    return MMKVStorage.get<PrayerSchedule[]>(STORAGE_KEYS.SCHEDULES) ?? [];
  }

  getSchedulesForProfile(profileId: string): PrayerSchedule[] {
    return this.getAllSchedules().filter(s => s.profileId === profileId);
  }

  getScheduleForPrayer(prayerName: PrayerName, profileId: string): PrayerSchedule | null {
    return this.getAllSchedules().find(s => s.prayerName === prayerName && s.profileId === profileId) ?? null;
  }

  saveSchedule(schedule: PrayerSchedule): void {
    const schedules = this.getAllSchedules();
    const idx = schedules.findIndex(s => s.id === schedule.id);
    if (idx >= 0) {
      schedules[idx] = schedule;
    } else {
      schedules.push(schedule);
    }
    MMKVStorage.set(STORAGE_KEYS.SCHEDULES, schedules);
  }

  deleteSchedule(scheduleId: string): void {
    const filtered = this.getAllSchedules().filter(s => s.id !== scheduleId);
    MMKVStorage.set(STORAGE_KEYS.SCHEDULES, filtered);
  }

  // Active schedule
  getActiveSchedule(): ActiveSchedule | null {
    return MMKVStorage.get<ActiveSchedule>(STORAGE_KEYS.ACTIVE_SCHEDULE) ?? null;
  }

  setActiveSchedule(schedule: ActiveSchedule | null): void {
    if (schedule === null) {
      MMKVStorage.delete(STORAGE_KEYS.ACTIVE_SCHEDULE);
    } else {
      MMKVStorage.set(STORAGE_KEYS.ACTIVE_SCHEDULE, schedule);
    }
  }
}

export const prayerRepository = new PrayerRepository();
