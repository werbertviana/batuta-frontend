// src/pages/atividades/licao01/introducao/AtivIntro.js

import React, { useRef, useEffect, useState } from 'react';
import { View, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../../../contexts/AuthContext';

import BatutaLoader from '../../../../components/loader/BatutaLoader';
import useActivitySession from '../../../../hooks/useActivitySession';
import useActivityFlow from '../../../../hooks/useActivityFlow';

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
  CircleText,
} from './AtivIntroStyles';

import SkipButton from '../../../../components/buttons/atividades/skipButton/SkipButton';
import NextButton from '../../../../components/buttons/atividades/nextButton/NextButton';

import Q01 from '../../../../assets/images/atividades/licao01/introducao/Q01.png';
import Q02 from '../../../../assets/images/atividades/licao01/introducao/Q02.png';
import Q03 from '../../../../assets/images/atividades/licao01/introducao/Q03.png';
import Q04 from '../../../../assets/images/atividades/licao01/introducao/Q04.png';

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

function AtivIntro() {
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

  // =========================
  // SESSION
  // =========================
  const session = useActivitySession('ativ-intro');

  const {
    allAtividades,
    questaoAtual,
    currentIndex,
    isLoadingActivity,
    restartActivity,
    resetSession,
  } = session;

  // =========================
  // FLOW (🔥 NOVO)
  // =========================
  const flow = useActivityFlow({
    activityName: 'Introducao',
    session,
    user,
    headerRef,
    navigation,
    updateGameStats,
    previewActivity,
    completeActivity,
    isSyncing,
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
    confirmarResposta,
    fecharFeedback,
    skip,
    resetarFlow,
    finalizarAtividade,
    setLifeModalVisible,
  } = flow;

  // =========================
  // UI STATES (mantidos)
  // =========================
  const [skipInfoVisible, setSkipInfoVisible] = useState(false);
  const [hideSkipInfo, setHideSkipInfo] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    const loadSkipInfoPreference = async () => {
      try {
        const key = getHideSkipInfoKey(user);
        if (!key) return;

        const value = await AsyncStorage.getItem(key);
        setHideSkipInfo(value === 'true');

        await AsyncStorage.removeItem(OLD_HIDE_SKIP_INFO_KEY);
      } catch (e) {
        console.log(e);
      }
    };

    loadSkipInfoPreference();
  }, [user]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setToastVisible(true);

    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
    }

    toastTimeoutRef.current = setTimeout(() => {
      setToastVisible(false);
    }, 1800);
  };

  // =========================
  // HANDLERS
  // =========================
  const handleConfirm = async () => {
    const result = await confirmarResposta();

    if (result?.error === 'no_selection') {
      showToast('Selecione uma alternativa');
    }
  };

  const handleSkip = () => {
    const result = skip();

    if (result?.limit) {
      showToast('Limite de pulos atingido');
    }

    if (!skipInfoShownRef.current && !hideSkipInfo) {
      skipInfoShownRef.current = true;
      setSkipInfoVisible(true);
    }
  };

  const handleRecomecar = async () => {
    resetarFlow();
    resetSession();
    await restartActivity();
  };

  const handleCloseActivity = () => {
    navigation.navigate('Tab', { screen: 'Home' });
  };

  // =========================
  // RENDER
  // =========================
  const getImages = (imagem) => {
    switch (imagem) {
      case 'Q01.png':
        return <ImageAlternativa source={Q01} resizeMode="contain" />;
      case 'Q02.png':
        return <ImageAlternativa source={Q02} resizeMode="contain" />;
      case 'Q03.png':
        return <ImageAlternativa source={Q03} resizeMode="contain" />;
      case 'Q04.png':
        return <ImageAlternativa source={Q04} resizeMode="contain" />;
      default:
        return null;
    }
  };

  const tipoQuestao =
    questaoAtual?.tipo === 'texto' ? 'texto' : 'figura';

  const renderQuestao = () => (
    <View>
      <QuestaoText>{questaoAtual.questao}</QuestaoText>

      <AlternativasContainer
        style={
          tipoQuestao === 'texto'
            ? { flexDirection: 'column', flexWrap: 'nowrap' }
            : null
        }
      >
        {questaoAtual.opcoes.map((item) =>
          tipoQuestao === 'texto' ? (
            <AlternativaContainer2
              key={item.alternativa}
              onPress={() => setRespostaSelecionada(item.alternativa)}
            >
              <CircleInline>
                <CircleText>{item.alternativa}</CircleText>
              </CircleInline>

              <AlternativaText>{item.texto}</AlternativaText>
            </AlternativaContainer2>
          ) : (
            <AlternativaContainer
              key={item.alternativa}
              onPress={() => setRespostaSelecionada(item.alternativa)}
            >
              <ImageContainer>
                <CircleContainer>
                  <CircleText>{item.alternativa}</CircleText>
                </CircleContainer>
                {getImages(item.imagem)}
              </ImageContainer>
            </AlternativaContainer>
          ),
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
          renderItem={renderQuestao}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ flexGrow: 1 }}
        />
      </ContentContainer>

      <ButtonContainer>
        <SkipButton
          onPress={handleSkip}
          usedSkips={puladasCount}
          maxSkips={MAX_SKIPS_PER_ACTIVITY}
        />

        <NextButton onPress={handleConfirm} />
      </ButtonContainer>

      <AppToast visible={toastVisible} message={toastMessage} />

      <SkipInfoModal
        visible={skipInfoVisible}
        onClose={() => setSkipInfoVisible(false)}
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
        onRecomecar={handleRecomecar}
        onContinuar={finalizarAtividade}
      />

      <LifeLostModal
        visible={lifeModalVisible}
        onConfirm={() => {
          setLifeModalVisible(false);
          handleRecomecar();
        }}
        onExit={handleCloseActivity}
      />
    </AtivContainer>
  );
}

export default AtivIntro;