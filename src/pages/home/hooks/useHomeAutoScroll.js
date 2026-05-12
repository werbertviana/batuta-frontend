// src/screens/home/hooks/useHomeAutoScroll.js

import { useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';

import { getCurrentLessonIndex } from '../helpers/homeProgressHelpers';

export default function useHomeAutoScroll({
  flatListRef,
  feeds,
  isLoadingFeeds,
  progressLevel,
}) {
  useFocusEffect(
    useCallback(() => {
      if (!feeds.length || isLoadingFeeds) return undefined;

      const lessonIndex = getCurrentLessonIndex(feeds, progressLevel);

      if (lessonIndex <= 0) return undefined;

      const timeout = setTimeout(() => {
        flatListRef.current?.scrollToIndex({
          index: lessonIndex,
          animated: true,
          viewPosition: 0.08,
        });
      }, 450);

      return () => clearTimeout(timeout);
    }, [flatListRef, feeds, isLoadingFeeds, progressLevel]),
  );
}