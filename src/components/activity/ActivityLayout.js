// src/components/activity/ActivityLayout.js

import React from 'react';

import AtivHeader from '../ativHeader/AtivHeader';
import NivelIndicator from '../nivel/NivelIndicator';

function ActivityLayout({
  headerRef,
  progress,
  nivel,
  onClose,
  children,
  footer,
  Container,
  ContentContainer,
  ButtonContainer,
}) {
  return (
    <Container>
      <AtivHeader ref={headerRef} progress={progress} onClose={onClose} />

      <NivelIndicator nivel={nivel} />

      <ContentContainer>{children}</ContentContainer>

      <ButtonContainer>{footer}</ButtonContainer>
    </Container>
  );
}

export default ActivityLayout;