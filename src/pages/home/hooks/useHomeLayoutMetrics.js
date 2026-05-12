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
      compactLesson1BoardHeight: Math.min(height * 0.55, 400),

      lockedLessonIconWidth: Math.min(width * 0.64, 250),
      lockedLessonIconHeight: Math.min(height * 0.1, 95),
      lockedCardWidth: Math.min(width * 0.68, 250),
      lockedCardHeight: Math.min(height * 0.11, 100),
      lockedCardMarginBottom: Math.max(height * 0.025, 18),
    }),
    [width, height],
  );

  return metrics;
}