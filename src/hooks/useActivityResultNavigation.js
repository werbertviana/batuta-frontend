import { useEffect, useMemo, useRef } from 'react';

import {
  registerActivityCallbacks,
  removeActivityCallbacks,
} from './activityNavigationRegistry';

function createCallbackKey(activityName, type) {
  return `${activityName}-${type}-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2)}`;
}

export default function useActivityResultNavigation({
  activityName,
  navigation,

  resumoVisible,
  resumoDados,
  lifeModalVisible,

  currentIndex,
  totalQuestoes,
  puladasCount,

  onRecomecar,
  onContinuar,
  onRetry,
  onExit,
}) {
  const resumoNavigationSentRef = useRef(false);
  const gameOverNavigationSentRef = useRef(false);

  const resumoCallbackKey = useMemo(
    () => createCallbackKey(activityName, 'resumo'),
    [activityName],
  );

  const gameOverCallbackKey = useMemo(
    () => createCallbackKey(activityName, 'gameover'),
    [activityName],
  );

  useEffect(() => {
    registerActivityCallbacks(resumoCallbackKey, {
      onRecomecar: async () => {
        resumoNavigationSentRef.current = false;

        navigation.goBack();

        setTimeout(() => {
          onRecomecar?.();
        }, 0);
      },

      onContinuar: async () => {
        resumoNavigationSentRef.current = false;

        onContinuar?.();
      },
    });

    return () => {
      removeActivityCallbacks(resumoCallbackKey);
    };
  }, [resumoCallbackKey, navigation, onRecomecar, onContinuar]);

  useEffect(() => {
    registerActivityCallbacks(gameOverCallbackKey, {
      onRetry: async () => {
        gameOverNavigationSentRef.current = false;

        navigation.goBack();

        setTimeout(() => {
          onRetry?.();
        }, 0);
      },

      onExit: async () => {
        gameOverNavigationSentRef.current = false;

        onExit?.();
      },
    });

    return () => {
      removeActivityCallbacks(gameOverCallbackKey);
    };
  }, [gameOverCallbackKey, navigation, onRetry, onExit]);

  useEffect(() => {
    if (!resumoVisible || !resumoDados || resumoNavigationSentRef.current) {
      return;
    }

    resumoNavigationSentRef.current = true;

    navigation.navigate('ResumoAtividade', {
      callbackKey: resumoCallbackKey,
      resumoDados,
    });
  }, [resumoVisible, resumoDados, navigation, resumoCallbackKey]);

  useEffect(() => {
    if (!lifeModalVisible || gameOverNavigationSentRef.current) {
      return;
    }

    gameOverNavigationSentRef.current = true;

    navigation.navigate('GameOver', {
      callbackKey: gameOverCallbackKey,
      acertos: resumoDados?.acertos ?? 0,
      erros: resumoDados?.erros ?? 2,
      questaoAtual: currentIndex + 1,
      totalQuestoes,
      puladasCount,
    });
  }, [
    lifeModalVisible,
    resumoDados,
    currentIndex,
    totalQuestoes,
    puladasCount,
    navigation,
    gameOverCallbackKey,
  ]);
}