import React, { useRef } from 'react';
import { Animated, Easing } from 'react-native';

import {
  ButtonDepthCircle,
  ButtonFaceAnimated,
  ButtonFaceCircle,
  ButtonIcon,
  ButtonInnerArea,
  ButtonOuterCircle,
  TouchableButton,
} from './GameCircleButtonStyles';

const PRESS_DISTANCE = 8;

function GameCircleButton({
  icon,
  isActive = true,
  onPress,
}) {
  const pressAnim = useRef(new Animated.Value(0)).current;

  const pressDown = () => {
    Animated.timing(pressAnim, {
      toValue: PRESS_DISTANCE,
      duration: 70,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
  };

  const pressUp = () => {
    Animated.timing(pressAnim, {
      toValue: 0,
      duration: 90,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
  };

  const handlePress = event => {
    const { pageX = 0, pageY = 0 } = event?.nativeEvent || {};

    Animated.sequence([
      Animated.timing(pressAnim, {
        toValue: PRESS_DISTANCE,
        duration: 70,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.delay(40),
      Animated.timing(pressAnim, {
        toValue: 0,
        duration: 90,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start(() => {
      onPress?.({
        pageX,
        pageY,
      });
    });
  };

  return (
    <TouchableButton
      activeOpacity={1}
      onPressIn={pressDown}
      onPressOut={pressUp}
      onPress={handlePress}
    >
      <ButtonOuterCircle>
        <ButtonInnerArea>
          <ButtonDepthCircle isActive={isActive} />

          <ButtonFaceAnimated
            style={{
              transform: [{ translateY: pressAnim }],
            }}
          >
            <ButtonFaceCircle isActive={isActive}>
              <ButtonIcon source={icon} resizeMode="contain" />
            </ButtonFaceCircle>
          </ButtonFaceAnimated>
        </ButtonInnerArea>
      </ButtonOuterCircle>
    </TouchableButton>
  );
}

export default GameCircleButton;