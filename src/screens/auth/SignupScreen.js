// src/screens/auth/SignupScreen.js

import React, { useEffect, useRef, useState } from 'react';
import {
  Platform,
  KeyboardAvoidingView,
  Alert,
  Animated,
  Easing,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';

import {
  Background,
  SignupContainer,
  LogoContainer,
  LogoImage,
  Form,
  InputWrapper,
  InputIconArea,
  StyledTextInput,
  FieldErrorText,
  ButtonsContainer,
  PrimaryButton,
  ButtonText,
  LoginRow,
  LoginText,
  LoginLink,
  Subtitle,
  SuccessBox,
  SuccessIconCircle,
  SuccessText,
} from './SignupStyles';

import LogoBatuta from '../../assets/images/logo/logo.png';
import LoginBackground from '../../assets/images/login/login-background.png';

const teal = '#2FAFC4';

const commonEmailTypos = {
  'gmai.com': 'gmail.com',
  'gmial.com': 'gmail.com',
  'gmail.con': 'gmail.com',
  'gmail.com.br': 'gmail.com',
  'hotmai.com': 'hotmail.com',
  'hotmal.com': 'hotmail.com',
  'hotmil.com': 'hotmail.com',
  'outlok.com': 'outlook.com',
  'outloo.com': 'outlook.com',
  'yaho.com': 'yahoo.com',
};

function normalizeUsername(value) {
  return value.trim().toLowerCase();
}

function normalizeEmail(value) {
  return value.trim().toLowerCase();
}

function isValidEmailFormat(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);
}

function getEmailDomain(value) {
  return value.split('@')[1]?.toLowerCase() || '';
}

