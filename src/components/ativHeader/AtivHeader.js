// src/components/ativHeader/AtivHeader.js

import React, {
  useState,
  useImperativeHandle,
  forwardRef,
  useRef,
} from 'react';
import { Animated, Easing } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import {
  HeaderContainer,
  HeaderRow,
  LeftArea,
  CenterArea,
  RightArea,
  TouchableHeader,
  LifeContainer,
  LifeImage,
  LifeText,
  ImageIcon,
} from './AtivHeaderStyles';

import Life from '../../assets/icons/life.png';
import IconeX from '../../assets/icons/x.png';

import AtivProgressBar from '../ativProgressBar/AtivProgressBar';
import { getLifeGlobal, setLifeGlobal } from '../../store/lifeStore';

const AtivHeader = forwardRef(({ progress, onClose }, ref) => {
  const navigation = useNavigation();

  const [lifePoints, setLifePoints] = useState(() => getLifeGlobal() ?? 2);

  const heartScale = useRef(new Animated.Value(1)).current;
  const heartOpacity = useRef(new Animated.Value(1)).current;
  const heartRotate = useRef(new Animated.Value(0)).current;
  const heartTranslateY = useRef(new Animated.Value(0)).current;
  const isAnimatingLifeRef = useRef(false);

  const triggerLifeLostAnimation = (onFinish) => {
    if (isAnimatingLifeRef.current) return;

    isAnimatingLifeRef.current = true;

    heartScale.setValue(1);
    heartOpacity.setValue(1);
    heartRotate.setValue(0);
    heartTranslateY.setValue(0);

    Animated.sequence([
      Animated.parallel([
        Animated.timing(heartScale, {
          toValue: 1.35,
          duration: 130,
          easing: Easing.out(Easing.back(2)),
          useNativeDriver: true,
        }),
        Animated.timing(heartRotate, {
          toValue: -1,
          duration: 130,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
      ]),

      Animated.parallel([
        Animated.sequence([
          Animated.timing(heartRotate, {
            toValue: 1,
            duration: 70,
            useNativeDriver: true,
          }),
          Animated.timing(heartRotate, {
            toValue: -1,
            duration: 70,
            useNativeDriver: true,
          }),
          Animated.timing(heartRotate, {
            toValue: 0.7,
            duration: 70,
            useNativeDriver: true,
          }),
        ]),

        Animated.timing(heartScale, {
          toValue: 0.65,
          duration: 260,
          easing: Easing.in(Easing.back(1.8)),
          useNativeDriver: true,
        }),

        Animated.timing(heartOpacity, {
          toValue: 0.25,
          duration: 260,
          useNativeDriver: true,
        }),

        Animated.timing(heartTranslateY, {
          toValue: 8,
          duration: 260,
          useNativeDriver: true,
        }),
      ]),

      Animated.parallel([
        Animated.timing(heartScale, {
          toValue: 1,
          duration: 180,
          easing: Easing.out(Easing.back(1.5)),
          useNativeDriver: true,
        }),
        Animated.timing(heartOpacity, {
          toValue: 1,
          duration: 180,
          useNativeDriver: true,
        }),
        Animated.timing(heartRotate, {
          toValue: 0,
          duration: 180,
          useNativeDriver: true,
        }),
        Animated.timing(heartTranslateY, {
          toValue: 0,
          duration: 180,
          useNativeDriver: true,
        }),
      ]),
    ]).start(() => {
      if (onFinish) {
        onFinish();
      }

      isAnimatingLifeRef.current = false;
    });
  };

  useImperativeHandle(
    ref,
    () => ({
      getLives: () => lifePoints,

      triggerLifeLostAnimation,

      loseLife: () => {
        triggerLifeLostAnimation(() => {
          setLifePoints((prev) => {
            const updated = Math.max(prev - 1, 0);
            setLifeGlobal(updated);
            return updated;
          });
        });
      },

      resetLives: () => {
        setLifePoints(2);
        setLifeGlobal(2);
      },
    }),
    [lifePoints],
  );

  const handleClose = () => {
    if (onClose) onClose();
    else navigation.goBack();
  };

  const showProgress = typeof progress === 'number';

  const heartRotateInterpolate = heartRotate.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: ['-18deg', '0deg', '18deg'],
  });

  return (
    <HeaderContainer>
      <HeaderRow>
        <LeftArea>
          <TouchableHeader onPress={handleClose}>
            <ImageIcon source={IconeX} />
          </TouchableHeader>
        </LeftArea>

        <CenterArea>
          {showProgress && <AtivProgressBar progress={progress} />}
        </CenterArea>

        <RightArea>
          <LifeContainer>
            <Animated.View
              style={{
                transform: [
                  { scale: heartScale },
                  { rotate: heartRotateInterpolate },
                  { translateY: heartTranslateY },
                ],
                opacity: heartOpacity,
              }}
            >
              <LifeImage source={Life} />
            </Animated.View>

            <LifeText>{lifePoints}</LifeText>
          </LifeContainer>
        </RightArea>
      </HeaderRow>
    </HeaderContainer>
  );
});

export default AtivHeader;