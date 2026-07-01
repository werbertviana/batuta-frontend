import { useRef, useState } from 'react';
import PopoverHost from '../../components/popoverHost/PopoverHost';

export default function usePopoverController({
  flatListRef,
  scrollOffsetRef,
  previousScrollOffsetRef,
  pendingMeasureRef,
  targetCenterY,
  popoverTopGap,
  lockedLessonTopOffset,
}) {
  const [activeActionKey, setActiveActionKey] = useState(null);
  const [popover, setPopover] = useState(null);
  const [actionSpaceVisible, setActionSpaceVisible] = useState(false);
  const [isPopoverClosing, setIsPopoverClosing] = useState(false);
  const [currentPopoverType, setCurrentPopoverType] = useState(null);

  const pendingOpenRef = useRef(null);
  const skipCloseAnimationRef = useRef(false);

  // refs sempre sincronizadas com o estado
  const popoverRef = useRef(null);
  const activeActionKeyRef = useRef(null);
  const actionSpaceVisibleRef = useRef(false);

  const updatePopover = value => {
    popoverRef.current = value;
    setPopover(value);
  };

  const updateActiveActionKey = value => {
    activeActionKeyRef.current = value;
    setActiveActionKey(value);
  };

  const updateActionSpaceVisible = value => {
    actionSpaceVisibleRef.current = value;
    setActionSpaceVisible(value);
  };

  const isLockedLessonAction = (actionData, type) =>
    type === 'locked' && actionData?.lockedKind === 'lesson';

  const getPointerLeft = actionData => {
    const isLeftSide = actionData.index % 2 === 0;
    return isLeftSide ? 58 : 198;
  };

  const measureAndShowPopover = (
    actionData,
    measureFn,
    type = 'action',
  ) => {
    measureFn((fx, fy, width, measuredHeight, px, py) => {
      const pointerLeft = getPointerLeft(actionData);

      const isLockedLesson =
        isLockedLessonAction(actionData, type);

      const anchorHeight = isLockedLesson
        ? actionData.anchor?.visualHeight ??
          measuredHeight
        : measuredHeight;

      const fixedTopPosition =
        py +
        anchorHeight +
        popoverTopGap +
        (isLockedLesson
          ? lockedLessonTopOffset
          : 0);

      setIsPopoverClosing(false);
      setCurrentPopoverType(type);

      updatePopover({
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
    const currentOffset =
      scrollOffsetRef.current;

    const originalAnchorY =
      actionData.anchor?.pageY ??
      targetCenterY;

    const scrollDelta =
      originalAnchorY - targetCenterY;

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
    const closeActions = () => {
    if (!popoverRef.current || isPopoverClosing) {
      return;
    }

    setIsPopoverClosing(true);
  };

  const resetPopover = () => {
    flatListRef.current?.scrollToOffset({
      offset: previousScrollOffsetRef.current,
      animated: true,
    });

    updateActiveActionKey(null);
    updatePopover(null);

    setCurrentPopoverType(null);
    setIsPopoverClosing(false);

    pendingMeasureRef.current = null;

    updateActionSpaceVisible(false);

    // existe outro popover aguardando?
    if (pendingOpenRef.current) {
      const next = pendingOpenRef.current;

      pendingOpenRef.current = null;

      requestAnimationFrame(() => {
        openPopover(
          next.actionData,
          next.measureButtonNativeFn,
          next.type,
        );
      });

      return;
    }

    skipCloseAnimationRef.current = false;
  };

  const openPopover = (
    actionData,
    measureButtonNativeFn,
    type = 'action',
  ) => {
    const isSameItem =
      activeActionKeyRef.current === actionData.key &&
      popoverRef.current?.type === type;

    // clicou novamente no mesmo item
    if (isSameItem) {
      skipCloseAnimationRef.current = false;
      closeActions();
      return;
    }

    // existe um popover aberto → troca
    if (popoverRef.current && !isPopoverClosing) {
      skipCloseAnimationRef.current = true;

      pendingOpenRef.current = {
        actionData,
        measureButtonNativeFn,
        type,
      };

      closeActions();
      return;
    }

    previousScrollOffsetRef.current =
      scrollOffsetRef.current;

    pendingMeasureRef.current = null;

    updateActiveActionKey(actionData.key);

    setCurrentPopoverType(type);
    setIsPopoverClosing(false);

    if (!actionSpaceVisibleRef.current) {
      updateActionSpaceVisible(true);

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
    activeActionKey,
    popover,
    actionSpaceVisible,
    isPopoverClosing,
    currentPopoverType,

    // usado pelo ActionPopover para saber
    // quando deve ignorar a animação de fechamento
    skipCloseAnimation:
      skipCloseAnimationRef.current,

    closeActions,
    resetPopover,

    handleOpenActions,
    handleOpenLockedActions,
  };
}