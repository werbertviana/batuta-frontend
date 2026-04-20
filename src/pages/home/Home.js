import React, { useState, useEffect, useCallback } from 'react';
import { FlatList, View, TouchableOpacity, Dimensions } from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

import Header from '../../components/header/Header';
import staticFeeds from '../../data/feeds/feeds.json';

import {
  Background,
  HomeContainer,
  FeedContainer,
  ItemContainer,
  LessonContainer,
  IconLesson,
} from './HomeStyles';

import FeedItem from '../../components/feedItem/FeedItem';

import Licao01 from '../../assets/images/home/licao01_active.png';
import Licao02 from '../../assets/images/home/licao02_active.png';
import Licao02Inactive from '../../assets/images/home/licao02_inactive.png';

import LockedModal from '../../components/modal/LockedModal';
import BonusLifeModal from '../../components/modal/BonusLifeModal';

import { getLifeGlobal, setLifeGlobal } from '../../store/lifeStore';

const Bg = require('../../assets/images/home/bg.png');

const { width, height } = Dimensions.get('window');

// globais da sessão
let lastUserId = null;
let nivelGlobal = null;
let xpGlobal = 0;
let batutaGlobal = 0;

// controle por sessão
const atividadesComBonus = new Set();
const atividadesConcluidas = new Set();
const licoesComBatuta = new Set();

// fallback para garantir unicidade se vier tudo indefinido
let resultadoSeq = 0;

function getResultadoId(resultado) {
  const raw =
    resultado?.atividadeId ||
    resultado?.atividade ||
    resultado?.practiceRoute ||
    (resultado?.lesson && resultado?.itemId
      ? `lesson-${resultado.lesson}-item-${resultado.itemId}`
      : null);

  if (raw && String(raw).trim()) return String(raw);

  resultadoSeq += 1;
  return `resultado-${Date.now()}-${resultadoSeq}`;
}

