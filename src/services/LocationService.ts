import Geolocation from 'react-native-geolocation-service';
import { Platform, PermissionsAndroid } from 'react-native';
import type { LocationCoords } from '../types';

export class LocationService {
  async requestPermissions(): Promise<boolean> {
    if (Platform.OS !== 'android') return false;
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: 'Location Permission',
        message: 'Prayer Silencer needs location access to calculate prayer times.',
        buttonPositive: 'Allow',
        buttonNegative: 'Deny',
      },
    );
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  }

  getCurrentLocation(): Promise<LocationCoords> {
    return new Promise((resolve, reject) => {
      Geolocation.getCurrentPosition(
        pos => resolve({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          accuracy: pos.coords.accuracy ?? undefined,
        }),
        err => reject(new Error(err.message)),
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 60000,
        },
      );
    });
  }

  async getCityName(coords: LocationCoords): Promise<string> {
    // Offline city estimation based on timezone
    // In a production app, use a reverse geocoding service or local database
    // For now, return coordinates as fallback
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const parts = tz.split('/');
      return parts[parts.length - 1].replace(/_/g, ' ');
    } catch {
      return `${coords.latitude.toFixed(2)}, ${coords.longitude.toFixed(2)}`;
    }
  }
}

export const locationService = new LocationService();
