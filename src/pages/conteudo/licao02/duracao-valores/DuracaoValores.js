// src/pages/conteudo/licao02/duracao-valores/DuracaoValores.js

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

import DuracaoValoresHeader from './DuracaoValoresHeader';
import BatutaLoader from '../../../../components/loader/BatutaLoader';

import {
  Container,
  SlideView,
  DivisorLine2,
  FlatView,
  Div,
  DivisorLine,
  ImageSound,
  DivFinal,
} from './DuracaoValoresStyles';

import { getModuleByContentKey } from '../../../../services/batutaApi';

import Slide01 from '../../../../assets/images/conteudo/licao02/duracao-valores/slide01.png';
import Slide02 from '../../../../assets/images/conteudo/licao02/duracao-valores/slide02.png';
import Slide03 from '../../../../assets/images/conteudo/licao02/duracao-valores/slide03.png';
import Slide04 from '../../../../assets/images/conteudo/licao02/duracao-valores/slide04.png';
import Slide05 from '../../../../assets/images/conteudo/licao02/duracao-valores/slide05.png';
import Slide06 from '../../../../assets/images/conteudo/licao02/duracao-valores/slide06.png';
import Slide07 from '../../../../assets/images/conteudo/licao02/duracao-valores/slide07.png';
import Slide08 from '../../../../assets/images/conteudo/licao02/duracao-valores/slide08.png';
import Slide09 from '../../../../assets/images/conteudo/licao02/duracao-valores/slide09.png';
import Slide10 from '../../../../assets/images/conteudo/licao02/duracao-valores/slide10.png';
import Slide11 from '../../../../assets/images/conteudo/licao02/duracao-valores/slide11.png';

import Som from '../../../../assets/icons/sound.png';

import {
  ConteudoNextButton,
  ConteudoDoneButton,
  ConteudoPrevButton,
  ConteudoSkipButton,
} from '../../../../components/buttons/conteudo/ConteudoButtons';

const audioMap = {
  semibreve: require('../../../../assets/sounds/licao02/duracao-valores/semibreve.mp3'),
  minima: require('../../../../assets/sounds/licao02/duracao-valores/minima.mp3'),
  seminima: require('../../../../assets/sounds/licao02/duracao-valores/seminima.mp3'),
  colcheia: require('../../../../assets/sounds/licao02/duracao-valores/colcheia.mp3'),
  semicolcheia: require('../../../../assets/sounds/licao02/duracao-valores/semicolcheia.mp3'),
  fusa: require('../../../../assets/sounds/licao02/duracao-valores/fusa.mp3'),
  semifusa: require('../../../../assets/sounds/licao02/duracao-valores/semifusa.mp3'),
};

function DuracaoValores() {
  const navigation = useNavigation();
  const route = useRoute();

  const { width, height } = Dimensions.get('window');

  const [slides, setSlides] = useState([]);
  const [musica, setMusica] = useState(null);
  const [isLoadingSlides, setIsLoadingSlides] = useState(true);

  const normalImageStyle = {
    width: width * 0.95,
    height: height * 0.56,
  };

  const valueImageStyle = {
    width: width * 0.95,
    height: height * 0.48,
  };

  useEffect(() => {
    let isMounted = true;

    const loadSlides = async () => {
      try {
        setIsLoadingSlides(true);

        const contentKey = route?.params?.content ?? '7';
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
        console.log('[DURACAO_VALORES] Erro ao carregar slides da API:', error);

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
        console.log(`[DURACAO_VALORES] Erro ao carregar áudio ${audioName}:`, error);
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
    navigation.navigate('AtivDuracao');
  };

  const renderSoundBlock = (soundName, isFinal = false) => {
    const Wrapper = isFinal ? DivFinal : Div;

    return (
      <Wrapper>
        <DivisorLine />

        <TouchableOpacity onPress={() => selected(soundName)}>
          <SafeAreaView>
            <ImageSound source={Som} />
          </SafeAreaView>
        </TouchableOpacity>

        <DivisorLine />
      </Wrapper>
    );
  };

  const renderGroupedDuracao01 = () => (
    <FlatView style={{ marginTop: 10 }}>
      <FastImage resizeMode="contain" source={Slide01} style={normalImageStyle} />
      <FastImage resizeMode="contain" source={Slide02} style={normalImageStyle} />
      <FastImage resizeMode="contain" source={Slide03} style={normalImageStyle} />
    </FlatView>
  );

  const renderGroupedDuracao02 = () => (
    <FlatView>
      <FastImage resizeMode="contain" source={Slide04} style={valueImageStyle} />
      <DivisorLine2 style={{ marginTop: 20 }} />

      <FastImage resizeMode="contain" source={Slide05} style={valueImageStyle} />
      {renderSoundBlock('semibreve')}

      <FastImage resizeMode="contain" source={Slide06} style={valueImageStyle} />
      {renderSoundBlock('minima')}

      <FastImage resizeMode="contain" source={Slide07} style={valueImageStyle} />
      {renderSoundBlock('seminima')}

      <FastImage resizeMode="contain" source={Slide08} style={valueImageStyle} />
      {renderSoundBlock('colcheia')}

      <FastImage resizeMode="contain" source={Slide09} style={valueImageStyle} />
      {renderSoundBlock('semicolcheia')}

      <FastImage resizeMode="contain" source={Slide10} style={valueImageStyle} />
      {renderSoundBlock('fusa')}

      <FastImage resizeMode="contain" source={Slide11} style={valueImageStyle} />
      {renderSoundBlock('semifusa', true)}
    </FlatView>
  );

  const renderGroupedSlide = (imageName) => {
    if (imageName === 'slide01_03.png') {
      return renderGroupedDuracao01();
    }

    if (imageName === 'slide04_11.png') {
      return renderGroupedDuracao02();
    }

    return null;
  };

  const renderSlides = ({ item }) => (
    <Container>
      <DuracaoValoresHeader />

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

export default DuracaoValores;