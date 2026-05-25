// src/screens/auth/ResetPasswordScreen.js

import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Platform,
  KeyboardAvoidingView,
  Animated,
  Easing,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { useNavigation, useRoute } from '@react-navigation/native';

import {
  Background,
  ResetContainer,
  LogoContainer,
  LogoImage,
  Subtitle,
  Form,
  InputWrapper,
  InputIconArea,
  StyledTextInput,
  FieldErrorText,
  SuccessBox,
  SuccessIconCircle,
  SuccessText,
  ErrorBox,
  ErrorIconCircle,
  ErrorText,
  PrimaryButton,
  ButtonText,
  LoginRow,
  LoginText,
  LoginLink,
} from './ResetPasswordStyles';

import LogoBatuta from '../../assets/images/logo/logo.png';
import LoginBackground from '../../assets/images/login/login-background.png';

const teal = '#2FAFC4';

function getTokenFromRoute(route) {
  return route?.params?.token || route?.params?.params?.token || '';
}

export default function ResetPasswordScreen() {
  const navigation = useNavigation();
  const route = useRoute();

  const floatAnim = useRef(new Animated.Value(0)).current;

  const tokenFromLink = useMemo(() => getTokenFromRoute(route), [route]);
  const shouldShowTokenField = !tokenFromLink;

  const [token, setToken] = useState(tokenFromLink);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [tokenError, setTokenError] = useState('');
  const [newPasswordError, setNewPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [generalError, setGeneralError] = useState('');

  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const API_BASE =
    Platform.OS === 'android'
      ? 'http://10.0.2.2:3000/api'
      : 'http://localhost:3000/api';

  useEffect(() => {
    if (tokenFromLink) {
      setToken(tokenFromLink);
      setTokenError('');
      setGeneralError('');
    }
  }, [tokenFromLink]);

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: -5,
          duration: 1450,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 1450,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    );

    animation.start();

    return () => {
      animation.stop();
    };
  }, [floatAnim]);

  function clearErrors() {
    setTokenError('');
    setNewPasswordError('');
    setConfirmPasswordError('');
    setGeneralError('');
  }

  function clearMessages() {
    clearErrors();
    setSuccessMessage('');
  }

  function validateForm() {
    clearErrors();

    if (!token.trim()) {
      const message = 'Token de recuperação não encontrado.';

      if (shouldShowTokenField) {
        setTokenError(message);
      } else {
        setGeneralError(message);
      }

      return false;
    }

    if (!newPassword.trim()) {
      setNewPasswordError('Informe a nova senha.');
      return false;
    }

    if (newPassword.length < 4) {
      setNewPasswordError('A senha precisa ter pelo menos 4 caracteres.');
      return false;
    }

    if (!confirmPassword.trim()) {
      setConfirmPasswordError('Confirme a nova senha.');
      return false;
    }

    if (newPassword !== confirmPassword) {
      setConfirmPasswordError('As senhas não conferem.');
      return false;
    }

    return true;
  }

  async function handleResetPassword() {
    setSuccessMessage('');
    setGeneralError('');

    if (!validateForm()) return;

    try {
      setLoading(true);

      const response = await fetch(`${API_BASE}/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: token.trim(),
          newPassword,
        }),
      });

      let data = null;

      try {
        data = await response.json();
      } catch (_e) {
        data = null;
      }

      if (!response.ok) {
        const code = data?.error?.code;
        const message =
          data?.error?.message || 'Não foi possível redefinir a senha.';

        if (code === 'INVALID_OR_EXPIRED_RESET_TOKEN') {
          const tokenMessage =
            'Token inválido ou expirado. Solicite uma nova recuperação.';

          if (shouldShowTokenField) {
            setTokenError(tokenMessage);
          } else {
            setGeneralError(tokenMessage);
          }

          return;
        }

        setGeneralError(message);
        return;
      }

      setSuccessMessage('Senha redefinida com sucesso! Redirecionando...');

      setTimeout(() => {
        navigation.reset({
          index: 0,
          routes: [{ name: 'Login' }],
        });
      }, 1800);
    } catch (err) {
      console.log('RESET PASSWORD ERROR:', err);
      setGeneralError('Não foi possível conectar ao servidor.');
    } finally {
      setLoading(false);
    }
  }

  function handleGoToLogin() {
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  }

  return (
    <Background source={LoginBackground} resizeMode="cover">
      <KeyboardAvoidingView
        style={{ flex: 1, width: '100%', alignItems: 'center' }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ResetContainer>
          <Animated.View style={{ transform: [{ translateY: floatAnim }] }}>
            <LogoContainer>
              <LogoImage source={LogoBatuta} resizeMode="contain" />
            </LogoContainer>
          </Animated.View>

          <Subtitle>Crie uma nova senha para acessar sua conta.</Subtitle>

          {!!successMessage && (
            <SuccessBox>
              <SuccessIconCircle>
                <Feather name="check" size={18} color="#ffffff" />
              </SuccessIconCircle>

              <SuccessText>{successMessage}</SuccessText>
            </SuccessBox>
          )}

          {!!generalError && (
            <ErrorBox>
              <ErrorIconCircle>
                <Feather name="alert-triangle" size={16} color="#ffffff" />
              </ErrorIconCircle>

              <ErrorText>{generalError}</ErrorText>
            </ErrorBox>
          )}

          <Form>
            {shouldShowTokenField && (
              <>
                <InputWrapper hasError={!!tokenError}>
                  <InputIconArea>
                    <Feather name="key" size={22} color={teal} />
                  </InputIconArea>

                  <StyledTextInput
                    placeholder="Token de recuperação"
                    placeholderTextColor="#9a9a9a"
                    autoCapitalize="none"
                    autoCorrect={false}
                    value={token}
                    onChangeText={value => {
                      setToken(value);
                      setTokenError('');
                      setGeneralError('');
                      setSuccessMessage('');
                    }}
                    editable={!loading}
                  />
                </InputWrapper>

                {!!tokenError && <FieldErrorText>{tokenError}</FieldErrorText>}
              </>
            )}

            <InputWrapper
              hasError={!!newPasswordError}
              style={{ marginTop: shouldShowTokenField ? 14 : 0 }}
            >
              <InputIconArea>
                <Feather name="lock" size={22} color={teal} />
              </InputIconArea>

              <StyledTextInput
                placeholder="Nova senha"
                placeholderTextColor="#9a9a9a"
                secureTextEntry
                value={newPassword}
                onChangeText={value => {
                  setNewPassword(value);
                  setNewPasswordError('');
                  setGeneralError('');
                  setSuccessMessage('');
                }}
                editable={!loading}
              />
            </InputWrapper>

            {!!newPasswordError && (
              <FieldErrorText>{newPasswordError}</FieldErrorText>
            )}

            <InputWrapper
              hasError={!!confirmPasswordError}
              style={{ marginTop: 14 }}
            >
              <InputIconArea>
                <Feather name="shield" size={22} color={teal} />
              </InputIconArea>

              <StyledTextInput
                placeholder="Confirmar nova senha"
                placeholderTextColor="#9a9a9a"
                secureTextEntry
                value={confirmPassword}
                onChangeText={value => {
                  setConfirmPassword(value);
                  setConfirmPasswordError('');
                  setGeneralError('');
                  setSuccessMessage('');
                }}
                editable={!loading}
              />
            </InputWrapper>

            {!!confirmPasswordError && (
              <FieldErrorText>{confirmPasswordError}</FieldErrorText>
            )}
          </Form>

          <PrimaryButton onPress={handleResetPassword} disabled={loading}>
            <ButtonText>
              {loading ? 'SALVANDO...' : 'REDEFINIR SENHA'}
            </ButtonText>
          </PrimaryButton>

          <LoginRow>
            <LoginText>Lembrou sua senha?</LoginText>
            <LoginLink onPress={handleGoToLogin}>Entrar</LoginLink>
          </LoginRow>
        </ResetContainer>
      </KeyboardAvoidingView>
    </Background>
  );
}