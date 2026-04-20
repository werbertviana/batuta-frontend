import React from 'react';
import { FlatList, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AppIntroSlider from 'react-native-app-intro-slider';
import FastImage from 'react-native-fast-image';
import ClaveHeader from './ClaveHeader';

import {
  Container,
  SlideView,
  FlatView,
} from './ClaveStyles';

// importando imagens
import Slide01 from '../../../../assets/images/conteudo/licao01/clave/slide01.png';
import Slide02 from '../../../../assets/images/conteudo/licao01/clave/slide02.png';
import Slide03 from '../../../../assets/images/conteudo/licao01/clave/slide03.png';
import Slide04 from '../../../../assets/images/conteudo/licao01/clave/slide04.png';
import Slide05 from '../../../../assets/images/conteudo/licao01/clave/slide05.png';
import Slide06 from '../../../../assets/images/conteudo/licao01/clave/slide06.png';
import Slide07 from '../../../../assets/images/conteudo/licao01/clave/slide07.png';
import Slide08 from '../../../../assets/images/conteudo/licao01/clave/slide08.png';

// import botões do conteúdo
import {
  ConteudoNextButton,
  ConteudoDoneButton,
  ConteudoPrevButton,
  ConteudoSkipButton,
} from '../../../../components/buttons/conteudo/ConteudoButtons';

// import slides estáticos
import staticSlides from '../../../../data/licao01/clave.json';

function Clave() {
  const allSlides = staticSlides.slides;
  const navigation = useNavigation();
  const { width, height } = Dimensions.get('window');

  const normalImageStyle = {
    width: width * 0.95,
    height: height * 0.55,
  };

  const Done = () => {
    navigation.navigate('AtivClave');
  };

  const renderFlatClave = (item) => {
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

  const renderFlatSol = (item) => {
    if (item === 'slide03_04.png') {
      return (
        <FlatView>
          <FastImage
            resizeMode="contain"
            source={Slide03}
            style={normalImageStyle}
          />
          <FastImage
            resizeMode="contain"
            source={Slide04}
            style={normalImageStyle}
          />
        </FlatView>
      );
    }

    return null;
  };

  const renderFlatFa = (item) => {
    if (item === 'slide05_06.png') {
      return (
        <FlatView>
          <FastImage
            resizeMode="contain"
            source={Slide05}
            style={normalImageStyle}
          />
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

  const renderFlatDo = (item) => {
    if (item === 'slide07_08.png') {
      return (
        <FlatView>
          <FastImage
            resizeMode="contain"
            source={Slide07}
            style={normalImageStyle}
          />
          <FastImage
            resizeMode="contain"
            source={Slide08}
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
        <ClaveHeader />
        <SlideView>
          <FlatList
            data={allSlides}
            keyExtractor={(items) => items.key}
            renderItem={(items) => renderFlatClave(items.item.image)}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
          />
        </SlideView>
      </Container>
    ),

    'slide03_04.png': (
      <Container>
        <ClaveHeader />
        <SlideView>
          <FlatList
            data={allSlides}
            keyExtractor={(items) => items.key}
            renderItem={(items) => renderFlatSol(items.item.image)}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
          />
        </SlideView>
      </Container>
    ),

    'slide05_06.png': (
      <Container>
        <ClaveHeader />
        <SlideView>
          <FlatList
            data={allSlides}
            keyExtractor={(items) => items.key}
            renderItem={(items) => renderFlatFa(items.item.image)}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
          />
        </SlideView>
      </Container>
    ),

    'slide07_08.png': (
      <Container>
        <ClaveHeader />
        <SlideView>
          <FlatList
            data={allSlides}
            keyExtractor={(items) => items.key}
            renderItem={(items) => renderFlatDo(items.item.image)}
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

export default Clave;