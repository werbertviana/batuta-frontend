// src/screens/atividades/licao02/figuras-pausas/AtivFigPausas.js

import React, { useState, useRef, useEffect } from 'react';
import { View, FlatList, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../../../contexts/AuthContext';

import AtivHeader from '../../../../components/ativHeader/AtivHeader';

import {
  AtivContainer,
  ContentContainer,
  AlternativasContainer,
  AlternativaContainer2,
  ButtonContainer,
  QuestaoText,
  AlternativaContainer,
  CircleContainer,
  CircleInline,
  ImageContainer,
  ImageAlternativa,
  AlternativaText,
} from './AtivFigPausasStyles';

import SkipButton from '../../../../components/buttons/atividades/skipButton/SkipButton';
import NextButton from '../../../../components/buttons/atividades/nextButton/NextButton';

import staticAtividades from '../../../../data/atividades/licao02/figuras-pausas/ativFigPausas.json';

import Q01 from '../../../../assets/images/atividades/licao02/figuras-pausas/Q01.png';
import Q02 from '../../../../assets/images/atividades/licao02/figuras-pausas/Q02.png';
import Q03 from '../../../../assets/images/atividades/licao02/figuras-pausas/Q03.png';
import Q04 from '../../../../assets/images/atividades/licao02/figuras-pausas/Q04.png';
import Q05 from '../../../../assets/images/atividades/licao02/figuras-pausas/Q05.png';

import FeedbackModal from '../../../../components/modal/FeedbackModal';
import ResumoAtividadeModal from '../../../../components/modal/ResumoAtividadeModal';
import LifeLostModal from '../../../../components/modal/LifeLostModal';
import SkipInfoModal from '../../../../components/modal/SkipInfoModal';
import AppToast from '../../../../components/toast/AppToast';

import { CircleText } from '../compasso/AtivCompassoStyles';
import NivelIndicator from '../../../../components/nivel/NivelIndicator';

const MAX_SKIPS_PER_ACTIVITY = 2;
const OLD_HIDE_SKIP_INFO_KEY = '@batuta:hide_skip_info_modal';

const getHideSkipInfoKey = (user) => {
  const identifier = user?.email || user?.id;

  if (!identifier) return null;

  return `@batuta:hide_skip_info_modal:user:${String(identifier).toLowerCase()}`;
};

function AtivFigPausas() {
  const navigation = useNavigation();

  const {
    user,
    updateGameStats,
    previewActivity,
    completeActivity,
    isSyncing,
  } = useAuth();

  const headerRef = useRef(null);
  const toastTimeoutRef = useRef(null);
  const skipInfoShownRef = useRef(false);

  const allAtividades = staticAtividades.atividades;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [respostaSelecionada, setRespostaSelecionada] = useState(null);

  const [feedbackVisible, setFeedbackVisible] = useState(false);
  const [feedbackInfo, setFeedbackInfo] = useState({
    isCorrect: false,
    correctAlternative: '',
  });

  const [resumoVisible, setResumoVisible] = useState(false);
  const [resumoDados, setResumoDados] = useState(null);

  const [lifeModalVisible, setLifeModalVisible] = useState(false);
  const [skipInfoVisible, setSkipInfoVisible] = useState(false);
  const [hideSkipInfo, setHideSkipInfo] = useState(false);

  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('warning');

  const [isSavingLife, setIsSavingLife] = useState(false);
  const [isPreviewingActivity, setIsPreviewingActivity] = useState(false);
  const [isFinishingActivity, setIsFinishingActivity] = useState(false);

  const [puladasCount, setPuladasCount] = useState(0);

  const acertosRef = useRef(0);
  const errosRef = useRef(0);
  const puladasRef = useRef(0);

  const questaoAtual = allAtividades[currentIndex];

  useEffect(() => {
    const loadSkipInfoPreference = async () => {
      try {
        const key = getHideSkipInfoKey(user);

        if (!key) {
          setHideSkipInfo(false);
          return;
        }

        const value = await AsyncStorage.getItem(key);
        setHideSkipInfo(value === 'true');

        await AsyncStorage.removeItem(OLD_HIDE_SKIP_INFO_KEY);
      } catch (error) {
        console.log('[AtivFigPausas] Erro ao carregar preferência:', error);
      }
    };

    loadSkipInfoPreference();

    return () => {
      if (toastTimeoutRef.current) {
        clearTimeout(toastTimeoutRef.current);
      }
    };
  }, [user?.id, user?.email]);

  const handleDisableSkipInfoNextTime = async () => {
    try {
      const key = getHideSkipInfoKey(user);

      if (!key) return;

      await AsyncStorage.setItem(key, 'true');
      setHideSkipInfo(true);
    } catch (error) {
      console.log('[AtivFigPausas] Erro ao salvar preferência:', error);
    }
  };

  const showToast = (message, type = 'warning') => {
    setToastMessage(message);
    setToastType(type);
    setToastVisible(true);

    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
    }

    toastTimeoutRef.current = setTimeout(() => {
      setToastVisible(false);
    }, 1800);
  };

  const getImages = (imagem) => {
    switch (imagem) {
      case 'Q01.png':
        return <ImageAlternativa resizeMode="contain" source={Q01} />;
      case 'Q02.png':
        return <ImageAlternativa resizeMode="contain" source={Q02} />;
      case 'Q03.png':
        return <ImageAlternativa resizeMode="contain" source={Q03} />;
      case 'Q04.png':
        return <ImageAlternativa resizeMode="contain" source={Q04} />;
      case 'Q05.png':
        return <ImageAlternativa resizeMode="contain" source={Q05} />;
      default:
        return null;
    }
  };

  const tipoQuestaoRaw =
    typeof questaoAtual?.tipo === 'string'
      ? questaoAtual.tipo.toLowerCase()
      : '';

  const tipoQuestao = tipoQuestaoRaw === 'texto' ? 'texto' : 'figura';

  const handleSelectAlternative = (alternativa) => {
    if (isSavingLife || isPreviewingActivity || isFinishingActivity) return;
    setRespostaSelecionada(alternativa);
  };

  const getCurrentLives = () => {
    let vidasRestantes = Number(user?.gameStats?.lifePoints ?? 3);

    if (headerRef.current?.getLives) {
      const v = headerRef.current.getLives();
      if (!isNaN(v)) vidasRestantes = v;
    }

    return vidasRestantes;
  };

  const calcularResumoLocal = () => {
    const totalQuestoes = allAtividades.length;
    const acertos = acertosRef.current;
    const erros = errosRef.current;
    const puladas = puladasRef.current;
    const percentualAcerto = (acertos / totalQuestoes) * 100;
    const aprovado = percentualAcerto >= 50;

    return {
      atividade: 'Figuras de Pausas',
      totalQuestoes,
      acertos,
      erros,
      puladas,
      maxPuladas: MAX_SKIPS_PER_ACTIVITY,
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
        Alert.alert('Erro', 'Não foi possível calcular a prévia da atividade.');
        return;
      }

      const reward = preview.reward ?? {};

      setResumoDados({
        ...resumoLocal,
        xpBaseGanho: reward.xpBaseGanho ?? 0,
        xpBonusGanho: reward.xpBonusGanho ?? 0,
        xpGanho: reward.xpGanho ?? 0,
        bonusVida: reward.bonusVidaGanha ?? false,
        bonusXpGanho: reward.bonusXpGanho ?? false,
        batutasGanhas: reward.batutasGanhas ?? 0,
        subiuElo: reward.subiuElo ?? false,
        eloAnterior: reward.eloAnterior ?? null,
        eloAtual: reward.eloAtual ?? null,
        primeiraConclusao: reward.primeiraConclusao ?? false,
        lessonCompleted: reward.lessonCompleted ?? false,
        lessonRewardGranted: reward.lessonRewardGranted ?? false,
        progressLevelAnterior: reward.progressLevelAnterior ?? null,
        progressLevelAtual: reward.progressLevelAtual ?? null,
        subiuProgressLevel: reward.subiuProgressLevel ?? false,
        reward,
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
        Alert.alert(
          'Erro',
          'Não foi possível sincronizar a atividade com o servidor.',
        );
        return;
      }

      navigation.navigate('Tab', {
        screen: 'Home',
        params: {
          resultadoAtividade: {
            user: result.user ?? null,
            reward: result.reward ?? null,
          },
        },
      });
    } finally {
      setIsFinishingActivity(false);
    }
  };

  const persistirPerdaDeVida = async () => {
    if (isSavingLife) return false;

    const vidasAntes = getCurrentLives();
    const vidasDepois = Math.max(0, vidasAntes - 1);

    if (headerRef.current?.loseLife) {
      headerRef.current.loseLife();
    }

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

  const irParaProximaOuResumo = () => {
    const next = currentIndex + 1 < allAtividades.length;

    if (next) {
      setCurrentIndex((prev) => prev + 1);
      setRespostaSelecionada(null);
    } else {
      mostrarResumoFinal();
    }
  };

  const handleConfirm = async () => {
    if (isSavingLife || isPreviewingActivity || isFinishingActivity || isSyncing) {
      return;
    }

    if (!respostaSelecionada) {
      showToast('Selecione uma alternativa', 'warning');
      return;
    }

    const alternativaCorreta = questaoAtual.alternativa_correta;
    const isCorrect = respostaSelecionada === alternativaCorreta;

    if (isCorrect) {
      acertosRef.current += 1;
    } else {
      errosRef.current += 1;

      const gameOver = await persistirPerdaDeVida();
      if (gameOver) return;
    }

    setFeedbackInfo({
      isCorrect,
      correctAlternative: alternativaCorreta,
    });

    setFeedbackVisible(true);
  };

  const handleCloseFeedback = () => {
    if (isSavingLife || isPreviewingActivity || isFinishingActivity) return;

    setFeedbackVisible(false);
    irParaProximaOuResumo();
  };

  const handleSkipLimit = () => {
    showToast('Limite de pulos atingido', 'warning');
  };

  const handleSkip = () => {
    if (isSavingLife || isPreviewingActivity || isFinishingActivity || isSyncing) {
      return;
    }

    if (puladasRef.current >= MAX_SKIPS_PER_ACTIVITY) {
      handleSkipLimit();
      return;
    }

    puladasRef.current += 1;
    setPuladasCount(puladasRef.current);

    if (!skipInfoShownRef.current && !hideSkipInfo) {
      skipInfoShownRef.current = true;
      setSkipInfoVisible(true);
    }

    irParaProximaOuResumo();
  };

  const renderAlternativaFigura = (alternativa, imagem) => {
    const isSelected = respostaSelecionada === alternativa;

    return (
      <AlternativaContainer
        key={alternativa}
        onPress={() => handleSelectAlternative(alternativa)}
        style={isSelected ? { borderColor: '#34B1C7' } : null}
      >
        <ImageContainer>
          <CircleContainer style={isSelected ? { borderColor: '#34B1C7' } : null}>
            <CircleText>{alternativa}</CircleText>
          </CircleContainer>

          {getImages(imagem)}
        </ImageContainer>
      </AlternativaContainer>
    );
  };

  const renderAlternativaTexto = (alternativa, texto) => {
    const isSelected = respostaSelecionada === alternativa;

    return (
      <AlternativaContainer2
        key={alternativa}
        onPress={() => handleSelectAlternative(alternativa)}
        style={isSelected ? { borderColor: '#34B1C7' } : null}
      >
        <CircleInline style={isSelected ? { borderColor: '#34B1C7' } : null}>
          <CircleText>{alternativa}</CircleText>
        </CircleInline>

        <AlternativaText numberOfLines={3}>{texto}</AlternativaText>
      </AlternativaContainer2>
    );
  };

  const renderQuestao = () => (
    <View>
      <QuestaoText>{questaoAtual.questao}</QuestaoText>

      <AlternativasContainer
        style={
          tipoQuestao === 'texto'
            ? {
                flexDirection: 'column',
                flexWrap: 'nowrap',
                justifyContent: 'flex-start',
              }
            : null
        }
      >
        {questaoAtual.opcoes.map((item) =>
          tipoQuestao === 'texto'
            ? renderAlternativaTexto(item.alternativa, item.texto)
            : renderAlternativaFigura(item.alternativa, item.imagem),
        )}
      </AlternativasContainer>
    </View>
  );

  const resetarAtividade = () => {
    acertosRef.current = 0;
    errosRef.current = 0;
    puladasRef.current = 0;
    skipInfoShownRef.current = false;

    setPuladasCount(0);
    setResumoVisible(false);
    setResumoDados(null);
    setFeedbackVisible(false);
    setRespostaSelecionada(null);
    setCurrentIndex(0);
  };

  const handleRecomecar = () => {
    resetarAtividade();
  };

  const handleContinuarResumo = async () => {
    await finalizarAtividade();
  };

  const handleLifeModalConfirm = () => {
    setLifeModalVisible(false);
    resetarAtividade();
  };

  const handleLifeModalExit = () => {
    setLifeModalVisible(false);

    navigation.navigate('Tab', {
      screen: 'Home',
      params: {
        resultadoAtividade: {
          reward: {
            aprovado: false,
            xpGanho: 0,
            bonusVidaGanha: false,
            bonusXpGanho: false,
          },
        },
      },
    });
  };

  const handleCloseActivity = () => {
    navigation.navigate('Tab', {
      screen: 'Home',
      params: {
        resultadoAtividade: {
          reward: {
            aprovado: false,
            xpGanho: 0,
            bonusVidaGanha: false,
            bonusXpGanho: false,
          },
        },
      },
    });
  };

  const progress = (currentIndex + 1) / allAtividades.length;

  const actionsDisabled =
    isSyncing || isSavingLife || isPreviewingActivity || isFinishingActivity;

  const skipLimitReached = puladasCount >= MAX_SKIPS_PER_ACTIVITY;

  return (
    <AtivContainer>
      <AtivHeader
        ref={headerRef}
        progress={progress}
        onClose={handleCloseActivity}
      />

      <NivelIndicator nivel={questaoAtual?.nivel} />

      <ContentContainer>
        <FlatList
          data={[questaoAtual]}
          keyExtractor={(item) => item.id}
          renderItem={renderQuestao}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1, paddingBottom: 8 }}
        />
      </ContentContainer>

      <ButtonContainer>
        <SkipButton
          onPress={handleSkip}
          disabled={actionsDisabled || skipLimitReached}
          onDisabledPress={skipLimitReached ? handleSkipLimit : undefined}
          usedSkips={puladasCount}
          maxSkips={MAX_SKIPS_PER_ACTIVITY}
        />

        <NextButton onPress={handleConfirm} disabled={actionsDisabled} />
      </ButtonContainer>

      <AppToast
        visible={toastVisible}
        message={toastMessage}
        type={toastType}
      />

      <SkipInfoModal
        visible={skipInfoVisible}
        onClose={() => setSkipInfoVisible(false)}
        onDisableNextTime={handleDisableSkipInfoNextTime}
        maxSkips={MAX_SKIPS_PER_ACTIVITY}
      />

      <FeedbackModal
        visible={feedbackVisible}
        isCorrect={feedbackInfo.isCorrect}
        correctAlternative={feedbackInfo.correctAlternative}
        onClose={handleCloseFeedback}
      />

      <ResumoAtividadeModal
        visible={resumoVisible}
        resumoDados={resumoDados}
        onClose={handleContinuarResumo}
        onRecomecar={handleRecomecar}
        onContinuar={handleContinuarResumo}
      />

      <LifeLostModal
        visible={lifeModalVisible}
        onConfirm={handleLifeModalConfirm}
        onExit={handleLifeModalExit}
      />
    </AtivContainer>
  );
}

export default AtivFigPausas;