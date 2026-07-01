// src/screens/home/hooks/useHomeController.js

import useHomeLayoutMetrics from './useHomeLayoutMetrics';
import useHomeData from './useHomeData';
import useUnlockAnimationFlow from './useUnlockAnimationFlow';
import useHomeModals from './useHomeModals';
import useHomeActivityResult from './useHomeActivityResult';
import useHomeAutoScroll from './useHomeAutoScroll';

function useHomeController({
  route,
  navigation,
  user,
  flatListRef,
}) {
  /**
   * Dados da Home
   */
  const homeData = useHomeData(user);

  /**
   * Layout
   */
  const layoutMetrics = useHomeLayoutMetrics();

  /**
   * Fluxo de desbloqueio
   */
  const unlockFlow = useUnlockAnimationFlow(
    homeData.feeds,
  );

  /**
   * Modais
   */
  const modals = useHomeModals({
    playQueuedUnlockAnimation:
      unlockFlow.playQueuedUnlockAnimation,
  });

  /**
   * Trata o retorno das atividades
   */
  useHomeActivityResult({
    route,
    navigation,
    currentUser: user,

    feeds: homeData.feeds,

    progressLevel:
      homeData.progressLevel,

    setProgressLevel:
      homeData.setProgressLevel,

    triggerUnlockAnimation:
      unlockFlow.triggerUnlockAnimation,

    setPendingUnlockProgressLevel:
      unlockFlow.setPendingUnlockProgressLevel,

    setQueuedUnlockProgressLevel:
      unlockFlow.setQueuedUnlockProgressLevel,

    setBonusReward:
      modals.setBonusReward,

    setBonusModalVisible:
      modals.setBonusModalVisible,

    setEloReward:
      modals.setEloReward,

    setEloModalVisible:
      modals.setEloModalVisible,
  });

  /**
   * Scroll automático
   */
  useHomeAutoScroll({
    flatListRef,

    feeds: homeData.feeds,

    isLoadingFeeds:
      homeData.isLoadingFeeds,

    progressLevel:
      homeData.progressLevel,
  });

  return {
    // Layout
    ...layoutMetrics,

    // Dados
    ...homeData,

    // Unlock
    ...unlockFlow,

    // Modais
    ...modals,
  };
}

export default useHomeController;