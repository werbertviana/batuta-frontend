import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Animated, ScrollView, View } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Sound from 'react-native-sound';

import {
  Container,
  Content,
  Card,
  HeaderImage,
  Message,
  MessageStrong,
  ProgressBox,
  ProgressText,
  InfoBox,
  InfoLabel,
  InfoValue,
  InfoIcon,
  Divider,
  Divider2,
  ButtonsColumn,
  RetryButton,
  ExitButton,
  RetryButtonText,
  ExitButtonText,
} from './GameOverStyles';

import CheckIcon from '../../assets/icons/check.png';
import ErrorIcon from '../../assets/icons/fail.png';

const gameOverHeader = require('../../assets/images/resumo/gameover.png');
const failSound = require('../../assets/sounds/feedback/fail.mp3');

export default function GameOver() {
  const navigation = useNavigation();
  const route = useRoute();
  const pulseAnim = useRef(new Animated.Value(1)).current;

  const [loadingAction, setLoadingAction] = useState(null);

  const {
    onRetry,
    onExit,
    retryRoute,
    exitRoute = 'Home',
    acertos = 0,
    erros = 0,
    totalQuestoes = 0,
    questaoAtual = 0,
  } = route.params || {};

  const isLoading = !!loadingAction;

  useEffect(() => {
    Sound.setCategory('Playback');
  }, []);

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.02,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: true,
        }),
      ]),
    );

    animation.start();

    return () => {
      animation.stop();
    };
  }, [pulseAnim]);

  useEffect(() => {
    const sound = new Sound(failSound, error => {
      if (error) {
        console.log('Erro ao carregar fail.mp3:', error);
        return;
      }

      sound.play(success => {
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
  }, []);

  const handleRetry = async () => {
    if (isLoading) return;

    try {
      setLoadingAction('retry');

      if (onRetry) {
        await Promise.resolve(onRetry());
        return;
      }

      if (retryRoute) {
        navigation.replace(retryRoute);
        return;
      }

      navigation.goBack();
    } catch (error) {
      console.log('[GAME OVER] erro ao tentar novamente:', error);
      setLoadingAction(null);
    }
  };

  const handleExit = async () => {
    if (isLoading) return;

    try {
      setLoadingAction('exit');

      if (onExit) {
        await Promise.resolve(onExit());
        return;
      }

      navigation.reset({
        index: 0,
        routes: [{ name: exitRoute }],
      });
    } catch (error) {
      console.log('[GAME OVER] erro ao sair:', error);
      setLoadingAction(null);
    }
  };

  const shouldShowReachedQuestion = totalQuestoes > 0 && questaoAtual > 0;

  return (
    <Container>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24 }}
      >
        <Content>
          <Card>
            <HeaderImage
              source={gameOverHeader}
              resizeMode="contain"
              style={{ transform: [{ scale: pulseAnim }] }}
            />

            <Message>Ops! Suas vidas acabaram nesta atividade.</Message>

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

            {shouldShowReachedQuestion && (
              <ProgressBox>
                <ProgressText>
                  Você chegou até a questão {questaoAtual} de {totalQuestoes}.
                </ProgressText>
              </ProgressBox>
            )}

            <MessageStrong>
              Deseja tentar novamente com mais 2 chances? 🔄
            </MessageStrong>

            <Divider />

            <ButtonsColumn>
              <RetryButton onPress={handleRetry} disabled={isLoading}>
                {loadingAction === 'retry' ? (
                  <ActivityIndicator color="#ffffff" />
                ) : (
                  <RetryButtonText>TENTAR NOVAMENTE</RetryButtonText>
                )}
              </RetryButton>

              <ExitButton onPress={handleExit} disabled={isLoading}>
                {loadingAction === 'exit' ? (
                  <ActivityIndicator color="#333333" />
                ) : (
                  <ExitButtonText>SAIR</ExitButtonText>
                )}
              </ExitButton>
            </ButtonsColumn>
          </Card>
        </Content>
      </ScrollView>
    </Container>
  );
}