// src/screens/home/Home.js

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
import EloUpModal from '../../components/modal/EloUpModal';

import { getLifeGlobal, setLifeGlobal } from '../../store/lifeStore';

const Bg = require('../../assets/images/home/bg.png');

const { width, height } = Dimensions.get('window');

function Home({ route }) {
  const navigation = useNavigation();
  const { user } = useAuth();
  const currentUser = user;

  const [lockedLessonInfo, setLockedLessonInfo] = useState({
    visible: false,
    lessonNumber: null,
  });

  const [bonusModalVisible, setBonusModalVisible] = useState(false);
  const [bonusReward, setBonusReward] = useState({
    bonusVidaGanha: false,
    bonusXpGanho: false,
  });

  const [eloModalVisible, setEloModalVisible] = useState(false);
  const [eloReward, setEloReward] = useState({
    eloAnterior: null,
    eloAtual: null,
  });

  const [progressLevel, setProgressLevel] = useState(1);
  const [life, setLife] = useState(getLifeGlobal());
  const [batutaPoints, setBatutaPoints] = useState(0);
  const [xpPoints, setXpPoints] = useState(0);

  useEffect(() => {
    if (!currentUser?.gameStats) return;

    const backendLife = Math.max(0, Number(currentUser.gameStats.lifePoints ?? 3));
    const backendXp = Math.max(0, Number(currentUser.gameStats.xpPoints ?? 0));
    const backendBatutas = Math.max(
      0,
      Number(currentUser.gameStats.batutaPoints ?? 0),
    );
    const backendProgressLevel = Math.max(
      1,
      Number(currentUser.gameStats.progressLevel ?? 1),
    );

    setLifeGlobal(backendLife);
    setLife(backendLife);
    setXpPoints(backendXp);
    setBatutaPoints(backendBatutas);
    setProgressLevel(backendProgressLevel);
  }, [currentUser?.id, currentUser?.gameStats]);

  useFocusEffect(
    useCallback(() => {
      const processResultado = async () => {
        const resultado = route?.params?.resultadoAtividade;
        if (!resultado) return;

        const reward = resultado?.reward ?? resultado;
        const updatedUser = resultado?.user ?? null;

        if (updatedUser?.gameStats) {
          const backendLife = Math.max(
            0,
            Number(
              updatedUser.gameStats.lifePoints ??
                currentUser?.gameStats?.lifePoints ??
                3,
            ),
          );

          const backendXp = Math.max(
            0,
            Number(
              updatedUser.gameStats.xpPoints ??
                currentUser?.gameStats?.xpPoints ??
                0,
            ),
          );

          const backendBatutas = Math.max(
            0,
            Number(
              updatedUser.gameStats.batutaPoints ??
                currentUser?.gameStats?.batutaPoints ??
                0,
            ),
          );

          const backendProgressLevel = Math.max(
            1,
            Number(
              updatedUser.gameStats.progressLevel ??
                currentUser?.gameStats?.progressLevel ??
                1,
            ),
          );

          setLifeGlobal(backendLife);
          setLife(backendLife);
          setXpPoints(backendXp);
          setBatutaPoints(backendBatutas);
          setProgressLevel(backendProgressLevel);
        }

        const hasBonusLife = !!reward?.bonusVidaGanha;
        const hasBonusXp = !!reward?.bonusXpGanho;
        const hasEloUp = !!reward?.subiuElo;

        if (hasEloUp) {
          setEloReward({
            eloAnterior: reward?.eloAnterior ?? null,
            eloAtual: reward?.eloAtual ?? null,
          });
        }

        if (hasBonusLife || hasBonusXp) {
          setBonusReward({
            bonusVidaGanha: hasBonusLife,
            bonusXpGanho: hasBonusXp,
          });
          setBonusModalVisible(true);
        } else if (hasEloUp) {
          setEloModalVisible(true);
        }

        navigation.setParams({ resultadoAtividade: undefined });
      };

      processResultado();
    }, [route?.params?.resultadoAtividade, navigation, currentUser?.gameStats]),
  );

  const getLessonTotalItemsBefore = (lessonNumber) => {
    return staticFeeds.feeds
      .filter((lesson) => Number(lesson.lesson) < Number(lessonNumber))
      .reduce((total, lesson) => total + (lesson.items?.length || 0), 0);
  };

  const getLessonTotalItemsUntil = (lessonNumber) => {
    return staticFeeds.feeds
      .filter((lesson) => Number(lesson.lesson) <= Number(lessonNumber))
      .reduce((total, lesson) => total + (lesson.items?.length || 0), 0);
  };

  const isLessonUnlocked = (lessonNumber) => {
    if (Number(lessonNumber) === 1) return true;

    const previousLessonsTotal = getLessonTotalItemsBefore(lessonNumber);
    return progressLevel > previousLessonsTotal;
  };

  const isLessonBlocked = (lessonNumber) => !isLessonUnlocked(lessonNumber);

  const isOnlyLesson2Blocked = isLessonBlocked('2');

  const compactLesson1IconWidth = Math.min(width * 0.68, 260);
  const compactLesson1IconHeight = Math.min(height * 0.12, 110);
  const compactLesson1BoardHeight = Math.min(height * 0.55, 400);

  const lockedLessonIconWidth = Math.min(width * 0.64, 250);
  const lockedLessonIconHeight = Math.min(height * 0.1, 95);
  const lockedCardWidth = Math.min(width * 0.68, 250);
  const lockedCardHeight = Math.min(height * 0.11, 100);
  const lockedCardMarginBottom = Math.max(height * 0.025, 18);

  const getLessonIcon = (lessonNumber, blocked = false) => {
    if (lessonNumber === '1') return Licao01;

    if (lessonNumber === '2') {
      return blocked ? Licao02Inactive : Licao02;
    }

    return blocked ? Licao02Inactive : Licao02;
  };

  const isItemActive = (lesson, index) => {
    const lessonNumber = Number(lesson.lesson);

    if (isLessonBlocked(lessonNumber)) return false;

    const previousLessonsTotal = getLessonTotalItemsBefore(lessonNumber);
    const progressInLesson = Math.max(0, progressLevel - previousLessonsTotal);
    const allowed = Math.min(progressInLesson, lesson.items.length);

    return index < allowed;
  };

  const handleOpenLockedLesson = (lessonNumber) => {
    setLockedLessonInfo({
      visible: true,
      lessonNumber,
    });
  };

  const handleCloseLockedLesson = () => {
    setLockedLessonInfo({
      visible: false,
      lessonNumber: null,
    });
  };

  const renderLockedLesson = (lesson) => (
    <FeedContainer style={{ alignItems: 'center', marginTop: 4 }}>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => handleOpenLockedLesson(lesson.lesson)}
      >
        <View style={{ alignItems: 'center', opacity: 0.5 }}>
          <LessonContainer>
            <IconLesson
              source={getLessonIcon(lesson.lesson, true)}
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

  const renderLessonBlock = ({ item: lesson }) => {
    const itens = lesson.items;
    const lessonBlocked = isLessonBlocked(lesson.lesson);

    if (lessonBlocked) {
      return renderLockedLesson(lesson);
    }

    return (
      <FeedContainer
        style={
          isOnlyLesson2Blocked
            ? { marginTop: Math.max(height * 0.02, 20) }
            : undefined
        }
      >
        <LessonContainer>
          <IconLesson
            resizeMode="contain"
            source={getLessonIcon(lesson.lesson)}
            style={
              isOnlyLesson2Blocked && lesson.lesson === '1'
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
            isOnlyLesson2Blocked && lesson.lesson === '1'
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

  const handleCloseBonusModal = () => {
    setBonusModalVisible(false);
    setBonusReward({
      bonusVidaGanha: false,
      bonusXpGanho: false,
    });

    if (eloReward?.eloAnterior && eloReward?.eloAtual) {
      setEloModalVisible(true);
    }
  };

  const handleCloseEloModal = () => {
    setEloModalVisible(false);
    setEloReward({
      eloAnterior: null,
      eloAtual: null,
    });
  };

  const lockedLessonNumber = Number(lockedLessonInfo.lessonNumber);
  const previousLessonNumber = lockedLessonNumber > 1 ? lockedLessonNumber - 1 : null;

  const lockedLessonMessage = previousLessonNumber
    ? `Complete a Lição ${String(previousLessonNumber).padStart(
        2,
        '0',
      )} para \n desbloquear esta lição.`
    : 'Complete a lição anterior para desbloquear esta lição.';

  return (
    <HomeContainer>
      <Header
        xpPoints={xpPoints}
        batutaPoints={batutaPoints}
        lifePoints={life}
      />

      <FlatList
        data={staticFeeds.feeds}
        keyExtractor={(lesson) => lesson.lesson}
        renderItem={renderLessonBlock}
        showsVerticalScrollIndicator={false}
        scrollEnabled={!isOnlyLesson2Blocked}
        contentContainerStyle={{
          paddingBottom: isOnlyLesson2Blocked ? 20 : 40,
        }}
      />

      <LockedModal
        visible={lockedLessonInfo.visible}
        onClose={handleCloseLockedLesson}
        title="Lição bloqueada"
        message={lockedLessonMessage}
      />

      <BonusLifeModal
        visible={bonusModalVisible}
        onClose={handleCloseBonusModal}
        bonusVidaGanha={bonusReward.bonusVidaGanha}
        bonusXpGanho={bonusReward.bonusXpGanho}
      />

      <EloUpModal
        visible={eloModalVisible}
        onClose={handleCloseEloModal}
        eloAnterior={eloReward.eloAnterior}
        eloAtual={eloReward.eloAtual}
      />
    </HomeContainer>
  );
}

export default Home;