// src/pages/conteudo/licao02/figuras-notas/FigurasNotas.js

import React, { useState, useEffect } from 'react';
import { FlatList, Dimensions } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import AppIntroSlider from 'react-native-app-intro-slider';
import FastImage from 'react-native-fast-image';

import FigurasNotasHeader from './FigurasNotasHeader';
import BatutaLoader from '../../../../components/loader/BatutaLoader';

import {
  Container,
  SlideView,
  FlatView,
} from './FigurasNotasStyles';

import { getModuleByContentKey } from '../../../../services/batutaApi';

import Slide01 from '../../../../assets/images/conteudo/licao02/figuras-notas/slide01.png';
import Slide02 from '../../../../assets/images/conteudo/licao02/figuras-notas/slide02.png';
import Slide03 from '../../../../assets/images/conteudo/licao02/figuras-notas/slide03.png';
import Slide04 from '../../../../assets/images/conteudo/licao02/figuras-notas/slide04.png';
import Slide05 from '../../../../assets/images/conteudo/licao02/figuras-notas/slide05.png';
import Slide06 from '../../../../assets/images/conteudo/licao02/figuras-notas/slide06.png';

import {
  ConteudoNextButton,
  ConteudoDoneButton,
  ConteudoPrevButton,
  ConteudoSkipButton,
} from '../../../../components/buttons/conteudo/ConteudoButtons';

function FigurasNotas() {
  const navigation = useNavigation();
  const route = useRoute();

  const { width, height } = Dimensions.get('window');

  const [slides, setSlides] = useState([]);
  const [isLoadingSlides, setIsLoadingSlides] = useState(true);

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

  useEffect(() => {
    let isMounted = true;

    const loadSlides = async () => {
      try {
        setIsLoadingSlides(true);

        const contentKey = route?.params?.content ?? '5';
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
        console.log('[FIGURAS_NOTAS] Erro ao carregar slides da API:', error);

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
    navigation.navigate('AtivFigNotas');
  };

  const renderGroupedFigurasNotas01 = () => (
    <FlatView>
      <FastImage resizeMode="contain" source={Slide01} style={normalImageStyle} />
      <FastImage resizeMode="contain" source={Slide02} style={compactImageStyle} />
      <FastImage resizeMode="contain" source={Slide03} style={normalImageStyle} />
      <FastImage
        resizeMode="contain"
        source={Slide04}
        style={{ ...normalImageStyle, marginTop: 10 }}
      />
      <FastImage resizeMode="contain" source={Slide05} style={observationImageStyle} />
    </FlatView>
  );

  const renderGroupedFigurasNotas02 = () => (
    <FlatView style={{ flex: 1, width: '100%' }}>
      <FastImage resizeMode="contain" source={Slide06} style={normalImageStyle} />
    </FlatView>
  );

  const renderGroupedSlide = (imageName) => {
    if (imageName === 'slide01_05.png') {
      return renderGroupedFigurasNotas01();
    }

    if (imageName === 'slide06.png') {
      return renderGroupedFigurasNotas02();
    }

    return null;
  };

  const renderSlides = ({ item }) => {
    const isSingleCenteredSlide = item.image === 'slide06.png';

    return (
      <Container>
        <FigurasNotasHeader />

        <SlideView>
          <FlatList
            data={[item.image]}
            keyExtractor={(image) => image}
            renderItem={({ item: imageName }) => renderGroupedSlide(imageName)}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={
              isSingleCenteredSlide
                ? {
                    flexGrow: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }
                : undefined
            }
          />
        </SlideView>
      </Container>
    );
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

export default FigurasNotas;