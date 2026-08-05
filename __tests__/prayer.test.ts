import { PrayerCalculator } from '../src/prayer/PrayerCalculator';
import { ScheduleCalculator } from '../src/prayer/ScheduleCalculator';
import type { LocationCoords, ScheduleWindow } from '../src/types';

describe('PrayerCalculator', () => {
  const calculator = new PrayerCalculator();

  const dhaka: LocationCoords = { latitude: 23.8103, longitude: 90.4125 };
  const karachi: LocationCoords = { latitude: 24.8607, longitude: 67.0011 };

  describe('calculateTimes', () => {
    it('should calculate valid prayer times for Dhaka', () => {
      const today = new Date('2024-01-15T00:00:00.000Z');
      const times = calculator.calculateTimes(today, dhaka, 'Karachi', 'Hanafi');

      expect(times).toBeDefined();
      expect(times.fajr).toBeDefined();
      expect(times.dhuhr).toBeDefined();
      expect(times.asr).toBeDefined();
      expect(times.maghrib).toBeDefined();
      expect(times.isha).toBeDefined();
    });

    it('should return times in chronological order', () => {
      const today = new Date('2024-01-15T00:00:00.000Z');
      const times = calculator.calculateTimes(today, dhaka, 'Karachi', 'Hanafi');

      const fajr = new Date(times.fajr).getTime();
      const dhuhr = new Date(times.dhuhr).getTime();
      const asr = new Date(times.asr).getTime();
      const maghrib = new Date(times.maghrib).getTime();
      const isha = new Date(times.isha).getTime();

      expect(fajr).toBeLessThan(dhuhr);
      expect(dhuhr).toBeLessThan(asr);
      expect(asr).toBeLessThan(maghrib);
      expect(maghrib).toBeLessThan(isha);
    });

    it('should produce different Asr times for Hanafi vs Shafi', () => {
      const today = new Date('2024-01-15T00:00:00.000Z');
      const hanafiTimes = calculator.calculateTimes(today, karachi, 'Karachi', 'Hanafi');
      const shafiTimes = calculator.calculateTimes(today, karachi, 'Karachi', 'Shafi');

      const hanafiAsr = new Date(hanafiTimes.asr).getTime();
      const shafiAsr = new Date(shafiTimes.asr).getTime();

      // Hanafi Asr is always later than Shafi Asr
      expect(hanafiAsr).toBeGreaterThan(shafiAsr);
    });

    it('should support all calculation methods', () => {
      const methods = [
        'Karachi', 'MuslimWorldLeague', 'Egyptian', 'NorthAmerica',
        'Dubai', 'Kuwait', 'Qatar', 'Singapore'
      ] as const;
      const today = new Date('2024-06-01T00:00:00.000Z');

      methods.forEach(method => {
        expect(() => {
          calculator.calculateTimes(today, dhaka, method, 'Shafi');
        }).not.toThrow();
      });
    });
  });

  describe('getNextPrayer', () => {
    it('should return null when all prayers have passed', () => {
      const today = new Date('2024-01-15T00:00:00.000Z');
      const times = calculator.calculateTimes(today, dhaka, 'Karachi', 'Hanafi');

      // Set "now" to 11pm — all prayers should have passed
      const lateNight = new Date('2024-01-15T23:00:00.000Z');
      const next = calculator.getNextPrayer(times, lateNight);

      expect(next).toBeNull();
    });

    it('should return correct next prayer', () => {
      const today = new Date('2024-01-15T00:00:00.000Z');
      const times = calculator.calculateTimes(today, dhaka, 'Karachi', 'Hanafi');

      // Set "now" to early morning before Fajr
      const earlyMorning = new Date('2024-01-15T00:30:00.000Z');
      const next = calculator.getNextPrayer(times, earlyMorning);

      expect(next?.name).toBe('Fajr');
    });
  });

  describe('getTimeUntil', () => {
    it('should calculate correct hours, minutes, seconds', () => {
      const target = new Date();
      target.setHours(target.getHours() + 2);
      target.setMinutes(target.getMinutes() + 30);

      const { hours, minutes } = calculator.getTimeUntil(target);

      expect(hours).toBe(2);
      expect(minutes).toBe(30);
    });

    it('should return zeros when target is in the past', () => {
      const past = new Date(Date.now() - 60000);
      const result = calculator.getTimeUntil(past);

      expect(result.hours).toBe(0);
      expect(result.minutes).toBe(0);
      expect(result.seconds).toBe(0);
    });
  });
});

describe('ScheduleCalculator', () => {
  const calculator = new ScheduleCalculator();
  const prayerTime = new Date('2024-01-15T12:00:00.000Z'); // noon prayer

  describe('getWindowDates', () => {
    it('should calculate offset-based window correctly', () => {
      const window: ScheduleWindow = {
        id: 'test-1',
        name: 'Test Window',
        useExactTime: false,
        startOffset: -10, // 10 min before prayer
        endOffset: 30,    // 30 min after prayer
        enabled: true,
      };

      const { start, end } = calculator.getWindowDates(prayerTime, window);

      const expectedStart = new Date(prayerTime.getTime() - 10 * 60 * 1000);
      const expectedEnd = new Date(prayerTime.getTime() + 30 * 60 * 1000);

      expect(start.getTime()).toBe(expectedStart.getTime());
      expect(end.getTime()).toBe(expectedEnd.getTime());
    });
  });

  describe('mergeOverlappingWindows', () => {
    it('should merge overlapping windows', () => {
      const windows = [
        { start: new Date('2024-01-15T12:00:00Z'), end: new Date('2024-01-15T12:30:00Z'), windowId: '1' },
        { start: new Date('2024-01-15T12:20:00Z'), end: new Date('2024-01-15T13:00:00Z'), windowId: '2' },
      ];

      const merged = calculator.mergeOverlappingWindows(windows);

      expect(merged).toHaveLength(1);
      expect(merged[0].start.toISOString()).toBe('2024-01-15T12:00:00.000Z');
      expect(merged[0].end.toISOString()).toBe('2024-01-15T13:00:00.000Z');
    });

    it('should not merge non-overlapping windows', () => {
      const windows = [
        { start: new Date('2024-01-15T12:00:00Z'), end: new Date('2024-01-15T12:30:00Z'), windowId: '1' },
        { start: new Date('2024-01-15T14:00:00Z'), end: new Date('2024-01-15T14:30:00Z'), windowId: '2' },
      ];

      const merged = calculator.mergeOverlappingWindows(windows);
      expect(merged).toHaveLength(2);
    });

    it('should handle empty array', () => {
      expect(calculator.mergeOverlappingWindows([])).toHaveLength(0);
    });
  });

  describe('isCurrentlyActive', () => {
    it('should return true when within active window', () => {
      const windows = [
        { start: new Date('2024-01-15T12:00:00Z'), end: new Date('2024-01-15T12:30:00Z'), windowId: '1' },
      ];
      const now = new Date('2024-01-15T12:15:00Z');
      expect(calculator.isCurrentlyActive(windows, now)).toBe(true);
    });

    it('should return false when outside all windows', () => {
      const windows = [
        { start: new Date('2024-01-15T12:00:00Z'), end: new Date('2024-01-15T12:30:00Z'), windowId: '1' },
      ];
      const now = new Date('2024-01-15T14:00:00Z');
      expect(calculator.isCurrentlyActive(windows, now)).toBe(false);
    });
  });
});
