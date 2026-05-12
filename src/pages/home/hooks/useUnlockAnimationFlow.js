// src/screens/home/hooks/useUnlockAnimationFlow.js

import { useCallback, useEffect, useState } from 'react';

import { getUnlockKeyByProgressLevel } from '../helpers/homeProgressHelpers';

export default function useUnlockAnimationFlow(feeds) {
  const [recentlyUnlockedKey, setRecentlyUnlockedKey] = useState(null);

  const [pendingUnlockProgressLevel, setPendingUnlockProgressLevel] =
    useState(null);

  const [queuedUnlockProgressLevel, setQueuedUnlockProgressLevel] =
    useState(null);

  const triggerUnlockAnimation = useCallback(
    (targetProgressLevel) => {
      const newUnlockKey = getUnlockKeyByProgressLevel(
        feeds,
        targetProgressLevel,
      );

      if (!newUnlockKey) return;

      requestAnimationFrame(() => {
        setRecentlyUnlockedKey(newUnlockKey);
      });
    },
    [feeds],
  );

  useEffect(() => {
    if (!pendingUnlockProgressLevel || feeds.length === 0) return;

    triggerUnlockAnimation(pendingUnlockProgressLevel);
    setPendingUnlockProgressLevel(null);
  }, [pendingUnlockProgressLevel, feeds, triggerUnlockAnimation]);

  const playQueuedUnlockAnimation = useCallback(() => {
    if (!queuedUnlockProgressLevel) return;

    if (feeds.length > 0) {
      triggerUnlockAnimation(queuedUnlockProgressLevel);
    } else {
      setPendingUnlockProgressLevel(queuedUnlockProgressLevel);
    }

    setQueuedUnlockProgressLevel(null);
  }, [queuedUnlockProgressLevel, feeds, triggerUnlockAnimation]);

  const clearUnlockAnimation = useCallback(() => {
    setRecentlyUnlockedKey(null);
  }, []);

  return {
    recentlyUnlockedKey,

    pendingUnlockProgressLevel,
    setPendingUnlockProgressLevel,

    queuedUnlockProgressLevel,
    setQueuedUnlockProgressLevel,

    triggerUnlockAnimation,
    playQueuedUnlockAnimation,
    clearUnlockAnimation,
  };
}