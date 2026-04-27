import React, { useEffect } from 'react';
import { Modal, View, Text, Image } from 'react-native';
import Sound from 'react-native-sound';

import {
  Overlay,
  Container,
  Title,
  Message,
  Button,
  ButtonText,
} from './EloUpModalStyles';

const rankupSound = require('../../assets/sounds/feedback/victory.mp3');

function formatEloLabel(elo) {
  if (!elo) return '';

  const map = {
    ferro: 'Ferro',
    bronze: 'Bronze',
    prata: 'Prata',
    ouro: 'Ouro',
    platina: 'Platina',
    diamante: 'Diamante',
    maestro: 'Maestro',
  };

  return map[String(elo).toLowerCase()] ?? elo;
}

function getEloIcon(elo) {
  switch (String(elo).toLowerCase()) {
    case 'ferro':
      return require('../../assets/icons/ferro.png');
    case 'bronze':
      return require('../../assets/icons/bronze.png');
    case 'prata':
      return require('../../assets/icons/prata.png');
    case 'ouro':
      return require('../../assets/icons/ouro.png');
    case 'platina':
      return require('../../assets/icons/platina.png');
    case 'diamante':
      return require('../../assets/icons/diamante.png');
    case 'maestro':
      return require('../../assets/icons/maestro.png');
    default:
      return null;
  }
}

export default function EloUpModal({
  visible,
  onClose,
  eloAnterior,
  eloAtual,
}) {
  useEffect(() => {
    Sound.setCategory('Playback');
  }, []);

  useEffect(() => {
    if (!visible) return;

    const sound = new Sound(rankupSound, (error) => {
      if (error) {
        console.log('Erro ao carregar som de rank up:', error);
        return;
      }

      sound.play((success) => {
        if (!success) {
          console.log('Erro ao reproduzir som de rank up');
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
          <Title>Você subiu de elo! 🏆</Title>

          <Message>
            Sua evolução musical foi reconhecida. Continue assim para alcançar
            novos níveis!
          </Message>

          <View
            style={{
              alignSelf: 'center',
            }}
          >
            {/* ELO ANTERIOR */}
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 4,
              }}
            >
              <Image
                source={getEloIcon(eloAnterior)}
                resizeMode="contain"
                style={{
                  width: 45,
                  height: 45,
                }}
              />

              <Text
                style={{
                  fontFamily: 'GothamCondensed-Bold',
                  fontSize: 30,
                  marginLeft: 10,
                  color: '#333333',
                }}
              >
                {formatEloLabel(eloAnterior)}
              </Text>
            </View>

            {/* SETA */}
            <Text
              style={{
                textAlign: 'center',
                fontSize: 30,
                color: '#38bfdc',
                marginVertical: 2,
                fontFamily: 'GothamCondensed-Bold',
              }}
            >
              ↓
            </Text>

            {/* ELO NOVO */}
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}
            >
              <Image
                source={getEloIcon(eloAtual)}
                resizeMode="contain"
                style={{
                  width: 45,
                  height: 45,
                }}
              />

              <Text
                style={{
                  fontFamily: 'GothamCondensed-Bold',
                  fontSize: 30,
                  marginLeft: 10,
                  color: '#333333',
                }}
              >
                {formatEloLabel(eloAtual)}
              </Text>
            </View>
          </View>

          <Button onPress={onClose}>
            <ButtonText>CONTINUAR</ButtonText>
          </Button>
        </Container>
      </Overlay>
    </Modal>
  );
}