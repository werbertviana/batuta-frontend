// src/screens/home/Home.js

import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  FlatList,
  View,
  TouchableOpacity,
  Dimensions,
  Animated,
  Easing,
} from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

import Header from '../../components/header/Header';
import { getLessonsWithModules } from '../../services/batutaApi';
import BatutaLoader from '../../components/loader/BatutaLoader';

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

const unlockGlowSize = Math.min(width * 0.27, 112);

function UnlockAnimatedItem({ active, children, onTouch }) {
  const glowOpacity = useRef(new Animated.Value(0)).current;
  const shineTranslateX = useRef(new Animated.Value(-unlockGlowSize)).current;
  const shineOpacity = useRef(new Animated.Value(0)).current;
  const loopRef = useRef(null);

  useEffect(() => {
    if (!active) {
      if (loopRef.current) {
        loopRef.current.stop();
        loopRef.current = null;
      }

      glowOpacity.setValue(0);
      shineTranslateX.setValue(-unlockGlowSize);
      shineOpacity.setValue(0);
      return;
    }

    glowOpacity.setValue(0.42);
    shineTranslateX.setValue(-unlockGlowSize);
    shineOpacity.setValue(0);

    loopRef.current = Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(glowOpacity, {
            toValue: 0.58,
            duration: 650,
            easing: Easing.inOut(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.timing(shineOpacity, {
            toValue: 0.82,
            duration: 180,
            useNativeDriver: true,
          }),
          Animated.timing(shineTranslateX, {
            toValue: unlockGlowSize,
            duration: 1050,
            easing: Easing.inOut(Easing.quad),
            useNativeDriver: true,
          }),
        ]),

        Animated.parallel([
          Animated.timing(glowOpacity, {
            toValue: 0.36,
            duration: 500,
            easing: Easing.inOut(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.timing(shineOpacity, {
            toValue: 0,
            duration: 260,
            useNativeDriver: true,
          }),
        ]),

        Animated.delay(450),

        Animated.timing(shineTranslateX, {
          toValue: -unlockGlowSize,
          duration: 0,
          useNativeDriver: true,
        }),
      ]),
    );

    loopRef.current.start();

    return () => {
      if (loopRef.current) {
        loopRef.current.stop();
        loopRef.current = null;
      }
    };
  }, [active, glowOpacity, shineOpacity, shineTranslateX]);

  return (
    <View
      onTouchStart={active ? onTouch : undefined}
      style={{
        position: 'relative',
        overflow: 'visible',
      }}
    >
      {active && (
        <View
          pointerEvents="none"
          style={{
            position: 'absolute',
            top: 20,
            left: 0,
            right: 0,
            alignItems: 'center',
            zIndex: 5,
            elevation: 5,
          }}
        >
          <Animated.View
            style={{
              width: unlockGlowSize,
              height: unlockGlowSize,
              borderRadius: unlockGlowSize / 2,
              overflow: 'hidden',
              backgroundColor: 'rgba(52, 177, 199, 0.10)',
              borderWidth: 2,
              borderColor: 'rgba(52, 177, 199, 0.30)',
              opacity: glowOpacity,
            }}
          >
            <Animated.View
              style={{
                position: 'absolute',
                top: -8,
                bottom: -8,
                width: 30,
                borderRadius: 999,
                backgroundColor: 'rgba(255, 255, 255, 0.85)',
                opacity: shineOpacity,
                transform: [
                  { translateX: shineTranslateX },
                  { rotate: '18deg' },
                ],
              }}
            />
          </Animated.View>
        </View>
      )}

      <View style={{ position: 'relative', zIndex: 3 }}>{children}</View>
    </View>
  );
}

function Home({ route }) {
  const navigation = useNavigation();
  const { user } = useAuth();
  const currentUser = user;

  const unlockAnimationTimeoutRef = useRef(null);

  const [feeds, setFeeds] = useState([]);
  const [isLoadingFeeds, setIsLoadingFeeds] = useState(true);
  const [recentlyUnlockedKey, setRecentlyUnlockedKey] = useState(null);
  const [pendingUnlockProgressLevel, setPendingUnlockProgressLevel] =
    useState(null);
  const [queuedUnlockProgressLevel, setQueuedUnlockProgressLevel] =
    useState(null);

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
    let isMounted = true;

    const loadFeeds = async () => {
      try {
        setIsLoadingFeeds(true);

        const apiFeeds = await getLessonsWithModules();

        if (isMounted) {
          setFeeds(apiFeeds);
        }
      } catch (error) {
        console.log('[HOME] Erro ao carregar feeds da API:', error);

        if (isMounted) {
          setFeeds([]);
        }
      } finally {
        if (isMounted) {
          setIsLoadingFeeds(false);
        }
      }
    };

    loadFeeds();

    return () => {
      isMounted = false;

      if (unlockAnimationTimeoutRef.current) {
        clearTimeout(unlockAnimationTimeoutRef.current);
      }
    };
  }, []);

  const getUnlockKeyByProgressLevel = useCallback(
    (targetProgressLevel) => {
      let count = 0;

      for (const lesson of feeds) {
        const items = lesson.items || [];

        for (const item of items) {
          count += 1;

          if (count === Number(targetProgressLevel)) {
            return `${lesson.lesson}:${item.id}`;
          }
        }
      }

      return null;
    },
    [feeds],
  );

  const triggerUnlockAnimation = useCallback(
    (targetProgressLevel) => {
      const newUnlockKey = getUnlockKeyByProgressLevel(targetProgressLevel);

      if (!newUnlockKey) return;

      requestAnimationFrame(() => {
        setRecentlyUnlockedKey(newUnlockKey);
      });
    },
    [getUnlockKeyByProgressLevel],
  );

  useEffect(() => {
    if (!pendingUnlockProgressLevel || feeds.length === 0) return;

    triggerUnlockAnimation(pendingUnlockProgressLevel);
    setPendingUnlockProgressLevel(null);
  }, [pendingUnlockProgressLevel, feeds, triggerUnlockAnimation]);

  useEffect(() => {
    if (!currentUser?.gameStats) return;

    const backendLife = Math.max(
      0,
      Number(currentUser.gameStats.lifePoints ?? 3),
    );

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

        const hasBonusLife = !!reward?.bonusVidaGanha;
        const hasBonusXp = !!reward?.bonusXpGanho;
        const hasEloUp = !!reward?.subiuElo;

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

          const progressLevelAnterior = Number(
            reward?.progressLevelAnterior ?? progressLevel,
          );

          const progressLevelAtual = Number(
            reward?.progressLevelAtual ?? backendProgressLevel,
          );

          const shouldAnimateUnlock =
            progressLevelAtual > progressLevelAnterior ||
            reward?.subiuProgressLevel === true;

          if (shouldAnimateUnlock) {
            const hasAnyRewardModal = hasBonusLife || hasBonusXp || hasEloUp;

            if (hasAnyRewardModal) {
              setQueuedUnlockProgressLevel(progressLevelAtual);
            } else if (feeds.length > 0) {
              triggerUnlockAnimation(progressLevelAtual);
            } else {
              setPendingUnlockProgressLevel(progressLevelAtual);
            }
          }

          setLifeGlobal(backendLife);
          setLife(backendLife);
          setXpPoints(backendXp);
          setBatutaPoints(backendBatutas);
          setProgressLevel(backendProgressLevel);
        }

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
    }, [
      route?.params?.resultadoAtividade,
      navigation,
      currentUser?.gameStats,
      progressLevel,
      feeds,
      triggerUnlockAnimation,
    ]),
  );

  const getLessonTotalItemsBefore = (lessonNumber) => {
    return feeds
      .filter((lesson) => Number(lesson.lesson) < Number(lessonNumber))
      .reduce((total, lesson) => total + (lesson.items?.length || 0), 0);
  };

  const isLessonUnlocked = (lessonNumber) => {
    if (Number(lessonNumber) === 1) return true;

    const previousLessonsTotal = getLessonTotalItemsBefore(lessonNumber);
    return progressLevel > previousLessonsTotal;
  };

  const isLessonBlocked = (lessonNumber) => !isLessonUnlocked(lessonNumber);

  const isOnlyLesson2Blocked = feeds.length === 2 && isLessonBlocked('2');

  const compactLesson1IconWidth = Math.min(width * 0.68, 260);
  const compactLesson1IconHeight = Math.min(height * 0.12, 110);
  const compactLesson1BoardHeight = Math.min(height * 0.55, 400);

  const lockedLessonIconWidth = Math.min(width * 0.64, 250);
  const lockedLessonIconHeight = Math.min(height * 0.1, 95);
  const lockedCardWidth = Math.min(width * 0.68, 250);
  const lockedCardHeight = Math.min(height * 0.11, 100);
  const lockedCardMarginBottom = Math.max(height * 0.025, 18);

  const getLessonIcon = (lessonNumber, blocked = false) => {
    if (String(lessonNumber) === '1') return Licao01;

    if (String(lessonNumber) === '2') {
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
    const itens = lesson.items || [];
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
              isOnlyLesson2Blocked && String(lesson.lesson) === '1'
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
            isOnlyLesson2Blocked && String(lesson.lesson) === '1'
              ? {
                  height: compactLesson1BoardHeight,
                  marginBottom: 8,
                }
              : undefined
          }
        >
          <ItemContainer>
            {itens.map((item, index) => {
              const unlockKey = `${lesson.lesson}:${item.id}`;
              const isRecentlyUnlocked = recentlyUnlockedKey === unlockKey;

              return (
                <UnlockAnimatedItem
                  key={item.id}
                  active={isRecentlyUnlocked}
                  onTouch={() => {
                    if (isRecentlyUnlocked) {
                      setRecentlyUnlockedKey(null);
                    }
                  }}
                >
                  <FeedItem
                    title={item.title}
                    icon={item.icon}
                    content={item.content}
                    isActive={isItemActive(lesson, index)}
                    practiceRoute={item.practiceRoute}
                  />
                </UnlockAnimatedItem>
              );
            })}
          </ItemContainer>
        </Background>
      </FeedContainer>
    );
  };

  const playQueuedUnlockAnimation = () => {
    if (!queuedUnlockProgressLevel) return;

    if (feeds.length > 0) {
      triggerUnlockAnimation(queuedUnlockProgressLevel);
    } else {
      setPendingUnlockProgressLevel(queuedUnlockProgressLevel);
    }

    setQueuedUnlockProgressLevel(null);
  };

  const handleCloseBonusModal = () => {
    setBonusModalVisible(false);
    setBonusReward({
      bonusVidaGanha: false,
      bonusXpGanho: false,
    });

    if (eloReward?.eloAnterior && eloReward?.eloAtual) {
      setEloModalVisible(true);
      return;
    }

    playQueuedUnlockAnimation();
  };

  const handleCloseEloModal = () => {
    setEloModalVisible(false);
    setEloReward({
      eloAnterior: null,
      eloAtual: null,
    });

    playQueuedUnlockAnimation();
  };

  const lockedLessonNumber = Number(lockedLessonInfo.lessonNumber);

  const previousLessonNumber =
    lockedLessonNumber > 1 ? lockedLessonNumber - 1 : null;

  const lockedLessonMessage = previousLessonNumber
    ? `Complete a Lição ${String(previousLessonNumber).padStart(
        2,
        '0',
      )} para \n desbloquear esta lição.`
    : 'Complete a lição anterior para desbloquear esta lição.';

  if (isLoadingFeeds) {
    return <BatutaLoader text="Carregando lições..." />;
  }

  return (
    <HomeContainer>
      <Header
        xpPoints={xpPoints}
        batutaPoints={batutaPoints}
        lifePoints={life}
      />

      <FlatList
        data={feeds}
        keyExtractor={(lesson) => String(lesson.lesson)}
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