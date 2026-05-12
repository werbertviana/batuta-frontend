// src/hooks/useActivityNavigationHandlers.js

export default function useActivityNavigationHandlers({
  navigation,
  headerRef,
  updateGameStats,
  resetarFlow,
  resetSession,
  restartActivity,
  setLifeModalVisible,
  resetSkipInfoSession,
}) {
  const buildExitRewardParams = () => ({
    resultadoAtividade: {
      reward: {
        aprovado: false,
        xpGanho: 0,
        bonusVidaGanha: false,
        bonusXpGanho: false,
      },
    },
  });

  const resetarAtividade = () => {
    resetSkipInfoSession();

    resetarFlow();
    resetSession();
  };

  const handleRecomecar = async () => {
    resetarAtividade();
    await restartActivity();
  };

  const handleLifeModalConfirm = async () => {
    setLifeModalVisible(false);

    headerRef.current?.resetLives?.();

    try {
      await updateGameStats({
        lifePoints: 2,
      });
    } catch (error) {
      console.log('[useActivityNavigationHandlers] Erro ao resetar vidas:', error);
    }

    resetarAtividade();
    await restartActivity();
  };

  const handleLifeModalExit = () => {
    setLifeModalVisible(false);

    navigation.navigate('Tab', {
      screen: 'Home',
      params: buildExitRewardParams(),
    });
  };

  const handleCloseActivity = () => {
    navigation.navigate('Tab', {
      screen: 'Home',
      params: buildExitRewardParams(),
    });
  };

  return {
    resetarAtividade,
    handleRecomecar,
    handleLifeModalConfirm,
    handleLifeModalExit,
    handleCloseActivity,
  };
}