import { useCallback, useEffect, useRef, useState } from 'react';

import { startActivityBySlug } from '../services/batutaApi';

const normalizeActivityFromApi = (activity) => {
  if (!activity?.questions?.length) {
    return [];
  }

  return activity.questions.map((question) => ({
    id: String(question.id),
    questao: question.statement,
    tipo: String(question.type || '').toLowerCase(),
    nivel: question.level,
    alternativa_correta:
      question.options?.find((option) => option.isCorrect)?.label ?? '',
    opcoes: (question.options || []).map((option) => ({
      alternativa: option.label,
      texto: option.text,
      imagem: option.image,
    })),
    order: question.order,
  }));
};

export function useActivitySession(activitySlug) {
  const isMountedRef = useRef(true);

  const [allAtividades, setAllAtividades] = useState([]);
  const [isLoadingActivity, setIsLoadingActivity] = useState(true);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [respostaSelecionada, setRespostaSelecionada] = useState(null);

  const questaoAtual = allAtividades[currentIndex];

  const loadActivity = useCallback(async () => {
    try {
      setIsLoadingActivity(true);

      const activity = await startActivityBySlug(activitySlug);
      const normalized = normalizeActivityFromApi(activity);

      if (isMountedRef.current) {
        setAllAtividades(normalized);
        setCurrentIndex(0);
        setRespostaSelecionada(null);
      }
    } catch (error) {
      console.log(`[useActivitySession] Erro ao carregar ${activitySlug}:`, error);

      if (isMountedRef.current) {
        setAllAtividades([]);
        setCurrentIndex(0);
        setRespostaSelecionada(null);
      }
    } finally {
      if (isMountedRef.current) {
        setIsLoadingActivity(false);
      }
    }
  }, [activitySlug]);

  useEffect(() => {
    isMountedRef.current = true;

    loadActivity();

    return () => {
      isMountedRef.current = false;
    };
  }, [loadActivity]);

  const resetSession = useCallback(() => {
    setCurrentIndex(0);
    setRespostaSelecionada(null);
  }, []);

  const goToNextQuestion = useCallback(() => {
    const hasNext = currentIndex + 1 < allAtividades.length;

    if (hasNext) {
      setCurrentIndex((prev) => prev + 1);
      setRespostaSelecionada(null);
      return true;
    }

    return false;
  }, [allAtividades.length, currentIndex]);

  const restartActivity = useCallback(async () => {
    resetSession();
    await loadActivity();
  }, [loadActivity, resetSession]);

  return {
    allAtividades,
    questaoAtual,
    currentIndex,
    respostaSelecionada,
    setRespostaSelecionada,
    isLoadingActivity,
    loadActivity,
    resetSession,
    goToNextQuestion,
    restartActivity,
  };
}

export default useActivitySession;