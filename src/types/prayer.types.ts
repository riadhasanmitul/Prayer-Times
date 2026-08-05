export type PrayerName = 'Fajr' | 'Dhuhr' | 'Asr' | 'Maghrib' | 'Isha';
export type RingerMode = 'silent' | 'vibrate' | 'normal';

export interface LocationCoords {
  latitude: number;
  longitude: number;
  accuracy?: number;
}

export interface ManualCity {
  name: string;
  country: string;
  latitude: number;
  longitude: number;
  timezone: string;
}

export type LocationSource = 'gps' | 'manual';

export interface LocationState {
  source: LocationSource;
  coords?: LocationCoords;
  city?: ManualCity;
  lastUpdated?: number;
  cityName?: string;
}

export interface DailyPrayerTimes {
  date: string; // ISO string
  locationCoords: LocationCoords;
  fajr: string;    // ISO string
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
}

export interface ScheduleWindow {
  id: string;
  name: string;
  useExactTime: boolean;
  startOffset: number;      // minutes offset from prayer (can be negative = before)
  endOffset: number;        // minutes offset from prayer
  exactStartTime?: string;  // 'HH:mm' if useExactTime
  exactEndTime?: string;    // 'HH:mm' if useExactTime
  enabled: boolean;
}

export interface PrayerSchedule {
  id: string;
  prayerName: PrayerName;
  profileId: string;
  windows: ScheduleWindow[];
  enabled: boolean;
}

export interface ActiveSchedule {
  scheduleId: string;
  prayerName: PrayerName;
  profileId: string;
  startTime: string; // ISO
  endTime: string;   // ISO
  previousRingerMode: RingerMode;
  userOverridden: boolean;
}

export interface AlarmEntry {
  id: string;
  prayerName: PrayerName;
  action: 'start' | 'end';
  triggerAtMillis: number;
  profileId: string;
  windowId: string;
}
