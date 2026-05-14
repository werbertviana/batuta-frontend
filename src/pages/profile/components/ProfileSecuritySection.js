// src/pages/profile/components/ProfileSecuritySection.js

import React from 'react';
import Feather from 'react-native-vector-icons/Feather';

import {
  Divider,
  SectionHeader,
  SectionIconCircle,
  SectionIconImage,
  SectionTitle,
  Label,
  InputWrapper,
  Input,
  EyeButton,
  FieldErrorText,
} from '../ProfileStyles';

const teal = '#2FAFC4';
const grayIcon = '#7A7A7A';

function ProfileSecuritySection({
  iconSeguranca,

  currentPassword,
  newPassword,
  confirmPassword,

  currentPasswordError,
  newPasswordError,
  confirmPasswordError,

  showCurrentPassword,
  showNewPassword,
  showConfirmPassword,

  setCurrentPassword,
  setNewPassword,
  setConfirmPassword,

  setCurrentPasswordError,
  setNewPasswordError,
  setConfirmPasswordError,

  setShowCurrentPassword,
  setShowNewPassword,
  setShowConfirmPassword,

  setGeneralError,
  setSuccessMessage,
}) {
  return (
    <>
      <Divider />

      <SectionHeader>
        <SectionIconCircle>
          <SectionIconImage
            source={iconSeguranca}
            resizeMode="contain"
          />
        </SectionIconCircle>

        <SectionTitle>
          SEGURANÇA
        </SectionTitle>
      </SectionHeader>

      <Label>Senha atual</Label>

      <InputWrapper>
        <Feather
          name="lock"
          size={22}
          color={teal}
          style={{ marginRight: 14 }}
        />

        <Input
          value={currentPassword}
          onChangeText={(value) => {
            setCurrentPassword(value);
            setCurrentPasswordError('');
            setGeneralError('');
            setSuccessMessage('');
          }}
          secureTextEntry={!showCurrentPassword}
          placeholder="Digite sua senha atual"
          placeholderTextColor="#B0B0B0"
        />

        <EyeButton
          onPress={() =>
            setShowCurrentPassword(
              !showCurrentPassword
            )
          }
        >
          <Feather
            name={
              showCurrentPassword
                ? 'eye-off'
                : 'eye'
            }
            size={22}
            color={grayIcon}
          />
        </EyeButton>
      </InputWrapper>

      {currentPasswordError ? (
        <FieldErrorText>
          {currentPasswordError}
        </FieldErrorText>
      ) : null}

      <Label>Nova senha</Label>

      <InputWrapper>
        <Feather
          name="lock"
          size={22}
          color={teal}
          style={{ marginRight: 14 }}
        />

        <Input
          value={newPassword}
          onChangeText={(value) => {
            setNewPassword(value);
            setNewPasswordError('');
            setGeneralError('');
            setSuccessMessage('');
          }}
          secureTextEntry={!showNewPassword}
          placeholder="Digite a nova senha"
          placeholderTextColor="#B0B0B0"
        />

        <EyeButton
          onPress={() =>
            setShowNewPassword(
              !showNewPassword
            )
          }
        >
          <Feather
            name={
              showNewPassword
                ? 'eye-off'
                : 'eye'
            }
            size={22}
            color={grayIcon}
          />
        </EyeButton>
      </InputWrapper>

      {newPasswordError ? (
        <FieldErrorText>
          {newPasswordError}
        </FieldErrorText>
      ) : null}

      <Label>Confirmar nova senha</Label>

      <InputWrapper>
        <Feather
          name="lock"
          size={22}
          color={teal}
          style={{ marginRight: 14 }}
        />

        <Input
          value={confirmPassword}
          onChangeText={(value) => {
            setConfirmPassword(value);
            setConfirmPasswordError('');
            setGeneralError('');
            setSuccessMessage('');
          }}
          secureTextEntry={!showConfirmPassword}
          placeholder="Confirme a nova senha"
          placeholderTextColor="#B0B0B0"
        />

        <EyeButton
          onPress={() =>
            setShowConfirmPassword(
              !showConfirmPassword
            )
          }
        >
          <Feather
            name={
              showConfirmPassword
                ? 'eye-off'
                : 'eye'
            }
            size={22}
            color={grayIcon}
          />
        </EyeButton>
      </InputWrapper>

      {confirmPasswordError ? (
        <FieldErrorText>
          {confirmPasswordError}
        </FieldErrorText>
      ) : null}
    </>
  );
}

export default ProfileSecuritySection;