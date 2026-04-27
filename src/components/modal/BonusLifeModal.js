import React, { useEffect } from 'react';
import { Modal, View, Text } from 'react-native';
import Sound from 'react-native-sound';

import {
  Overlay,
  Container,
  Title,
  Message,
  Button,
  ButtonText,
  Divider
} from './BonusLifeModalStyles';

// Som de vitória ao ganhar bônus
const victorySound = require('../../assets/sounds/feedback/victory.mp3');

export default function BonusLifeModal({ visible, onClose }) {
  useEffect(() => {
    Sound.setCategory('Playback');
  }, []);

  useEffect(() => {
    if (!visible) return;

    const sound = new Sound(victorySound, (error) => {
      if (error) {
        console.log('Erro ao carregar victory.mp3:', error);
        return;
      }

      sound.play((success) => {
        if (!success) {
          console.log('Erro ao reproduzir victory.mp3');
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
      onRequestClose={onClose}
    >
      <Overlay>
        <Container>
          <Title>Performance impecável! 🎤</Title>

          <Message>
            Você concluiu esta atividade com desempenho perfeito e ganhou: 
          </Message>
          <Divider/>
          <View
            style={{
              marginTop: 10,
              alignSelf: 'center',
            }}
          >
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: 10,
                marginBottom: 2,
              }}
            >
              <Text
                style={{
                  width: 34,
                  textAlign: 'center',
                  fontSize: 28,
                }}
              >
                ❤️
              </Text>

              <Text
                style={{
                  fontFamily: 'GothamCondensed-Bold',
                  fontSize: 28,
                  marginLeft: 10,
                  color: '#333333'
                }}
              >
                +1 ponto de vida
              </Text>
            </View>

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 2
              }}
            >
              <Text
                style={{
                  width: 34,
                  textAlign: 'center',
                  fontSize: 28,
                }}
              >
                ⭐
              </Text>

              <Text
                style={{
                  fontFamily: 'GothamCondensed-Bold',
                  fontSize: 28,
                  marginLeft: 10,
                  color: '#333333'
                }}
              >
                +1 XP bônus
              </Text>
            </View>
          </View>
          <Message
            style={{
              fontSize: 22,
              textAlign: 'center',
              marginTop: 14,
            }}
          >
            Obs.: bônus único por atividade.
          </Message>
          <Divider/>
          <Button onPress={onClose}>
            <ButtonText>CONTINUAR</ButtonText>
          </Button>
        </Container>
      </Overlay>
    </Modal>
  );
}