// src/screens/home/Home.js

import React, { useRef } from 'react';
import { FlatList } from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigation } from '@react-navigation/native';

import Header from '../../components/header/Header';
import BatutaLoader from '../../components/loader/BatutaLoader';

import { HomeContainer } from './HomeStyles';

import LessonBlock from './components/LessonBlock';
import useHomeData from './hooks/useHomeData';
import useHomeActivityResult from './hooks/useHomeActivityResult';
import useHomeAutoScroll from './hooks/useHomeAutoScroll';
import useUnlockAnimationFlow from './hooks/useUnlockAnimationFlow';
import useHomeLayoutMetrics from './hooks/useHomeLayoutMetrics';
import useHomeModals from './hooks/useHomeModals';

import { getLessonIcon } from './helpers/homeLessonAssets';

import {
  isItemActive as checkIsItemActive,
  isLessonBlocked as checkIsLessonBlocked,
} from './helpers/homeProgressHelpers';

import LockedModal from '../../components/modal/LockedModal';
import BonusLifeModal from '../../components/modal/BonusLifeModal';
import EloUpModal from '../../components/modal/EloUpModal';

function Home({ route }) {
  const navigation = useNavigation();
  const { user } = useAuth();
  const currentUser = user;

  const flatListRef = useRef(null);

  const {
    height,
    unlockGlowSize,
    compactLesson1IconWidth,
    compactLesson1IconHeight,
    compactLesson1BoardHeight,
    lockedLessonIconWidth,
    lockedLessonIconHeight,
    lockedCardWidth,
    lockedCardHeight,
    lockedCardMarginBottom,
  } = useHomeLayoutMetrics();

  const {
    feeds,
    isLoadingFeeds,
    progressLevel,
    setProgressLevel,
    life,
    batutaPoints,
    xpPoints,
  } = useHomeData(currentUser);

  const {
    recentlyUnlockedKey,
    triggerUnlockAnimation,
    playQueuedUnlockAnimation,
    clearUnlockAnimation,
    setPendingUnlockProgressLevel,
    setQueuedUnlockProgressLevel,
  } = useUnlockAnimationFlow(feeds);

  const {
    lockedLessonInfo,
    bonusModalVisible,
    bonusReward,
    eloModalVisible,
    eloReward,
    setBonusReward,
    setBonusModalVisible,
    setEloReward,
    setEloModalVisible,
    handleOpenLockedLesson,
    handleCloseLockedLesson,
    handleCloseBonusModal,
    handleCloseEloModal,
    lockedLessonMessage,
  } = useHomeModals({
    playQueuedUnlockAnimation,
  });

  useHomeActivityResult({
    route,
    navigation,
    currentUser,
    feeds,
    progressLevel,
    setProgressLevel,
    triggerUnlockAnimation,
    setPendingUnlockProgressLevel,
    setQueuedUnlockProgressLevel,
    setBonusReward,
    setBonusModalVisible,
    setEloReward,
    setEloModalVisible,
  });

  useHomeAutoScroll({
    flatListRef,
    feeds,
    isLoadingFeeds,
    progressLevel,
  });

  const isLessonBlocked = (lessonNumber) =>
    checkIsLessonBlocked(feeds, lessonNumber, progressLevel);

  const isItemActive = (lesson, index) =>
    checkIsItemActive(feeds, lesson, index, progressLevel);

  const isOnlyLesson2Blocked = feeds.length === 2 && isLessonBlocked('2');

  if (isLoadingFeeds) {
    return <BatutaLoader text="Carregando lições..." />;
  }

  return (
    <HomeContainer>
      <Header
        xpPoints={xpPoints}
        batutaPoints={batutaPoints}
        lifePoints={life}
      />

      <FlatList
        ref={flatListRef}
        data={feeds}
        keyExtractor={(lesson) => String(lesson.lesson)}
        renderItem={({ item }) => (
          <LessonBlock
            lesson={item}
            isBlocked={isLessonBlocked(item.lesson)}
            isOnlyLesson2Blocked={isOnlyLesson2Blocked}
            height={height}
            compactLesson1IconWidth={compactLesson1IconWidth}
            compactLesson1IconHeight={compactLesson1IconHeight}
            compactLesson1BoardHeight={compactLesson1BoardHeight}
            lockedLessonIconWidth={lockedLessonIconWidth}
            lockedLessonIconHeight={lockedLessonIconHeight}
            lockedCardWidth={lockedCardWidth}
            lockedCardHeight={lockedCardHeight}
            lockedCardMarginBottom={lockedCardMarginBottom}
            recentlyUnlockedKey={recentlyUnlockedKey}
            unlockGlowSize={unlockGlowSize}
            getLessonIcon={getLessonIcon}
            isItemActive={isItemActive}
            onOpenLockedLesson={handleOpenLockedLesson}
            onClearUnlockAnimation={clearUnlockAnimation}
          />
        )}
        showsVerticalScrollIndicator={false}
        scrollEnabled={!isOnlyLesson2Blocked}
        onScrollToIndexFailed={(info) => {
          setTimeout(() => {
            flatListRef.current?.scrollToIndex({
              index: info.index,
              animated: true,
              viewPosition: 0.08,
            });
          }, 500);
        }}
        contentContainerStyle={{
          paddingBottom: isOnlyLesson2Blocked ? 20 : 40,
        }}
      />

      <LockedModal
        visible={lockedLessonInfo.visible}
        onClose={handleCloseLockedLesson}
        title="Lição bloqueada"
        message={lockedLessonMessage}
      />

      <BonusLifeModal
        visible={bonusModalVisible}
        onClose={handleCloseBonusModal}
        bonusVidaGanha={bonusReward.bonusVidaGanha}
        bonusXpGanho={bonusReward.bonusXpGanho}
      />

      <EloUpModal
        visible={eloModalVisible}
        onClose={handleCloseEloModal}
        eloAnterior={eloReward.eloAnterior}
        eloAtual={eloReward.eloAtual}
      />
    </HomeContainer>
  );
}

export default Home;