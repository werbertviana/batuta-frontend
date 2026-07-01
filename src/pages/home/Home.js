// src/screens/home/Home.js

import React from 'react';
import { Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { useAuth } from '../../contexts/AuthContext';

import { HomeContainer } from './HomeStyles';

import useHomeRefs from './hooks/useHomeRefs';
import usePopoverController from './hooks/usePopoverController';
import useHomeNavigation from './hooks/useHomeNavigation';
import useHomeScrollController from './hooks/useHomeScrollController';
import useHomeController from './hooks/useHomeController';
import useLessonController from './hooks/useLessonController';
import useHomeFeedController from './hooks/useHomeFeedController';
import useHomePopoverController from './hooks/useHomePopoverController';

import HomeFeed from './components/HomeFeed';
import HomePopover from './components/HomePopover';

import BatutaLoader from '../../components/loader/BatutaLoader';

import { getLessonIcon } from './helpers/homeLessonAssets';

import HomeModals from './components/HomeModals';

import useHomeModalController from './hooks/useHomeModalController';

const { height: screenHeight } = Dimensions.get('window');

const EXTRA_ACTION_SPACE = 150;
const EXTRA_LOCKED_SPACE = 160;

const TARGET_CENTER_Y = screenHeight * 0.4;
const POPOVER_WIDTH = 280;
const POPOVER_TOP_GAP = 10;
const LOCKED_LESSON_TOP_OFFSET = -100;

function Home({ route }) {
  const navigation = useNavigation();

  const { user, hasSeenTutorial } = useAuth();

  const {
    flatListRef,
    scrollOffsetRef,
    previousScrollOffsetRef,
    pendingMeasureRef,
    isPressingItemRef,
  } = useHomeRefs();

  const {
    activeActionKey,
    popover,
    actionSpaceVisible,
    isPopoverClosing,
    currentPopoverType,
    closeActions,
    handlePopoverAnimationEnd,
    getPointerTop,
    openPopover,
  } = usePopoverController({
    flatListRef,
    scrollOffsetRef,
    previousScrollOffsetRef,
    pendingMeasureRef,
    TARGET_CENTER_Y,
    POPOVER_TOP_GAP,
    LOCKED_LESSON_TOP_OFFSET,
  });

  const {
    handleNavigateContent,
    handleNavigatePractice,
  } = useHomeNavigation({
    navigation,
    hasSeenTutorial,
    handlePopoverAnimationEnd,
  });

  const {
    getExtraBottomSpace,
    handleScrollEnd,
  } = useHomeScrollController({
    actionSpaceVisible,
    currentPopoverType,
    pendingMeasureRef,
    extraActionSpace: EXTRA_ACTION_SPACE,
    extraLockedSpace: EXTRA_LOCKED_SPACE,
  });

  const {
    // Layout
    height,
    unlockGlowSize,
    compactLesson1IconWidth,
    compactLesson1IconHeight,
    compactLesson1BoardHeight,
    lockedCardWidth,
    lockedCardHeight,
    lockedCardMarginBottom,

    // Dados
    feeds,
    isLoadingFeeds,
    progressLevel,
    setProgressLevel,
    life,
    batutaPoints,
    xpPoints,

    // Unlock
    recentlyUnlockedKey,
    clearUnlockAnimation,
    // Modais
    bonusModalVisible,
    bonusReward,
    eloModalVisible,
    eloReward,
    handleCloseBonusModal,
    handleCloseEloModal,
  } = useHomeController({
    route,
    navigation,
    user,
    flatListRef,
  });

  const {
    isLessonBlocked,
    isItemActive,
    isOnlyLesson2Blocked,
    handleOpenActions,
    handleOpenLockedActions,
  } = useLessonController({
    feeds,
    progressLevel,
    openPopover,
  });

  const feed = useHomeFeedController({
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
  });

  const popoverController = useHomePopoverController({
    popover,
    isPopoverClosing,
    getPointerTop,
    handlePopoverAnimationEnd,
    handleNavigateContent,
    handleNavigatePractice,
    popoverWidth: POPOVER_WIDTH,
  });

  const modals = useHomeModalController({
  bonusModalVisible,
  bonusReward,
  handleCloseBonusModal,

  eloModalVisible,
  eloReward,
  handleCloseEloModal,
});

  if (isLoadingFeeds) {
    return (
      <BatutaLoader text="Carregando lições..." />
    );
  }

  return (
    <HomeContainer
      onTouchStart={() => {
        if (isPressingItemRef.current) {
          return;
        }

        if (popover && !isPopoverClosing) {
          closeActions();
        }
      }}
    >
      <HomeFeed {...feed} />

      <HomePopover {...popoverController} />

    <HomeModals
      {...modals}
    />
    </HomeContainer>
  );
}

export default Home;