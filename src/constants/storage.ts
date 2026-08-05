export const STORAGE_KEYS = {
  SETTINGS: 'app_settings',
  PROFILES: 'profiles',
  ACTIVE_PROFILE_ID: 'active_profile_id',
  SCHEDULES: 'prayer_schedules',
  ACTIVE_SCHEDULE: 'active_schedule',
  LOCATION_STATE: 'location_state',
  PRAYER_TIMES_CACHE: 'prayer_times_cache',
  ALARM_ENTRIES: 'alarm_entries',
  PRAYER_SCHEDULE_JSON: 'prayer_schedule_json', // shared with native
} as const;

export type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS];
