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
  hasPassword = true,
  canDeleteWithGoogle = false,
  onCancel,
  onConfirm,
  onConfirmWithGoogle,
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
    if (!hasPassword && canDeleteWithGoogle) {
      if (onConfirmWithGoogle) onConfirmWithGoogle();
      return;
    }

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

  const title = isPasswordStep
    ? 'Confirmar exclusão'
    : 'Excluir conta';

  const message = isPasswordStep
    ? 'Para continuar, digite sua senha atual. Essa confirmação protege sua conta.'
    : !hasPassword && canDeleteWithGoogle
      ? 'Sua conta foi criada com Google. Para proteger sua conta, confirme novamente com Google antes de excluir.'
      : 'Tem certeza que deseja excluir sua conta? Essa ação é permanente e não pode ser desfeita.';

  const confirmLabel = loading
    ? 'EXCLUINDO...'
    : isPasswordStep
      ? 'CONFIRMAR'
      : !hasPassword && canDeleteWithGoogle
        ? 'CONFIRMAR COM GOOGLE'
        : 'EXCLUIR';

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

          <DeleteTitle>{title}</DeleteTitle>

          <DeleteMessage>{message}</DeleteMessage>

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

          {!isPasswordStep && !!visibleError && (
            <FieldErrorText>{visibleError}</FieldErrorText>
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
              <ConfirmButtonText>{confirmLabel}</ConfirmButtonText>
            </ConfirmButton>
          </ButtonsRow>
        </DeleteContainer>
      </Overlay>
    </Modal>
  );
}

export default DeleteAccountModal;