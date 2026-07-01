// src/screens/home/Home.js

import React, { useRef, useState } from 'react';
import { Dimensions, FlatList, View } from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigation } from '@react-navigation/native';

import Header from '../../components/header/Header';
import BatutaLoader from '../../components/loader/BatutaLoader';
import ActionPopover from '../../components/actionPopover/ActionPopover';

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

import BonusLifeModal from '../../components/modal/BonusLifeModal';
import EloUpModal from '../../components/modal/EloUpModal';

const { height: screenHeight, width: screenWidth } = Dimensions.get('window');

const EXTRA_ACTION_SPACE = 150;
const EXTRA_LOCKED_SPACE = 160;

const TARGET_CENTER_Y = screenHeight * 0.4;
const POPOVER_WIDTH = 280;
const POPOVER_TOP_GAP = 10;

const LOCKED_LESSON_TOP_OFFSET = -100;

const contentRouteMap = {
  '1': 'Introdução',
  '2': 'Pauta Musical',
  '3': 'Clave Musical',
  '4': 'Notas Musicais',
  '5': 'Figuras de Notas',
  '6': 'Figuras de Pausas',
  '7': 'Duração dos Valores',
  '8': 'Compasso Musical',
};

const practiceRouteMap = {
  Introdução: 'AtivIntro',
  'Pauta Musical': 'AtivPauta',
  'Clave Musical': 'AtivClave',
  'Notas Musicais': 'AtivNotas',
  'Figuras de Notas': 'AtivFigNotas',
  'Figuras de Pausas': 'AtivFigPausas',
  'Duração dos Valores': 'AtivDuracao',
  'Compasso Musical': 'AtivCompasso',
};

