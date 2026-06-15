// src/screens/home/Home.js

import React, { useEffect, useRef, useState } from 'react';
import { Dimensions, FlatList, View, TouchableWithoutFeedback } from 'react-native';
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

const EXTRA_ACTION_SPACE = 280; 
const TARGET_CENTER_Y = screenHeight * 0.40; // Ponto ideal para alinhar o topo do item focado
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

  const [activeActionKey, setActiveActionKey] = useState(null);
  const [renderPopover, setRenderPopover] = useState(null);
  const [actionSpaceVisible, setActionSpaceVisible] = useState(false);
  
  // Guarda a função que mede o botão para ser executada após o scroll parar
  const pendingMeasureRef = useRef(null);

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
    setActiveActionKey(null);
    setRenderPopover(null);
    setActionSpaceVisible(false);
    pendingMeasureRef.current = null;
  };

  // Mede e renderiza o card exatamente onde o botão se encontra
  const measureAndShowPopover = (actionData, measureFn) => {
    measureFn((fx, fy, width, height, px, py) => {
      const isLeftSide = actionData.index % 2 === 0;
      
      // Ajusta a setinha de acordo com o lado do item
      const pointerLeft = isLeftSide ? 58 : 198; 
      
      // Posição padrão fixa: 10 pixels cravados abaixo do botão
      const fixedTopPosition = py + height + 10;

      setRenderPopover({
        top: fixedTopPosition,
        pointerLeft,
        itemData: actionData,
      });
    });
  };

  const handleOpenActions = (actionData, measureButtonNativeFn) => {
    if (activeActionKey === actionData.key) {
      closeActions();
      return;
    }

    setRenderPopover(null);
    setActiveActionKey(actionData.key);
    setActionSpaceVisible(true);

    const currentOffset = scrollOffsetRef.current;
    const originalAnchorY = actionData.anchor?.pageY ?? TARGET_CENTER_Y;

    // Calcula a distância do scroll para alinhar o item na tela
    const scrollDelta = originalAnchorY - TARGET_CENTER_Y;
    let targetOffset = currentOffset + scrollDelta;

    // INTERCEPTAÇÃO: Se o destino for o topo da lista (ou menor), ela não vai conseguir rolar
    if (targetOffset <= 0) {
      targetOffset = 0;
      
      // Se a lista já está estacionada no topo (0px), abre o card na hora!
      if (currentOffset === 0) {
        pendingMeasureRef.current = null;
        measureAndShowPopover(actionData, measureButtonNativeFn);
        return;
      }
    }

    // Se o movimento for insignificante (menos de 5px), também abre direto
    if (Math.abs(scrollDelta) < 5) {
      pendingMeasureRef.current = null;
      measureAndShowPopover(actionData, measureButtonNativeFn);
      return;
    }

    // Caso precise rolar, agendamos para executar no fim do scroll estável
    pendingMeasureRef.current = () => measureAndShowPopover(actionData, measureButtonNativeFn);

    flatListRef.current?.scrollToOffset({
      offset: targetOffset,
      animated: true,
    });
  };

  // Disparado de forma assíncrona/nativa quando as animações de scroll param completamente
  const handleScrollEnd = () => {
    if (pendingMeasureRef.current) {
      pendingMeasureRef.current();
      pendingMeasureRef.current = null;
    }
  };

  const resetActionState = () => {
    closeActions();
  };

  const handleNavigateContent = (itemData) => {
    if (!itemData) return;
    const contentKey = String(itemData.content ?? '');
    const routeName = contentRouteMap[contentKey] || itemData.title;

    resetActionState();
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

  const handleNavigatePractice = (itemData) => {
    if (!itemData) return;
    const routeName = itemData.practiceRoute || practiceRouteMap[itemData.title];

    resetActionState();
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

  if (isLoadingFeeds) {
    return <BatutaLoader text="Carregando lições..." />;
  }

  return (
    <HomeContainer>
      <TouchableWithoutFeedback onPress={closeActions}>
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
              paddingBottom: actionSpaceVisible ? EXTRA_ACTION_SPACE : 40,
            }}
          />
        </View>
      </TouchableWithoutFeedback>

      {/* Camada global absoluta de primeiro plano real */}
      {renderPopover && (
        <View
          style={{
            position: 'absolute',
            top: renderPopover.top,
            left: (screenWidth - POPOVER_WIDTH) / 2, 
            width: POPOVER_WIDTH,
            zIndex: 99999,
            elevation: 20,
          }}
        >
          <ActionPopover
            pointerStyle={{ left: renderPopover.pointerLeft, top: -10 }}
            onPressContent={() => handleNavigateContent(renderPopover.itemData)}
            onPressPractice={() => handleNavigatePractice(renderPopover.itemData)}
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