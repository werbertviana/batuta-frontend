// src/components/modal/DeleteAccountModal.js

import React from 'react';
import { Modal } from 'react-native';

import {
  Overlay,
  DeleteContainer,
  DeleteIconWrapper,
  DeleteIconCircle,
  DeleteTitle,
  DeleteMessage,
  ButtonsRow,
  CancelButton,
  CancelButtonText,
  ConfirmButton,
  ConfirmButtonText,
} from './DeleteAccountModalStyles';

function DeleteAccountModal({
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
        <DeleteContainer>
          <DeleteIconWrapper>
            <DeleteIconCircle>!</DeleteIconCircle>
          </DeleteIconWrapper>

          <DeleteTitle>Excluir conta</DeleteTitle>

          <DeleteMessage>
            Tem certeza que deseja excluir sua conta? Essa ação é permanente e
            não pode ser desfeita.
          </DeleteMessage>

          <ButtonsRow>
            <CancelButton activeOpacity={0.85} onPress={onCancel}>
              <CancelButtonText>CANCELAR</CancelButtonText>
            </CancelButton>

            <ConfirmButton
              activeOpacity={0.85}
              onPress={onConfirm}
              disabled={loading}
            >
              <ConfirmButtonText>
                {loading ? 'EXCLUINDO...' : 'EXCLUIR'}
              </ConfirmButtonText>
            </ConfirmButton>
          </ButtonsRow>
        </DeleteContainer>
      </Overlay>
    </Modal>
  );
}

export default DeleteAccountModal;