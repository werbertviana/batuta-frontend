// src/screens/home/hooks/useHomePopoverView.js

function useHomePopoverController({
  popover,
  isPopoverClosing,
  getPointerTop,
  handlePopoverAnimationEnd,
  handleNavigateContent,
  handleNavigatePractice,
  popoverWidth,
}) {
  return {
    popover,
    isPopoverClosing,
    getPointerTop,
    handlePopoverAnimationEnd,
    onPressContent: handleNavigateContent,
    onPressPractice: handleNavigatePractice,
    POPOVER_WIDTH: popoverWidth,
  };
}

export default useHomePopoverController;