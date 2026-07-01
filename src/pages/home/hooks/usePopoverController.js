// src/screens/home/hooks/usePopoverController.js

import { useState } from 'react';

const POPOVER_WIDTH = 280;

function usePopoverController({
  flatListRef,
  scrollOffsetRef,
  previousScrollOffsetRef,
  pendingMeasureRef,

  TARGET_CENTER_Y,
  POPOVER_TOP_GAP,
  LOCKED_LESSON_TOP_OFFSET,
}) {
  const [activeActionKey, setActiveActionKey] = useState(null);
  const [popover, setPopover] = useState(null);
  const [actionSpaceVisible, setActionSpaceVisible] = useState(false);
  const [isPopoverClosing, setIsPopoverClosing] = useState(false);
  const [currentPopoverType, setCurrentPopoverType] = useState(null);

  const isLockedLessonAction = (actionData, type) =>
    type === 'locked' && actionData?.lockedKind === 'lesson';

  const closeActions = () => {
    if (popover && !isPopoverClosing) {
      setIsPopoverClosing(true);
    }
  };

  const handlePopoverAnimationEnd = () => {
    flatListRef.current?.scrollToOffset({
      offset: previousScrollOffsetRef.current,
      animated: true,
    });

    setActiveActionKey(null);
    setPopover(null);
    setIsPopoverClosing(false);
    setCurrentPopoverType(null);

    pendingMeasureRef.current = null;

    setTimeout(() => {
      setActionSpaceVisible(false);
    }, 250);
  };

  const getPointerLeft = actionData => {
    const isLeftSide = actionData.index % 2 === 0;
    return isLeftSide ? 58 : 198;
  };

  const getPointerTop = type =>
    type === 'locked' ? -12 : -10;

  const measureAndShowPopover = (
    actionData,
    measureFn,
    type = 'action',
  ) => {
    measureFn((fx, fy, width, measuredHeight, px, py) => {
      const pointerLeft = getPointerLeft(actionData);

      const isLockedLesson = isLockedLessonAction(
        actionData,
        type,
      );

      const anchorHeight = isLockedLesson
        ? actionData.anchor?.visualHeight ?? measuredHeight
        : measuredHeight;

      const fixedTopPosition =
        py +
        anchorHeight +
        POPOVER_TOP_GAP +
        (isLockedLesson ? LOCKED_LESSON_TOP_OFFSET : 0);

      setIsPopoverClosing(false);
      setCurrentPopoverType(type);

      setPopover({
        type,
        top: fixedTopPosition,
        pointerLeft,
        itemData: actionData,
      });
    });
  };

  const openPopoverAfterSpaceReady = (
    actionData,
    measureButtonNativeFn,
    type = 'action',
  ) => {
    const currentOffset = scrollOffsetRef.current;

    const originalAnchorY =
      actionData.anchor?.pageY ?? TARGET_CENTER_Y;

    const scrollDelta =
      originalAnchorY - TARGET_CENTER_Y;

    let targetOffset =
      currentOffset + scrollDelta;

    if (targetOffset <= 0) {
      targetOffset = 0;

      if (currentOffset === 0) {
        measureAndShowPopover(
          actionData,
          measureButtonNativeFn,
          type,
        );
        return;
      }
    }

    if (Math.abs(scrollDelta) < 5) {
      measureAndShowPopover(
        actionData,
        measureButtonNativeFn,
        type,
      );
      return;
    }

    pendingMeasureRef.current = () =>
      measureAndShowPopover(
        actionData,
        measureButtonNativeFn,
        type,
      );

    flatListRef.current?.scrollToOffset({
      offset: targetOffset,
      animated: true,
    });
  };

  const openPopover = (
    actionData,
    measureButtonNativeFn,
    type = 'action',
  ) => {
    const isSameItem =
      activeActionKey === actionData.key &&
      popover?.type === type;

    if (isSameItem) {
      closeActions();
      return;
    }

    previousScrollOffsetRef.current =
      scrollOffsetRef.current;

    pendingMeasureRef.current = null;

    setActiveActionKey(actionData.key);
    setCurrentPopoverType(type);
    setIsPopoverClosing(false);

    if (!actionSpaceVisible) {
      setActionSpaceVisible(true);

      requestAnimationFrame(() => {
        openPopoverAfterSpaceReady(
          actionData,
          measureButtonNativeFn,
          type,
        );
      });

      return;
    }

    openPopoverAfterSpaceReady(
      actionData,
      measureButtonNativeFn,
      type,
    );
  };

  return {
    activeActionKey,
    popover,
    actionSpaceVisible,
    isPopoverClosing,
    currentPopoverType,

    setActiveActionKey,
    setPopover,
    setActionSpaceVisible,
    setIsPopoverClosing,
    setCurrentPopoverType,

    closeActions,
    handlePopoverAnimationEnd,

    getPointerLeft,
    getPointerTop,

    measureAndShowPopover,
    openPopoverAfterSpaceReady,
    openPopover,

    POPOVER_WIDTH,
  };
}

export default usePopoverController;