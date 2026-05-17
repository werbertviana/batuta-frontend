import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Animated, Text, View, ScrollView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Sound from 'react-native-sound';

import { getActivityCallbacks } from '../../hooks/activityNavigationRegistry';

import {
  Container,
  Content,
  Card,
  HeaderImage,
  MessageContainer,
  MessageSubText,
  InfoBox,
  InfoLabel,
  InfoValue,
  InfoIcon,
  ButtonsRow,
  ActionButton,
  ActionButton2,
  ActionButtonText,
  Divider,
  Divider2,
} from './ResumoAtividadeStyles';

import CheckIcon from '../../assets/icons/check.png';
import ErrorIcon from '../../assets/icons/fail.png';
import XpIcon from '../../assets/icons/xp.png';

const atividadeConcluidaHeader = require('../../assets/images/resumo/atividade_concluida.png');
const atividadeNaoConcluidaHeader = require('../../assets/images/resumo/atividade_naoconcluida.png');

const win2Sound = require('../../assets/sounds/feedback/win2.mp3');
const failSound = require('../../assets/sounds/feedback/fail.mp3');

function formatPercent(value) {
  if (value == null) return '0%';
  return `${Math.round(value)}%`;
}

export default function ResumoAtividade() {
  const navigation = useNavigation();
  const route = useRoute();
  const pulseAnim = useRef(new Animated.Value(1)).current;

  const [loadingAction, setLoadingAction] = useState(null);

  const {
    callbackKey,
    resumoDados,
    continuarRoute = 'Home',
    recomecarRoute,
  } = route.params || {};

  const callbacks = getActivityCallbacks(callbackKey);
  const isLoading = !!loadingAction;

  useEffect(() => {
    Sound.setCategory('Playback');
  }, []);

  const percentualAcerto = resumoDados?.percentualAcerto ?? 0;
  const aprovado = percentualAcerto >= 50;

  const headerImage = aprovado
    ? atividadeConcluidaHeader
    : atividadeNaoConcluidaHeader;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.035,
          duration: 850,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 850,
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
    if (!resumoDados) return;

    const soundFile = aprovado ? win2Sound : failSound;

    const sound = new Sound(soundFile, error => {
      if (error) {
        console.log('Erro ao carregar som do resumo:', error);
        return;
      }

      sound.play(success => {
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
  }, [aprovado, resumoDados]);

  const handleRecomecarPress = async () => {
    if (isLoading) return;

    try {
      setLoadingAction('restart');

      if (callbacks?.onRecomecar) {
        await Promise.resolve(callbacks.onRecomecar());
        return;
      }

      if (recomecarRoute) {
        navigation.replace(recomecarRoute);
        return;
      }

      navigation.goBack();
    } catch (error) {
      console.log('[RESUMO] erro ao recomeçar:', error);
      setLoadingAction(null);
    }
  };

  const handleContinuarPress = async () => {
    if (isLoading) return;

    try {
      setLoadingAction('continue');

      if (callbacks?.onContinuar) {
        await Promise.resolve(callbacks.onContinuar());
        return;
      }

      navigation.reset({
        index: 0,
        routes: [{ name: continuarRoute }],
      });
    } catch (error) {
      console.log('[RESUMO] erro ao continuar:', error);
      setLoadingAction(null);
    }
  };

  if (!resumoDados) {
    return (
      <Container>
        <Content>
          <Card>
            <HeaderImage
              source={atividadeNaoConcluidaHeader}
              resizeMode="contain"
              style={{ transform: [{ scale: pulseAnim }] }}
            />

            <MessageSubText>
              Não foi possível carregar o resumo.
            </MessageSubText>

            <ButtonsRow>
              <ActionButton2
                isPrimary
                onPress={() => navigation.navigate('Home')}
              >
                <ActionButtonText>VOLTAR</ActionButtonText>
              </ActionButton2>
            </ButtonsRow>
          </Card>
        </Content>
      </Container>
    );
  }

  const {
    acertos = 0,
    erros = 0,
    xpGanho = 0,
    xpBaseGanho = 0,
    xpBonusGanho = 0,
  } = resumoDados;

  const mostrarComposicaoXp = xpBaseGanho > 0 || xpBonusGanho > 0;

  return (
    <Container>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24 }}
      >
        <Content>
          <Card>
            <HeaderImage
              source={headerImage}
              resizeMode="contain"
              style={{ transform: [{ scale: pulseAnim }] }}
            />

            <MessageContainer>
              {aprovado ? (
                <MessageSubText>
                  Com {formatPercent(percentualAcerto)} de aproveitamento,
                  você está avançando na sua jornada musical.
                </MessageSubText>
              ) : (
                <MessageSubText>
                  Para avançar, você precisa de pelo menos 50% de acertos.
                  Que tal tentar de novo e melhorar seu resultado?
                </MessageSubText>
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
                    {' '}
                    +{' '}
                    <Text
                      style={{
                        color: '#F4B400',
                        fontFamily: 'GothamCondensed-Bold',
                      }}
                    >
                      {xpBonusGanho} XP bônus
                    </Text>
                  </Text>
                ) : null}
              </MessageSubText>
            )}

            <Divider />

            <ButtonsRow>
              {aprovado ? (
                <>
                  <ActionButton2
                    isPrimary
                    onPress={handleContinuarPress}
                    disabled={isLoading}
                  >
                    {loadingAction === 'continue' ? (
                      <ActivityIndicator color="#ffffff" />
                    ) : (
                      <ActionButtonText>CONTINUAR</ActionButtonText>
                    )}
                  </ActionButton2>

                  <ActionButton
                    onPress={handleRecomecarPress}
                    disabled={isLoading}
                  >
                    {loadingAction === 'restart' ? (
                      <ActivityIndicator color="#ffffff" />
                    ) : (
                      <ActionButtonText>RECOMEÇAR</ActionButtonText>
                    )}
                  </ActionButton>
                </>
              ) : (
                <>
                  <ActionButton
                    isPrimary
                    onPress={handleRecomecarPress}
                    disabled={isLoading}
                  >
                    {loadingAction === 'restart' ? (
                      <ActivityIndicator color="#ffffff" />
                    ) : (
                      <ActionButtonText>RECOMEÇAR</ActionButtonText>
                    )}
                  </ActionButton>

                  <ActionButton2
                    onPress={handleContinuarPress}
                    disabled={isLoading}
                  >
                    {loadingAction === 'continue' ? (
                      <ActivityIndicator color="#ffffff" />
                    ) : (
                      <ActionButtonText>CONTINUAR</ActionButtonText>
                    )}
                  </ActionButton2>
                </>
              )}
            </ButtonsRow>
          </Card>
        </Content>
      </ScrollView>
    </Container>
  );
}