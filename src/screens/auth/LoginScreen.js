// src/screens/auth/LoginScreen.js
import React, { useState } from 'react';
import { Platform, KeyboardAvoidingView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../contexts/AuthContext';

import {
  Background,
  Overlay,
  Container,
  LogoContainer,
  LogoImage,
  Form,
  InputWrapper,
  InputIconArea,
  InputIconText,
  StyledTextInput,
  ForgotPasswordText,
  ButtonsContainer,
  PrimaryButton,
  SecondaryButton,
  ButtonText,
} from './LoginStyles';

import LogoBatuta from '../../assets/images/logo/logo.png';
import LoginBackground from '../../assets/images/login/login-background.png';

export default function LoginScreen() {
  const { login } = useAuth();
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);

  const API_BASE =
    Platform.OS === 'android'
      ? 'http://10.0.2.2:3000/api'
      : 'http://localhost:3000/api';

  const handleLogin = async () => {
    if (!email.trim() || !senha.trim()) {
      Alert.alert('Atenção', 'Informe email e senha.');
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim(),
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
          data?.error?.message || 'Falha no login. Verifique suas credenciais.';
        const backendCode = data?.error?.code;

        Alert.alert(
          'Erro',
          backendCode ? `${backendMessage} (${backendCode})` : backendMessage
        );
        return;
      }

      // { id, name, email, gameStats: { lifePoints, batutaPoints, xpPoints, elo, progressLevel } }
      console.log('LOGIN OK (user):', data);

      login(data);

      navigation.reset({
        index: 0,
        routes: [{ name: 'Tab' }],
      });
    } catch (err) {
      console.log('LOGIN ERROR:', err);
      Alert.alert(
        'Erro de rede',
        'Não foi possível conectar ao servidor. Verifique a URL/porta e sua conexão.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAccount = () => {
    navigation.navigate('Signup');
  };

  const handleForgotPassword = () => {
    console.log('Esqueceu a senha');
  };

  return (
    <Background source={LoginBackground} resizeMode="cover">
      <KeyboardAvoidingView
        style={{ flex: 1, width: '100%', alignItems: 'center' }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <LogoContainer>
          <LogoImage source={LogoBatuta} resizeMode="contain" />
        </LogoContainer>

        <Form>
          <InputWrapper>
            <InputIconArea>
              <InputIconText>✉️</InputIconText>
            </InputIconArea>

            <StyledTextInput
              placeholder="Email"
              placeholderTextColor="#9a9a9a"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
              editable={!loading}
            />
          </InputWrapper>

          <InputWrapper style={{ marginTop: 20 }}>
            <InputIconArea>
              <InputIconText>🔒</InputIconText>
            </InputIconArea>

            <StyledTextInput
              placeholder="Senha"
              placeholderTextColor="#9a9a9a"
              secureTextEntry
              value={senha}
              onChangeText={setSenha}
              editable={!loading}
            />
          </InputWrapper>

          <ForgotPasswordText onPress={handleForgotPassword}>
            Esqueceu a senha?
          </ForgotPasswordText>
        </Form>

        <ButtonsContainer>
          <PrimaryButton onPress={handleLogin} disabled={loading}>
            <ButtonText>{loading ? 'ENTRANDO...' : 'ENTRAR'}</ButtonText>
          </PrimaryButton>

          <SecondaryButton onPress={handleCreateAccount} disabled={loading}>
            <ButtonText>CRIAR CONTA</ButtonText>
          </SecondaryButton>
        </ButtonsContainer>
      </KeyboardAvoidingView>
    </Background>
  );
}