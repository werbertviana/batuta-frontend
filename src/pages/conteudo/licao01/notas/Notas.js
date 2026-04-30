// src/pages/conteudo/licao01/notas/Notas.js

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

import NotasHeader from './NotasHeader';
import BatutaLoader from '../../../../components/loader/BatutaLoader';

import {
  Container,
  ImageSound,
  Div,
  DivisorLine,
  SlideView,
  FlatView,
  DivFinal,
} from './NotasStyles';

import { getModuleByContentKey } from '../../../../services/batutaApi';

import Slide01 from '../../../../assets/images/conteudo/licao01/notas/slide01.png';
import Slide02 from '../../../../assets/images/conteudo/licao01/notas/slide02.png';
import Slide03 from '../../../../assets/images/conteudo/licao01/notas/slide03.png';
import Slide04 from '../../../../assets/images/conteudo/licao01/notas/slide04.png';
import Slide05 from '../../../../assets/images/conteudo/licao01/notas/slide05.png';
import Slide06 from '../../../../assets/images/conteudo/licao01/notas/slide06.png';
import Slide07 from '../../../../assets/images/conteudo/licao01/notas/slide07.png';
import Slide08 from '../../../../assets/images/conteudo/licao01/notas/slide08.png';
import Slide09 from '../../../../assets/images/conteudo/licao01/notas/slide09.png';
import Slide10 from '../../../../assets/images/conteudo/licao01/notas/slide10.png';
import Slide11 from '../../../../assets/images/conteudo/licao01/notas/slide11.png';

import Som from '../../../../assets/icons/sound.png';

import {
  ConteudoNextButton,
  ConteudoDoneButton,
  ConteudoPrevButton,
  ConteudoSkipButton,
} from '../../../../components/buttons/conteudo/ConteudoButtons';

const audioMap = {
  do: require('../../../../assets/sounds/licao01/notas/do.mp3'),
  re: require('../../../../assets/sounds/licao01/notas/re.mp3'),
  mi: require('../../../../assets/sounds/licao01/notas/mi.mp3'),
  fa: require('../../../../assets/sounds/licao01/notas/fa.mp3'),
  sol: require('../../../../assets/sounds/licao01/notas/sol.mp3'),
  la: require('../../../../assets/sounds/licao01/notas/la.mp3'),
  si: require('../../../../assets/sounds/licao01/notas/si.mp3'),
  escala: require('../../../../assets/sounds/licao01/notas/escala.mp3'),
};

function Notas() {
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

  const noteImageStyle = {
    width: width * 0.95,
    height: height * 0.48,
  };

  const finalImageStyle = {
    width: width * 0.95,
    height: height * 0.38,
  };

  useEffect(() => {
    let isMounted = true;

    const loadSlides = async () => {
      try {
        setIsLoadingSlides(true);

        const contentKey = route?.params?.content ?? '3';
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
        console.log('[NOTAS] Erro ao carregar slides da API:', error);

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
        console.log(`[NOTAS] Erro ao carregar áudio ${audioName}:`, error);
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
    navigation.navigate('AtivNotas');
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

  const renderGroupedNotas01 = () => (
    <FlatView>
      <FastImage resizeMode="contain" source={Slide01} style={normalImageStyle} />
      <FastImage resizeMode="contain" source={Slide02} style={normalImageStyle} />
      <FastImage resizeMode="contain" source={Slide03} style={normalImageStyle} />
    </FlatView>
  );

  const renderGroupedNotas02 = () => (
    <FlatView>
      <FastImage resizeMode="contain" source={Slide04} style={noteImageStyle} />
      {renderSoundBlock('do')}

      <FastImage resizeMode="contain" source={Slide05} style={noteImageStyle} />
      {renderSoundBlock('re')}

      <FastImage resizeMode="contain" source={Slide06} style={noteImageStyle} />
      {renderSoundBlock('mi')}

      <FastImage resizeMode="contain" source={Slide07} style={noteImageStyle} />
      {renderSoundBlock('fa')}

      <FastImage resizeMode="contain" source={Slide08} style={noteImageStyle} />
      {renderSoundBlock('sol')}

      <FastImage resizeMode="contain" source={Slide09} style={noteImageStyle} />
      {renderSoundBlock('la')}

      <FastImage resizeMode="contain" source={Slide10} style={noteImageStyle} />
      {renderSoundBlock('si')}

      <FastImage resizeMode="contain" source={Slide11} style={finalImageStyle} />
      {renderSoundBlock('escala', true)}
    </FlatView>
  );

  const renderGroupedSlide = (imageName) => {
    if (imageName === 'slide01_03.png') {
      return renderGroupedNotas01();
    }

    if (imageName === 'slide04_11.png') {
      return renderGroupedNotas02();
    }

    return null;
  };

  const renderSlides = ({ item }) => (
    <Container>
      <NotasHeader />

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

export default Notas;