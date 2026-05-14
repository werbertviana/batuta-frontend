// src/components/modal/RemovePhotoModal.js

import React from 'react';
import { Modal } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';

import {
  Overlay,
  RemoveContainer,
  RemoveIconWrapper,
  RemoveTitle,
  RemoveMessage,
  ButtonsRow,
  CancelButton,
  CancelButtonText,
  ConfirmButton,
  ConfirmButtonText,
} from './RemovePhotoModalStyles';

function RemovePhotoModal({
  visible,
  loading = false,
  onCancel,
  onConfirm,
}) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <Overlay>
        <RemoveContainer>
          <RemoveIconWrapper>
            <Feather
              name="trash-2"
              size={42}
              color="#ff3b3b"
            />
          </RemoveIconWrapper>

          <RemoveTitle>
            Remover foto?
          </RemoveTitle>

          <RemoveMessage>
            Sua foto atual será removida do perfil.
          </RemoveMessage>

          <ButtonsRow>
            <CancelButton
              activeOpacity={0.85}
              disabled={loading}
              onPress={onCancel}
            >
              <CancelButtonText>
                CANCELAR
              </CancelButtonText>
            </CancelButton>

            <ConfirmButton
              activeOpacity={0.85}
              disabled={loading}
              onPress={onConfirm}
            >
              <ConfirmButtonText>
                {loading
                  ? 'REMOVENDO...'
                  : 'REMOVER'}
              </ConfirmButtonText>
            </ConfirmButton>
          </ButtonsRow>
        </RemoveContainer>
      </Overlay>
    </Modal>
  );
}

export default RemovePhotoModal;