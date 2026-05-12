// src/components/activity/AlternativeImage.js

import React from 'react';

import {
  AlternativaContainer,
  ImageContainer,
  CircleContainer,
  CircleText,
  ImageAlternativa,
} from './activityStyles';

function AlternativeImage({
  alternativa,
  imagem,
  imageMap,
  selected,
  onPress,
  disabled,
  activityStyles = {},
}) {
  const source = imageMap?.[imagem];

  const AlternativeContainerComponent =
    activityStyles.AlternativaContainer || AlternativaContainer;

  const ImageContainerComponent =
    activityStyles.ImageContainer || ImageContainer;

  const CircleContainerComponent =
    activityStyles.CircleContainer || CircleContainer;

  const CircleTextComponent =
    activityStyles.CircleText || CircleText;

  const ImageAlternativeComponent =
    activityStyles.ImageAlternativa || ImageAlternativa;

  return (
    <AlternativeContainerComponent
      onPress={disabled ? null : onPress}
      style={selected ? { borderColor: '#34B1C7' } : null}
    >
      <ImageContainerComponent>
        <CircleContainerComponent
          style={selected ? { borderColor: '#34B1C7' } : null}
        >
          <CircleTextComponent>{alternativa}</CircleTextComponent>
        </CircleContainerComponent>

        {source && (
          <ImageAlternativeComponent resizeMode="contain" source={source} />
        )}
      </ImageContainerComponent>
    </AlternativeContainerComponent>
  );
}

export default AlternativeImage;