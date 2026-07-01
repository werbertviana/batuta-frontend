// src/screens/home/hooks/useHomeModalController.js

function useHomeModalController({
  bonusModalVisible,
  bonusReward,
  handleCloseBonusModal,

  eloModalVisible,
  eloReward,
  handleCloseEloModal,
}) {
  return {
    bonusModal: {
      visible: bonusModalVisible,
      onClose: handleCloseBonusModal,
      bonusVidaGanha:
        bonusReward.bonusVidaGanha,
      bonusXpGanho:
        bonusReward.bonusXpGanho,
    },

    eloModal: {
      visible: eloModalVisible,
      onClose: handleCloseEloModal,
      eloAnterior:
        eloReward.eloAnterior,
      eloAtual:
        eloReward.eloAtual,
    },
  };
}

export default useHomeModalController;