// src/components/activity/AlternativeText.js

import React from 'react';

import {
  AlternativaContainer2,
  CircleInline,
  AlternativaText,
  CircleText,
} from './activityStyles';

function AlternativeText({
  alternativa,
  texto,
  selected,
  onPress,
  disabled,
  activityStyles = {},
}) {
  const AlternativeContainerComponent =
    activityStyles.AlternativaContainer2 || AlternativaContainer2;

  const CircleInlineComponent =
    activityStyles.CircleInline || CircleInline;

  const AlternativeTextComponent =
    activityStyles.AlternativaText || AlternativaText;

  const CircleTextComponent =
    activityStyles.CircleText || CircleText;

  return (
    <AlternativeContainerComponent
      onPress={disabled ? null : onPress}
      style={selected ? { borderColor: '#34B1C7' } : null}
    >
      <CircleInlineComponent
        style={selected ? { borderColor: '#34B1C7' } : null}
      >
        <CircleTextComponent>{alternativa}</CircleTextComponent>
      </CircleInlineComponent>

      <AlternativeTextComponent numberOfLines={3}>
        {texto}
      </AlternativeTextComponent>
    </AlternativeContainerComponent>
  );
}

export default AlternativeText;