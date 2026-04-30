// src/pages/conteudo/licao02/compasso/Compasso.js

import React, { useState, useEffect, useCallback } from 'react';
import {
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import AppIntroSlider from 'react-native-app-intro-slider';
import FastImage from 'react-native-fast-image';
import Sound from 'react-native-sound';

import CompassoHeader from './CompassoHeader';
import BatutaLoader from '../../../../components/loader/BatutaLoader';

import {
  Container,
  SlideView,
  FlatView,
  Div,
  DivisorLine,
  ImageSound,
} from './CompassoStyles';

import { getModuleByContentKey } from '../../../../services/batutaApi';

import Slide01 from '../../../../assets/images/conteudo/licao02/compasso/slide01.png';
import Slide02 from '../../../../assets/images/conteudo/licao02/compasso/slide02.png';
import Slide03 from '../../../../assets/images/conteudo/licao02/compasso/slide03.png';
import Slide04 from '../../../../assets/images/conteudo/licao02/compasso/slide04.png';
import Slide05 from '../../../../assets/images/conteudo/licao02/compasso/slide05.png';
import Slide06 from '../../../../assets/images/conteudo/licao02/compasso/slide06.png';
import Slide07 from '../../../../assets/images/conteudo/licao02/compasso/slide07.png';
import Slide08 from '../../../../assets/images/conteudo/licao02/compasso/slide08.png';

import Som from '../../../../assets/icons/sound.png';

import {
  ConteudoNextButton,
  ConteudoDoneButton,
  ConteudoPrevButton,
  ConteudoSkipButton,
} from '../../../../components/buttons/conteudo/ConteudoButtons';

const audioMap = {
  pretinha: require('../../../../assets/sounds/licao02/compasso/pretinha.mp3'),
  metronomo: require('../../../../assets/sounds/licao02/compasso/metronomo.mp3'),
};

function Compasso() {
  const navigation = useNavigation();
  const route = useRoute();

  const { width, height } = Dimensions.get('window');

  const [slides, setSlides] = useState([]);
  const [musica, setMusica] = useState(null);
  const [isLoadingSlides, setIsLoadingSlides] = useState(true);

  const compactImageStyle = {
    width: width * 0.95,
    height: height * 0.48,
  };

  const normalImageStyle = {
    width: width * 0.95,
    height: height * 0.56,
  };

  const finalImageStyle = {
    width: width * 0.95,
    height: height * 0.14,
    marginBottom: 30,
  };

  useEffect(() => {
    let isMounted = true;

    const loadSlides = async () => {
      try {
        setIsLoadingSlides(true);

        const contentKey = route?.params?.content ?? '8';
        const module = await getModuleByContentKey(contentKey);

        const apiSlides = (module?.slides || [])
          .map((slide) => ({
            key: String(slide.id),
            image: slide.image,
            audios: slide.audios || [],
            order: slide.order,
          }))
          .sort((a, b) => a.order - b.order);

        if (isMounted) {
          setSlides(apiSlides);
        }
      } catch (error) {
        console.log('[COMPASSO] Erro ao carregar slides da API:', error);

        if (isMounted) {
          setSlides([]);
        }
      } finally {
        if (isMounted) {
          setIsLoadingSlides(false);
        }
      }
    };

    loadSlides();

    return () => {
      isMounted = false;
    };
  }, [route?.params?.content]);

  const stopSound = useCallback(() => {
    if (musica) {
      musica.stop(() => {
        musica.release();
        setMusica(null);
      });
    }
  }, [musica]);

  useEffect(() => {
    return () => {
      if (musica) {
        musica.stop(() => {
          musica.release();
        });
      }
    };
  }, [musica]);

  const playSound = (audioName) => {
    const audioSource = audioMap[audioName];

    if (!audioSource) return;

    Sound.setCategory('Playback');

    const sound = new Sound(audioSource, (error) => {
      if (error) {
        console.log(`[COMPASSO] Erro ao carregar áudio ${audioName}:`, error);
        return;
      }

      sound.play(() => {
        sound.release();
        setMusica(null);
      });
    });

    setMusica(sound);
  };

  const selected = (audioName) => {
    if (musica) {
      stopSound();
      return;
    }

    playSound(audioName);
  };

  const Done = () => {
    navigation.navigate('AtivCompasso');
  };

  const renderSoundBlock = (soundName) => (
    <Div>
      <DivisorLine />

      <TouchableOpacity onPress={() => selected(soundName)}>
        <SafeAreaView>
          <ImageSound source={Som} />
        </SafeAreaView>
      </TouchableOpacity>

      <DivisorLine />
    </Div>
  );

  const renderGroupedCompasso01 = () => (
    <FlatView style={{ marginTop: 10 }}>
      <FastImage resizeMode="contain" source={Slide01} style={compactImageStyle} />
      {renderSoundBlock('pretinha')}

      <FastImage resizeMode="contain" source={Slide02} style={normalImageStyle} />
      {renderSoundBlock('metronomo')}

      <FastImage
        resizeMode="contain"
        source={Slide03}
        style={{ ...normalImageStyle, marginBottom: 15 }}
      />
    </FlatView>
  );

  const renderGroupedCompasso02 = () => (
    <FlatView>
      <FastImage resizeMode="contain" source={Slide04} style={normalImageStyle} />
      <FastImage resizeMode="contain" source={Slide05} style={normalImageStyle} />
      <FastImage
        resizeMode="contain"
        source={Slide06}
        style={{ ...normalImageStyle, marginTop: 10 }}
      />
      <FastImage resizeMode="contain" source={Slide07} style={normalImageStyle} />
      <FastImage resizeMode="contain" source={Slide08} style={finalImageStyle} />
    </FlatView>
  );

  const renderGroupedSlide = (imageName) => {
    if (imageName === 'slide01_03.png') {
      return renderGroupedCompasso01();
    }

    if (imageName === 'slide04_08.png') {
      return renderGroupedCompasso02();
    }

    return null;
  };

  const renderSlides = ({ item }) => (
    <Container>
      <CompassoHeader />

      <SlideView>
        <FlatList
          data={[item.image]}
          keyExtractor={(image) => image}
          renderItem={({ item: imageName }) => renderGroupedSlide(imageName)}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
        />
      </SlideView>
    </Container>
  );

  if (isLoadingSlides) {
    return <BatutaLoader text="Carregando conteúdo..." />;
  }

  if (slides.length === 0) {
    return <BatutaLoader text="Preparando conteúdo..." />;
  }

  return (
    <AppIntroSlider
      renderItem={renderSlides}
      data={slides}
      style={{ backgroundColor: '#FFF' }}
      activeDotStyle={{
        marginTop: '6%',
        backgroundColor: '#96989A',
      }}
      dotStyle={{
        marginTop: '6%',
        backgroundColor: '#D2D3D5',
      }}
      showSkipButton
      showPrevButton
      bottomButton
      renderNextButton={ConteudoNextButton}
      renderSkipButton={ConteudoSkipButton}
      renderDoneButton={ConteudoDoneButton}
      renderPrevButton={ConteudoPrevButton}
      onDone={Done}
    />
  );
}

export default Compasso;