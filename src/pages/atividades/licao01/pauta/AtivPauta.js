// src/pages/atividades/licao01/pauta/AtivPauta.js

import React, { useState, useRef, useEffect } from 'react';
import { View, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../../../contexts/AuthContext';

import AtivHeader from '../../../../components/ativHeader/AtivHeader';
import BatutaLoader from '../../../../components/loader/BatutaLoader';
import useActivitySession from '../../../../hooks/useActivitySession';
import useActivityFlow from '../../../../hooks/useActivityFlow';

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
  CircleText,
} from './AtivPautaStyles';

import SkipButton from '../../../../components/buttons/atividades/skipButton/SkipButton';
import NextButton from '../../../../components/buttons/atividades/nextButton/NextButton';

import Q01 from '../../../../assets/images/atividades/licao01/pauta/Q01.png';
import Q02 from '../../../../assets/images/atividades/licao01/pauta/Q02.png';
import Q03 from '../../../../assets/images/atividades/licao01/pauta/Q03.png';
import Q04 from '../../../../assets/images/atividades/licao01/pauta/Q04.png';

import FeedbackModal from '../../../../components/modal/FeedbackModal';
import ResumoAtividadeModal from '../../../../components/modal/ResumoAtividadeModal';
import LifeLostModal from '../../../../components/modal/LifeLostModal';
import SkipInfoModal from '../../../../components/modal/SkipInfoModal';
import AppToast from '../../../../components/toast/AppToast';
import NivelIndicator from '../../../../components/nivel/NivelIndicator';

const MAX_SKIPS_PER_ACTIVITY = 2;
const OLD_HIDE_SKIP_INFO_KEY = '@batuta:hide_skip_info_modal';

const getHideSkipInfoKey = (user) => {
  const identifier = user?.email || user?.id;
  if (!identifier) return null;

  return `@batuta:hide_skip_info_modal:user:${String(identifier).toLowerCase()}`;
};

function AtivPauta() {
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

  const session = useActivitySession('ativ-pauta');

  const {
    allAtividades,
    questaoAtual,
    currentIndex,
    isLoadingActivity,
    restartActivity,
    resetSession,
  } = session;

  const flow = useActivityFlow({
    activityName: 'Pauta Musical',
    session,
    user,
    headerRef,
    navigation,
    updateGameStats,
    previewActivity,
    completeActivity,
    isSyncing,
    maxSkips: MAX_SKIPS_PER_ACTIVITY,
  });

  const {
    respostaSelecionada,
    setRespostaSelecionada,
    feedbackVisible,
    feedbackInfo,
    resumoVisible,
    resumoDados,
    lifeModalVisible,
    puladasCount,
    isSavingLife,
    isPreviewingActivity,
    isFinishingActivity,
    confirmarResposta,
    fecharFeedback,
    skip,
    resetarFlow,
    finalizarAtividade,
    setLifeModalVisible,
  } = flow;

  const [skipInfoVisible, setSkipInfoVisible] = useState(false);
  const [hideSkipInfo, setHideSkipInfo] = useState(false);

  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('warning');

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
        console.log('[AtivPauta] Erro ao carregar preferência:', error);
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
      console.log('[AtivPauta] Erro ao salvar preferência:', error);
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

  const handleConfirm = async () => {
    const result = await confirmarResposta();

    if (result?.error === 'no_selection') {
      showToast('Selecione uma alternativa', 'warning');
    }
  };

  const handleSkipLimit = () => {
    showToast('Limite de pulos atingido', 'warning');
  };

  const handleSkip = () => {
    const result = skip();

    if (result?.limit) {
      handleSkipLimit();
      return;
    }

    if (result?.ok && !skipInfoShownRef.current && !hideSkipInfo) {
      skipInfoShownRef.current = true;
      setSkipInfoVisible(true);
    }
  };

  const resetarAtividade = () => {
    skipInfoShownRef.current = false;

    resetarFlow();
    resetSession();
  };

  const handleRecomecar = async () => {
    resetarAtividade();
    await restartActivity();
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

  if (isLoadingActivity) {
    return <BatutaLoader text="Afinando a atividade..." />;
  }

  if (!questaoAtual) {
    return <BatutaLoader text="Preparando atividade..." />;
  }

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
        onClose={fecharFeedback}
      />

      <ResumoAtividadeModal
        visible={resumoVisible}
        resumoDados={resumoDados}
        onClose={finalizarAtividade}
        onRecomecar={handleRecomecar}
        onContinuar={finalizarAtividade}
      />

      <LifeLostModal
        visible={lifeModalVisible}
        onConfirm={handleLifeModalConfirm}
        onExit={handleLifeModalExit}
      />
    </AtivContainer>
  );
}

export default AtivPauta;