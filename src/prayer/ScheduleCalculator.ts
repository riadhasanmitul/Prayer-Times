import dayjs from 'dayjs';
import type { ScheduleWindow, PrayerName } from '../types';

export interface TimeWindow {
  start: Date;
  end: Date;
  windowId: string;
}

export class ScheduleCalculator {
  getWindowDates(prayerTime: Date, window: ScheduleWindow): TimeWindow {
    let start: Date;
    let end: Date;

    if (window.useExactTime && window.exactStartTime && window.exactEndTime) {
      const [sh, sm] = window.exactStartTime.split(':').map(Number);
      const [eh, em] = window.exactEndTime.split(':').map(Number);
      start = dayjs(prayerTime).startOf('day').hour(sh).minute(sm).toDate();
      end = dayjs(prayerTime).startOf('day').hour(eh).minute(em).toDate();
    } else {
      start = dayjs(prayerTime).add(window.startOffset, 'minute').toDate();
      end = dayjs(prayerTime).add(window.endOffset, 'minute').toDate();
    }

    return { start, end, windowId: window.id };
  }

  mergeOverlappingWindows(windows: TimeWindow[]): TimeWindow[] {
    if (windows.length === 0) return [];
    const sorted = [...windows].sort((a, b) => a.start.getTime() - b.start.getTime());
    const merged: TimeWindow[] = [sorted[0]];

    for (let i = 1; i < sorted.length; i++) {
      const last = merged[merged.length - 1];
      if (sorted[i].start <= last.end) {
        // Overlap: extend
        last.end = new Date(Math.max(last.end.getTime(), sorted[i].end.getTime()));
      } else {
        merged.push(sorted[i]);
      }
    }
    return merged;
  }

  isCurrentlyActive(windows: TimeWindow[], now: Date = new Date()): boolean {
    return windows.some(w => now >= w.start && now <= w.end);
  }

  getActiveWindow(windows: TimeWindow[], now: Date = new Date()): TimeWindow | null {
    return windows.find(w => now >= w.start && now <= w.end) ?? null;
  }
}

export const scheduleCalculator = new ScheduleCalculator();
