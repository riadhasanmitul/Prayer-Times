import { NativeModules, Platform } from 'react-native';

interface AlarmSchedulerNativeModule {
  scheduleAlarm(
    alarmId: string,
    triggerAtMillis: number,
    prayerName: string,
    action: string,
  ): Promise<void>;
  cancelAlarm(alarmId: string): Promise<void>;
  cancelAllAlarms(): Promise<void>;
}

const { AlarmSchedulerModule } = NativeModules as { AlarmSchedulerModule: AlarmSchedulerNativeModule };

const MockModule: AlarmSchedulerNativeModule = {
  scheduleAlarm: () => Promise.resolve(),
  cancelAlarm: () => Promise.resolve(),
  cancelAllAlarms: () => Promise.resolve(),
};

export const AlarmScheduler: AlarmSchedulerNativeModule =
  Platform.OS === 'android' && AlarmSchedulerModule ? AlarmSchedulerModule : MockModule;
