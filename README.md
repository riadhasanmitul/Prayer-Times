# Prayer Silencer 🕌

**Automatically silence your phone during prayer times.**

A premium Android application built with React Native and TypeScript that automatically calculates prayer times based on your GPS location and silences your phone during prayer windows — inspired by Samsung Modes & Routines, specialized for Muslim prayer automation.

---

## Features

- 🕌 **Offline Prayer Calculation** — Powered by the Adhan library, no internet required
- 📍 **GPS-Based Location** — Automatic prayer times for your current location  
- 🔇 **Smart Phone Silencer** — Automatically switches to Silent/Vibrate mode during prayer
- 🔔 **Persistent Notification** — Shows active prayer + remaining time + "Restore Now" button
- ⏰ **Custom Schedule Windows** — Add custom time offsets (e.g., "Asr: -10 min to +30 min")
- 👤 **Profiles** — Home, Office, Mosque, Travel profiles with different settings
- 🔄 **Sound Restore** — Restores previous ringer mode after prayer ends
- 🛡️ **User Override Respect** — If you manually change sound during prayer, it respects your choice
- 🔋 **Battery Optimized** — Uses AlarmManager + WorkManager for reliable background scheduling
- 🌙 **Dark/Light/System Theme** — Material Design 3

---

## Architecture

```
Prayer Silencer
├── Presentation Layer
│   ├── Screens (HomeScreen, SchedulesScreen, ProfilesScreen, SettingsScreen)
│   ├── Components (PrayerCard, ActiveBanner, NextPrayerCard)
│   └── Navigation (AppNavigator, TabBar)
├── Domain Layer
│   ├── Repositories (IPrayerRepository, IProfileRepository, ISettingsRepository)
│   └── Use Cases (CalculatePrayerTimes, ScheduleAlarms, RestoreSound)
├── Data Layer
│   ├── MMKV Storage (MMKVStorage singleton)
│   └── Repositories (PrayerRepository, ProfileRepository, SettingsRepository)
├── Prayer Engine
│   ├── PrayerCalculator (Adhan integration)
│   ├── ScheduleCalculator (Window merging)
│   └── SoundStateManager (Ringer control)
├── Services
│   ├── SchedulerService (AlarmManager orchestration)
│   └── LocationService (GPS + permissions)
├── State (Zustand)
│   ├── prayerStore, profileStore, settingsStore
└── Native Android (Kotlin)
    ├── SilentModeModule (AudioManager bridge)
    ├── AlarmSchedulerModule (AlarmManager bridge)
    ├── PrayerForegroundService (Foreground service)
    ├── AlarmReceiver, BootReceiver, TimeChangeReceiver
    └── PrayerScheduleWorker (WorkManager daily reschedule)
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React Native 0.86 |
| Language | TypeScript (Strict) |
| Navigation | React Navigation 7 |
| UI | React Native Paper (Material Design 3) |
| State | Zustand |
| Storage | React Native MMKV |
| Prayer Times | Adhan |
| Location | React Native Geolocation Service |
| Animations | React Native Reanimated 3 |
| Background | Android AlarmManager + WorkManager |
| Native Bridge | Kotlin Native Modules |

---

## Prerequisites

- Node.js 20+
- Java Development Kit (JDK) 17
- Android Studio with Android SDK
- Android SDK API 24+ (minSdk 24, targetSdk 34)

---

## Quick Start

```bash
git clone https://github.com/YOUR_USERNAME/prayer-silencer.git
cd prayer-silencer
npm install
npm run android
```

---

## Build APK

### Debug APK

```bash
cd android && ./gradlew assembleDebug
# APK at: android/app/build/outputs/apk/debug/app-debug.apk
```

### Release APK

```bash
# Generate keystore first:
keytool -genkey -v -keystore prayer-silencer.keystore -alias prayer-silencer-key -keyalg RSA -keysize 2048 -validity 10000

# Build release:
cd android && ./gradlew assembleRelease
```

### Cloud Build (GitHub Actions)

Push to GitHub — the `.github/workflows/build-android.yml` workflow automatically builds an APK as an artifact on every push. Create a GitHub Release with:

```bash
git tag v1.0.0 && git push origin v1.0.0
```

---

## Android Permissions

| Permission | Purpose |
|---|---|
| ACCESS_FINE_LOCATION | GPS for prayer time calculation |
| ACCESS_NOTIFICATION_POLICY | Control Do Not Disturb mode |
| MODIFY_AUDIO_SETTINGS | Set ringer to silent/vibrate |
| FOREGROUND_SERVICE | Active prayer notification |
| RECEIVE_BOOT_COMPLETED | Reschedule alarms after reboot |
| SCHEDULE_EXACT_ALARM | Precise prayer time alarms |
| POST_NOTIFICATIONS | Prayer notifications (Android 13+) |

---

## Prayer Calculation Methods

- University of Islamic Sciences, Karachi (Default)
- Muslim World League
- Egyptian General Authority
- Moonsighting Committee Worldwide (ISNA)
- Dubai, Kuwait, Qatar, Singapore, Tehran, Turkey

---

## Privacy

- No analytics, no tracking, no user data collection
- No server required — fully offline
- Location stays on device

---

## Acknowledgments

- [Adhan](https://github.com/batoulapps/adhan-js) — Prayer time calculation by Batoul Apps
- [React Native Paper](https://callstack.github.io/react-native-paper/) — MD3 components
- [React Native Reanimated](https://docs.swmansion.com/react-native-reanimated/) — Animations
