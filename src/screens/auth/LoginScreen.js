import React, { useEffect, useRef, useState } from 'react';
import {
  Platform,
  KeyboardAvoidingView,
  Alert,
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

export default function LoginScreen() {
  const { login, loginWithGoogle } = useAuth();
  const navigation = useNavigation();

  const floatAnim = useRef(new Animated.Value(0)).current;

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
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
    try {
      setGoogleLoading(true);

      const result = await loginWithGoogle();

      if (!result?.ok) {
        Alert.alert(
          'Erro',
          result?.message || 'Não foi possível entrar com Google.',
        );
        return;
      }

      goAfterLogin(result.user);
    } catch (err) {
      console.log('GOOGLE LOGIN ERROR:', err);
      Alert.alert('Erro', 'Não foi possível entrar com Google.');
    } finally {
      setGoogleLoading(false);
    }
  };

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
          backendCode ? `${backendMessage} (${backendCode})` : backendMessage,
        );
        return;
      }

      login(data);
      goAfterLogin(data);
    } catch (err) {
      console.log('LOGIN ERROR:', err);
      Alert.alert(
        'Erro de rede',
        'Não foi possível conectar ao servidor. Verifique a URL/porta e sua conexão.',
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
                  style={{
                    width: 22,
                    height: 22,
                  }}
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
            <InputWrapper>
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
                onChangeText={setEmail}
                editable={!isBusy}
              />
            </InputWrapper>

            <InputWrapper style={{ marginTop: 16 }}>
              <InputIconArea>
                <Feather name="lock" size={22} color={teal} />
              </InputIconArea>

              <StyledTextInput
                placeholder="Senha"
                placeholderTextColor="#9a9a9a"
                secureTextEntry
                value={senha}
                onChangeText={setSenha}
                editable={!isBusy}
              />
            </InputWrapper>

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