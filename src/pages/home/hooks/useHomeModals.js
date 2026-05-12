// src/screens/home/hooks/useHomeModals.js

import { useState } from 'react';

export default function useHomeModals({ playQueuedUnlockAnimation }) {
  const [lockedLessonInfo, setLockedLessonInfo] = useState({
    visible: false,
    lessonNumber: null,
  });

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

  const handleOpenLockedLesson = (lessonNumber) => {
    setLockedLessonInfo({
      visible: true,
      lessonNumber,
    });
  };

  const handleCloseLockedLesson = () => {
    setLockedLessonInfo({
      visible: false,
      lessonNumber: null,
    });
  };

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

  const lockedLessonNumber = Number(lockedLessonInfo.lessonNumber);

  const previousLessonNumber =
    lockedLessonNumber > 1 ? lockedLessonNumber - 1 : null;

  const lockedLessonMessage = previousLessonNumber
    ? `Complete a Lição ${String(previousLessonNumber).padStart(
        2,
        '0',
      )} para \n desbloquear esta lição.`
    : 'Complete a lição anterior para desbloquear esta lição.';

  return {
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
  };
}