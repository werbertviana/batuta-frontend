import React, { useState, useEffect } from 'react';
import { SafeAreaView, TouchableOpacity, FlatList, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AppIntroSlider from 'react-native-app-intro-slider';
import FastImage from 'react-native-fast-image';
import IntroHeader from './IntroHeader';
import Sound from 'react-native-sound';

import {
  Container,
  ImageSound,
  Div,
  DivisorLine,
  SlideView,
  SlideView2,
  FlatView,
} from './IntroStyles';

// importando imagens
import Slide01 from '../../../../assets/images/conteudo/licao01/introducao/slide01.png';
import Slide02 from '../../../../assets/images/conteudo/licao01/introducao/slide02.png';
import Slide03 from '../../../../assets/images/conteudo/licao01/introducao/slide03.png';
import Slide04 from '../../../../assets/images/conteudo/licao01/introducao/slide04.png';
import Slide05 from '../../../../assets/images/conteudo/licao01/introducao/slide05.png';
import Slide06 from '../../../../assets/images/conteudo/licao01/introducao/slide06.png';

// importando ícones
import Som from '../../../../assets/icons/sound.png';

// import slides estáticos
import staticSlides from '../../../../data/licao01/intro.json';

// import botões do conteúdo
import {
  ConteudoNextButton,
  ConteudoDoneButton,
  ConteudoPrevButton,
  ConteudoSkipButton,
} from '../../../../components/buttons/conteudo/ConteudoButtons';


function Introducao() {
  const allSlides = staticSlides.slides;
  const [musica, setMusica] = useState(null);
  const navigation = useNavigation();
  const { width, height } = Dimensions.get('window');

  const normalImageStyle = {
    width: width * 0.95,
    height: height * 0.55
  };

  const audioImageStyle = {
    width: width * 0.95,
    height: height * 0.50
  };

  const playSound = (music) => {
    Sound.setCategory('Playback');
    let sound = null;

    if (music === 'melodia') {
      sound = new Sound(
        require('../../../../assets/sounds/licao01/introducao/melodia.mp3'),
        (error) => {
          if (error) {
            console.log('Erro ao carregar a melodia:', error);
            return;
          }

          sound.play((success) => {
            if (success) {
              console.log('Melodia terminou de tocar');
            } else {
              console.log('Erro ao reproduzir a melodia');
            }
            setMusica(null);
          });
        }
      );
    }

    if (music === 'harmonia') {
      sound = new Sound(
        require('../../../../assets/sounds/licao01/introducao/harmonia.mp3'),
        (error) => {
          if (error) {
            console.log('Erro ao carregar a harmonia:', error);
            return;
          }

          sound.play((success) => {
            if (success) {
              console.log('Harmonia terminou de tocar');
            } else {
              console.log('Erro ao reproduzir a harmonia');
            }
            setMusica(null);
          });
        }
      );
    }

    if (music === 'ritmo') {
      sound = new Sound(
        require('../../../../assets/sounds/licao01/introducao/ritmo.mp3'),
        (error) => {
          if (error) {
            console.log('Erro ao carregar o ritmo:', error);
            return;
          }

          sound.play((success) => {
            if (success) {
              console.log('Ritmo terminou de tocar');
            } else {
              console.log('Erro ao reproduzir o ritmo');
            }
            setMusica(null);
          });
        }
      );
    }

    setMusica(sound);
  };

  const selected = (music) => {
    if (musica) {
      musica.stop(() => {
        musica.release();
        setMusica(null);
      });
      return;
    }

    playSound(music);
  };

  useEffect(() => {
    return () => {
      if (musica) {
        musica.stop(() => {
          musica.release();
        });
      }
    };
  }, [musica]);

  const Done = () => {
    navigation.navigate('AtivIntro');
  };

  const renderNormalSlide = (source) => (
    <Container>
      <IntroHeader />
      <SlideView>
        <FastImage
          resizeMode="contain"
          source={source}
          style={normalImageStyle}
        />
      </SlideView>
    </Container>
  );

  const renderAudioSlide = (source, soundName) => (
    <Container>
      <IntroHeader />
      <SlideView2>
        <FastImage
          resizeMode="contain"
          source={source}
          style={audioImageStyle}
        />
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

  const renderFlatIntro = (item) => {
    if (item === 'slide02_03.png') {
      return (
        <FlatView>
          <FastImage
            resizeMode="contain"
            source={Slide02}
            style={normalImageStyle}
          />
          <FastImage
            resizeMode="contain"
            source={Slide03}
            style={normalImageStyle}
          />
        </FlatView>
      );
    }

    return null;
  };

  const slideComponents = {
    'slide01.png': renderNormalSlide(Slide01),

    'slide02_03.png': (
      <Container>
        <IntroHeader />
        <SlideView>
          <FlatList
            data={allSlides}
            keyExtractor={(items) => items.key}
            renderItem={(items) => renderFlatIntro(items.item.image)}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
          />
        </SlideView>
      </Container>
    ),

    'slide04.png': renderAudioSlide(Slide04, 'melodia'),
    'slide05.png': renderAudioSlide(Slide05, 'harmonia'),
    'slide06.png': renderAudioSlide(Slide06, 'ritmo'),
  };

  const renderSlides = ({ item }) => {
    return slideComponents[item.image] || null;
  };

  return (
    <AppIntroSlider
      renderItem={renderSlides}
      data={allSlides}
      style={{ backgroundColor: '#FFF' }}
      activeDotStyle={{
        marginTop: '6%',
        backgroundColor: '#96989A',
      }}
      dotStyle={{
        marginTop: '6%',
        backgroundColor: '#D2D3D5',
      }}
      showSkipButton={true}
      showPrevButton={true}
      bottomButton={true}
      renderNextButton={ConteudoNextButton}
      renderSkipButton={ConteudoSkipButton}
      renderDoneButton={ConteudoDoneButton}
      renderPrevButton={ConteudoPrevButton}
      onDone={Done}
    />
  );
}

export default Introducao;