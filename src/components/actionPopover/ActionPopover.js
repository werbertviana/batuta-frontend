import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Easing,
  TouchableWithoutFeedback,
  Text,
} from 'react-native';

import {
  ActionButtonPrimary,
  ActionButtonSecondary,
  ActionButtonTextPrimary,
  ActionButtonTextSecondary,
  ActionPopoverContainer,
  ActionPopoverPointer,
} from './ActionPopoverStyles';

function ActionPopover({
  style,
  pointerStyle,
  onPressContent,
  onPressPractice,
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
        <ActionPopoverContainer style={style}>
          <ActionPopoverPointer style={pointerStyle} />

          <ActionButtonPrimary
            activeOpacity={0.85}
            onPress={onPressContent}
          >
            <ActionButtonTextPrimary>
              CONTEÚDO
            </ActionButtonTextPrimary>
          </ActionButtonPrimary>

          <ActionButtonSecondary
            activeOpacity={0.85}
            onPress={onPressPractice}
          >
            <ActionButtonTextSecondary>
              PRATICAR +{' '}
              <Text style={{ color: '#F7C600' }}>
                XP
              </Text>
            </ActionButtonTextSecondary>
          </ActionButtonSecondary>
        </ActionPopoverContainer>
      </TouchableWithoutFeedback>
    </Animated.View>
  );
}

export default ActionPopover;