export type RootStackParamList = {
  Main: undefined;
  PrayerScheduleDetail: { prayerName: string };
  AddCustomSchedule: { prayerName: string };
  ProfileEditor: { profileId?: string };
  Settings: undefined;
  Permissions: undefined;
  About: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Schedules: undefined;
  Profiles: undefined;
};

export type MainTabScreenProps<T extends keyof MainTabParamList> = any;
