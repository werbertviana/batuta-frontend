// src/screens/atividades/licao02/duracao-valores/AtivDuracao.js
import React, { useState, useRef } from 'react';
import { FlatList, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import AtivHeader from '../../../../components/ativHeader/AtivHeader';

import {
  AtivContainer,
  ContentContainer,
  AlternativasContainer,
  AlternativaContainer2,
  ButtonContainer,
  QuestaoContainer,
  QuestaoText,
  AlternativaContainer,
  CircleContainer,
  CircleInline,
  ImageContainer,
  ImageAlternativa,
  AlternativaText,
} from './AtivDuracaoStyles';

import SkipButton from '../../../../components/buttons/atividades/skipButton/SkipButton';
import NextButton from '../../../../components/buttons/atividades/nextButton/NextButton';

import staticAtividades from '../../../../data/atividades/licao02/duracao-valores/ativDuracao.json';

import Q01 from '../../../../assets/images/atividades/licao02/duracao-valores/Q01.png';
import Q02 from '../../../../assets/images/atividades/licao02/duracao-valores/Q02.png';
import Q03 from '../../../../assets/images/atividades/licao02/duracao-valores/Q03.png';
import Q04 from '../../../../assets/images/atividades/licao02/duracao-valores/Q04.png';
import Q05 from '../../../../assets/images/atividades/licao02/duracao-valores/Q05.png';
import Q06 from '../../../../assets/images/atividades/licao02/duracao-valores/Q06.png';
import Q07 from '../../../../assets/images/atividades/licao02/duracao-valores/Q07.png';
import Q08 from '../../../../assets/images/atividades/licao02/duracao-valores/Q08.png';

import FeedbackModal from '../../../../components/modal/FeedbackModal';
import ResumoAtividadeModal from '../../../../components/modal/ResumoAtividadeModal';
import LifeLostModal from '../../../../components/modal/LifeLostModal';
import { CircleText } from '../../licao01/introducao/AtivIntroStyles';

import NivelIndicator from '../../../../components/nivel/NivelIndicator';

function AtivDuracao() {
  const navigation = useNavigation();
  const headerRef = useRef(null);

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

  const acertosRef = useRef(0);
  const errosRef = useRef(0);
  const xpRef = useRef(0);

  const teveGameOverRef = useRef(false);
  const bonusJaConcedidoRef = useRef(false);

  const questaoAtual = allAtividades[currentIndex];

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
      case 'Q06.png':
        return <ImageAlternativa resizeMode="contain" source={Q06} />;
      case 'Q07.png':
        return <ImageAlternativa resizeMode="contain" source={Q07} />;
      case 'Q08.png':
        return <ImageAlternativa resizeMode="contain" source={Q08} />;
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
    setRespostaSelecionada(alternativa);
  };

  const calcularResumo = () => {
    const totalQuestoes = allAtividades.length;
    const acertos = acertosRef.current;
    const erros = errosRef.current;
    const percentualAcerto = (acertos / totalQuestoes) * 100;
    const aprovado = percentualAcerto >= 50;
    const xpGanho = xpRef.current;

    let vidasRestantes = 2;
    if (headerRef.current?.getLives) {
      const v = headerRef.current.getLives();
      if (typeof v === 'number') vidasRestantes = v;
    }

    const acertouTudo = acertos === totalQuestoes;

    const bonusVida =
      aprovado &&
      acertouTudo &&
      !teveGameOverRef.current &&
      !bonusJaConcedidoRef.current;

    return {
      totalQuestoes,
      acertos,
      erros,
      percentualAcerto,
      aprovado,
      xpGanho,
      vidasRestantes,
      bonusVida,
      atividade: 'duracao-valores',
    };
  };

  const mostrarResumoFinal = () => {
    const resultado = calcularResumo();

    if (resultado.bonusVida) {
      bonusJaConcedidoRef.current = true;
    }

    setResumoDados(resultado);
    setResumoVisible(true);
  };

  const navegarParaHomeComResultado = () => {
    if (!resumoDados) return;

    navigation.navigate('Tab', {
      screen: 'Home',
      params: {
        resultadoAtividade: resumoDados,
      },
    });
  };

  const aplicarPerdaDeVida = () => {
    let vidasAntes = 2;

    if (headerRef.current?.getLives) {
      const v = headerRef.current.getLives();
      if (typeof v === 'number') vidasAntes = v;
    }

    if (headerRef.current?.loseLife) {
      headerRef.current.loseLife();
    }

    if (vidasAntes === 0) {
      teveGameOverRef.current = true;
      setFeedbackVisible(false);
      setLifeModalVisible(true);
      return true;
    }

    return false;
  };

  const handleConfirm = () => {
    if (!respostaSelecionada) {
      Alert.alert('Atenção', 'Selecione uma alternativa antes de confirmar.');
      return;
    }

    const alternativaCorreta = questaoAtual.alternativa_correta;
    const isCorrect = respostaSelecionada === alternativaCorreta;

    if (isCorrect) {
      acertosRef.current += 1;
      xpRef.current += 2;
    } else {
      errosRef.current += 1;
      const gameOver = aplicarPerdaDeVida();
      if (gameOver) return;
    }

    setFeedbackInfo({
      isCorrect,
      correctAlternative: alternativaCorreta,
    });

    setFeedbackVisible(true);
  };

  const handleCloseFeedback = () => {
    setFeedbackVisible(false);

    const proximaQuestaoIndex = currentIndex + 1;
    const temProximaQuestao = proximaQuestaoIndex < allAtividades.length;

    if (temProximaQuestao) {
      setCurrentIndex((prev) => prev + 1);
      setRespostaSelecionada(null);
    } else {
      mostrarResumoFinal();
    }
  };

  const handleSkip = () => {
    errosRef.current += 1;

    const gameOver = aplicarPerdaDeVida();
    if (gameOver) return;

    const proximaQuestaoIndex = currentIndex + 1;
    const temProximaQuestao = proximaQuestaoIndex < allAtividades.length;

    if (temProximaQuestao) {
      setCurrentIndex((prev) => prev + 1);
      setRespostaSelecionada(null);
    } else {
      mostrarResumoFinal();
    }
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
    <QuestaoContainer>
      <QuestaoText>{questaoAtual.questao}</QuestaoText>

      <AlternativasContainer
        style={
          tipoQuestao === 'texto'
            ? { flexDirection: 'column', flexWrap: 'nowrap', justifyContent: 'flex-start' }
            : null
        }
      >
        {questaoAtual.opcoes.map((item) =>
          tipoQuestao === 'texto'
            ? renderAlternativaTexto(item.alternativa, item.texto)
            : renderAlternativaFigura(item.alternativa, item.imagem),
        )}
      </AlternativasContainer>
    </QuestaoContainer>
  );

  const handleRecomecar = () => {
    acertosRef.current = 0;
    errosRef.current = 0;
    xpRef.current = 0;

    setResumoVisible(false);
    setFeedbackVisible(false);
    setRespostaSelecionada(null);
    setCurrentIndex(0);
  };

  const handleFecharResumo = () => {
    setResumoVisible(false);
    navegarParaHomeComResultado();
  };

  const handleLifeModalConfirm = () => {
    setLifeModalVisible(false);

    acertosRef.current = 0;
    errosRef.current = 0;
    xpRef.current = 0;

    setResumoVisible(false);
    setFeedbackVisible(false);
    setRespostaSelecionada(null);
    setCurrentIndex(0);

    if (headerRef.current?.resetLives) {
      headerRef.current.resetLives();
    }
  };

  const handleCloseActivity = () => {
    const resumoParcial = calcularResumo();

    const resultado = {
      ...resumoParcial,
      aprovado: false,
      xpGanho: 0,
      bonusVida: false,
    };

    navigation.navigate('Tab', {
      screen: 'Home',
      params: {
        resultadoAtividade: resultado,
      },
    });
  };

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
          keyExtractor={(item) => item.id}
          renderItem={renderQuestao}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1, paddingBottom: 8 }}
        />
      </ContentContainer>

      <ButtonContainer>
        <SkipButton onPress={handleSkip} />
        <NextButton onPress={handleConfirm} />
      </ButtonContainer>

      <FeedbackModal
        visible={feedbackVisible}
        isCorrect={feedbackInfo.isCorrect}
        correctAlternative={feedbackInfo.correctAlternative}
        onClose={handleCloseFeedback}
      />

      <ResumoAtividadeModal
        visible={resumoVisible}
        resumoDados={resumoDados}
        onClose={handleFecharResumo}
        onRecomecar={handleRecomecar}
        onContinuar={handleFecharResumo}
      />

      <LifeLostModal
        visible={lifeModalVisible}
        onConfirm={handleLifeModalConfirm}
      />
    </AtivContainer>
  );
}

export default AtivDuracao;