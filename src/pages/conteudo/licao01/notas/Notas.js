import React, { useState, useEffect } from 'react';
import { TouchableOpacity, FlatList, SafeAreaView, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AppIntroSlider from 'react-native-app-intro-slider';
import FastImage from 'react-native-fast-image';
import NotasHeader from './NotasHeader';
import Sound from 'react-native-sound';

import {
  Container,
  ImageSound,
  Div,
  DivisorLine,
  SlideView,
  FlatView,
  DivFinal,
} from './NotasStyles';

// importando imagens
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
import staticSlides from '../../../../data/licao01/notas.json';

function Notas() {
  const allSlides = staticSlides.slides;
  const [musica, setMusica] = useState(null);
  const navigation = useNavigation();
  const { width, height } = Dimensions.get('window');

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

    if (music === 'do') {
      sound = new Sound(
        require('../../../../assets/sounds/licao01/notas/do.mp3'),
        (error) => {
          if (error) {
            console.log('Erro ao carregar a nota Dó:', error);
            return;
          }
          sound.play((success) => {
            if (success) {
              console.log('Nota Dó terminou de tocar');
            } else {
              console.log('Erro ao reproduzir a nota Dó');
            }
            setMusica(null);
          });
        }
      );
    }

    if (music === 're') {
      sound = new Sound(
        require('../../../../assets/sounds/licao01/notas/re.mp3'),
        (error) => {
          if (error) {
            console.log('Erro ao carregar a nota Ré:', error);
            return;
          }
          sound.play((success) => {
            if (success) {
              console.log('Nota Ré terminou de tocar');
            } else {
              console.log('Erro ao reproduzir a nota Ré');
            }
            setMusica(null);
          });
        }
      );
    }

    if (music === 'mi') {
      sound = new Sound(
        require('../../../../assets/sounds/licao01/notas/mi.mp3'),
        (error) => {
          if (error) {
            console.log('Erro ao carregar a nota Mi:', error);
            return;
          }
          sound.play((success) => {
            if (success) {
              console.log('Nota Mi terminou de tocar');
            } else {
              console.log('Erro ao reproduzir a nota Mi');
            }
            setMusica(null);
          });
        }
      );
    }

    if (music === 'fa') {
      sound = new Sound(
        require('../../../../assets/sounds/licao01/notas/fa.mp3'),
        (error) => {
          if (error) {
            console.log('Erro ao carregar a nota Fá:', error);
            return;
          }
          sound.play((success) => {
            if (success) {
              console.log('Nota Fá terminou de tocar');
            } else {
              console.log('Erro ao reproduzir a nota Fá');
            }
            setMusica(null);
          });
        }
      );
    }

    if (music === 'sol') {
      sound = new Sound(
        require('../../../../assets/sounds/licao01/notas/sol.mp3'),
        (error) => {
          if (error) {
            console.log('Erro ao carregar a nota Sol:', error);
            return;
          }
          sound.play((success) => {
            if (success) {
              console.log('Nota Sol terminou de tocar');
            } else {
              console.log('Erro ao reproduzir a nota Sol');
            }
            setMusica(null);
          });
        }
      );
    }

    if (music === 'la') {
      sound = new Sound(
        require('../../../../assets/sounds/licao01/notas/la.mp3'),
        (error) => {
          if (error) {
            console.log('Erro ao carregar a nota Lá:', error);
            return;
          }
          sound.play((success) => {
            if (success) {
              console.log('Nota Lá terminou de tocar');
            } else {
              console.log('Erro ao reproduzir a nota Lá');
            }
            setMusica(null);
          });
        }
      );
    }

    if (music === 'si') {
      sound = new Sound(
        require('../../../../assets/sounds/licao01/notas/si.mp3'),
        (error) => {
          if (error) {
            console.log('Erro ao carregar a nota Si:', error);
            return;
          }
          sound.play((success) => {
            if (success) {
              console.log('Nota Si terminou de tocar');
            } else {
              console.log('Erro ao reproduzir a nota Si');
            }
            setMusica(null);
          });
        }
      );
    }

    if (music === 'escala') {
      sound = new Sound(
        require('../../../../assets/sounds/licao01/notas/escala.mp3'),
        (error) => {
          if (error) {
            console.log('Erro ao carregar a escala:', error);
            return;
          }
          sound.play((success) => {
            if (success) {
              console.log('Escala terminou de tocar');
            } else {
              console.log('Erro ao reproduzir a escala');
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

  const renderFlatNotas01 = (item) => {
    if (item === 'slide01_03.png') {
      return (
        <FlatView>
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

  const renderFlatNotas02 = (item) => {
    if (item === 'slide04_11.png') {
      return (
        <FlatView>
          <FastImage
            resizeMode="contain"
            source={Slide04}
            style={noteImageStyle}
          />
          {renderSoundBlock('do')}

          <FastImage
            resizeMode="contain"
            source={Slide05}
            style={noteImageStyle}
          />
          {renderSoundBlock('re')}

          <FastImage
            resizeMode="contain"
            source={Slide06}
            style={noteImageStyle}
          />
          {renderSoundBlock('mi')}

          <FastImage
            resizeMode="contain"
            source={Slide07}
            style={noteImageStyle}
          />
          {renderSoundBlock('fa')}

          <FastImage
            resizeMode="contain"
            source={Slide08}
            style={noteImageStyle}
          />
          {renderSoundBlock('sol')}

          <FastImage
            resizeMode="contain"
            source={Slide09}
            style={noteImageStyle}
          />
          {renderSoundBlock('la')}

          <FastImage
            resizeMode="contain"
            source={Slide10}
            style={noteImageStyle}
          />
          {renderSoundBlock('si')}

          <FastImage
            resizeMode="contain"
            source={Slide11}
            style={finalImageStyle}
          />
          {renderSoundBlock('escala', true)}
        </FlatView>
      );
    }

    return null;
  };

  const slideComponents = {
    'slide01_03.png': (
      <Container>
        <NotasHeader />
        <SlideView>
          <FlatList
            data={allSlides}
            keyExtractor={(items) => items.key}
            renderItem={(items) => renderFlatNotas01(items.item.image)}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
          />
        </SlideView>
      </Container>
    ),
    'slide04_11.png': (
      <Container>
        <NotasHeader />
        <SlideView>
          <FlatList
            data={allSlides}
            keyExtractor={(items) => items.key}
            renderItem={(items) => renderFlatNotas02(items.item.image)}
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

export default Notas;