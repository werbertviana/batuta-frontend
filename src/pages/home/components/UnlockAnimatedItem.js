import React, { useEffect, useRef } from 'react';
import { Animated, Easing, View } from 'react-native';

function UnlockAnimatedItem({ active, children, onTouch, glowSize }) {
  const glowOpacity = useRef(new Animated.Value(0)).current;
  const shineTranslateX = useRef(new Animated.Value(-glowSize)).current;
  const shineOpacity = useRef(new Animated.Value(0)).current;
  const loopRef = useRef(null);

  useEffect(() => {
    if (!active) {
      if (loopRef.current) {
        loopRef.current.stop();
        loopRef.current = null;
      }

      glowOpacity.setValue(0);
      shineTranslateX.setValue(-glowSize);
      shineOpacity.setValue(0);
      return;
    }

    glowOpacity.setValue(0.42);
    shineTranslateX.setValue(-glowSize);
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
            toValue: glowSize,
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
          toValue: -glowSize,
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
  }, [active, glowOpacity, shineOpacity, shineTranslateX, glowSize]);

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
              width: glowSize,
              height: glowSize,
              borderRadius: glowSize / 2,
              overflow: 'hidden',
              backgroundColor: '#236a79',
              borderWidth: 2,
              borderColor: '#34b1c7',
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

export default UnlockAnimatedItem;