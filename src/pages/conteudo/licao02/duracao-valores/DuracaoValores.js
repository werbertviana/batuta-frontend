import React, { useState, useEffect } from 'react';
import { TouchableOpacity, FlatList, SafeAreaView, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AppIntroSlider from 'react-native-app-intro-slider';
import FastImage from 'react-native-fast-image';
import DuracaoValoresHeader from './DuracaoValoresHeader';
import Sound from 'react-native-sound';

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

// importando imagens
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

// importando ícones
import Som from '../../../../assets/icons/sound.png';

// import botões do conteúdo
import {
  ConteudoNextButton,
  ConteudoDoneButton,
  ConteudoPrevButton,
  ConteudoSkipButton,
} from '../../../../components/buttons/conteudo/ConteudoButtons';

// import slides estáticos
import staticSlides from '../../../../data/licao02/duracaoValores.json';

function DuracaoValores() {
  const allSlides = staticSlides.slides;
  const [musica, setMusica] = useState(null);
  const navigation = useNavigation();
  const { width, height } = Dimensions.get('window');

  const normalImageStyle = {
    width: width * 0.95,
    height: height * 0.56,
  };

  const valueImageStyle = {
    width: width * 0.95,
    height: height * 0.48,
  };

  const selected = (music) => {
    if (musica) {
      musica.stop(() => {
        musica.release();
        setMusica(null);
      });
      return;
    }

    PlaySound(music);
  };

  const PlaySound = (music) => {
    Sound.setCategory('Playback');
    let sound = null;

    if (music === 'semibreve') {
      sound = new Sound(
        require('../../../../assets/sounds/licao02/duracao-valores/semibreve.mp3'),
        (error) => {
          if (error) {
            console.log('Erro ao carregar a Semibreve:', error);
            return;
          }
          sound.play((success) => {
            if (success) {
              console.log('Semibreve terminou de tocar');
            } else {
              console.log('Erro ao reproduzir a Semibreve');
            }
            setMusica(null);
          });
        }
      );
    }

    if (music === 'minima') {
      sound = new Sound(
        require('../../../../assets/sounds/licao02/duracao-valores/minima.mp3'),
        (error) => {
          if (error) {
            console.log('Erro ao carregar a Mínima:', error);
            return;
          }
          sound.play((success) => {
            if (success) {
              console.log('Mínima terminou de tocar');
            } else {
              console.log('Erro ao reproduzir a Mínima');
            }
            setMusica(null);
          });
        }
      );
    }

    if (music === 'seminima') {
      sound = new Sound(
        require('../../../../assets/sounds/licao02/duracao-valores/seminima.mp3'),
        (error) => {
          if (error) {
            console.log('Erro ao carregar a Seminima:', error);
            return;
          }
          sound.play((success) => {
            if (success) {
              console.log('Seminima terminou de tocar');
            } else {
              console.log('Erro ao reproduzir a Seminima');
            }
            setMusica(null);
          });
        }
      );
    }

    if (music === 'colcheia') {
      sound = new Sound(
        require('../../../../assets/sounds/licao02/duracao-valores/colcheia.mp3'),
        (error) => {
          if (error) {
            console.log('Erro ao carregar a Colcheia:', error);
            return;
          }
          sound.play((success) => {
            if (success) {
              console.log('Colcheia terminou de tocar');
            } else {
              console.log('Erro ao reproduzir a Colcheia');
            }
            setMusica(null);
          });
        }
      );
    }

    if (music === 'semicolcheia') {
      sound = new Sound(
        require('../../../../assets/sounds/licao02/duracao-valores/semicolcheia.mp3'),
        (error) => {
          if (error) {
            console.log('Erro ao carregar a Semicolcheia:', error);
            return;
          }
          sound.play((success) => {
            if (success) {
              console.log('Semicolcheia terminou de tocar');
            } else {
              console.log('Erro ao reproduzir a Semicolcheia');
            }
            setMusica(null);
          });
        }
      );
    }

    if (music === 'fusa') {
      sound = new Sound(
        require('../../../../assets/sounds/licao02/duracao-valores/fusa.mp3'),
        (error) => {
          if (error) {
            console.log('Erro ao carregar a Fusa:', error);
            return;
          }
          sound.play((success) => {
            if (success) {
              console.log('Fusa terminou de tocar');
            } else {
              console.log('Erro ao reproduzir a Fusa');
            }
            setMusica(null);
          });
        }
      );
    }

    if (music === 'semifusa') {
      sound = new Sound(
        require('../../../../assets/sounds/licao02/duracao-valores/semifusa.mp3'),
        (error) => {
          if (error) {
            console.log('Erro ao carregar a Semifusa:', error);
            return;
          }
          sound.play((success) => {
            if (success) {
              console.log('Semifusa terminou de tocar');
            } else {
              console.log('Erro ao reproduzir a Semifusa');
            }
            setMusica(null);
          });
        }
      );
    }

    setMusica(sound);
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

  const renderFlatDuracao01 = (item) => {
    if (item === 'slide01_03.png') {
      return (
        <FlatView style={{ marginTop: 10 }}>
          <FastImage
            resizeMode="contain"
            source={Slide01}
            style={normalImageStyle}
          />
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

  const renderFlatDuracao02 = (item) => {
    if (item === 'slide04_11.png') {
      return (
        <FlatView>
          <FastImage
            resizeMode="contain"
            source={Slide04}
            style={valueImageStyle}
          />
          <DivisorLine2 style={{ marginTop: 20 }} />

          <FastImage
            resizeMode="contain"
            source={Slide05}
            style={valueImageStyle}
          />
          {renderSoundBlock('semibreve')}

          <FastImage
            resizeMode="contain"
            source={Slide06}
            style={valueImageStyle}
          />
          {renderSoundBlock('minima')}

          <FastImage
            resizeMode="contain"
            source={Slide07}
            style={valueImageStyle}
          />
          {renderSoundBlock('seminima')}

          <FastImage
            resizeMode="contain"
            source={Slide08}
            style={valueImageStyle}
          />
          {renderSoundBlock('colcheia')}

          <FastImage
            resizeMode="contain"
            source={Slide09}
            style={valueImageStyle}
          />
          {renderSoundBlock('semicolcheia')}

          <FastImage
            resizeMode="contain"
            source={Slide10}
            style={valueImageStyle}
          />
          {renderSoundBlock('fusa')}

          <FastImage
            resizeMode="contain"
            source={Slide11}
            style={valueImageStyle}
          />
          {renderSoundBlock('semifusa', true)}
        </FlatView>
      );
    }

    return null;
  };

  const slideComponents = {
    'slide01_03.png': (
      <Container>
        <DuracaoValoresHeader />
        <SlideView>
          <FlatList
            data={allSlides}
            keyExtractor={(items) => items.key}
            renderItem={(items) => renderFlatDuracao01(items.item.image)}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
          />
        </SlideView>
      </Container>
    ),
    'slide04_11.png': (
      <Container>
        <DuracaoValoresHeader />
        <SlideView>
          <FlatList
            data={allSlides}
            keyExtractor={(items) => items.key}
            renderItem={(items) => renderFlatDuracao02(items.item.image)}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
          />
        </SlideView>
      </Container>
    ),
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

export default DuracaoValores;