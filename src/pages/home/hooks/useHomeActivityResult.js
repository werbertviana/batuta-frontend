// src/screens/home/hooks/useHomeActivityResult.js

import { useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';

export default function useHomeActivityResult({
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
}) {
  useFocusEffect(
    useCallback(() => {
      const processResultado = async () => {
        const resultado = route?.params?.resultadoAtividade;
        if (!resultado) return;

        const reward = resultado?.reward ?? resultado;
        const updatedUser = resultado?.user ?? null;

        const hasBonusLife = !!reward?.bonusVidaGanha;
        const hasBonusXp = !!reward?.bonusXpGanho;
        const hasEloUp = !!reward?.subiuElo;

        if (updatedUser?.gameStats) {
          const backendProgressLevel = Math.max(
            1,
            Number(updatedUser.gameStats.progressLevel ?? 1),
          );

          const progressLevelAnterior = Number(
            reward?.progressLevelAnterior ?? progressLevel,
          );

          const progressLevelAtual = Number(
            reward?.progressLevelAtual ?? backendProgressLevel,
          );

          const shouldAnimateUnlock =
            progressLevelAtual > progressLevelAnterior ||
            reward?.subiuProgressLevel === true;

          if (shouldAnimateUnlock) {
            const hasAnyRewardModal = hasBonusLife || hasBonusXp || hasEloUp;

            if (hasAnyRewardModal) {
              setQueuedUnlockProgressLevel(progressLevelAtual);
            } else if (feeds.length > 0) {
              triggerUnlockAnimation(progressLevelAtual);
            } else {
              setPendingUnlockProgressLevel(progressLevelAtual);
            }
          }

          setProgressLevel(backendProgressLevel);
        }

        if (hasEloUp) {
          setEloReward({
            eloAnterior: reward?.eloAnterior ?? null,
            eloAtual: reward?.eloAtual ?? null,
          });
        }

        if (hasBonusLife || hasBonusXp) {
          setBonusReward({
            bonusVidaGanha: hasBonusLife,
            bonusXpGanho: hasBonusXp,
          });

          setBonusModalVisible(true);
        } else if (hasEloUp) {
          setEloModalVisible(true);
        }

        navigation.setParams({ resultadoAtividade: undefined });
      };

      processResultado();
    }, [
      route?.params?.resultadoAtividade,
      navigation,
      currentUser?.gameStats,
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
    ]),
  );
}