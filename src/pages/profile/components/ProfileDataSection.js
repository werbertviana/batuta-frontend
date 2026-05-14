// src/pages/profile/components/ProfileDataSection.js

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
  FieldErrorText,
} from '../ProfileStyles';

const teal = '#2FAFC4';

function ProfileDataSection({
  iconDados,

  name,
  username,
  email,

  nameError,
  usernameError,
  emailError,

  setName,
  setUsername,
  setEmail,

  setNameError,
  setUsernameError,
  setEmailError,

  setGeneralError,
  setSuccessMessage,
}) {
  return (
    <>
      <Divider />

      <SectionHeader>
        <SectionIconCircle>
          <SectionIconImage
            source={iconDados}
            resizeMode="contain"
          />
        </SectionIconCircle>

        <SectionTitle>
          MEUS DADOS
        </SectionTitle>
      </SectionHeader>

      <Label>Nome</Label>

      <InputWrapper>
        <Feather
          name="user"
          size={22}
          color={teal}
          style={{ marginRight: 14 }}
        />

        <Input
          value={name}
          onChangeText={(value) => {
            setName(value);
            setNameError('');
            setGeneralError('');
            setSuccessMessage('');
          }}
          placeholder="Digite seu nome"
          placeholderTextColor="#B0B0B0"
        />
      </InputWrapper>

      {nameError ? (
        <FieldErrorText>
          {nameError}
        </FieldErrorText>
      ) : null}

      <Label>Usuário</Label>

      <InputWrapper>
        <Feather
          name="at-sign"
          size={22}
          color={teal}
          style={{ marginRight: 14 }}
        />

        <Input
          value={username}
          onChangeText={(value) => {
            setUsername(value);
            setUsernameError('');
            setGeneralError('');
            setSuccessMessage('');
          }}
          autoCapitalize="none"
          placeholder="Digite seu usuário"
          placeholderTextColor="#B0B0B0"
        />
      </InputWrapper>

      {usernameError ? (
        <FieldErrorText>
          {usernameError}
        </FieldErrorText>
      ) : null}

      <Label>E-mail</Label>

      <InputWrapper>
        <Feather
          name="mail"
          size={22}
          color={teal}
          style={{ marginRight: 14 }}
        />

        <Input
          value={email}
          onChangeText={(value) => {
            setEmail(value);
            setEmailError('');
            setGeneralError('');
            setSuccessMessage('');
          }}
          keyboardType="email-address"
          autoCapitalize="none"
          placeholder="Digite seu e-mail"
          placeholderTextColor="#B0B0B0"
        />
      </InputWrapper>

      {emailError ? (
        <FieldErrorText>
          {emailError}
        </FieldErrorText>
      ) : null}
    </>
  );
}

export default ProfileDataSection;