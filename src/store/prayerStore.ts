import { create } from 'zustand';
import { prayerCalculator } from '../prayer/PrayerCalculator';
import { prayerRepository } from '../data/repositories/PrayerRepository';
import { settingsRepository } from '../data/repositories/SettingsRepository';
import { locationService } from '../services/LocationService';
import { MMKVStorage } from '../data/storage/MMKVStorage';
import { STORAGE_KEYS } from '../constants';
import type { DailyPrayerTimes, LocationState, ActiveSchedule, PrayerName } from '../types';
import dayjs from 'dayjs';

interface PrayerState {
  dailyTimes: DailyPrayerTimes | null;
  nextPrayer: { name: PrayerName; time: Date } | null;
  locationState: LocationState | null;
  activeSchedule: ActiveSchedule | null;
  isLoading: boolean;
  error: string | null;

  loadPrayerTimes: () => Promise<void>;
  refreshLocation: () => Promise<void>;
  setActiveSchedule: (schedule: ActiveSchedule | null) => void;
  clearError: () => void;
}

export const usePrayerStore = create<PrayerState>()(set => ({
  dailyTimes: null,
  nextPrayer: null,
  locationState: null,
  activeSchedule: null,
  isLoading: false,
  error: null,

  loadPrayerTimes: async () => {
    set({ isLoading: true, error: null });
    try {
      const locationState = settingsRepository.getLocationState();
      const settings = settingsRepository.getSettings();

      let coords = locationState?.coords;

      if (!coords) {
        const loc = await locationService.getCurrentLocation();
        coords = loc;
        const cityName = await locationService.getCityName(loc);
        const newState: LocationState = { source: 'gps', coords: loc, lastUpdated: Date.now(), cityName };
        settingsRepository.saveLocationState(newState);
        set({ locationState: newState });
      } else {
        set({ locationState });
      }

      const today = new Date();
      const dateKey = dayjs(today).format('YYYY-MM-DD');
      const cached = prayerRepository.getCachedPrayerTimes(dateKey);
      let times: DailyPrayerTimes;

      if (cached && cached.locationCoords.latitude === coords.latitude) {
        times = cached;
      } else {
        times = prayerCalculator.calculateTimes(today, coords, settings.calculationMethod, settings.madhab);
        prayerRepository.cachePrayerTimes(dateKey, times);
      }

      const nextPrayer = prayerCalculator.getNextPrayer(times);
      const activeSchedule = prayerRepository.getActiveSchedule();

      set({ dailyTimes: times, nextPrayer, activeSchedule, isLoading: false });
    } catch (e) {
      set({ error: String(e), isLoading: false });
    }
  },

  refreshLocation: async () => {
    set({ isLoading: true });
    try {
      const loc = await locationService.getCurrentLocation();
      const cityName = await locationService.getCityName(loc);
      const settings = settingsRepository.getSettings();
      const newState: LocationState = { source: 'gps', coords: loc, lastUpdated: Date.now(), cityName };
      settingsRepository.saveLocationState(newState);

      const today = new Date();
      const dateKey = dayjs(today).format('YYYY-MM-DD');
      const times = prayerCalculator.calculateTimes(today, loc, settings.calculationMethod, settings.madhab);
      prayerRepository.cachePrayerTimes(dateKey, times);
      const nextPrayer = prayerCalculator.getNextPrayer(times);

      set({ locationState: newState, dailyTimes: times, nextPrayer, isLoading: false });
    } catch (e) {
      set({ error: String(e), isLoading: false });
    }
  },

  setActiveSchedule: (schedule) => {
    prayerRepository.setActiveSchedule(schedule);
    set({ activeSchedule: schedule });
  },

  clearError: () => set({ error: null }),
}));
