import React, { useState, useEffect } from 'react';
import { FlatList, Dimensions } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import AppIntroSlider from 'react-native-app-intro-slider';
import FastImage from 'react-native-fast-image';

import PautaHeader from './PautaHeader';
import BatutaLoader from '../../../../components/loader/BatutaLoader';

import {
  Container,
  SlideView,
  FlatView,
} from './PautaStyles';

import { getModuleByContentKey } from '../../../../services/batutaApi';

import Slide01 from '../../../../assets/images/conteudo/licao01/pauta/slide01.png';
import Slide02 from '../../../../assets/images/conteudo/licao01/pauta/slide02.png';
import Slide03 from '../../../../assets/images/conteudo/licao01/pauta/slide03.png';
import Slide04 from '../../../../assets/images/conteudo/licao01/pauta/slide04.png';
import Slide05 from '../../../../assets/images/conteudo/licao01/pauta/slide05.png';
import Slide06 from '../../../../assets/images/conteudo/licao01/pauta/slide06.png';
import Slide07 from '../../../../assets/images/conteudo/licao01/pauta/slide07.png';
import Slide08 from '../../../../assets/images/conteudo/licao01/pauta/slide08.png';

import {
  ConteudoNextButton,
  ConteudoDoneButton,
  ConteudoPrevButton,
  ConteudoSkipButton,
} from '../../../../components/buttons/conteudo/ConteudoButtons';

function Pauta() {
  const navigation = useNavigation();
  const route = useRoute();
  const { width, height } = Dimensions.get('window');

  const [slides, setSlides] = useState([]);
  const [isLoadingSlides, setIsLoadingSlides] = useState(true);

  const normalImageStyle = {
    width: width * 0.95,
    height: height * 0.55,
  };

  useEffect(() => {
    let isMounted = true;

    const loadSlides = async () => {
      try {
        setIsLoadingSlides(true);

        const contentKey = route?.params?.content ?? '2';
        const module = await getModuleByContentKey(contentKey);

        const apiSlides = (module?.slides || [])
          .map((slide) => ({
            key: String(slide.id),
            image: slide.image,
            order: slide.order,
          }))
          .sort((a, b) => a.order - b.order);

        if (isMounted) {
          setSlides(apiSlides);
        }
      } catch (error) {
        console.log('[PAUTA] Erro ao carregar slides da API:', error);

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

  const Done = () => {
    navigation.navigate('AtivPauta');
  };

  const renderFlatPauta01 = ({ item }) => {
    if (item === 'slide01.png') {
      return <FastImage resizeMode="contain" source={Slide01} style={normalImageStyle} />;
    }

    if (item === 'slide02.png') {
      return <FastImage resizeMode="contain" source={Slide02} style={normalImageStyle} />;
    }

    if (item === 'slide03.png') {
      return <FastImage resizeMode="contain" source={Slide03} style={normalImageStyle} />;
    }

    if (item === 'slide04.png') {
      return <FastImage resizeMode="contain" source={Slide04} style={normalImageStyle} />;
    }

    return null;
  };

  const renderFlatPauta02 = ({ item }) => {
    if (item === 'slide05.png') {
      return <FastImage resizeMode="contain" source={Slide05} style={normalImageStyle} />;
    }

    if (item === 'slide06.png') {
      return <FastImage resizeMode="contain" source={Slide06} style={normalImageStyle} />;
    }

    if (item === 'slide07.png') {
      return <FastImage resizeMode="contain" source={Slide07} style={normalImageStyle} />;
    }

    if (item === 'slide08.png') {
      return <FastImage resizeMode="contain" source={Slide08} style={normalImageStyle} />;
    }

    return null;
  };

  const renderGroupedSlide01 = () => (
    <Container>
      <PautaHeader />
      <SlideView>
        <FlatList
          data={['slide01.png', 'slide02.png', 'slide03.png', 'slide04.png']}
          keyExtractor={(item) => item}
          renderItem={renderFlatPauta01}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
        />
      </SlideView>
    </Container>
  );

  const renderGroupedSlide02 = () => (
    <Container>
      <PautaHeader />
      <SlideView>
        <FlatList
          data={['slide05.png', 'slide06.png', 'slide07.png', 'slide08.png']}
          keyExtractor={(item) => item}
          renderItem={renderFlatPauta02}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
        />
      </SlideView>
    </Container>
  );

  const renderSlides = ({ item }) => {
    if (item.image === 'slide01_04.png') {
      return renderGroupedSlide01();
    }

    if (item.image === 'slide05_08.png') {
      return renderGroupedSlide02();
    }

    return null;
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

export default Pauta;