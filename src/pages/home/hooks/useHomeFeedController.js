// src/screens/home/hooks/useHomeFeedController.js

function useHomeFeedController({
  xpPoints,
  batutaPoints,
  life,

  flatListRef,
  feeds,
  scrollOffsetRef,
  closeActions,
  handleScrollEnd,
  getExtraBottomSpace,

  isLessonBlocked,
  isItemActive,
  isOnlyLesson2Blocked,

  height,
  compactLesson1IconWidth,
  compactLesson1IconHeight,
  compactLesson1BoardHeight,

  lockedCardWidth,
  lockedCardHeight,
  lockedCardMarginBottom,

  activeActionKey,
  recentlyUnlockedKey,
  unlockGlowSize,

  clearUnlockAnimation,

  getLessonIcon,

  handleOpenActions,
  handleOpenLockedActions,

  isPressingItemRef,
}) {
  return {
    header: {
      xpPoints,
      batutaPoints,
      lifePoints: life,
    },

    list: {
      flatListRef,
      feeds,
      scrollOffsetRef,
      closeActions,
      handleScrollEnd,
      getExtraBottomSpace,
    },

    lesson: {
      isLessonBlocked,
      isItemActive,
      isOnlyLesson2Blocked,

      height,

      compactLesson1IconWidth,
      compactLesson1IconHeight,
      compactLesson1BoardHeight,

      lockedCardWidth,
      lockedCardHeight,
      lockedCardMarginBottom,

      activeActionKey,
      recentlyUnlockedKey,
      unlockGlowSize,

      clearUnlockAnimation,

      getLessonIcon,

      handleOpenActions,
      handleOpenLockedActions,

      isPressingItemRef,
    },
  };
}

export default useHomeFeedController;