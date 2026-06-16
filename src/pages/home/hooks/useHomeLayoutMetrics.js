// src/screens/home/hooks/useHomeLayoutMetrics.js

import { useMemo } from 'react';
import { Dimensions } from 'react-native';

export default function useHomeLayoutMetrics() {
  const { width, height } = Dimensions.get('window');

  const metrics = useMemo(
    () => ({
      width,
      height,

      unlockGlowSize: Math.min(width * 0.27, 112),

      compactLesson1IconWidth: Math.min(width * 0.68, 260),
      compactLesson1IconHeight: Math.min(height * 0.12, 110),
      compactLesson1BoardHeight: Math.min(height * 0.55, 420),
      
      lockedCardWidth: Math.min(width * 0.68, 250),
      lockedCardHeight: Math.min(height * 0.11, 100),
      lockedCardMarginBottom: Math.max(height * 0.025, 18),

      lessonDividerLeftWidth: Math.min(width * 0.18, 76),
      lessonDividerRightWidth: Math.min(width * 0.18, 76),

      lessonDividerLeftGap: Math.min(width * 0.12, 48),
      lessonDividerRightGap: Math.min(width * 0.08, 32),
    }),
    [width, height],
  );

  return metrics;
}