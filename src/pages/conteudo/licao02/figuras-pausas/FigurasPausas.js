import React from 'react';
import { FlatList, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AppIntroSlider from 'react-native-app-intro-slider';
import FastImage from 'react-native-fast-image';
import FigurasPausasHeader from './FigurasPausasHeader';

import {
  Container,
  SlideView,
  FlatView,
} from './FigurasPausasStyles';

// importando imagens
import Slide01 from '../../../../assets/images/conteudo/licao02/figuras-pausas/slide01.png';
import Slide02 from '../../../../assets/images/conteudo/licao02/figuras-pausas/slide02.png';
import Slide03 from '../../../../assets/images/conteudo/licao02/figuras-pausas/slide03.png';

// import botões do conteúdo
import {
  ConteudoNextButton,
  ConteudoDoneButton,
  ConteudoPrevButton,
  ConteudoSkipButton,
} from '../../../../components/buttons/conteudo/ConteudoButtons';

// import slides estáticos
import staticSlides from '../../../../data/licao02/figurasPausas.json';

function FigurasPausas() {
  const allSlides = staticSlides.slides;
  const navigation = useNavigation();
  const { width, height } = Dimensions.get('window');

  const normalImageStyle = {
    width: width * 0.95,
    height: height * 0.55,
  };

  const Done = () => {
    navigation.navigate('AtivFigPausas');
  };

  const renderFlatFigurasPausas01 = (item) => {
    if (item === 'slide01_02.png') {
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
        </FlatView>
      );
    }

    return null;
  };

  const renderFlatFigurasPausas02 = (item) => {
    if (item === 'slide03.png') {
      return (
        <FlatView style={{ flex: 1, width: '100%' }}>
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
    'slide01_02.png': (
      <Container>
        <FigurasPausasHeader />
        <SlideView>
          <FlatList
            data={allSlides}
            keyExtractor={(items) => items.key}
            renderItem={(items) => renderFlatFigurasPausas01(items.item.image)}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
          />
        </SlideView>
      </Container>
    ),
    'slide03.png': (
      <Container>
        <FigurasPausasHeader />
        <SlideView>
          <FlatList
            data={allSlides}
            keyExtractor={(items) => items.key}
            renderItem={(items) => renderFlatFigurasPausas02(items.item.image)}
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

export default FigurasPausas;