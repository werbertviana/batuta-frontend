import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Easing,
  TouchableWithoutFeedback,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';

import {
  LockedButton,
  LockedButtonIconBox,
  LockedButtonText,
  LockedPopoverContainer,
  LockedPopoverMessage,
  LockedPopoverPointer,
  LockedPopoverTitle,
} from './LockedActionPopoverStyles';

function LockedActionPopover({
  style,
  pointerStyle,
  title = 'Conteúdo bloqueado',
  message = 'Complete a atividade anterior para desbloquear esse aqui!',
  isClosing = false,
  onAnimationEnd,
}) {
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    if (isClosing) {
      Animated.timing(scaleAnim, {
        toValue: 0.85,
        duration: 120,
        easing: Easing.in(Easing.ease),
        useNativeDriver: true,
      }).start(({ finished }) => {
        if (finished && onAnimationEnd) {
          onAnimationEnd();
        }
      });

      return;
    }

    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 6,
      tension: 45,
      useNativeDriver: true,
    }).start();
  }, [isClosing, scaleAnim, onAnimationEnd]);

  return (
    <Animated.View
      style={{
        transform: [{ scale: scaleAnim }],
      }}
    >
      <TouchableWithoutFeedback
        onPress={event => {
          event.stopPropagation();
        }}
      >
        <LockedPopoverContainer style={style}>
          <LockedPopoverPointer style={pointerStyle} />

          <LockedPopoverTitle>{title}</LockedPopoverTitle>

          <LockedPopoverMessage>
            {message}
          </LockedPopoverMessage>

          <LockedButton activeOpacity={1} disabled>
            <LockedButtonIconBox>
              <Feather name="lock" size={22} color="#F3F3F3" />
            </LockedButtonIconBox>

            <LockedButtonText>
              BLOQUEADO
            </LockedButtonText>
          </LockedButton>
        </LockedPopoverContainer>
      </TouchableWithoutFeedback>
    </Animated.View>
  );
}

export default LockedActionPopover;