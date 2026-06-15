import React, { useRef, useState } from 'react';
import {
  Dimensions,
  FlatList,
  View,
} from 'react-native';
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

import LockedModal from '../../components/modal/LockedModal';
import BonusLifeModal from '../../components/modal/BonusLifeModal';
import EloUpModal from '../../components/modal/EloUpModal';

const { height: screenHeight, width: screenWidth } = Dimensions.get('window');

const EXTRA_ACTION_SPACE = 150;
const TARGET_CENTER_Y = screenHeight * 0.4;
const POPOVER_WIDTH = 280;

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
  const currentUser = user;

  const flatListRef = useRef(null);
  const scrollOffsetRef = useRef(0);
  const pendingMeasureRef = useRef(null);
  const lastPopoverLayoutRef = useRef(null);
  const pendingActionRef = useRef(null);

  const [activeActionKey, setActiveActionKey] = useState(null);
  const [renderPopover, setRenderPopover] = useState(null);
  const [actionSpaceVisible, setActionSpaceVisible] = useState(false);
  const [isPopoverClosing, setIsPopoverClosing] = useState(false);

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

  const isLessonBlocked = lessonNumber =>
    checkIsLessonBlocked(feeds, lessonNumber, progressLevel);

  const isItemActive = (lesson, index) =>
    checkIsItemActive(feeds, lesson, index, progressLevel);

  const isOnlyLesson2Blocked = feeds.length === 2 && isLessonBlocked('2');

  const closeActions = () => {
    if (renderPopover && !isPopoverClosing) {
      lastPopoverLayoutRef.current = renderPopover;
      setIsPopoverClosing(true);
    }
  };

  const handlePopoverAnimationEnd = () => {
    setActiveActionKey(null);
    setRenderPopover(null);
    setActionSpaceVisible(false);
    setIsPopoverClosing(false);

    pendingMeasureRef.current = null;
    lastPopoverLayoutRef.current = null;
    pendingActionRef.current = null;
  };

  const measureAndShowPopover = (actionData, measureFn) => {
    measureFn((fx, fy, width, measuredHeight, px, py) => {
      const isLeftSide = actionData.index % 2 === 0;
      const pointerLeft = isLeftSide ? 58 : 198;
      const fixedTopPosition = py + measuredHeight + 10;

      const popoverLayout = {
        top: fixedTopPosition,
        pointerLeft,
        itemData: actionData,
      };

      lastPopoverLayoutRef.current = popoverLayout;

      setIsPopoverClosing(false);
      setRenderPopover(popoverLayout);
    });
  };

  const openActionsAfterSpaceReady = (actionData, measureButtonNativeFn) => {
    const currentOffset = scrollOffsetRef.current;
    const originalAnchorY = actionData.anchor?.pageY ?? TARGET_CENTER_Y;

    const scrollDelta = originalAnchorY - TARGET_CENTER_Y;
    let targetOffset = currentOffset + scrollDelta;

    if (targetOffset <= 0) {
      targetOffset = 0;

      if (currentOffset === 0) {
        measureAndShowPopover(actionData, measureButtonNativeFn);
        return;
      }
    }

    if (Math.abs(scrollDelta) < 5) {
      measureAndShowPopover(actionData, measureButtonNativeFn);
      return;
    }

    pendingMeasureRef.current = () =>
      measureAndShowPopover(actionData, measureButtonNativeFn);

    flatListRef.current?.scrollToOffset({
      offset: targetOffset,
      animated: true,
    });
  };

  const handleOpenActions = (actionData, measureButtonNativeFn) => {
    const isSameItem = activeActionKey === actionData.key;

    if (isSameItem) {
      closeActions();
      return;
    }

    pendingMeasureRef.current = null;

    setRenderPopover(null);
    setIsPopoverClosing(false);
    setActiveActionKey(actionData.key);

    pendingActionRef.current = {
      actionData,
      measureButtonNativeFn,
    };

    setActionSpaceVisible(true);

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const pendingAction = pendingActionRef.current;

        if (!pendingAction) return;

        pendingActionRef.current = null;

        openActionsAfterSpaceReady(
          pendingAction.actionData,
          pendingAction.measureButtonNativeFn,
        );
      });
    });
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

  const popoverLayout = renderPopover ?? lastPopoverLayoutRef.current;

  if (isLoadingFeeds) {
    return <BatutaLoader text="Carregando lições..." />;
  }

  return (
    <HomeContainer>
      <View
        style={{ flex: 1 }}
        onTouchStart={() => {
          closeActions();
        }}
      >
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
              onOpenActions={handleOpenActions}
            />
          )}
          showsVerticalScrollIndicator={false}
          scrollEnabled={!isOnlyLesson2Blocked}
          scrollEventThrottle={16}
          onScroll={event => {
            scrollOffsetRef.current = event.nativeEvent.contentOffset.y;
          }}
          onScrollBeginDrag={closeActions}
          onMomentumScrollEnd={handleScrollEnd}
          onScrollAnimationEnd={handleScrollEnd}
          contentContainerStyle={{
            paddingBottom: actionSpaceVisible ? EXTRA_ACTION_SPACE : 35,
          }}
        />
      </View>

      {(renderPopover !== null || isPopoverClosing) && popoverLayout && (
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
            pointerStyle={{
              left: popoverLayout.pointerLeft,
              top: -10,
            }}
            isClosing={isPopoverClosing}
            onAnimationEnd={handlePopoverAnimationEnd}
            onPressContent={() => handleNavigateContent(popoverLayout.itemData)}
            onPressPractice={() => handleNavigatePractice(popoverLayout.itemData)}
          />
        </View>
      )}

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