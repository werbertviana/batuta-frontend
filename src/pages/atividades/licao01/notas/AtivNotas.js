// src/pages/atividades/licao01/notas/AtivNotas.js

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
} from './AtivNotasStyles';

import { CircleText } from '../introducao/AtivIntroStyles';

import SkipButton from '../../../../components/buttons/atividades/skipButton/SkipButton';
import NextButton from '../../../../components/buttons/atividades/nextButton/NextButton';

import Q01 from '../../../../assets/images/atividades/licao01/notas/Q01.png';
import Q02 from '../../../../assets/images/atividades/licao01/notas/Q02.png';
import Q03 from '../../../../assets/images/atividades/licao01/notas/Q03.png';
import Q04 from '../../../../assets/images/atividades/licao01/notas/Q04.png';
import Q05 from '../../../../assets/images/atividades/licao01/notas/Q05.png';
import Q06 from '../../../../assets/images/atividades/licao01/notas/Q06.png';
import Q07 from '../../../../assets/images/atividades/licao01/notas/Q07.png';
import Q08 from '../../../../assets/images/atividades/licao01/notas/Q08.png';

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

function AtivNotas() {
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

  const session = useActivitySession('ativ-notas');

  const {
    allAtividades,
    questaoAtual,
    currentIndex,
    isLoadingActivity,
    restartActivity,
    resetSession,
  } = session;

  const flow = useActivityFlow({
    activityName: 'Notas Musicais',
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

    return () => {
      if (toastTimeoutRef.current) {
        clearTimeout(toastTimeoutRef.current);
      }
    };
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
      case 'Q05.png':
        return <ImageAlternativa source={Q05} resizeMode="contain" />;
      case 'Q06.png':
        return <ImageAlternativa source={Q06} resizeMode="contain" />;
      case 'Q07.png':
        return <ImageAlternativa source={Q07} resizeMode="contain" />;
      case 'Q08.png':
        return <ImageAlternativa source={Q08} resizeMode="contain" />;
      default:
        return null;
    }
  };

  const tipoQuestao =
    questaoAtual?.tipo === 'texto' ? 'texto' : 'figura';

  const renderAlternativaFigura = (item) => {
    const isSelected = respostaSelecionada === item.alternativa;

    return (
      <AlternativaContainer
        key={item.alternativa}
        onPress={() => setRespostaSelecionada(item.alternativa)}
        style={isSelected ? { borderColor: '#34B1C7' } : null}
      >
        <ImageContainer>
          <CircleContainer style={isSelected ? { borderColor: '#34B1C7' } : null}>
            <CircleText>{item.alternativa}</CircleText>
          </CircleContainer>

          {getImages(item.imagem)}
        </ImageContainer>
      </AlternativaContainer>
    );
  };

  const renderAlternativaTexto = (item) => {
    const isSelected = respostaSelecionada === item.alternativa;

    return (
      <AlternativaContainer2
        key={item.alternativa}
        onPress={() => setRespostaSelecionada(item.alternativa)}
        style={isSelected ? { borderColor: '#34B1C7' } : null}
      >
        <CircleInline style={isSelected ? { borderColor: '#34B1C7' } : null}>
          <CircleText>{item.alternativa}</CircleText>
        </CircleInline>

        <AlternativaText numberOfLines={3}>{item.texto}</AlternativaText>
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
            ? renderAlternativaTexto(item)
            : renderAlternativaFigura(item),
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
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1, paddingBottom: 8 }}
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

export default AtivNotas;