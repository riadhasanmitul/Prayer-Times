import { useState, useCallback } from 'react';
import { Platform, PermissionsAndroid, Linking } from 'react-native';
import { SilentMode } from '../native/SilentModeModule';

export interface PermissionStatus {
  location: 'granted' | 'denied' | 'blocked' | 'unknown';
  notification: 'granted' | 'denied' | 'blocked' | 'unknown';
  dnd: 'granted' | 'denied' | 'unknown';
}

export const usePermissions = () => {
  const [status, setStatus] = useState<PermissionStatus>({
    location: 'unknown',
    notification: 'unknown',
    dnd: 'unknown',
  });

  const checkAll = useCallback(async () => {
    if (Platform.OS !== 'android') return;

    const locationResult = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );

    const hasDnd = await SilentMode.hasDndAccess();

    setStatus(prev => ({
      ...prev,
      location: locationResult ? 'granted' : 'denied',
      dnd: hasDnd ? 'granted' : 'denied',
    }));
  }, []);

  const requestLocation = useCallback(async () => {
    const result = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );
    const granted = result === PermissionsAndroid.RESULTS.GRANTED;
    setStatus(prev => ({ ...prev, location: granted ? 'granted' : 'denied' }));
    return granted;
  }, []);

  const requestDnd = useCallback(async () => {
    await SilentMode.requestDndAccess();
    const hasDnd = await SilentMode.hasDndAccess();
    setStatus(prev => ({ ...prev, dnd: hasDnd ? 'granted' : 'denied' }));
  }, []);

  return { status, checkAll, requestLocation, requestDnd };
};
