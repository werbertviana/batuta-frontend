// src/components/modal/DeleteAccountModal.js

import React, { useEffect, useState } from 'react';
import { Modal } from 'react-native';

import {
  Overlay,
  DeleteContainer,
  DeleteIconWrapper,
  DeleteIconCircle,
  DeleteTitle,
  DeleteMessage,
  PasswordInputWrapper,
  PasswordInput,
  FieldErrorText,
  ButtonsRow,
  CancelButton,
  CancelButtonText,
  ConfirmButton,
  ConfirmButtonText,
} from './DeleteAccountModalStyles';

function DeleteAccountModal({
  visible,
  loading = false,
  error = '',
  onCancel,
  onConfirm,
}) {
  const [step, setStep] = useState('confirm');
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  useEffect(() => {
    if (!visible) {
      setStep('confirm');
      setPassword('');
      setPasswordError('');
    }
  }, [visible]);

  useEffect(() => {
    if (error) {
      setPasswordError('');
    }
  }, [error]);

  const handleCancel = () => {
    if (loading) return;

    setStep('confirm');
    setPassword('');
    setPasswordError('');

    if (onCancel) onCancel();
  };

  const handleFirstConfirm = () => {
    setStep('password');
  };

  const handleFinalConfirm = () => {
    const trimmedPassword = password.trim();

    if (!trimmedPassword) {
      setPasswordError('Digite sua senha para confirmar.');
      return;
    }

    setPasswordError('');

    if (onConfirm) {
      onConfirm(trimmedPassword);
    }
  };

  const isPasswordStep = step === 'password';
  const visibleError = passwordError || error;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleCancel}
    >
      <Overlay>
        <DeleteContainer>
          <DeleteIconWrapper>
            <DeleteIconCircle>!</DeleteIconCircle>
          </DeleteIconWrapper>

          <DeleteTitle>
            {isPasswordStep ? 'Confirmar exclusão' : 'Excluir conta'}
          </DeleteTitle>

          <DeleteMessage>
            {isPasswordStep
              ? 'Para continuar, digite sua senha atual. Essa confirmação protege sua conta.'
              : 'Tem certeza que deseja excluir sua conta? Essa ação é permanente e não pode ser desfeita.'}
          </DeleteMessage>

          {isPasswordStep && (
            <>
              <PasswordInputWrapper hasError={!!visibleError}>
                <PasswordInput
                  value={password}
                  onChangeText={text => {
                    setPassword(text);
                    setPasswordError('');
                  }}
                  placeholder="Senha atual"
                  placeholderTextColor="#999999"
                  secureTextEntry
                  editable={!loading}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </PasswordInputWrapper>

              {!!visibleError && <FieldErrorText>{visibleError}</FieldErrorText>}
            </>
          )}

          <ButtonsRow>
            <CancelButton activeOpacity={0.85} onPress={handleCancel}>
              <CancelButtonText>CANCELAR</CancelButtonText>
            </CancelButton>

            <ConfirmButton
              activeOpacity={0.85}
              onPress={isPasswordStep ? handleFinalConfirm : handleFirstConfirm}
              disabled={loading}
            >
              <ConfirmButtonText>
                {loading
                  ? 'EXCLUINDO...'
                  : isPasswordStep
                    ? 'CONFIRMAR'
                    : 'EXCLUIR'}
              </ConfirmButtonText>
            </ConfirmButton>
          </ButtonsRow>
        </DeleteContainer>
      </Overlay>
    </Modal>
  );
}

export default DeleteAccountModal;