function Home({ route }) {
  const navigation = useNavigation();
  const { user, updateGameStats } = useAuth();
  const currentUser = user;

  const [lockedLessonVisible, setLockedLessonVisible] = useState(false);
  const [bonusModalVisible, setBonusModalVisible] = useState(false);

  const [nivel, setNivel] = useState(() => (nivelGlobal ?? 1));
  const [life, setLife] = useState(getLifeGlobal());
  const [batutaPoints, setBatutaPoints] = useState(() => batutaGlobal);
  const [xpPoints, setXpPoints] = useState(() => xpGlobal);

  useEffect(() => {
    if (!currentUser?.gameStats) return;

    const userId = currentUser.id;
    const changedUser = lastUserId !== userId;

    if (changedUser) {
      lastUserId = userId;

      atividadesComBonus.clear();
      atividadesConcluidas.clear();
      licoesComBatuta.clear();
      resultadoSeq = 0;

      xpGlobal = Number(currentUser.gameStats.xpPoints || 0);
      setXpPoints(xpGlobal);

      batutaGlobal = Number(currentUser.gameStats.batutaPoints || 0);
      setBatutaPoints(batutaGlobal);

      const backendLife = Math.max(0, Number(currentUser.gameStats.lifePoints ?? 3));
      setLifeGlobal(backendLife);
      setLife(backendLife);

      const backendNivel = Math.max(1, Number(currentUser.gameStats.nivel || 1));
      nivelGlobal = backendNivel;
      setNivel(backendNivel);

      console.log('[HOME] init backend (novo usuário):', {
        userId,
        backendNivel,
        xpGlobal,
        batutaGlobal,
        backendLife,
      });
    } else {
      console.log('[HOME] mesmo usuário - não reinit do backend:', userId);
    }
  }, [currentUser?.id, currentUser?.gameStats]);

  const lesson1 = staticFeeds.feeds.find((l) => l.lesson === '1');
  const totalItensLicao1 = lesson1?.items?.length || 0;

  const lesson2 = staticFeeds.feeds.find((l) => l.lesson === '2');
  const totalItensLicao2 = lesson2?.items?.length || 0;

  const licao1Concluida = nivel > totalItensLicao1;
  const licao2Concluida = nivel > (totalItensLicao1 + totalItensLicao2);
  const licao2Bloqueada = !licao1Concluida;

  // tamanhos responsivos quando a lição 02 estiver bloqueada
  const compactLesson1IconWidth = Math.min(width * 0.68, 260);
  const compactLesson1IconHeight = Math.min(height * 0.12, 110);
  const compactLesson1BoardHeight = Math.min(height * 0.55, 400);

  const lockedLessonIconWidth = Math.min(width * 0.64, 250);
  const lockedLessonIconHeight = Math.min(height * 0.1, 95);
  const lockedCardWidth = Math.min(width * 0.68, 250);
  const lockedCardHeight = Math.min(height * 0.11, 100);
  const lockedCardMarginBottom = Math.max(height * 0.025, 18);

  useFocusEffect(
    useCallback(() => {
      const resultado = route?.params?.resultadoAtividade;
      if (!resultado) return;

      console.log('[HOME] resultadoAtividade recebido:', resultado);

      const resultadoId = getResultadoId(resultado);

      // XP
      if (resultado.xpGanho) {
        xpGlobal += resultado.xpGanho;
        setXpPoints(xpGlobal);
      }

      // VIDA
      let novaVida = getLifeGlobal();

      if (typeof resultado.vidasRestantes === 'number') {
        novaVida = Math.max(0, resultado.vidasRestantes);
      }

      if (resultado.bonusVida) {
        if (!atividadesComBonus.has(resultadoId)) {
          atividadesComBonus.add(resultadoId);
          novaVida += 1;
          setBonusModalVisible(true);
        }
      }

      setLifeGlobal(novaVida);
      setLife(novaVida);

      // NÍVEL
      const deveSubirNivel =
        resultado?.concluida === true || resultado?.aprovado === true;

      let nextNivel = nivelGlobal ?? nivel;

      if (deveSubirNivel) {
        if (!atividadesConcluidas.has(resultadoId)) {
          atividadesConcluidas.add(resultadoId);

          nextNivel = (nivelGlobal ?? nivel) + 1;
          nivelGlobal = nextNivel;
          setNivel(nextNivel);

          console.log('[HOME] nível subiu para:', nextNivel, 'via', resultadoId);
        } else {
          console.log('[HOME] ignorado (já concluída na sessão):', resultadoId);
        }
      } else {
        console.log('[HOME] não subiu nível (concluida/aprovado false):', resultadoId);
      }

      updateGameStats({
        nivel: String(nivelGlobal ?? nextNivel),
        xpPoints: Number(xpGlobal || 0),
        lifePoints: Number(novaVida || 0),
        batutaPoints: Number(batutaGlobal || 0),
      });

      navigation.setParams({ resultadoAtividade: undefined });
    }, [route?.params?.resultadoAtividade, navigation, updateGameStats, nivel])
  );

  useEffect(() => {
    let changed = false;

    if (licao1Concluida && !licoesComBatuta.has('lesson-1')) {
      licoesComBatuta.add('lesson-1');
      batutaGlobal += 1;
      setBatutaPoints(batutaGlobal);
      changed = true;
    }

    if (licao2Concluida && !licoesComBatuta.has('lesson-2')) {
      licoesComBatuta.add('lesson-2');
      batutaGlobal += 1;
      setBatutaPoints(batutaGlobal);
      changed = true;
    }

    if (changed) {
      updateGameStats({
        batutaPoints: Number(batutaGlobal || 0),
      });
    }
  }, [licao1Concluida, licao2Concluida, updateGameStats]);

  const getLessonIcon = (lessonNumber) => {
    if (lessonNumber === '1') return Licao01;
    if (lessonNumber === '2') return Licao02;
    return null;
  };

  const isItemActive = (lesson, index) => {
    const lessonNumber = Number(lesson.lesson);

    if (lessonNumber === 1) {
      const allowed = Math.min(nivel, lesson.items.length);
      return index < allowed;
    }

    if (lessonNumber === 2) {
      if (licao2Bloqueada) return false;

      const offset = totalItensLicao1;
      const nivelNaLicao2 = Math.max(0, nivel - offset);
      const allowed = Math.min(nivelNaLicao2, lesson.items.length);
      return index < allowed;
    }

    return true;
  };

  const renderLessonBlock = ({ item: lesson }) => {
    const itens = lesson.items;

    if (lesson.lesson === '2' && licao2Bloqueada) {
      return (
        <FeedContainer style={{ alignItems: 'center', marginTop: 4 }}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setLockedLessonVisible(true)}
          >
            <View style={{ alignItems: 'center', opacity: 0.5 }}>
              <LessonContainer>
                <IconLesson
                  source={Licao02Inactive}
                  resizeMode="contain"
                  style={{
                    width: lockedLessonIconWidth,
                    height: lockedLessonIconHeight,
                    marginBottom: 8,
                  }}
                />
              </LessonContainer>

              <View
                style={{
                  width: lockedCardWidth,
                  height: lockedCardHeight,
                  backgroundColor: '#fff',
                  borderRadius: 16,
                  marginBottom: lockedCardMarginBottom,
                }}
              />
            </View>
          </TouchableOpacity>
        </FeedContainer>
      );
    }

    return (
      <FeedContainer style={licao2Bloqueada ? { marginTop: Math.max(height * 0.02, 20) } : undefined}>
        <LessonContainer>
          <IconLesson
            resizeMode="contain"
            source={getLessonIcon(lesson.lesson)}
            style={
              licao2Bloqueada && lesson.lesson === '1'
                ? {
                    width: compactLesson1IconWidth,
                    height: compactLesson1IconHeight,
                    marginBottom: 8,
                  }
                : undefined
            }
          />
        </LessonContainer>

        <Background
          resizeMode="contain"
          source={Bg}
          style={
            licao2Bloqueada && lesson.lesson === '1'
              ? {
                  height: compactLesson1BoardHeight,
                  marginBottom: 8,
                }
              : undefined
          }
        >
          <ItemContainer>
            {itens.map((item, index) => (
              <FeedItem
                key={item.id}
                title={item.title}
                icon={item.icon}
                isActive={isItemActive(lesson, index)}
                practiceRoute={item.practiceRoute}
              />
            ))}
          </ItemContainer>
        </Background>
      </FeedContainer>
    );
  };

  return (
    <HomeContainer>
      <Header xpPoints={xpPoints} batutaPoints={batutaPoints} lifePoints={life} />

      <FlatList
        data={staticFeeds.feeds}
        keyExtractor={(lesson) => lesson.lesson}
        renderItem={renderLessonBlock}
        showsVerticalScrollIndicator={false}
        scrollEnabled={licao2Bloqueada ? false : true}
        contentContainerStyle={{
          paddingBottom: licao2Bloqueada ? 20 : 40,
        }}
      />

      <LockedModal
        visible={lockedLessonVisible}
        onClose={() => setLockedLessonVisible(false)}
        message="Complete a Lição 01 para desbloquear esta lição."
      />

      <BonusLifeModal
        visible={bonusModalVisible}
        onClose={() => setBonusModalVisible(false)}
      />
    </HomeContainer>
  );
}

export default Home;