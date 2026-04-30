import React, { useEffect, useRef } from 'react';
import { Animated, Easing } from 'react-native';

import {
  Container,
  LoaderArea,
  MainNote,
  FloatingNote,
  EqualizerContainer,
  EqualizerBar,
  LoadingText,
} from './BatutaLoaderStyles';

function BatutaLoader({ text = 'Carregando...' }) {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  const noteOneAnim = useRef(new Animated.Value(0)).current;
  const noteTwoAnim = useRef(new Animated.Value(0)).current;
  const noteThreeAnim = useRef(new Animated.Value(0)).current;

  const barOneAnim = useRef(new Animated.Value(0.45)).current;
  const barTwoAnim = useRef(new Animated.Value(1)).current;
  const barThreeAnim = useRef(new Animated.Value(0.65)).current;
  const barFourAnim = useRef(new Animated.Value(0.85)).current;

  useEffect(() => {
    const mainNoteLoop = Animated.loop(
      Animated.parallel([
        Animated.sequence([
          Animated.timing(scaleAnim, {
            toValue: 1.18,
            duration: 450,
            easing: Easing.ease,
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 450,
            easing: Easing.ease,
            useNativeDriver: true,
          }),
        ]),
        Animated.sequence([
          Animated.timing(rotateAnim, {
            toValue: 1,
            duration: 900,
            easing: Easing.ease,
            useNativeDriver: true,
          }),
          Animated.timing(rotateAnim, {
            toValue: 0,
            duration: 900,
            easing: Easing.ease,
            useNativeDriver: true,
          }),
        ]),
      ]),
    );

    const createFloatingNoteLoop = (animatedValue, delay = 0) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(animatedValue, {
            toValue: 1,
            duration: 1400,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(animatedValue, {
            toValue: 0,
            duration: 0,
            useNativeDriver: true,
          }),
        ]),
      );

    const createBarLoop = (animatedValue, delay = 0) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(animatedValue, {
            toValue: 1,
            duration: 280,
            easing: Easing.ease,
            useNativeDriver: true,
          }),
          Animated.timing(animatedValue, {
            toValue: 0.35,
            duration: 280,
            easing: Easing.ease,
            useNativeDriver: true,
          }),
        ]),
      );

    const floatingOneLoop = createFloatingNoteLoop(noteOneAnim, 0);
    const floatingTwoLoop = createFloatingNoteLoop(noteTwoAnim, 350);
    const floatingThreeLoop = createFloatingNoteLoop(noteThreeAnim, 700);

    const barOneLoop = createBarLoop(barOneAnim, 0);
    const barTwoLoop = createBarLoop(barTwoAnim, 100);
    const barThreeLoop = createBarLoop(barThreeAnim, 200);
    const barFourLoop = createBarLoop(barFourAnim, 300);

    mainNoteLoop.start();
    floatingOneLoop.start();
    floatingTwoLoop.start();
    floatingThreeLoop.start();
    barOneLoop.start();
    barTwoLoop.start();
    barThreeLoop.start();
    barFourLoop.start();

    return () => {
      mainNoteLoop.stop();
      floatingOneLoop.stop();
      floatingTwoLoop.stop();
      floatingThreeLoop.stop();
      barOneLoop.stop();
      barTwoLoop.stop();
      barThreeLoop.stop();
      barFourLoop.stop();
    };
  }, [
    barFourAnim,
    barOneAnim,
    barThreeAnim,
    barTwoAnim,
    noteOneAnim,
    noteThreeAnim,
    noteTwoAnim,
    rotateAnim,
    scaleAnim,
  ]);

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['-8deg', '8deg'],
  });

  const floatingNoteOneStyle = {
    opacity: noteOneAnim.interpolate({
      inputRange: [0, 0.2, 0.8, 1],
      outputRange: [0, 1, 1, 0],
    }),
    transform: [
      {
        translateY: noteOneAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [18, -42],
        }),
      },
      {
        translateX: noteOneAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [-18, -46],
        }),
      },
    ],
  };

  const floatingNoteTwoStyle = {
    opacity: noteTwoAnim.interpolate({
      inputRange: [0, 0.2, 0.8, 1],
      outputRange: [0, 1, 1, 0],
    }),
    transform: [
      {
        translateY: noteTwoAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [12, -52],
        }),
      },
      {
        translateX: noteTwoAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [12, 42],
        }),
      },
    ],
  };

  const floatingNoteThreeStyle = {
    opacity: noteThreeAnim.interpolate({
      inputRange: [0, 0.2, 0.8, 1],
      outputRange: [0, 1, 1, 0],
    }),
    transform: [
      {
        translateY: noteThreeAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [24, -32],
        }),
      },
      {
        translateX: noteThreeAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 24],
        }),
      },
    ],
  };

  return (
    <Container>
      <LoaderArea>
        <FloatingNote style={floatingNoteOneStyle}>♪</FloatingNote>
        <FloatingNote style={floatingNoteTwoStyle}>♫</FloatingNote>
        <FloatingNote style={floatingNoteThreeStyle}>♬</FloatingNote>

        <Animated.View
          style={{
            transform: [{ scale: scaleAnim }, { rotate }],
          }}
        >
          <MainNote>♪</MainNote>
        </Animated.View>
      </LoaderArea>

      <EqualizerContainer>
        <EqualizerBar style={{ transform: [{ scaleY: barOneAnim }] }} />
        <EqualizerBar style={{ transform: [{ scaleY: barTwoAnim }] }} />
        <EqualizerBar style={{ transform: [{ scaleY: barThreeAnim }] }} />
        <EqualizerBar style={{ transform: [{ scaleY: barFourAnim }] }} />
      </EqualizerContainer>

      <LoadingText>{text}</LoadingText>
    </Container>
  );
}

export default BatutaLoader;