// src/components/feedItem/FeedItem.js

import React, { useEffect, useRef, useState } from 'react';
import { Animated, Easing, SafeAreaView, View } from 'react-native';

import {
  FloatingTitleView,
  TextFeedTitle,
  TitlePointer,
  TitleView,
  TouchableFeedItem,
} from './FeedItemStyles';

import GameCircleButton from '../gameCircleButton/GameCircleButton';
import LockedModal from '../modal/LockedModal';

const displayTitleMap = {
  'Figuras de Notas': 'Figuras de\nNotas',
  'Figuras de Pausas': 'Figuras de\nPausas',
  'Duração dos Valores': 'Duração dos\nValores',
  'Compasso Musical': 'Compasso\nMusical',
};

const iconMap = {
  'feed01.png': {
    active: require('../../assets/images/home/intro_active.png'),
    inactive: require('../../assets/images/home/intro_inactive.png'),
  },
  'feed02.png': {
    active: require('../../assets/images/home/pauta_active.png'),
    inactive: require('../../assets/images/home/pauta_inactive.png'),
  },
  'feed03.png': {
    active: require('../../assets/images/home/clave_active.png'),
    inactive: require('../../assets/images/home/clave_inactive.png'),
  },
  'feed04.png': {
    active: require('../../assets/images/home/notas_active.png'),
    inactive: require('../../assets/images/home/notas_inactive.png'),
  },
  'feed05.png': {
    active: require('../../assets/images/home/figuras_notas_active.png'),
    inactive: require('../../assets/images/home/figuras_notas_inactive.png'),
  },
  'feed06.png': {
    active: require('../../assets/images/home/figuras_pausas_active.png'),
    inactive: require('../../assets/images/home/figuras_pausas_inactive.png'),
  },
  'feed07.png': {
    active: require('../../assets/images/home/duracao_active.png'),
    inactive: require('../../assets/images/home/duracao_inactive.png'),
  },
  'feed08.png': {
    active: require('../../assets/images/home/compasso_active.png'),
    inactive: require('../../assets/images/home/compasso_inactive.png'),
  },
};

const fallbackIcon = iconMap['feed01.png'];

const getIcon = (iconName, isActive) => {
  const iconData = iconMap[iconName] || fallbackIcon;
  return isActive ? iconData.active : iconData.inactive;
};

const getDisplayTitle = title => displayTitleMap[title] || title;

const FeedItem = ({
  title,
  icon,
  isActive = true,
  practiceRoute,
  content,
  titleOffsetX = 0,
  pointerOffsetX = 0,
  index = 0,
  lessonNumber,
  onOpenActions,
}) => {
  const [lockedVisible, setLockedVisible] = useState(false);
  const floatAnim = useRef(new Animated.Value(0)).current;
  const buttonRef = useRef(null);

  const currentItemKey = `${lessonNumber}:${index}`;

  useEffect(() => {
    if (!isActive) {
      floatAnim.stopAnimation();
      floatAnim.setValue(0);
      return;
    }

    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: -7,
          duration: 800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 900,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    );

    animation.start();
    return () => animation.stop();
  }, [floatAnim, isActive]);

  const handlePress = () => {
    if (!isActive) {
      setLockedVisible(true);
      return;
    }

    if (buttonRef.current) {
      // Coleta dados rápidos pré-scroll para inicializar a direção da lista
      buttonRef.current.measure((fx, fy, width, height, px, py) => {
        onOpenActions?.(
          {
            key: currentItemKey,
            index,
            lessonNumber,
            title,
            content,
            practiceRoute,
            anchor: { pageX: px, pageY: py, width, height },
          },
          // Enviamos a função de medição nativa anexada ao elemento real para uso pós-scroll
          (cb) => buttonRef.current?.measure(cb)
        );
      });
    }
  };

  return (
    <SafeAreaView style={{ margin: 10 }}>
      <TouchableFeedItem>
        <FloatingTitleView
          pointerEvents="none"
          style={{ transform: [{ translateY: floatAnim }] }}
        >
          <TitleView style={{ transform: [{ translateX: titleOffsetX }] }}>
            <TextFeedTitle
              numberOfLines={2}
              style={{ color: isActive ? '#1F1F1F' : '#9E9E9E' }}
            >
              {getDisplayTitle(title)}
            </TextFeedTitle>

            <TitlePointer
              style={{
                transform: [
                  { translateX: pointerOffsetX },
                  { rotate: '45deg' },
                ],
              }}
            />
          </TitleView>
        </FloatingTitleView>

        <View ref={buttonRef} collapsable={false}>
          <GameCircleButton
            icon={getIcon(icon, isActive)}
            isActive={isActive}
            onPress={handlePress}
          />
        </View>
      </TouchableFeedItem>

      <LockedModal
        visible={lockedVisible}
        onClose={() => setLockedVisible(false)}
        title="Atividade bloqueada"
        message="Complete a atividade anterior para desbloquear esta."
      />
    </SafeAreaView>
  );
};

export default FeedItem;