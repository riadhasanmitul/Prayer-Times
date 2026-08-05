import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { PrayerName } from './prayer.types';
import type { ProfileId } from './settings.types';

export type RootStackParamList = {
  Main: undefined;
  Permissions: undefined;
  PrayerScheduleDetail: { prayerName: PrayerName; profileId: ProfileId };
  AddCustomSchedule: { prayerName: PrayerName; profileId: ProfileId; windowId?: string };
  ProfileEditor: { profileId?: ProfileId };
  Settings: undefined;
  About: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Schedules: undefined;
  Profiles: undefined;
};

export type RootStackScreenProps<T extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, T>;

export type MainTabScreenProps<T extends keyof MainTabParamList> =
  BottomTabScreenProps<MainTabParamList, T>;

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
