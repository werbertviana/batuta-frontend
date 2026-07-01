// src/screens/home/hooks/useHomeScrollController.js

function useHomeScrollController({
  actionSpaceVisible,
  currentPopoverType,
  pendingMeasureRef,
}) {
  const getExtraBottomSpace = () => {
    if (!actionSpaceVisible) {
      return 35;
    }

    return currentPopoverType === 'locked'
      ? 160
      : 150;
  };

  const handleScrollEnd = () => {
    if (pendingMeasureRef.current) {
      pendingMeasureRef.current();
      pendingMeasureRef.current = null;
    }
  };

  return {
    getExtraBottomSpace,
    handleScrollEnd,
  };
}

export default useHomeScrollController;