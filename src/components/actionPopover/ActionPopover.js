import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Easing,
  TouchableWithoutFeedback,
  Text,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';

import {
  ActionButtonPrimary,
  ActionButtonSecondary,
  ActionButtonTextPrimary,
  ActionButtonTextSecondary,
  ActionPopoverContainer,
  ActionPopoverPointer,
  LockedButton,
  LockedButtonIconBox,
  LockedButtonText,
  LockedPopoverMessage,
  LockedPopoverTitle,
} from './ActionPopoverStyles';

function ActionPopover({
  style,
  pointerStyle,
  variant = 'action',
  title = 'Conteúdo bloqueado',
  message = 'Complete a atividade anterior para desbloquear esse aqui!',
  onPressContent,
  onPressPractice,
  isClosing = false,
  onAnimationEnd,
}) {
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  const isLocked = variant === 'locked';

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
        <ActionPopoverContainer style={style} variant={variant}>
          <ActionPopoverPointer style={pointerStyle} variant={variant} />

          {isLocked ? (
            <>
              <LockedPopoverTitle>
                {title}
              </LockedPopoverTitle>

              <LockedPopoverMessage>
                {message}
              </LockedPopoverMessage>

              <LockedButton activeOpacity={1}>
                <LockedButtonIconBox>
                  <Feather name="lock" size={22} color="#F3F3F3" />
                </LockedButtonIconBox>

                <LockedButtonText>
                  BLOQUEADO
                </LockedButtonText>
              </LockedButton>
            </>
          ) : (
            <>
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
            </>
          )}
        </ActionPopoverContainer>
      </TouchableWithoutFeedback>
    </Animated.View>
  );
}

export default ActionPopover;