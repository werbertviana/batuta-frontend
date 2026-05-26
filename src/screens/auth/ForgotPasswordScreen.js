// src/screens/auth/ForgotPasswordScreen.js

import React, { useEffect, useRef, useState } from 'react';
import {
  Platform,
  KeyboardAvoidingView,
  Alert,
  Animated,
  Easing,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { useNavigation, useRoute } from '@react-navigation/native';

import {
  Background,
  ForgotContainer,
  LogoContainer,
  LogoImage,
  Subtitle,
  Form,
  InputWrapper,
  InputIconArea,
  StyledTextInput,
  FieldErrorText,
  SuccessBox,
  SuccessIconImage,
  SuccessText,
  SuccessDivider,
  SuccessDividerLine,
  SuccessDividerDot,
  SuccessEmail,
  PrimaryButton,
  ButtonText,
  LoginRow,
  LoginText,
  LoginLink,
} from './ForgotPasswordStyles';

import LogoBatuta from '../../assets/images/logo/logo.png';
import LoginBackground from '../../assets/images/login/login-background.png';
import CheckSuccessImage from '../../assets/images/forgot/check.png';

const teal = '#2FAFC4';

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);
}

function normalizeEmail(value) {
  return value.trim().toLowerCase();
}

export default function ForgotPasswordScreen() {
  const navigation = useNavigation();
  const route = useRoute();

  const floatAnim = useRef(new Animated.Value(0)).current;
  const initialEmail = route?.params?.email || '';

  const [email, setEmail] = useState(initialEmail);
  const [emailError, setEmailError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [sentEmail, setSentEmail] = useState('');

  const API_BASE =
    Platform.OS === 'android'
      ? 'http://10.0.2.2:3000/api'
      : 'http://localhost:3000/api';

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

  function validateEmail() {
    const normalizedEmail = normalizeEmail(email);

    if (!normalizedEmail) {
      setEmailError('Informe seu email.');
      return false;
    }

    if (!isValidEmail(normalizedEmail)) {
      setEmailError('Informe um email válido.');
      return false;
    }

    return true;
  }

  async function handleSendRecoveryEmail() {
    setEmailError('');
    setSuccessMessage('');
    setSentEmail('');

    if (!validateEmail()) return;

    const normalizedEmail = normalizeEmail(email);

    try {
      setLoading(true);

      const response = await fetch(`${API_BASE}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: normalizedEmail }),
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
          data?.error?.message || 'Não foi possível enviar o email.';

        if (code === 'GOOGLE_ACCOUNT_USE_GOOGLE_LOGIN') {
          setEmailError(
            'Essa conta foi criada com Google. Entre usando o botão Continuar com Google.',
          );
          return;
        }

        Alert.alert('Erro', message);
        return;
      }

      setSentEmail(normalizedEmail);

      setSuccessMessage(
        'Enviamos um link de redefinição.\nVerifique sua caixa de entrada\ne também o spam.',
      );
    } catch (err) {
      console.log('FORGOT PASSWORD ERROR:', err);
      Alert.alert('Erro de rede', 'Não foi possível conectar ao servidor.');
    } finally {
      setLoading(false);
    }
  }

  function handleGoToLogin() {
    navigation.goBack();
  }

  return (
    <Background source={LoginBackground} resizeMode="cover">
      <KeyboardAvoidingView
        style={{ flex: 1, width: '100%', alignItems: 'center' }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ForgotContainer>
          <Animated.View style={{ transform: [{ translateY: floatAnim }] }}>
            <LogoContainer>
              <LogoImage source={LogoBatuta} resizeMode="contain" />
            </LogoContainer>
          </Animated.View>

          <Subtitle>
            Informe seu email para receber o link de redefinição de senha.
          </Subtitle>

          {!!successMessage && (
            <SuccessBox>
              <SuccessIconImage source={CheckSuccessImage} resizeMode="contain" />

              <SuccessText>{successMessage}</SuccessText>

              <SuccessDivider>
                <SuccessDividerLine />
                <SuccessDividerDot />
                <SuccessDividerLine />
              </SuccessDivider>

              {!!sentEmail && <SuccessEmail>{sentEmail}</SuccessEmail>}
            </SuccessBox>
          )}

          <Form>
            <InputWrapper hasError={!!emailError}>
              <InputIconArea>
                <Feather name="mail" size={22} color={teal} />
              </InputIconArea>

              <StyledTextInput
                placeholder="Email"
                placeholderTextColor="#9a9a9a"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                value={email}
                onChangeText={value => {
                  setEmail(value);
                  setEmailError('');
                  setSuccessMessage('');
                  setSentEmail('');
                }}
                editable={!loading}
                returnKeyType="send"
                onSubmitEditing={handleSendRecoveryEmail}
              />
            </InputWrapper>

            {!!emailError && <FieldErrorText>{emailError}</FieldErrorText>}
          </Form>

          <PrimaryButton onPress={handleSendRecoveryEmail} disabled={loading}>
            <ButtonText>
              {loading
                ? 'ENVIANDO...'
                : successMessage
                  ? 'REENVIAR LINK'
                  : 'ENVIAR LINK'}
            </ButtonText>
          </PrimaryButton>

          <LoginRow>
            <LoginText>Lembrou sua senha?</LoginText>
            <LoginLink onPress={handleGoToLogin}>Entrar</LoginLink>
          </LoginRow>
        </ForgotContainer>
      </KeyboardAvoidingView>
    </Background>
  );
}