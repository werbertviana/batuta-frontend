// src/components/modal/LockedModal.js

import React from 'react';
import { Modal } from 'react-native';

import {
  Overlay,
  LockedContainer,
  LockedIconWrapper,
  LockedIcon,
  LockedTitle,
  LockedMessage,
  LockedButton,
  LockedButtonText,
} from './LockedModalStyles';

function LockedModal({
  visible,
  onClose,
  title = 'Conteúdo bloqueado',
  message = 'Complete a atividade anterior para desbloquear este conteúdo.',
}) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Overlay>
        <LockedContainer>
          <LockedIconWrapper>
            <LockedIcon
              source={require('../../assets/icons/lock.png')}
              resizeMode="contain"
            />
          </LockedIconWrapper>

          <LockedTitle>{title}</LockedTitle>

          <LockedMessage>{message}</LockedMessage>

          <LockedButton activeOpacity={0.85} onPress={onClose}>
            <LockedButtonText>CONTINUAR</LockedButtonText>
          </LockedButton>
        </LockedContainer>
      </Overlay>
    </Modal>
  );
}

export default LockedModal;