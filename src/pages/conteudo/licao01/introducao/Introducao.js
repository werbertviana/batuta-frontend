import React, { useState, useEffect, useCallback } from 'react';
import {
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  Dimensions,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import AppIntroSlider from 'react-native-app-intro-slider';
import FastImage from 'react-native-fast-image';
import Sound from 'react-native-sound';

import IntroHeader from './IntroHeader';
import BatutaLoader from '../../../../components/loader/BatutaLoader';

import {
  Container,
  ImageSound,
  Div,
  DivisorLine,
  SlideView,
  SlideView2,
} from './IntroStyles';

import { getModuleByContentKey } from '../../../../services/batutaApi';

import Slide01 from '../../../../assets/images/conteudo/licao01/introducao/slide01.png';
import Slide02 from '../../../../assets/images/conteudo/licao01/introducao/slide02.png';
import Slide03 from '../../../../assets/images/conteudo/licao01/introducao/slide03.png';
import Slide04 from '../../../../assets/images/conteudo/licao01/introducao/slide04.png';
import Slide05 from '../../../../assets/images/conteudo/licao01/introducao/slide05.png';
import Slide06 from '../../../../assets/images/conteudo/licao01/introducao/slide06.png';

import Som from '../../../../assets/icons/sound.png';

import {
  ConteudoNextButton,
  ConteudoDoneButton,
  ConteudoPrevButton,
  ConteudoSkipButton,
} from '../../../../components/buttons/conteudo/ConteudoButtons';

const slideImageMap = {
  'slide01.png': Slide01,
  'slide04.png': Slide04,
  'slide05.png': Slide05,
  'slide06.png': Slide06,
};

const audioMap = {
  melodia: require('../../../../assets/sounds/licao01/introducao/melodia.mp3'),
  harmonia: require('../../../../assets/sounds/licao01/introducao/harmonia.mp3'),
  ritmo: require('../../../../assets/sounds/licao01/introducao/ritmo.mp3'),
};

function Introducao() {
  const navigation = useNavigation();
  const route = useRoute();

  const { width, height } = Dimensions.get('window');

  const [slides, setSlides] = useState([]);
  const [musica, setMusica] = useState(null);
  const [isLoadingSlides, setIsLoadingSlides] = useState(true);

  const normalImageStyle = {
    width: width * 0.95,
    height: height * 0.55,
  };

  const audioImageStyle = {
    width: width * 0.95,
    height: height * 0.5,
  };

  useEffect(() => {
    let isMounted = true;

    const loadSlides = async () => {
      try {
        setIsLoadingSlides(true);

        const contentKey = route?.params?.content ?? '1';
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
        console.log('[INTRODUCAO] Erro ao carregar slides da API:', error);

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
        console.log(`[INTRODUCAO] Erro ao carregar áudio ${audioName}:`, error);
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
    navigation.navigate('AtivIntro');
  };

  const renderNormalSlide = (source) => (
    <Container>
      <IntroHeader />
      <SlideView>
        <FastImage resizeMode="contain" source={source} style={normalImageStyle} />
      </SlideView>
    </Container>
  );

  const renderAudioSlide = (source, soundName) => (
    <Container>
      <IntroHeader />

      <SlideView2>
        <FastImage resizeMode="contain" source={source} style={audioImageStyle} />
      </SlideView2>

      <Div>
        <DivisorLine />

        <TouchableOpacity onPress={() => selected(soundName)}>
          <SafeAreaView>
            <ImageSound source={Som} />
          </SafeAreaView>
        </TouchableOpacity>

        <DivisorLine />
      </Div>
    </Container>
  );

  const renderFlatIntro = ({ item }) => {
    if (item === 'slide02.png') {
      return (
        <FastImage resizeMode="contain" source={Slide02} style={normalImageStyle} />
      );
    }

    if (item === 'slide03.png') {
      return (
        <FastImage resizeMode="contain" source={Slide03} style={normalImageStyle} />
      );
    }

    return null;
  };

  const renderGroupedSlide = () => (
    <Container>
      <IntroHeader />

      <SlideView>
        <FlatList
          data={['slide02.png', 'slide03.png']}
          keyExtractor={(item) => item}
          renderItem={renderFlatIntro}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
        />
      </SlideView>
    </Container>
  );

  const renderSlides = ({ item }) => {
    if (item.image === 'slide02_03.png') {
      return renderGroupedSlide();
    }

    const source = slideImageMap[item.image];

    if (!source) return null;

    const audioName = item.audios?.[0]?.audioName;

    if (audioName) {
      return renderAudioSlide(source, audioName);
    }

    return renderNormalSlide(source);
  };

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

export default Introducao;