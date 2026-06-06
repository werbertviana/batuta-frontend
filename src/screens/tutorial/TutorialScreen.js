import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  StatusBar,
  Image,
} from 'react-native';

import AppIntroSlider from 'react-native-app-intro-slider';
import { useNavigation, useRoute } from '@react-navigation/native';

import { useAuth } from '../../contexts/AuthContext';
import BatutaLoader from '../../components/loader/BatutaLoader';

import {
  Background,
  Container,
  SlideView,
  ImageContainer,
  TutorialImage,
  PrimaryButton,
  PrimaryButtonText,
  DoneButton,
  DoneButtonText,
  SecondaryButton,
  SecondaryButtonText,
} from './TutorialStyles';

import TutorialBackground from '../../assets/images/tutorial/background.jpg';

const TUTORIALS = {
  intro: {
    doneLabel: 'COMECE SUA JORNADA!',
    slides: [
      {
        key: 'intro-1',
        image: require('../../assets/images/tutorial/tutorial01.png'),
      },
      {
        key: 'intro-2',
        image: require('../../assets/images/tutorial/tutorial02.png'),
      },
    ],
  },

  content: {
    doneLabel: 'CONTINUAR',
    slides: [
      {
        key: 'content-1',
        image: require('../../assets/images/tutorial/tutorial03.png'),
        imageStyle: {
          height: '100%',
          marginTop: -75,
        },
      },
    ],
  },

  activity: {
    doneLabel: 'PRATICAR',
    slides: [
      {
        key: 'activity-1',
        image: require('../../assets/images/tutorial/tutorial04.png'),
        imageStyle: {
          marginTop: -10,
        },
      },
      {
        key: 'activity-2',
        image: require('../../assets/images/tutorial/tutorial05.png'),
        imageStyle: {
          marginTop: -10,
        },
      },
    ],
  },

  rewards: {
    doneLabel: 'PRATICAR',
    slides: [
      {
        key: 'rewards-1',
        image: require('../../assets/images/tutorial/tutorial05.png'),
      },
    ],
  },

  profile: {
    doneLabel: 'CONTINUAR',
    slides: [
      {
        key: 'profile-1',
        image: require('../../assets/images/tutorial/tutorial06.png'),
        imageStyle: {
          marginTop: 10,
        },
      },
    ],
  },

  elos: {
    doneLabel: 'CONTINUAR',
    slides: [
      {
        key: 'elos-1',
        image: require('../../assets/images/tutorial/tutorial07.png'),
      },
    ],
  },
};

let tutorialsPreloadPromise = null;
let tutorialsAlreadyPreloaded = false;

function getTutorialConfig(tutorialKey) {
  return TUTORIALS[tutorialKey] || TUTORIALS.intro;
}

function getAllTutorialSlides() {
  return Object.values(TUTORIALS).flatMap(tutorial => tutorial.slides);
}

function buildLoadedSlidesMap(slides) {
  return slides.reduce((acc, slide) => {
    acc[slide.key] = true;
    return acc;
  }, {});
}

async function preloadImageSource(imageSource) {
  const asset = Image.resolveAssetSource(imageSource);

  if (!asset?.uri) {
    return Promise.resolve();
  }

  return Image.prefetch(asset.uri);
}

export async function preloadAllTutorialImages() {
  if (tutorialsAlreadyPreloaded) {
    return true;
  }

  if (tutorialsPreloadPromise) {
    return tutorialsPreloadPromise;
  }

  const allSlides = getAllTutorialSlides();

  tutorialsPreloadPromise = Promise.all(
    allSlides.map(slide => preloadImageSource(slide.image)),
  )
    .then(() => {
      tutorialsAlreadyPreloaded = true;
      return true;
    })
    .catch(() => {
      tutorialsAlreadyPreloaded = false;
      return false;
    });

  return tutorialsPreloadPromise;
}

async function preloadCurrentTutorialSlides(slides) {
  await Promise.all(slides.map(slide => preloadImageSource(slide.image)));
}

