import { AlarmScheduler } from '../native/AlarmSchedulerModule';
import { prayerCalculator } from '../prayer/PrayerCalculator';
import { scheduleCalculator } from '../prayer/ScheduleCalculator';
import { prayerRepository } from '../data/repositories/PrayerRepository';
import { profileRepository } from '../data/repositories/ProfileRepository';
import { settingsRepository } from '../data/repositories/SettingsRepository';
import { soundStateManager } from '../prayer/SoundStateManager';
import { MMKVStorage } from '../data/storage/MMKVStorage';
import { STORAGE_KEYS, PRAYER_NAMES } from '../constants';
import type { LocationCoords, PrayerName, AlarmEntry } from '../types';
import dayjs from 'dayjs';

export class SchedulerService {
  async scheduleDay(date: Date, location: LocationCoords): Promise<void> {
    const settings = settingsRepository.getSettings();
    const activeProfileId = profileRepository.getActiveProfileId();
    const profile = profileRepository.getEffectiveProfile(activeProfileId);

    const times = prayerCalculator.calculateTimes(
      date,
      location,
      settings.calculationMethod,
      settings.madhab,
    );

    const alarmEntries: AlarmEntry[] = [];

    for (const prayerName of PRAYER_NAMES) {
      const isEnabled = profile.enabledPrayers[prayerName] ?? true;
      if (!isEnabled) continue;

      const schedule = prayerRepository.getScheduleForPrayer(prayerName, activeProfileId);
      if (!schedule?.enabled) continue;

      const prayerTime = prayerCalculator.getPrayerTime(times, prayerName);
      const windows = schedule.windows
        .filter(w => w.enabled)
        .map(w => scheduleCalculator.getWindowDates(prayerTime, w));

      const merged = scheduleCalculator.mergeOverlappingWindows(windows);

      for (const window of merged) {
        const startId = `${prayerName}_start_${window.start.getTime()}`;
        const endId = `${prayerName}_end_${window.end.getTime()}`;

        await AlarmScheduler.scheduleAlarm(
          startId,
          window.start.getTime(),
          prayerName,
          'start',
        );

        await AlarmScheduler.scheduleAlarm(
          endId,
          window.end.getTime(),
          prayerName,
          'end',
        );

        alarmEntries.push(
          { id: startId, prayerName, action: 'start', triggerAtMillis: window.start.getTime(), profileId: activeProfileId, windowId: window.windowId },
          { id: endId, prayerName, action: 'end', triggerAtMillis: window.end.getTime(), profileId: activeProfileId, windowId: window.windowId },
        );
      }
    }

    MMKVStorage.set(STORAGE_KEYS.ALARM_ENTRIES, alarmEntries);
    // Store JSON for native WorkManager to re-read
    MMKVStorage.set(STORAGE_KEYS.PRAYER_SCHEDULE_JSON, JSON.stringify(alarmEntries));
  }

  async rescheduleAll(location: LocationCoords): Promise<void> {
    await AlarmScheduler.cancelAllAlarms();
    await this.scheduleDay(new Date(), location);
    // Also schedule tomorrow
    const tomorrow = dayjs().add(1, 'day').toDate();
    await this.scheduleDay(tomorrow, location);
  }

  async handlePrayerStart(prayerName: PrayerName, profileId: string): Promise<void> {
    const profile = profileRepository.getEffectiveProfile(profileId);
    const targetMode = profile.soundSettings.ringerMode;
    const previousMode = await soundStateManager.storeCurrentModeAndSilence(targetMode);

    prayerRepository.setActiveSchedule({
      scheduleId: `${prayerName}_${Date.now()}`,
      prayerName,
      profileId,
      startTime: new Date().toISOString(),
      endTime: new Date().toISOString(), // updated when alarm fires
      previousRingerMode: previousMode,
      userOverridden: false,
    });
  }

  async handlePrayerEnd(_prayerName: PrayerName): Promise<void> {
    const active = prayerRepository.getActiveSchedule();
    if (!active) return;

    const profile = profileRepository.getEffectiveProfile(active.profileId);

    if (profile.soundSettings.respectUserOverride) {
      const targetMode = profile.soundSettings.ringerMode;
      const overridden = await soundStateManager.hasUserOverridden(targetMode);
      if (overridden) {
        // User changed, respect their choice
        prayerRepository.setActiveSchedule(null);
        return;
      }
    }

    await soundStateManager.restorePhone(active.previousRingerMode);
    prayerRepository.setActiveSchedule(null);
  }
}

export const schedulerService = new SchedulerService();
