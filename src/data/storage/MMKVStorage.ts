import { MMKV } from 'react-native-mmkv';

const storage = new MMKV({ id: 'prayer-silencer' });

export class MMKVStorage {
  static set<T>(key: string, value: T): void {
    storage.set(key, JSON.stringify(value));
  }

  static get<T>(key: string): T | undefined {
    const raw = storage.getString(key);
    if (raw === undefined) return undefined;
    try {
      return JSON.parse(raw) as T;
    } catch {
      return undefined;
    }
  }

  static delete(key: string): void {
    storage.delete(key);
  }

  static getAllKeys(): string[] {
    return storage.getAllKeys();
  }

  static clearAll(): void {
    storage.clearAll();
  }

  static contains(key: string): boolean {
    return storage.contains(key);
  }
}