function Home({ route }) {
  const navigation = useNavigation();
  const { user, hasSeenTutorial } = useAuth();

  const flatListRef = useRef(null);
  const scrollOffsetRef = useRef(0);
  const previousScrollOffsetRef = useRef(0);
  const pendingMeasureRef = useRef(null);
  const isPressingItemRef = useRef(false);

  const [activeActionKey, setActiveActionKey] = useState(null);
  const [popover, setPopover] = useState(null);
  const [actionSpaceVisible, setActionSpaceVisible] = useState(false);
  const [isPopoverClosing, setIsPopoverClosing] = useState(false);
  const [currentPopoverType, setCurrentPopoverType] = useState(null);

  const layoutMetrics = useHomeLayoutMetrics();

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
  } = layoutMetrics;

  const {
    feeds,
    isLoadingFeeds,
    progressLevel,
    setProgressLevel,
    life,
    batutaPoints,
    xpPoints,
  } = useHomeData(user);

  const {
    recentlyUnlockedKey,
    triggerUnlockAnimation,
    playQueuedUnlockAnimation,
    clearUnlockAnimation,
    setPendingUnlockProgressLevel,
    setQueuedUnlockProgressLevel,
  } = useUnlockAnimationFlow(feeds);

  const {
    bonusModalVisible,
    bonusReward,
    eloModalVisible,
    eloReward,
    setBonusReward,
    setBonusModalVisible,
    setEloReward,
    setEloModalVisible,
    handleCloseBonusModal,
    handleCloseEloModal,
  } = useHomeModals({
    playQueuedUnlockAnimation,
  });

  useHomeActivityResult({
    route,
    navigation,
    currentUser: user,
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

  const isLessonBlocked = lessonNumber =>
    checkIsLessonBlocked(feeds, lessonNumber, progressLevel);

  const isItemActive = (lesson, index) =>
    checkIsItemActive(feeds, lesson, index, progressLevel);

  const isOnlyLesson2Blocked = feeds.length === 2 && isLessonBlocked('2');

  const isLockedLessonAction = (actionData, type) =>
    type === 'locked' && actionData?.lockedKind === 'lesson';

  const getPointerTop = type => (type === 'locked' ? -12 : -10);

  const getExtraBottomSpace = () => {
    if (!actionSpaceVisible) {
      return 35;
    }

    return currentPopoverType === 'locked'
      ? EXTRA_LOCKED_SPACE
      : EXTRA_ACTION_SPACE;
  };

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

  const measureAndShowPopover = (actionData, measureFn, type = 'action') => {
    measureFn((fx, fy, width, measuredHeight, px, py) => {
      const pointerLeft = getPointerLeft(actionData);
      const isLockedLesson = isLockedLessonAction(actionData, type);

      const anchorHeight = isLockedLesson
        ? actionData.anchor?.visualHeight ?? measuredHeight
        : measuredHeight;

      const fixedTopPosition =
        py +
        anchorHeight +
        POPOVER_TOP_GAP +
        (isLockedLesson ? LOCKED_LESSON_TOP_OFFSET : 0);

      const popoverLayout = {
        type,
        top: fixedTopPosition,
        pointerLeft,
        itemData: actionData,
      };

      setIsPopoverClosing(false);
      setCurrentPopoverType(type);
      setPopover(popoverLayout);
    });
  };

  const openPopoverAfterSpaceReady = (
    actionData,
    measureButtonNativeFn,
    type = 'action',
  ) => {
    const currentOffset = scrollOffsetRef.current;
    const originalAnchorY = actionData.anchor?.pageY ?? TARGET_CENTER_Y;

    const scrollDelta = originalAnchorY - TARGET_CENTER_Y;
    let targetOffset = currentOffset + scrollDelta;

    if (targetOffset <= 0) {
      targetOffset = 0;

      if (currentOffset === 0) {
        measureAndShowPopover(actionData, measureButtonNativeFn, type);
        return;
      }
    }

    if (Math.abs(scrollDelta) < 5) {
      measureAndShowPopover(actionData, measureButtonNativeFn, type);
      return;
    }

    pendingMeasureRef.current = () =>
      measureAndShowPopover(actionData, measureButtonNativeFn, type);

    flatListRef.current?.scrollToOffset({
      offset: targetOffset,
      animated: true,
    });
  };

  const openPopover = (actionData, measureButtonNativeFn, type = 'action') => {

  const isSameItem =
    activeActionKey === actionData.key &&
    popover?.type === type;

  // Mesmo item -> fecha
  if (isSameItem) {
    closeActions();
    return;
  }

  previousScrollOffsetRef.current = scrollOffsetRef.current;

  pendingMeasureRef.current = null;

  setActiveActionKey(actionData.key);
  setCurrentPopoverType(type);
  setIsPopoverClosing(false);

  // Primeira abertura
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

  // Já existe um popover aberto:
  // apenas atualiza o conteúdo
  openPopoverAfterSpaceReady(
    actionData,
    measureButtonNativeFn,
    type,
  );
};

  const handleOpenActions = (actionData, measureButtonNativeFn) => {
    openPopover(actionData, measureButtonNativeFn, 'action');
  };

  const handleOpenLockedActions = (actionData, measureButtonNativeFn) => {
    openPopover(actionData, measureButtonNativeFn, 'locked');
  };

  const handleScrollEnd = () => {
    if (pendingMeasureRef.current) {
      pendingMeasureRef.current();
      pendingMeasureRef.current = null;
    }
  };

  const handleNavigateContent = itemData => {
    if (!itemData) return;

    const contentKey = String(itemData.content ?? '');
    const routeName = contentRouteMap[contentKey] || itemData.title;

    handlePopoverAnimationEnd();

    if (!routeName) return;

    if (!hasSeenTutorial('content')) {
      navigation.navigate('Tutorial', {
        tutorialKey: 'content',
        returnTo: routeName,
        returnParams: { content: contentKey },
        resetAfterFinish: false,
      });
      return;
    }

    navigation.navigate(routeName, { content: contentKey });
  };

  const handleNavigatePractice = itemData => {
    if (!itemData) return;

    const routeName = itemData.practiceRoute || practiceRouteMap[itemData.title];

    handlePopoverAnimationEnd();

    if (!routeName) return;

    if (!hasSeenTutorial('activity')) {
      navigation.navigate('Tutorial', {
        tutorialKey: 'activity',
        returnTo: routeName,
        resetAfterFinish: false,
      });
      return;
    }

    navigation.navigate(routeName);
  };

  const popoverLayout = popover;
  if (isLoadingFeeds) {
    return <BatutaLoader text="Carregando lições..." />;
  }

  return (
<HomeContainer
  onTouchStart={() => {
    // O toque veio de um botão da lição.
    // Não fecha o popover.
    if (isPressingItemRef.current) {
      return;
    }

    // Toque fora de qualquer botão.
    if (popover && !isPopoverClosing) {
      closeActions();
    }
  }}
>
      <View style={{ flex: 1 }}>
        <Header
          xpPoints={xpPoints}
          batutaPoints={batutaPoints}
          lifePoints={life}
        />

        <FlatList
          ref={flatListRef}
          data={feeds}
          keyExtractor={lesson => String(lesson.lesson)}
          renderItem={({ item }) => (
            <LessonBlock
              lesson={item}
              isBlocked={isLessonBlocked(item.lesson)}
              isOnlyLesson2Blocked={isOnlyLesson2Blocked}
              height={height}
              compactLesson1IconWidth={compactLesson1IconWidth}
              compactLesson1IconHeight={compactLesson1IconHeight}
              compactLesson1BoardHeight={compactLesson1BoardHeight}
              lockedCardWidth={lockedCardWidth}
              lockedCardHeight={lockedCardHeight}
              lockedCardMarginBottom={lockedCardMarginBottom}
              activeActionKey={activeActionKey}
              recentlyUnlockedKey={recentlyUnlockedKey}
              unlockGlowSize={unlockGlowSize}
              getLessonIcon={getLessonIcon}
              isItemActive={isItemActive}
              onOpenLockedLesson={handleOpenLockedActions}
              onClearUnlockAnimation={clearUnlockAnimation}
              isPressingItemRef={isPressingItemRef}
              onOpenActions={handleOpenActions}
            />
          )}
          showsVerticalScrollIndicator={false}
          scrollEnabled
          scrollEventThrottle={16}
          onScroll={event => {
            scrollOffsetRef.current = event.nativeEvent.contentOffset.y;
          }}
          onScrollBeginDrag={closeActions}
          onMomentumScrollEnd={handleScrollEnd}
          onScrollAnimationEnd={handleScrollEnd}
          contentContainerStyle={{
            paddingBottom: getExtraBottomSpace(),
          }}
        />
      </View>

      {popoverLayout && (
        <View
          pointerEvents={isPopoverClosing ? 'none' : 'auto'}
          style={{
            position: 'absolute',
            top: popoverLayout.top,
            left: (screenWidth - POPOVER_WIDTH) / 2,
            width: POPOVER_WIDTH,
            zIndex: 99999,
            elevation: 20,
          }}
        >
          <ActionPopover
            variant={popoverLayout.type}
            title={popoverLayout.itemData?.title || 'Conteúdo bloqueado'}
            message={
              popoverLayout.itemData?.message ||
              'Complete a atividade anterior para desbloquear esse aqui!'
            }
            pointerStyle={{
              left: popoverLayout.pointerLeft,
              top: getPointerTop(popoverLayout.type),
            }}
            isClosing={isPopoverClosing}
            onAnimationEnd={handlePopoverAnimationEnd}
            onPressContent={() => handleNavigateContent(popoverLayout.itemData)}
            onPressPractice={() => handleNavigatePractice(popoverLayout.itemData)}
          />
        </View>
      )}

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