// src/pages/atividades/licao01/notas/AtivNotas.js

import React, { useRef } from 'react';
import { FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../../../contexts/AuthContext';

import BatutaLoader from '../../../../components/loader/BatutaLoader';
import useActivitySession from '../../../../hooks/useActivitySession';
import useActivityFlow from '../../../../hooks/useActivityFlow';
import useActivityToast from '../../../../hooks/useActivityToast';
import useSkipInfoPreference from '../../../../hooks/useSkipInfoPreference';
import useActivityNavigationHandlers from '../../../../hooks/useActivityNavigationHandlers';
import useActivityResultNavigation from '../../../../hooks/useActivityResultNavigation';

import ActivityLayout from '../../../../components/activity/ActivityLayout';
import QuestionRenderer from '../../../../components/activity/QuestionRenderer';

import {
  AtivContainer,
  ContentContainer,
  ButtonContainer,
} from './AtivNotasStyles';

import * as activityStyles from './AtivNotasStyles';

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
import SkipInfoModal from '../../../../components/modal/SkipInfoModal';
import AppToast from '../../../../components/toast/AppToast';

const MAX_SKIPS_PER_ACTIVITY = 2;

const imageMap = {
  'Q01.png': Q01,
  'Q02.png': Q02,
  'Q03.png': Q03,
  'Q04.png': Q04,
  'Q05.png': Q05,
  'Q06.png': Q06,
  'Q07.png': Q07,
  'Q08.png': Q08,
};

function AtivNotas() {
  const navigation = useNavigation();
  const headerRef = useRef(null);

  const {
    user,
    updateGameStats,
    previewActivity,
    completeActivity,
    isSyncing,
  } = useAuth();

  const {
    toastVisible,
    toastMessage,
    toastType,
    showToast,
  } = useActivityToast('warning');

  const {
    skipInfoVisible,
    shouldShowSkipInfo,
    showSkipInfo,
    closeSkipInfo,
    handleDisableSkipInfoNextTime,
    resetSkipInfoSession,
  } = useSkipInfoPreference(user);

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

  const {
    handleRecomecar,
    handleLifeModalConfirm,
    handleLifeModalExit,
    handleCloseActivity,
  } = useActivityNavigationHandlers({
    navigation,
    headerRef,
    updateGameStats,
    resetarFlow,
    resetSession,
    restartActivity,
    setLifeModalVisible,
    resetSkipInfoSession,
  });

  useActivityResultNavigation({
    activityName: 'AtivNotas',
    navigation,

    resumoVisible,
    resumoDados,
    lifeModalVisible,

    currentIndex,
    totalQuestoes: allAtividades.length,
    puladasCount,

    onRecomecar: handleRecomecar,
    onContinuar: finalizarAtividade,
    onRetry: handleLifeModalConfirm,
    onExit: handleLifeModalExit,
  });

  const handleSelectAlternative = alternativa => {
    if (isSavingLife || isPreviewingActivity || isFinishingActivity) return;

    setRespostaSelecionada(alternativa);
  };

  const handleConfirm = async () => {
    const result = await confirmarResposta();

    if (result?.error === 'no_selection') {
      showToast('Selecione uma alternativa', 'warning');
    }
  };

  const handleCloseFeedback = () => {
    fecharFeedback();
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

    if (result?.ok && shouldShowSkipInfo()) {
      showSkipInfo();
    }
  };

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
    <>
      <ActivityLayout
        headerRef={headerRef}
        progress={progress}
        nivel={questaoAtual?.nivel}
        onClose={handleCloseActivity}
        Container={AtivContainer}
        ContentContainer={ContentContainer}
        ButtonContainer={ButtonContainer}
        footer={
          <>
            <SkipButton
              onPress={handleSkip}
              disabled={actionsDisabled || skipLimitReached}
              onDisabledPress={skipLimitReached ? handleSkipLimit : undefined}
              usedSkips={puladasCount}
              maxSkips={MAX_SKIPS_PER_ACTIVITY}
            />

            <NextButton onPress={handleConfirm} disabled={actionsDisabled} />
          </>
        }
      >
        <FlatList
          data={[questaoAtual]}
          keyExtractor={item => item.id}
          renderItem={() => (
            <QuestionRenderer
              questao={questaoAtual}
              respostaSelecionada={respostaSelecionada}
              onSelect={handleSelectAlternative}
              disabled={actionsDisabled}
              imageMap={imageMap}
              activityStyles={activityStyles}
            />
          )}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1, paddingBottom: 8 }}
        />
      </ActivityLayout>

      <AppToast
        visible={toastVisible}
        message={toastMessage}
        type={toastType}
      />

      <SkipInfoModal
        visible={skipInfoVisible}
        onClose={closeSkipInfo}
        onDisableNextTime={handleDisableSkipInfoNextTime}
        maxSkips={MAX_SKIPS_PER_ACTIVITY}
      />

      <FeedbackModal
        visible={feedbackVisible}
        isCorrect={feedbackInfo.isCorrect}
        correctAlternative={feedbackInfo.correctAlternative}
        onClose={handleCloseFeedback}
      />
    </>
  );
}

export default AtivNotas;