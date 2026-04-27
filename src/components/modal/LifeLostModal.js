import React, { useEffect } from 'react';
import { Modal } from 'react-native';
import Sound from 'react-native-sound';

import {
  Overlay,
  Container,
  Title,
  Message,
  Divider,
  ActionButton,
  ActionButton2,
  ActionButtonText,
  ActionButtonText2,
  ButtonsRow,
  Message2
} from './LifeLostModalStyles';

const failSound = require('../../assets/sounds/feedback/fail.mp3');

export default function LifeLostModal({ visible, onConfirm, onExit }) {
  useEffect(() => {
    Sound.setCategory('Playback');
  }, []);

  useEffect(() => {
    if (!visible) return;

    const sound = new Sound(failSound, (error) => {
      if (error) {
        console.log('Erro ao carregar fail.mp3:', error);
        return;
      }

      sound.play((success) => {
        if (!success) {
          console.log('Falha ao reproduzir fail.mp3');
        }
        sound.release();
      });
    });

    return () => {
      try {
        sound.stop(() => sound.release());
      } catch (e) {}
    };
  }, [visible]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onExit || onConfirm}
    >
      <Overlay>
        <Container>
          <Title>Você ficou sem vidas! ❤️‍🩹</Title>

          <Message>
            O limite de erros desta atividade foi atingido.{'\n'}
          </Message>
          <Message2>
            Deseja tentar novamente com {'\n'} mais 2 chances? 🔄
          </Message2>

          <Divider />

          <ButtonsRow>

            <ActionButton2 onPress={onExit}>
              <ActionButtonText2>SAIR</ActionButtonText2>
            </ActionButton2>

            <ActionButton onPress={onConfirm}>
              <ActionButtonText>TENTAR NOVAMENTE</ActionButtonText>
            </ActionButton>
            
          </ButtonsRow>
        </Container>
      </Overlay>
    </Modal>
  );
}