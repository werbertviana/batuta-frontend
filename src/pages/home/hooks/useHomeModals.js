// src/screens/home/hooks/useHomeModals.js

import { useState } from 'react';

export default function useHomeModals({ playQueuedUnlockAnimation }) {
  const [bonusModalVisible, setBonusModalVisible] = useState(false);
  const [bonusReward, setBonusReward] = useState({
    bonusVidaGanha: false,
    bonusXpGanho: false,
  });

  const [eloModalVisible, setEloModalVisible] = useState(false);
  const [eloReward, setEloReward] = useState({
    eloAnterior: null,
    eloAtual: null,
  });

  const handleCloseBonusModal = () => {
    setBonusModalVisible(false);
    setBonusReward({
      bonusVidaGanha: false,
      bonusXpGanho: false,
    });

    if (eloReward?.eloAnterior && eloReward?.eloAtual) {
      setEloModalVisible(true);
      return;
    }

    playQueuedUnlockAnimation();
  };

  const handleCloseEloModal = () => {
    setEloModalVisible(false);
    setEloReward({
      eloAnterior: null,
      eloAtual: null,
    });

    playQueuedUnlockAnimation();
  };

  return {
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
  };
}