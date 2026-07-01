// src/screens/home/hooks/useLessonController.js

import {
  isItemActive as checkIsItemActive,
  isLessonBlocked as checkIsLessonBlocked,
} from '../helpers/homeProgressHelpers';

function useLessonController({
  feeds,
  progressLevel,
  openPopover,
}) {
  const isLessonBlocked = lessonNumber =>
    checkIsLessonBlocked(
      feeds,
      lessonNumber,
      progressLevel,
    );

  const isItemActive = (lesson, index) =>
    checkIsItemActive(
      feeds,
      lesson,
      index,
      progressLevel,
    );

  const isOnlyLesson2Blocked =
    feeds.length === 2 &&
    isLessonBlocked('2');

  const handleOpenActions = (
    actionData,
    measureButtonNativeFn,
  ) => {
    openPopover(
      actionData,
      measureButtonNativeFn,
      'action',
    );
  };

  const handleOpenLockedActions = (
    actionData,
    measureButtonNativeFn,
  ) => {
    openPopover(
      actionData,
      measureButtonNativeFn,
      'locked',
    );
  };

  return {
    isLessonBlocked,
    isItemActive,
    isOnlyLesson2Blocked,

    handleOpenActions,
    handleOpenLockedActions,
  };
}

export default useLessonController;