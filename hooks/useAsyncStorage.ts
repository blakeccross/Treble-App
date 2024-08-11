import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type StorageHookReturn = [any | null, (data: string) => string, () => void];

export default function useStorage(key: string): StorageHookReturn {
  const [storageItem, setStorageItem] = useState<any | null>();

  async function getStorageItem() {
    const data = await AsyncStorage.getItem(key);
    if (data) setStorageItem(JSON.parse(data));
    else setStorageItem(null);
  }

  function updateStorageItem(data: string): string {
    if (typeof data === 'string') {
      AsyncStorage.setItem(key, data);
      setStorageItem(data);
    }
    return data;
  }

  function clearStorageItem() {
    AsyncStorage.removeItem(key);
    setStorageItem(null);
  }

  useEffect(() => {
    getStorageItem();
  }, []);

  return [storageItem, updateStorageItem, clearStorageItem];
}
