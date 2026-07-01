// src/screens/home/components/HomeLessonList.js

import React from 'react';
import { FlatList } from 'react-native';

import LessonBlock from './LessonBlock';

function HomeLessonList({
  flatListRef,
  feeds,
  scrollOffsetRef,
  closeActions,
  handleScrollEnd,
  getExtraBottomSpace,
  lesson,
}) {
  const handleScroll = event => {
    scrollOffsetRef.current =
      event.nativeEvent.contentOffset.y;
  };

  const renderLesson = ({ item }) => (
    <LessonBlock
      lesson={item}
      isBlocked={lesson.isLessonBlocked(
        item.lesson,
      )}
      isOnlyLesson2Blocked={
        lesson.isOnlyLesson2Blocked
      }
      height={lesson.height}
      compactLesson1IconWidth={
        lesson.compactLesson1IconWidth
      }
      compactLesson1IconHeight={
        lesson.compactLesson1IconHeight
      }
      compactLesson1BoardHeight={
        lesson.compactLesson1BoardHeight
      }
      lockedCardWidth={
        lesson.lockedCardWidth
      }
      lockedCardHeight={
        lesson.lockedCardHeight
      }
      lockedCardMarginBottom={
        lesson.lockedCardMarginBottom
      }
      activeActionKey={
        lesson.activeActionKey
      }
      recentlyUnlockedKey={
        lesson.recentlyUnlockedKey
      }
      unlockGlowSize={
        lesson.unlockGlowSize
      }
      getLessonIcon={
        lesson.getLessonIcon
      }
      isItemActive={
        lesson.isItemActive
      }
      onOpenLockedLesson={
        lesson.handleOpenLockedActions
      }
      onClearUnlockAnimation={
        lesson.clearUnlockAnimation
      }
      isPressingItemRef={
        lesson.isPressingItemRef
      }
      onOpenActions={
        lesson.handleOpenActions
      }
    />
  );

  return (
    <FlatList
      ref={flatListRef}
      data={feeds}
      renderItem={renderLesson}
      keyExtractor={lesson =>
        String(lesson.lesson)
      }
      showsVerticalScrollIndicator={false}
      scrollEnabled
      scrollEventThrottle={16}
      onScroll={handleScroll}
      onScrollBeginDrag={closeActions}
      onMomentumScrollEnd={handleScrollEnd}
      onScrollAnimationEnd={handleScrollEnd}
      contentContainerStyle={{
        paddingBottom:
          getExtraBottomSpace(),
      }}
    />
  );
}

export default React.memo(HomeLessonList);