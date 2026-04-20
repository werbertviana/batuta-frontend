import React from 'react';
import { FlatList, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AppIntroSlider from 'react-native-app-intro-slider';
import FastImage from 'react-native-fast-image';
import FigurasNotasHeader from './FigurasNotasHeader';

import {
  Container,
  SlideView,
  FlatView,
} from './FigurasNotasStyles';

// importando imagens
import Slide01 from '../../../../assets/images/conteudo/licao02/figuras-notas/slide01.png';
import Slide02 from '../../../../assets/images/conteudo/licao02/figuras-notas/slide02.png';
import Slide03 from '../../../../assets/images/conteudo/licao02/figuras-notas/slide03.png';
import Slide04 from '../../../../assets/images/conteudo/licao02/figuras-notas/slide04.png';
import Slide05 from '../../../../assets/images/conteudo/licao02/figuras-notas/slide05.png';
import Slide06 from '../../../../assets/images/conteudo/licao02/figuras-notas/slide06.png';

// import botões do conteúdo
import {
  ConteudoNextButton,
  ConteudoDoneButton,
  ConteudoPrevButton,
  ConteudoSkipButton,
} from '../../../../components/buttons/conteudo/ConteudoButtons';

// import slides estáticos
import staticSlides from '../../../../data/licao02/figurasNotas.json';

function FigurasNotas() {
  const allSlides = staticSlides.slides;
  const navigation = useNavigation();
  const { width, height } = Dimensions.get('window');

  const normalImageStyle = {
    width: width * 0.95,
    height: height * 0.55,
  };

  const compactImageStyle = {
    width: width * 0.95,
    height: height * 0.48,
  };

  const observationImageStyle = {
    width: width * 0.90,
    height: height * 0.22,
    marginTop: 10,
  };

  const Done = () => {
    navigation.navigate('AtivFigNotas');
  };

  const renderFlatFigurasNotas01 = (item) => {
    if (item === 'slide01_05.png') {
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
            style={compactImageStyle}
          />
          <FastImage
            resizeMode="contain"
            source={Slide03}
            style={normalImageStyle}
          />
          <FastImage
            resizeMode="contain"
            source={Slide04}
            style={{ ...normalImageStyle, marginTop: 10 }}
          />
          <FastImage
            resizeMode="contain"
            source={Slide05}
            style={observationImageStyle}
          />
        </FlatView>
      );
    }

    return null;
  };

  const renderFlatFigurasNotas02 = (item) => {
    if (item === 'slide06.png') {
      return (
        <FlatView style={{ flex: 1, width: '100%' }}>
          <FastImage
            resizeMode="contain"
            source={Slide06}
            style={normalImageStyle}
          />
        </FlatView>
      );
  }

  return null;
  };

  const slideComponents = {
    'slide01_05.png': (
      <Container>
        <FigurasNotasHeader />
        <SlideView>
          <FlatList
            data={allSlides}
            keyExtractor={(items) => items.key}
            renderItem={(items) => renderFlatFigurasNotas01(items.item.image)}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
          />
        </SlideView>
      </Container>
    ),
    'slide06.png': (
      <Container>
        <FigurasNotasHeader />
        <SlideView>
          <FlatList
            data={allSlides}
            keyExtractor={(items) => items.key}
            renderItem={(items) => renderFlatFigurasNotas02(items.item.image)}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              flexGrow: 1,
              justifyContent: 'center',
              alignItems: 'center',
            }}
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

export default FigurasNotas;