export default function TutorialScreen() {
  const navigation = useNavigation();
  const route = useRoute();

  const { markTutorialAsSeen } = useAuth();

  const sliderRef = useRef(null);
  const buttonScale = useRef(new Animated.Value(1)).current;

  const [activeIndex, setActiveIndex] = useState(0);
  const [loadedSlides, setLoadedSlides] = useState({});
  const [isPreloadingTutorial, setIsPreloadingTutorial] = useState(true);

  const tutorialKey = route?.params?.tutorialKey || 'intro';
  const returnTo = route?.params?.returnTo || 'Tab';
  const returnParams = route?.params?.returnParams || undefined;
  const resetAfterFinish =
    route?.params?.resetAfterFinish ?? tutorialKey === 'intro';

  const tutorialConfig = useMemo(
    () => getTutorialConfig(tutorialKey),
    [tutorialKey],
  );

  const slides = tutorialConfig.slides;
  const hasMultipleSlides = slides.length > 1;
  const isLastSlide = activeIndex === slides.length - 1;

  const currentSlideKey = slides[activeIndex]?.key;
  const isCurrentSlideLoaded = Boolean(loadedSlides[currentSlideKey]);
  const isTutorialReady = !isPreloadingTutorial && isCurrentSlideLoaded;

  const renderEmptyButton = () => null;

  useEffect(() => {
    let isMounted = true;

    const prepareTutorial = async () => {
      try {
        setIsPreloadingTutorial(true);
        setLoadedSlides({});
        setActiveIndex(0);

        if (!tutorialsAlreadyPreloaded) {
          await preloadCurrentTutorialSlides(slides);
        }

        if (isMounted) {
          setLoadedSlides(buildLoadedSlidesMap(slides));
        }
      } catch (_err) {
        if (isMounted) {
          setLoadedSlides(buildLoadedSlidesMap(slides));
        }
      } finally {
        if (isMounted) {
          setIsPreloadingTutorial(false);
        }
      }
    };

    prepareTutorial();

    return () => {
      isMounted = false;
    };
  }, [slides]);

  const animateButton = () => {
    Animated.sequence([
      Animated.spring(buttonScale, {
        toValue: 0.96,
        useNativeDriver: true,
      }),
      Animated.spring(buttonScale, {
        toValue: 1,
        friction: 3,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const markSlideAsLoaded = key => {
    setLoadedSlides(current => ({
      ...current,
      [key]: true,
    }));
  };

  const goToNextSlide = () => {
    if (!isTutorialReady) return;

    const nextIndex = Math.min(activeIndex + 1, slides.length - 1);

    sliderRef.current?.goToSlide(nextIndex, true);
    setActiveIndex(nextIndex);
  };

  const goToPreviousSlide = () => {
    if (!isTutorialReady) return;

    const prevIndex = Math.max(activeIndex - 1, 0);

    sliderRef.current?.goToSlide(prevIndex, true);
    setActiveIndex(prevIndex);
  };

  const finishTutorial = async () => {
    if (!isTutorialReady) return;

    animateButton();

    try {
      await markTutorialAsSeen(tutorialKey);
    } catch (_err) {}

    if (resetAfterFinish) {
      navigation.reset({
        index: 0,
        routes: [
          {
            name: returnTo,
            params: returnParams,
          },
        ],
      });

      return;
    }

    navigation.replace(returnTo, returnParams);
  };

  const renderItem = ({ item }) => (
    <Background source={TutorialBackground} resizeMode="cover">
      <Container>
        <SlideView>
          <ImageContainer>
            <TutorialImage
              source={item.image}
              resizeMode="contain"
              style={item.imageStyle}
              onLoadEnd={() => markSlideAsLoaded(item.key)}
            />
          </ImageContainer>
        </SlideView>
      </Container>
    </Background>
  );

  const renderNextButton = () => (
    <PrimaryButton
      activeOpacity={0.9}
      onPress={goToNextSlide}
      disabled={!isTutorialReady}
    >
      <PrimaryButtonText>PRÓXIMO</PrimaryButtonText>
    </PrimaryButton>
  );

  const renderDoneButton = () => (
    <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
      <DoneButton
        activeOpacity={0.9}
        onPress={finishTutorial}
        disabled={!isTutorialReady}
      >
        <DoneButtonText numberOfLines={1} adjustsFontSizeToFit>
          {tutorialConfig.doneLabel || 'CONTINUAR'}
        </DoneButtonText>
      </DoneButton>
    </Animated.View>
  );

  const renderSkipButton = () => (
    <SecondaryButton
      activeOpacity={0.9}
      onPress={finishTutorial}
      disabled={!isTutorialReady}
    >
      <SecondaryButtonText>PULAR TUTORIAL</SecondaryButtonText>
    </SecondaryButton>
  );

  const renderPrevButton = () => (
    <SecondaryButton
      activeOpacity={0.9}
      onPress={goToPreviousSlide}
      disabled={!isTutorialReady}
    >
      <SecondaryButtonText>VOLTAR</SecondaryButtonText>
    </SecondaryButton>
  );

  if (isPreloadingTutorial) {
    return (
      <>
        <StatusBar
          translucent={false}
          backgroundColor="#757575"
          barStyle="light-content"
        />

        <Background source={TutorialBackground} resizeMode="cover">
          <BatutaLoader text="Preparando tutorial..." />
        </Background>
      </>
    );
  }

  return (
    <>
      <StatusBar
        translucent={false}
        backgroundColor="#757575"
        barStyle="light-content"
      />

      <AppIntroSlider
        ref={sliderRef}
        data={slides}
        renderItem={renderItem}
        style={{ backgroundColor: 'transparent' }}
        activeDotStyle={
          isTutorialReady
            ? {
                marginTop: '5%',
                backgroundColor: '#2FAFC4',
                width: 16,
                height: 16,
                borderRadius: 20,
                marginHorizontal: 5,
              }
            : {
                opacity: 0,
                width: 0,
                height: 0,
              }
        }
        dotStyle={
          isTutorialReady
            ? {
                marginTop: '5%',
                backgroundColor: '#D4D5D6',
                width: 14,
                height: 14,
                borderRadius: 20,
                marginHorizontal: 5,
              }
            : {
                opacity: 0,
                width: 0,
                height: 0,
              }
        }
        bottomButton
        showSkipButton={
          isTutorialReady && hasMultipleSlides && !isLastSlide
        }
        showPrevButton={
          isTutorialReady && hasMultipleSlides && isLastSlide
        }
        renderNextButton={isTutorialReady ? renderNextButton : renderEmptyButton}
        renderDoneButton={isTutorialReady ? renderDoneButton : renderEmptyButton}
        renderSkipButton={isTutorialReady ? renderSkipButton : renderEmptyButton}
        renderPrevButton={isTutorialReady ? renderPrevButton : renderEmptyButton}
        onDone={finishTutorial}
        onSkip={finishTutorial}
        onSlideChange={index => setActiveIndex(index)}
      />
    </>
  );
}