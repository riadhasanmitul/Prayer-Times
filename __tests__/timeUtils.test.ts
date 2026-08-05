import { formatTime, formatCountdown, addMinutes, isSameDay } from '../src/utils/timeUtils';

describe('timeUtils', () => {
  describe('formatTime', () => {
    const testDate = new Date('2024-01-15T13:30:00.000');

    it('should format time in 12h format', () => {
      const formatted = formatTime(testDate, '12h');
      expect(formatted).toMatch(/1:30\s*PM/i);
    });

    it('should format time in 24h format', () => {
      const formatted = formatTime(testDate, '24h');
      expect(formatted).toBe('13:30');
    });
  });

  describe('formatCountdown', () => {
    it('should format countdown as HH:MM:SS', () => {
      const future = new Date(Date.now() + 2 * 3600 * 1000 + 15 * 60 * 1000 + 30 * 1000);
      const result = formatCountdown(future);
      expect(result).toMatch(/02:15:30/);
    });

    it('should return 00:00:00 for past dates', () => {
      const past = new Date(Date.now() - 60000);
      expect(formatCountdown(past)).toBe('00:00:00');
    });
  });

  describe('addMinutes', () => {
    it('should add minutes correctly', () => {
      const base = new Date('2024-01-15T12:00:00.000Z');
      const result = addMinutes(base, 30);
      expect(result.toISOString()).toBe('2024-01-15T12:30:00.000Z');
    });

    it('should subtract minutes with negative offset', () => {
      const base = new Date('2024-01-15T12:00:00.000Z');
      const result = addMinutes(base, -10);
      expect(result.toISOString()).toBe('2024-01-15T11:50:00.000Z');
    });
  });

  describe('isSameDay', () => {
    it('should return true for same day', () => {
      const a = new Date('2024-01-15T08:00:00.000');
      const b = new Date('2024-01-15T22:00:00.000');
      expect(isSameDay(a, b)).toBe(true);
    });

    it('should return false for different days', () => {
      const a = new Date('2024-01-15T00:00:00.000');
      const b = new Date('2024-01-16T00:00:00.000');
      expect(isSameDay(a, b)).toBe(false);
    });
  });
});
