import { useState, useRef } from 'react';
import { Alert } from 'react-native';

const MAX_SKIPS_DEFAULT = 2;

export default function useActivityFlow({
  activityName,
  session,
  user,
  headerRef,
  navigation,
  updateGameStats,
  previewActivity,
  completeActivity,
  isSyncing,
  maxSkips = MAX_SKIPS_DEFAULT,
}) {
  const { allAtividades, currentIndex, questaoAtual, goToNextQuestion } =
    session;

  const [respostaSelecionada, setRespostaSelecionada] = useState(null);

  const [feedbackVisible, setFeedbackVisible] = useState(false);
  const [feedbackInfo, setFeedbackInfo] = useState({
    isCorrect: false,
    correctAlternative: '',
  });

  const [resumoVisible, setResumoVisible] = useState(false);
  const [resumoDados, setResumoDados] = useState(null);

  const [lifeModalVisible, setLifeModalVisible] = useState(false);

  const [puladasCount, setPuladasCount] = useState(0);

  const [isSavingLife, setIsSavingLife] = useState(false);
  const [isPreviewingActivity, setIsPreviewingActivity] = useState(false);
  const [isFinishingActivity, setIsFinishingActivity] = useState(false);

  const acertosRef = useRef(0);
  const errosRef = useRef(0);
  const puladasRef = useRef(0);

  // =========================
  // VIDA
  // =========================
  const getCurrentLives = () => {
    let vidas = Number(user?.gameStats?.lifePoints ?? 3);

    if (headerRef?.current?.getLives) {
      const v = headerRef.current.getLives();
      if (!isNaN(v)) vidas = v;
    }

    return vidas;
  };

  const persistirPerdaDeVida = async () => {
    if (isSavingLife) return false;

    const vidasAntes = getCurrentLives();
    const vidasDepois = Math.max(0, vidasAntes - 1);

    headerRef?.current?.loseLife?.();

    try {
      setIsSavingLife(true);

      const result = await updateGameStats({
        lifePoints: vidasDepois,
      });

      if (!result?.ok) {
        Alert.alert('Erro', 'Não foi possível salvar a perda de vida.');
        return false;
      }

      if (vidasDepois === 0) {
        setFeedbackVisible(false);
        setLifeModalVisible(true);
        return true;
      }

      return false;
    } finally {
      setIsSavingLife(false);
    }
  };

  // =========================
  // RESUMO
  // =========================
  const calcularResumoLocal = () => {
    const totalQuestoes = allAtividades.length;

    const acertos = acertosRef.current;
    const erros = errosRef.current;
    const puladas = puladasRef.current;

    const percentualAcerto =
      totalQuestoes > 0 ? (acertos / totalQuestoes) * 100 : 0;

    const aprovado = percentualAcerto >= 50;

    return {
      atividade: activityName,
      totalQuestoes,
      acertos,
      erros,
      puladas,
      maxPuladas: maxSkips,
      percentualAcerto,
      aprovado,
      vidasRestantes: getCurrentLives(),
    };
  };

  const mostrarResumoFinal = async () => {
    if (isPreviewingActivity || isFinishingActivity) return;

    const resumoLocal = calcularResumoLocal();

    try {
      setIsPreviewingActivity(true);

      const preview = await previewActivity({
        atividade: resumoLocal.atividade,
        acertos: resumoLocal.acertos,
        erros: resumoLocal.erros,
        puladas: resumoLocal.puladas,
        totalQuestoes: resumoLocal.totalQuestoes,
      });

      if (!preview?.ok) {
        Alert.alert('Erro', 'Não foi possível calcular a prévia.');
        return;
      }

      setResumoDados({
        ...resumoLocal,
        ...(preview.reward ?? {}),
        reward: preview.reward ?? {},
      });

      setResumoVisible(true);
    } finally {
      setIsPreviewingActivity(false);
    }
  };

  const finalizarAtividade = async () => {
    if (!resumoDados || isFinishingActivity) return;

    try {
      setIsFinishingActivity(true);

      const result = await completeActivity({
        atividade: resumoDados.atividade,
        acertos: resumoDados.acertos,
        erros: resumoDados.erros,
        puladas: resumoDados.puladas,
        totalQuestoes: resumoDados.totalQuestoes,
      });

      if (!result?.ok) {
        Alert.alert('Erro', 'Falha ao finalizar atividade.');
        return;
      }

      navigation.navigate('Tab', {
        screen: 'Home',
        params: {
          resultadoAtividade: {
            user: result.user,
            reward: result.reward,
          },
        },
      });
    } finally {
      setIsFinishingActivity(false);
    }
  };

  // =========================
  // FLUXO
  // =========================
  const irParaProximaOuResumo = () => {
    const hasNext = goToNextQuestion();

    if (!hasNext) {
      mostrarResumoFinal();
    } else {
      setRespostaSelecionada(null);
    }
  };

  const confirmarResposta = async () => {
    if (
      isSavingLife ||
      isPreviewingActivity ||
      isFinishingActivity ||
      isSyncing
    ) {
      return;
    }

    if (!respostaSelecionada) {
      return { error: 'no_selection' };
    }

    const correta = questaoAtual.alternativa_correta;
    const isCorrect = respostaSelecionada === correta;

    if (isCorrect) {
      acertosRef.current += 1;
    } else {
      errosRef.current += 1;

      const gameOver = await persistirPerdaDeVida();
      if (gameOver) return { gameOver: true };
    }

    setFeedbackInfo({
      isCorrect,
      correctAlternative: correta,
    });

    setFeedbackVisible(true);

    return { ok: true };
  };

  const fecharFeedback = () => {
    if (isSavingLife || isPreviewingActivity || isFinishingActivity) return;

    setFeedbackVisible(false);
    irParaProximaOuResumo();
  };

  const skip = () => {
    if (
      isSavingLife ||
      isPreviewingActivity ||
      isFinishingActivity ||
      isSyncing
    ) {
      return { blocked: true };
    }

    if (puladasRef.current >= maxSkips) {
      return { limit: true };
    }

    puladasRef.current += 1;
    setPuladasCount(puladasRef.current);

    irParaProximaOuResumo();

    return { ok: true };
  };

  const resetarFlow = () => {
    acertosRef.current = 0;
    errosRef.current = 0;
    puladasRef.current = 0;

    setPuladasCount(0);
    setResumoVisible(false);
    setResumoDados(null);
    setFeedbackVisible(false);
    setRespostaSelecionada(null);
  };

  return {
    // estado
    respostaSelecionada,
    feedbackVisible,
    feedbackInfo,
    resumoVisible,
    resumoDados,
    lifeModalVisible,
    puladasCount,

    // loading states
    isSavingLife,
    isPreviewingActivity,
    isFinishingActivity,

    // ações
    setRespostaSelecionada,
    confirmarResposta,
    fecharFeedback,
    skip,
    resetarFlow,
    finalizarAtividade,
    mostrarResumoFinal,
    setLifeModalVisible,
  };
}