export default function SignupScreen() {
  const navigation = useNavigation();

  const floatAnim = useRef(new Animated.Value(0)).current;

  const [nome, setNome] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');

  const [nomeError, setNomeError] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [senhaError, setSenhaError] = useState('');
  const [confirmarSenhaError, setConfirmarSenhaError] = useState('');

  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

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
    setNomeError('');
    setUsernameError('');
    setEmailError('');
    setSenhaError('');
    setConfirmarSenhaError('');
  }

  function validateForm() {
    clearErrors();

    const trimmedNome = nome.trim();
    const trimmedUsername = normalizeUsername(username);
    const trimmedEmail = normalizeEmail(email);

    if (!trimmedNome) {
      setNomeError('Informe seu nome.');
      return false;
    }

    if (trimmedNome.length < 2) {
      setNomeError('O nome precisa ter pelo menos 2 caracteres.');
      return false;
    }

    if (!trimmedUsername) {
      setUsernameError('Informe um nome de usuário.');
      return false;
    }

    if (trimmedUsername.length < 3) {
      setUsernameError('O usuário precisa ter pelo menos 3 caracteres.');
      return false;
    }

    if (!/^(?!\.)(?!.*\.$)[a-zA-Z0-9._]+$/.test(trimmedUsername)) {
      setUsernameError(
        'Use apenas letras, números, ponto ou underline.',
      );
      return false;
    }

    if (!trimmedEmail) {
      setEmailError('Informe seu email.');
      return false;
    }

    if (!isValidEmailFormat(trimmedEmail)) {
      setEmailError('Informe um email válido.');
      return false;
    }

    const domain = getEmailDomain(trimmedEmail);
    const suggestedDomain = commonEmailTypos[domain];

    if (suggestedDomain) {
      setEmailError(`Você quis dizer ${trimmedEmail.replace(domain, suggestedDomain)}?`);
      return false;
    }

    if (!senha.trim()) {
      setSenhaError('Informe uma senha.');
      return false;
    }

    if (senha.length < 4) {
      setSenhaError('A senha precisa ter pelo menos 4 caracteres.');
      return false;
    }

    if (!confirmarSenha.trim()) {
      setConfirmarSenhaError('Confirme sua senha.');
      return false;
    }

    if (senha !== confirmarSenha) {
      setConfirmarSenhaError('As senhas não conferem.');
      return false;
    }

    return true;
  }

  const handleSignup = async () => {
    setSuccessMessage('');

    if (!validateForm()) return;

    try {
      setLoading(true);

      const response = await fetch(`${API_BASE}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: nome.trim(),
          username: normalizeUsername(username),
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
        const backendMessage =
          data?.error?.message || 'Não foi possível criar a conta.';

        const backendCode = data?.error?.code;

        if (backendCode === 'EMAIL_ALREADY_EXISTS') {
          setEmailError('Este email já está em uso.');
          return;
        }

        if (backendCode === 'USERNAME_ALREADY_EXISTS') {
          setUsernameError('Este usuário já está em uso.');
          return;
        }

        Alert.alert('Erro', backendMessage);
        return;
      }

      setSuccessMessage('Conta criada com sucesso!');

      setTimeout(() => {
        navigation.goBack();
      }, 1200);
    } catch (err) {
      console.log('SIGNUP ERROR:', err);
      Alert.alert('Erro de rede', 'Não foi possível conectar ao servidor.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoToLogin = () => {
    navigation.goBack();
  };

  return (
    <Background source={LoginBackground} resizeMode="cover">
      <KeyboardAvoidingView
        style={{ flex: 1, width: '100%', alignItems: 'center' }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <SignupContainer>
          <Animated.View style={{ transform: [{ translateY: floatAnim }] }}>
            <LogoContainer>
              <LogoImage source={LogoBatuta} resizeMode="contain" />
            </LogoContainer>
          </Animated.View>

          <Subtitle>Crie sua conta e evolua no universo da música.</Subtitle>

          {!!successMessage && (
            <SuccessBox>
              <SuccessIconCircle>
                <Feather name="check" size={18} color="#ffffff" />
              </SuccessIconCircle>

              <SuccessText>{successMessage}</SuccessText>
            </SuccessBox>
          )}

          <Form>
            <InputWrapper hasError={!!nomeError}>
              <InputIconArea>
                <Feather name="user" size={22} color={teal} />
              </InputIconArea>

              <StyledTextInput
                placeholder="Nome"
                placeholderTextColor="#9a9a9a"
                value={nome}
                onChangeText={value => {
                  setNome(value);
                  setNomeError('');
                  setSuccessMessage('');
                }}
                editable={!loading}
              />
            </InputWrapper>
            {!!nomeError && <FieldErrorText>{nomeError}</FieldErrorText>}

            <InputWrapper hasError={!!usernameError} style={{ marginTop: 14 }}>
              <InputIconArea>
                <Feather name="at-sign" size={22} color={teal} />
              </InputIconArea>

              <StyledTextInput
                placeholder="Usuário"
                placeholderTextColor="#9a9a9a"
                autoCapitalize="none"
                autoCorrect={false}
                value={username}
                onChangeText={value => {
                  setUsername(value);
                  setUsernameError('');
                  setSuccessMessage('');
                }}
                editable={!loading}
              />
            </InputWrapper>
            {!!usernameError && (
              <FieldErrorText>{usernameError}</FieldErrorText>
            )}

            <InputWrapper hasError={!!emailError} style={{ marginTop: 14 }}>
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
                }}
                editable={!loading}
              />
            </InputWrapper>
            {!!emailError && <FieldErrorText>{emailError}</FieldErrorText>}

            <InputWrapper hasError={!!senhaError} style={{ marginTop: 14 }}>
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
                  setSuccessMessage('');
                }}
                editable={!loading}
              />
            </InputWrapper>
            {!!senhaError && <FieldErrorText>{senhaError}</FieldErrorText>}

            <InputWrapper
              hasError={!!confirmarSenhaError}
              style={{ marginTop: 14 }}
            >
              <InputIconArea>
                <Feather name="shield" size={22} color={teal} />
              </InputIconArea>

              <StyledTextInput
                placeholder="Confirmar senha"
                placeholderTextColor="#9a9a9a"
                secureTextEntry
                value={confirmarSenha}
                onChangeText={value => {
                  setConfirmarSenha(value);
                  setConfirmarSenhaError('');
                  setSuccessMessage('');
                }}
                editable={!loading}
              />
            </InputWrapper>
            {!!confirmarSenhaError && (
              <FieldErrorText>{confirmarSenhaError}</FieldErrorText>
            )}
          </Form>

          <ButtonsContainer>
            <PrimaryButton onPress={handleSignup} disabled={loading}>
              <ButtonText>{loading ? 'CRIANDO...' : 'CRIAR CONTA'}</ButtonText>
            </PrimaryButton>

            <LoginRow>
              <LoginText>Já possui conta?</LoginText>

              <LoginLink onPress={handleGoToLogin}>Entrar</LoginLink>
            </LoginRow>
          </ButtonsContainer>
        </SignupContainer>
      </KeyboardAvoidingView>
    </Background>
  );
}