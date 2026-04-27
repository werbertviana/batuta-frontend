import React, { useEffect } from 'react';
import { Modal, View, Text } from 'react-native';
import Sound from 'react-native-sound';

import {
  Overlay,
  Container,
  Title,
  MessageContainer,
  MessageText,
  MessageSubText,
  InfoBox,
  InfoLabel,
  InfoValue,
  InfoIcon,
  ButtonsRow,
  ActionButton,
  ActionButtonText,
  ActionButton2,
  Divider,
  Divider2,
} from './ResumoAtividadeModalStyles';

import CheckIcon from '../../assets/icons/check.png';
import ErrorIcon from '../../assets/icons/fail.png';
import XpIcon from '../../assets/icons/xp.png';

// Sons de feedback
const win2Sound = require('../../assets/sounds/feedback/win2.mp3');
const failSound = require('../../assets/sounds/feedback/fail.mp3');

function formatPercent(value) {
  if (value == null) return '0%';
  return `${Math.round(value)}%`;
}

export default function ResumoAtividadeModal({
  visible,
  resumoDados,
  onClose,
  onRecomecar,
  onContinuar,
}) {
  useEffect(() => {
    Sound.setCategory('Playback');
  }, []);

  const percentualAcerto = resumoDados?.percentualAcerto ?? 0;
  const aprovado = percentualAcerto >= 50;

  useEffect(() => {
    if (!visible || !resumoDados) return;

    const soundFile = aprovado ? win2Sound : failSound;

    const sound = new Sound(soundFile, (error) => {
      if (error) {
        console.log('Erro ao carregar som do resumo:', error);
        return;
      }

      sound.play((success) => {
        if (!success) {
          console.log('Erro ao reproduzir som do resumo');
        }
        sound.release();
      });
    });

    return () => {
      try {
        sound.stop(() => sound.release());
      } catch (e) {}
    };
  }, [visible, aprovado, resumoDados]);

  if (!resumoDados) return null;

  const {
    acertos,
    erros,
    xpGanho = 0,
    xpBaseGanho = 0,
    xpBonusGanho = 0,
  } = resumoDados;

  const handleRecomecarPress = () => {
    if (onRecomecar) onRecomecar();
  };

  const handleContinuarPress = () => {
    if (onContinuar) onContinuar();
    else if (onClose) onClose();
  };

  const mostrarComposicaoXp = xpBaseGanho > 0 || xpBonusGanho > 0;

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      onRequestClose={handleContinuarPress}
    >
      <Overlay>
        <Container>
          <Title> RESUMO DA ATIVIDADE 📋 </Title>

          <MessageContainer>
            {aprovado ? (
              <>
                <MessageText variant="success">
                  Parabéns! Você mandou muito bem! 🎉
                </MessageText>

                <MessageSubText>
                  Com {formatPercent(percentualAcerto)} de aproveitamento, você está
                  avançando na sua jornada musical.
                </MessageSubText>
              </>
            ) : (
              <>
                <MessageText variant="fail">
                  Boa tentativa! Não desanime. 🚀
                </MessageText>

                <MessageSubText>
                  Para avançar, você precisa de pelo menos 50% de acertos.
                  Que tal tentar de novo e melhorar seu resultado?
                </MessageSubText>
              </>
            )}
          </MessageContainer>

          <InfoBox>
            <InfoLabel>Acertos</InfoLabel>

            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <InfoValue>{acertos}</InfoValue>
              <InfoIcon source={CheckIcon} resizeMode="contain" />
            </View>
          </InfoBox>

          <Divider2 />

          <InfoBox>
            <InfoLabel>Erros</InfoLabel>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <InfoValue>{erros}</InfoValue>
              <InfoIcon source={ErrorIcon} resizeMode="contain" />
            </View>
          </InfoBox>

          <Divider2 />

          <View>
            <InfoBox>
              <InfoLabel>XP ganho</InfoLabel>

              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <InfoValue>{xpGanho}</InfoValue>
                <InfoIcon source={XpIcon} resizeMode="contain" />
              </View>
            </InfoBox>

            {mostrarComposicaoXp && (
              <MessageSubText
                style={{
                  textAlign: 'center',
                  marginTop: 4,
                  marginBottom: 2,
                  fontSize: 20,
                  color: '#777',
                }}
              >
                {xpBaseGanho} XP da atividade
                {xpBonusGanho > 0 ? (
                  <Text style={{ color: '#777' }}>
                    {' '}+ <Text style={{ color: '#F4B400', fontFamily: 'GothamCondensed-Bold' }}>{xpBonusGanho} XP bônus</Text>
                  </Text>
                ) : null}
              </MessageSubText>
            )}
          </View>

          <Divider />

          <ButtonsRow>
            <ActionButton onPress={handleRecomecarPress}>
              <ActionButtonText>RECOMEÇAR</ActionButtonText>
            </ActionButton>

            <ActionButton2 onPress={handleContinuarPress}>
              <ActionButtonText>CONTINUAR</ActionButtonText>
            </ActionButton2>
          </ButtonsRow>
        </Container>
      </Overlay>
    </Modal>
  );
}