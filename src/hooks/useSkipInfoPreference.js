// src/hooks/useSkipInfoPreference.js

import { useEffect, useRef, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const OLD_HIDE_SKIP_INFO_KEY = '@batuta:hide_skip_info_modal';

const getHideSkipInfoKey = (user) => {
  const identifier = user?.email || user?.id;
  if (!identifier) return null;

  return `@batuta:hide_skip_info_modal:user:${String(identifier).toLowerCase()}`;
};

export default function useSkipInfoPreference(user) {
  const skipInfoShownRef = useRef(false);

  const [skipInfoVisible, setSkipInfoVisible] = useState(false);
  const [hideSkipInfo, setHideSkipInfo] = useState(false);

  useEffect(() => {
    const loadSkipInfoPreference = async () => {
      try {
        const key = getHideSkipInfoKey(user);

        if (!key) {
          setHideSkipInfo(false);
          return;
        }

        const value = await AsyncStorage.getItem(key);
        setHideSkipInfo(value === 'true');

        await AsyncStorage.removeItem(OLD_HIDE_SKIP_INFO_KEY);
      } catch (error) {
        console.log('[useSkipInfoPreference] Erro ao carregar preferência:', error);
      }
    };

    loadSkipInfoPreference();
  }, [user?.id, user?.email]);

  const handleDisableSkipInfoNextTime = async () => {
    try {
      const key = getHideSkipInfoKey(user);

      if (!key) return;

      await AsyncStorage.setItem(key, 'true');
      setHideSkipInfo(true);
    } catch (error) {
      console.log('[useSkipInfoPreference] Erro ao salvar preferência:', error);
    }
  };

  const shouldShowSkipInfo = () => {
    return !skipInfoShownRef.current && !hideSkipInfo;
  };

  const showSkipInfo = () => {
    skipInfoShownRef.current = true;
    setSkipInfoVisible(true);
  };

  const closeSkipInfo = () => {
    setSkipInfoVisible(false);
  };

  const resetSkipInfoSession = () => {
    skipInfoShownRef.current = false;
  };

  return {
    skipInfoVisible,
    hideSkipInfo,

    setSkipInfoVisible,
    handleDisableSkipInfoNextTime,

    shouldShowSkipInfo,
    showSkipInfo,
    closeSkipInfo,
    resetSkipInfoSession,
  };
}