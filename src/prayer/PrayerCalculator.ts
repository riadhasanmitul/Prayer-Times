import {
  Coordinates,
  PrayerTimes,
  CalculationMethod,
  Madhab,
  CalculationParameters,
} from 'adhan';
import dayjs from 'dayjs';
import type { LocationCoords, DailyPrayerTimes, PrayerName } from '../types';
import type { CalculationMethodName, MadhabName } from '../types';

export class PrayerCalculator {
  private getCalculationParams(method: CalculationMethodName): CalculationParameters {
    switch (method) {
      case 'Karachi': return CalculationMethod.Karachi();
      case 'MuslimWorldLeague': return CalculationMethod.MuslimWorldLeague();
      case 'Egyptian': return CalculationMethod.Egyptian();
      case 'MoonsightingCommittee': return CalculationMethod.MoonsightingCommittee();
      case 'NorthAmerica': return CalculationMethod.NorthAmerica();
      case 'Dubai': return CalculationMethod.Dubai();
      case 'Kuwait': return CalculationMethod.Kuwait();
      case 'Qatar': return CalculationMethod.Qatar();
      case 'Singapore': return CalculationMethod.Singapore();
      case 'Tehran': return CalculationMethod.Tehran();
      case 'Turkey': return CalculationMethod.Turkey();
      default: return CalculationMethod.Karachi();
    }
  }

  private getMadhab(madhab: MadhabName): Madhab {
    return madhab === 'Hanafi' ? Madhab.Hanafi : Madhab.Shafi;
  }

  calculateTimes(
    date: Date,
    coords: LocationCoords,
    method: CalculationMethodName,
    madhab: MadhabName,
  ): DailyPrayerTimes {
    const coordinates = new Coordinates(coords.latitude, coords.longitude);
    const params = this.getCalculationParams(method);
    params.madhab = this.getMadhab(madhab);

    const prayerTimes = new PrayerTimes(coordinates, date, params);

    return {
      date: dayjs(date).startOf('day').toISOString(),
      locationCoords: coords,
      fajr: prayerTimes.fajr.toISOString(),
      dhuhr: prayerTimes.dhuhr.toISOString(),
      asr: prayerTimes.asr.toISOString(),
      maghrib: prayerTimes.maghrib.toISOString(),
      isha: prayerTimes.isha.toISOString(),
    };
  }

  getPrayerTime(times: DailyPrayerTimes, prayer: PrayerName): Date {
    const isoMap: Record<PrayerName, string> = {
      Fajr: times.fajr,
      Dhuhr: times.dhuhr,
      Asr: times.asr,
      Maghrib: times.maghrib,
      Isha: times.isha,
    };
    return new Date(isoMap[prayer]);
  }

  getNextPrayer(
    times: DailyPrayerTimes,
    now: Date = new Date(),
  ): { name: PrayerName; time: Date } | null {
    const prayers: PrayerName[] = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
    for (const name of prayers) {
      const time = this.getPrayerTime(times, name);
      if (time > now) return { name, time };
    }
    return null; // All prayers passed today
  }

  getTimeUntil(target: Date, from: Date = new Date()): { hours: number; minutes: number; seconds: number } {
    const diffMs = Math.max(0, target.getTime() - from.getTime());
    const totalSeconds = Math.floor(diffMs / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return { hours, minutes, seconds };
  }
}

export const prayerCalculator = new PrayerCalculator();
