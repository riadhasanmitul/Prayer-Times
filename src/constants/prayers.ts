import type { PrayerName } from '../types';
import type { CalculationMethodName } from '../types';

export const PRAYER_NAMES: PrayerName[] = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];

export const PRAYER_DISPLAY_NAMES: Record<PrayerName, string> = {
  Fajr: 'Fajr',
  Dhuhr: 'Dhuhr',
  Asr: 'Asr',
  Maghrib: 'Maghrib',
  Isha: 'Isha',
};

export const PRAYER_ICONS: Record<PrayerName, string> = {
  Fajr: 'weather-sunset-up',
  Dhuhr: 'weather-sunny',
  Asr: 'weather-partly-cloudy',
  Maghrib: 'weather-sunset-down',
  Isha: 'weather-night',
};

export const PRAYER_COLORS: Record<PrayerName, string> = {
  Fajr: '#FF9F43',
  Dhuhr: '#FFD700',
  Asr: '#26C6DA',
  Maghrib: '#EF5350',
  Isha: '#7C4DFF',
};

export const CALCULATION_METHODS: Record<CalculationMethodName, string> = {
  Karachi: 'University of Islamic Sciences, Karachi',
  MuslimWorldLeague: 'Muslim World League',
  Egyptian: 'Egyptian General Authority of Survey',
  MoonsightingCommittee: 'Moonsighting Committee Worldwide',
  NorthAmerica: 'Islamic Society of North America (ISNA)',
  Dubai: 'Dubai',
  Kuwait: 'Kuwait',
  Qatar: 'Qatar',
  Singapore: 'Majlis Ugama Islam Singapore',
  Tehran: 'Institute of Geophysics, Tehran',
  Turkey: 'Diyanet İşleri Başkanlığı, Turkey',
};
