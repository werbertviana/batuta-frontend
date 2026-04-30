// src/pages/conteudo/licao01/clave/Clave.js

import React, { useState, useEffect } from 'react';
import { FlatList, Dimensions } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import AppIntroSlider from 'react-native-app-intro-slider';
import FastImage from 'react-native-fast-image';

import ClaveHeader from './ClaveHeader';
import BatutaLoader from '../../../../components/loader/BatutaLoader';

import {
  Container,
  SlideView,
  FlatView,
} from './ClaveStyles';

import { getModuleByContentKey } from '../../../../services/batutaApi';

import Slide01 from '../../../../assets/images/conteudo/licao01/clave/slide01.png';
import Slide02 from '../../../../assets/images/conteudo/licao01/clave/slide02.png';
import Slide03 from '../../../../assets/images/conteudo/licao01/clave/slide03.png';
import Slide04 from '../../../../assets/images/conteudo/licao01/clave/slide04.png';
import Slide05 from '../../../../assets/images/conteudo/licao01/clave/slide05.png';
import Slide06 from '../../../../assets/images/conteudo/licao01/clave/slide06.png';
import Slide07 from '../../../../assets/images/conteudo/licao01/clave/slide07.png';
import Slide08 from '../../../../assets/images/conteudo/licao01/clave/slide08.png';

import {
  ConteudoNextButton,
  ConteudoDoneButton,
  ConteudoPrevButton,
  ConteudoSkipButton,
} from '../../../../components/buttons/conteudo/ConteudoButtons';

const groupedSlideMap = {
  'slide01_02.png': [Slide01, Slide02],
  'slide03_04.png': [Slide03, Slide04],
  'slide05_06.png': [Slide05, Slide06],
  'slide07_08.png': [Slide07, Slide08],
};

function Clave() {
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
            audios: slide.audios || [],
            order: slide.order,
          }))
          .sort((a, b) => a.order - b.order);

        if (isMounted) {
          setSlides(apiSlides);
        }
      } catch (error) {
        console.log('[CLAVE] Erro ao carregar slides da API:', error);

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
    navigation.navigate('AtivClave');
  };

  const renderGroupedImages = (imageName) => {
    const images = groupedSlideMap[imageName];

    if (!images) return null;

    return (
      <FlatView>
        {images.map((source, index) => (
          <FastImage
            key={`${imageName}-${index}`}
            resizeMode="contain"
            source={source}
            style={normalImageStyle}
          />
        ))}
      </FlatView>
    );
  };

  const renderSlides = ({ item }) => (
    <Container>
      <ClaveHeader />

      <SlideView>
        <FlatList
          data={[item.image]}
          keyExtractor={(image) => image}
          renderItem={({ item: imageName }) => renderGroupedImages(imageName)}
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

export default Clave;