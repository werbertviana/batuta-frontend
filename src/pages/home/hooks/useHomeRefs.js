import { useRef } from 'react';

function useHomeRefs() {
  const flatListRef = useRef(null);

  const scrollOffsetRef = useRef(0);

  const previousScrollOffsetRef = useRef(0);

  const pendingMeasureRef = useRef(null);

  const isPressingItemRef = useRef(false);

  return {
    flatListRef,

    scrollOffsetRef,

    previousScrollOffsetRef,

    pendingMeasureRef,

    isPressingItemRef,
  };
}

export default useHomeRefs;