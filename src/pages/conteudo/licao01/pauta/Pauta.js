import React from 'react';
import { useNavigation } from '@react-navigation/native';
import AppIntroSlider from 'react-native-app-intro-slider';
import FastImage from 'react-native-fast-image';
import { FlatList, Dimensions } from 'react-native';
import PautaHeader from './PautaHeader';

import {
  Container,
  SlideView,
  FlatView,
} from './PautaStyles';

// importando imagens
import Slide01 from '../../../../assets/images/conteudo/licao01/pauta/slide01.png';
import Slide02 from '../../../../assets/images/conteudo/licao01/pauta/slide02.png';
import Slide03 from '../../../../assets/images/conteudo/licao01/pauta/slide03.png';
import Slide04 from '../../../../assets/images/conteudo/licao01/pauta/slide04.png';
import Slide05 from '../../../../assets/images/conteudo/licao01/pauta/slide05.png';
import Slide06 from '../../../../assets/images/conteudo/licao01/pauta/slide06.png';
import Slide07 from '../../../../assets/images/conteudo/licao01/pauta/slide07.png';
import Slide08 from '../../../../assets/images/conteudo/licao01/pauta/slide08.png';

// import slides estáticos
import staticSlides from '../../../../data/licao01/pauta.json';

// import botões do conteúdo
import {
  ConteudoNextButton,
  ConteudoDoneButton,
  ConteudoPrevButton,
  ConteudoSkipButton,
} from '../../../../components/buttons/conteudo/ConteudoButtons';

function Pauta() {
  const allSlides = staticSlides.slides;
  const navigation = useNavigation();
  const { width, height } = Dimensions.get('window');

  const normalImageStyle = {
    width: width * 0.95,
    height: height * 0.55,
  };

  const Done = () => {
    navigation.navigate('AtivPauta');
  };

  const renderFlatPauta01 = (item) => {
    if (item === 'slide01_04.png') {
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

  const renderFlatPauta02 = (item) => {
    if (item === 'slide05_08.png') {
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
    'slide01_04.png': (
      <Container>
        <PautaHeader />
        <SlideView>
          <FlatList
            data={allSlides}
            keyExtractor={(items) => items.key}
            renderItem={(items) => renderFlatPauta01(items.item.image)}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
          />
        </SlideView>
      </Container>
    ),
    'slide05_08.png': (
      <Container>
        <PautaHeader />
        <SlideView>
          <FlatList
            data={allSlides}
            keyExtractor={(items) => items.key}
            renderItem={(items) => renderFlatPauta02(items.item.image)}
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

export default Pauta;