import React, { useEffect, useRef, useState } from 'react';
import { Animated, Easing, SafeAreaView } from 'react-native';
import Modal from 'react-native-modal';

import {
  ButtonDepthImage,
  ButtonFaceAnimated,
  ButtonFaceImage,
  ButtonInnerArea,
  ButtonOuterCircle,
  FloatingTitleView,
  TextFeedTitle,
  TitlePointer,
  TitleView,
  TouchableFeedItem,
} from './FeedItemStyles';

import ModalItem from '../modal/ModalItem';
import LockedModal from '../modal/LockedModal';

const PRESS_DISTANCE = 8;

const iconMap = {
  'feed01.png': {
    faceActive: require('../../assets/images/home/feed01_face_active.png'),
    faceInactive: require('../../assets/images/home/feed01_face_inactive.png'),
  },
  'feed02.png': {
    faceActive: require('../../assets/images/home/feed02_face_active.png'),
    faceInactive: require('../../assets/images/home/feed02_face_inactive.png'),
  },
  'feed03.png': {
    faceActive: require('../../assets/images/home/feed03_face_active.png'),
    faceInactive: require('../../assets/images/home/feed03_face_inactive.png'),
  },
  'feed04.png': {
    faceActive: require('../../assets/images/home/feed04_face_active.png'),
    faceInactive: require('../../assets/images/home/feed04_face_inactive.png'),
  },
  'feed05.png': {
    faceActive: require('../../assets/images/home/feed05_face_active.png'),
    faceInactive: require('../../assets/images/home/feed05_face_inactive.png'),
  },
  'feed06.png': {
    faceActive: require('../../assets/images/home/feed06_face_active.png'),
    faceInactive: require('../../assets/images/home/feed06_face_inactive.png'),
  },
  'feed07.png': {
    faceActive: require('../../assets/images/home/feed07_face_active.png'),
    faceInactive: require('../../assets/images/home/feed07_face_inactive.png'),
  },
  'feed08.png': {
    faceActive: require('../../assets/images/home/feed08_face_active.png'),
    faceInactive: require('../../assets/images/home/feed08_face_inactive.png'),
  },
};

const depthMap = {
  active: require('../../assets/images/home/feed_depth_active.png'),
  inactive: require('../../assets/images/home/feed_depth_inactive.png'),
};

const fallbackIcon = iconMap['feed01.png'];

const getFaceIcon = (iconName, isActive) => {
  const iconData = iconMap[iconName] || fallbackIcon;
  return isActive ? iconData.faceActive : iconData.faceInactive;
};

const FeedItem = ({
  title,
  icon,
  isActive = true,
  practiceRoute,
  content,
  titleOffsetX = 0,
  pointerOffsetX = 0,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [lockedVisible, setLockedVisible] = useState(false);

  const floatAnim = useRef(new Animated.Value(0)).current;
  const pressAnim = useRef(new Animated.Value(0)).current;

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

  const animateButtonDown = () => {
    Animated.timing(pressAnim, {
      toValue: PRESS_DISTANCE,
      duration: 70,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
  };

  const animateButtonUp = (callback) => {
    Animated.timing(pressAnim, {
      toValue: 0,
      duration: 90,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start(() => {
      if (callback) callback();
    });
  };

  const pressDown = () => {
    animateButtonDown();
  };

  const pressUp = () => {
    animateButtonUp();
  };

  const handlePress = () => {
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
      if (!isActive) {
        setLockedVisible(true);
        return;
      }

      setModalVisible(true);
    });
  };

  return (
    <SafeAreaView style={{ margin: 10 }}>
      <TouchableFeedItem
        activeOpacity={1}
        onPressIn={pressDown}
        onPressOut={pressUp}
        onPress={handlePress}
      >
        <FloatingTitleView
          pointerEvents="none"
          style={{ transform: [{ translateY: floatAnim }] }}
        >
          <TitleView style={{ transform: [{ translateX: titleOffsetX }] }}>
            <TextFeedTitle style={{ color: isActive ? '#1F1F1F' : '#9E9E9E' }}>
              {title}
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

        <ButtonOuterCircle>
          <ButtonInnerArea>
            <ButtonDepthImage
              resizeMode="contain"
              source={isActive ? depthMap.active : depthMap.inactive}
            />

            <ButtonFaceAnimated
              style={{ transform: [{ translateY: pressAnim }] }}
            >
              <ButtonFaceImage
                resizeMode="contain"
                source={getFaceIcon(icon, isActive)}
              />
            </ButtonFaceAnimated>
          </ButtonInnerArea>
        </ButtonOuterCircle>
      </TouchableFeedItem>

      <Modal
        isVisible={modalVisible}
        onBackdropPress={() => setModalVisible(false)}
        backdropColor="#000"
        animationIn="fadeInUp"
        animationOut="fadeOutDown"
        backdropOpacity={0.45}
        style={{ alignItems: 'center' }}
      >
        <ModalItem
          onClose={() => setModalVisible(false)}
          title={title}
          practiceRoute={practiceRoute}
          content={content}
        />
      </Modal>

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