// src/screens/auth/LoginScreen.js

import React, { useEffect, useRef, useState } from 'react';
import {
  Platform,
  KeyboardAvoidingView,
  Animated,
  Easing,
  Image,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../contexts/AuthContext';

import {
  Background,
  LoginContainer,
  LogoContainer,
  LogoImage,
  Form,
  InputWrapper,
  InputIconArea,
  StyledTextInput,
  FieldErrorText,
  ForgotPasswordText,
  ButtonsContainer,
  GoogleButton,
  GoogleIconCircle,
  GoogleButtonText,
  DividerContainer,
  DividerLine,
  DividerText,
  PrimaryButton,
  ButtonText,
  CreateAccountRow,
  CreateAccountText,
  CreateAccountLink,
} from './LoginStyles';

import LogoBatuta from '../../assets/images/logo/logo.png';
import LoginBackground from '../../assets/images/login/login-background.png';
import GoogleIcon from '../../assets/images/login/google.png';

const teal = '#2FAFC4';

function hasSeenIntroTutorial(user) {
  return Boolean(user?.tutorialsSeen?.intro);
}

function normalizeEmail(value) {
  return value.trim().toLowerCase();
}

function isValidEmailFormat(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);
}

export default function LoginScreen() {
  const { login, loginWithGoogle } = useAuth();
  const navigation = useNavigation();

  const floatAnim = useRef(new Animated.Value(0)).current;

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  const [emailError, setEmailError] = useState('');
  const [senhaError, setSenhaError] = useState('');
  const [generalError, setGeneralError] = useState('');

  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const isBusy = loading || googleLoading;

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

  function clearErrors() {
    setEmailError('');
    setSenhaError('');
    setGeneralError('');
  }

  function validateForm() {
    clearErrors();

    const trimmedEmail = normalizeEmail(email);

    if (!trimmedEmail) {
      setEmailError('Informe seu email.');
      return false;
    }

    if (!isValidEmailFormat(trimmedEmail)) {
      setEmailError('Informe um email válido.');
      return false;
    }

    if (!senha.trim()) {
      setSenhaError('Informe sua senha.');
      return false;
    }

    return true;
  }

  const goAfterLogin = loggedUser => {
    const alreadySawIntro = hasSeenIntroTutorial(loggedUser);

    if (alreadySawIntro) {
      navigation.reset({
        index: 0,
        routes: [{ name: 'Tab' }],
      });

      return;
    }

    navigation.reset({
      index: 0,
      routes: [
        {
          name: 'Tutorial',
          params: {
            tutorialKey: 'intro',
            returnTo: 'Tab',
            resetAfterFinish: true,
          },
        },
      ],
    });
  };

  const goToSignup = () => {
    if (isBusy) return;
    navigation.navigate('Signup');
  };

  const handleForgotPassword = () => {
    if (isBusy) return;

    navigation.navigate('ForgotPassword', {
      email: email.trim(),
    });
  };

  const handleGoogleLogin = async () => {
    if (isBusy) return;

    try {
      clearErrors();
      setGoogleLoading(true);

      const result = await loginWithGoogle();

      if (!result?.ok) {
        setGeneralError(result?.message || 'Não foi possível entrar com Google.');
        return;
      }

      goAfterLogin(result.user);
    } catch (err) {
      console.log('GOOGLE LOGIN ERROR:', err);
      setGeneralError('Não foi possível entrar com Google.');
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);

      const response = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: normalizeEmail(email),
          password: senha,
        }),
      });

      let data = null;

      try {
        data = await response.json();
      } catch (_e) {
        data = null;
      }

      if (!response.ok) {
        const backendCode = data?.error?.code;
        const backendMessage = data?.error?.message;

        if (backendCode === 'USER_NOT_FOUND' || backendCode === 'EMAIL_NOT_FOUND') {
          setEmailError('Este email não está cadastrado.');
          return;
        }

        if (backendCode === 'INVALID_PASSWORD') {
          setSenhaError('Senha incorreta.');
          return;
        }

        if (backendCode === 'GOOGLE_ACCOUNT_WITHOUT_PASSWORD') {
          setGeneralError(
            'Essa conta foi criada com Google. Entre usando o botão do Google.',
          );
          return;
        }

        if (backendCode === 'INVALID_CREDENTIALS') {
          setGeneralError('Email ou senha incorretos.');
          return;
        }

        setGeneralError(
          backendMessage || 'Falha no login. Verifique suas credenciais.',
        );
        return;
      }

      login(data);
      goAfterLogin(data);
    } catch (err) {
      console.log('LOGIN ERROR:', err);
      setGeneralError(
        'Não foi possível conectar ao servidor. Verifique sua conexão.',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Background source={LoginBackground} resizeMode="cover">
      <KeyboardAvoidingView
        style={{ flex: 1, width: '100%', alignItems: 'center' }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <LoginContainer>
          <Animated.View style={{ transform: [{ translateY: floatAnim }] }}>
            <LogoContainer>
              <LogoImage source={LogoBatuta} resizeMode="contain" />
            </LogoContainer>
          </Animated.View>

          <ButtonsContainer>
            <GoogleButton onPress={handleGoogleLogin} disabled={isBusy}>
              <GoogleIconCircle>
                <Image
                  source={GoogleIcon}
                  resizeMode="contain"
                  style={{ width: 22, height: 22 }}
                />
              </GoogleIconCircle>

              <GoogleButtonText>
                {googleLoading ? 'CONECTANDO...' : 'CONTINUAR COM GOOGLE'}
              </GoogleButtonText>
            </GoogleButton>

            <DividerContainer>
              <DividerLine />
              <DividerText>ou entre com email</DividerText>
              <DividerLine />
            </DividerContainer>
          </ButtonsContainer>

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
                  setGeneralError('');
                }}
                editable={!isBusy}
              />
            </InputWrapper>
            {!!emailError && <FieldErrorText>{emailError}</FieldErrorText>}

            <InputWrapper hasError={!!senhaError} style={{ marginTop: 16 }}>
              <InputIconArea>
                <Feather name="lock" size={22} color={teal} />
              </InputIconArea>

              <StyledTextInput
                placeholder="Senha"
                placeholderTextColor="#9a9a9a"
                secureTextEntry
                value={senha}
                onChangeText={value => {
                  setSenha(value);
                  setSenhaError('');
                  setGeneralError('');
                }}
                editable={!isBusy}
              />
            </InputWrapper>
            {!!senhaError && <FieldErrorText>{senhaError}</FieldErrorText>}

            {!!generalError && <FieldErrorText>{generalError}</FieldErrorText>}

            <ForgotPasswordText onPress={handleForgotPassword}>
              Esqueceu a senha?
            </ForgotPasswordText>
          </Form>

          <ButtonsContainer>
            <PrimaryButton onPress={handleLogin} disabled={isBusy}>
              <ButtonText>{loading ? 'ENTRANDO...' : 'ENTRAR'}</ButtonText>
            </PrimaryButton>

            <CreateAccountRow>
              <CreateAccountText>Ainda não tem conta?</CreateAccountText>

              <CreateAccountLink onPress={goToSignup}>
                Criar com email
              </CreateAccountLink>
            </CreateAccountRow>
          </ButtonsContainer>
        </LoginContainer>
      </KeyboardAvoidingView>
    </Background>
  );
}