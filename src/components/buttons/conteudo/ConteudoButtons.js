import React from 'react';
import {
  NextView,
  SkipView,
  PrevView,
  DoneView,
  TextPrimary,
  TextSecondary,
} from './ConteudoButtonsStyles';

export const ConteudoNextButton = () => (
  <NextView>
    <TextPrimary>PRÓXIMO</TextPrimary>
  </NextView>
);

export const ConteudoSkipButton = () => (
  <SkipView>
    <TextSecondary>PULAR</TextSecondary>
  </SkipView>
);

export const ConteudoPrevButton = () => (
  <PrevView>
    <TextSecondary>VOLTAR</TextSecondary>
  </PrevView>
);

export const ConteudoDoneButton = () => (
  <DoneView>
    <TextPrimary>PRATICAR</TextPrimary>
  </DoneView>
);