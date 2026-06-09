// src/screens/auth/LoginStyles.js

import styled from 'styled-components/native';
import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const contentWidth = '82%';

export const Background = styled.ImageBackground`
  flex: 1;
  background-color: white;
  align-items: center;
`;

export const LoginContainer = styled.View`
  flex: 1;
  width: 100%;
  align-items: center;
  justify-content: center;
  padding-top: ${Math.max(height * 0.035, 26)}px;
  padding-bottom: ${Math.max(height * 0.026, 22)}px;
`;

export const LogoContainer = styled.View`
  align-items: center;
  justify-content: center;
  margin-bottom: ${Math.max(height * 0.018, 14)}px;
`;

export const LogoImage = styled.Image`
  width: ${Math.min(width * 0.43, 170)}px;
  height: ${Math.min(width * 0.43, 170)}px;
`;

export const Form = styled.View`
  width: ${contentWidth};
  margin-top: 2px;
`;

export const InputWrapper = styled.View`
  flex-direction: row;
  align-items: center;
  background-color: #ebecec;
  border-radius: 14px;
  height: ${Math.min(height * 0.062, 52)}px;
  border-bottom-width: 3px;
  border-color: ${({ hasError }) => (hasError ? '#ff3b3b' : '#d4d6d6')};
  border-left-width: 0.5px;
  border-right-width: 0.5px;
`;

export const InputIconArea = styled.View`
  width: 44px;
  align-items: center;
  justify-content: center;
  margin-left: 8px;
  margin-right: 6px;
`;

export const StyledTextInput = styled.TextInput`
  flex: 1;
  font-size: ${Math.min(width * 0.052, 20)}px;
  color: #333333;
  font-family: 'GothamCondensed-Medium';
  padding-right: 14px;
`;

export const ForgotPasswordText = styled.Text`
  align-self: flex-end;
  margin-top: 10px;
  font-size: ${Math.min(width * 0.052, 21)}px;
  color: #236a79;
  font-family: 'GothamCondensed-Medium';
`;

export const ButtonsContainer = styled.View`
  align-items: center;
  justify-content: center;
  width: ${contentWidth};
`;

export const GoogleButton = styled.TouchableOpacity`
  width: 100%;
  min-height: ${Math.min(height * 0.068, 58)}px;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  border-radius: 14px;
  background-color: #ffffff;
  border-width: 1px;
  border-color: #d9d9d9;
  border-bottom-width: 4px;
  margin-bottom: 16px;
  opacity: ${({ disabled }) => (disabled ? 0.65 : 1)};
`;

export const GoogleIconCircle = styled.View`
  width: 34px;
  height: 34px;
  border-radius: 17px;
  align-items: center;
  justify-content: center;
  background-color: #ffffff;
  border-width: 1px;
  border-color: #e5e5e5;
  margin-right: 10px;
`;

export const GoogleIconText = styled.Text`
  font-size: 21px;
  color: #4285f4;
  font-weight: bold;
`;

export const GoogleButtonText = styled.Text`
  font-family: 'GothamCondensed-Medium';
  font-size: ${Math.min(width * 0.058, 24)}px;
  color: #222222;
  letter-spacing: 0.8px;
`;

export const DividerContainer = styled.View`
  width: 100%;
  flex-direction: row;
  align-items: center;
  margin-bottom: 16px;
`;

export const DividerLine = styled.View`
  flex: 1;
  height: 1px;
  background-color: rgba(0, 0, 0, 0.18);
`;

export const DividerText = styled.Text`
  margin: 0 10px;
  font-size: ${Math.min(width * 0.046, 18)}px;
  color: #333333;
  font-family: 'GothamCondensed-Medium';
`;

export const PrimaryButton = styled.TouchableOpacity`
  width: 100%;
  height: ${Math.min(height * 0.072, 62)}px;
  justify-content: center;
  align-items: center;
  border-radius: 14px;
  background-color: #3cb1c7;
  border-bottom-width: 4px;
  border-color: #236a79;
  margin-top: 24px;
  margin-bottom: 16px;
  opacity: ${({ disabled }) => (disabled ? 0.65 : 1)};
  border-left-width: 0.5px;
  border-right-width: 0.5px;
`;

export const ButtonText = styled.Text`
  font-family: 'GothamCondensed-Medium';
  font-size: ${Math.min(width * 0.078, 30)}px;
  color: #ffffff;
  letter-spacing: 1px;
`;

export const CreateAccountRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin-top: 2px;
`;

export const CreateAccountText = styled.Text`
  font-family: 'GothamCondensed-Medium';
  font-size: ${Math.min(width * 0.051, 20)}px;
  color: #222222;
`;

export const CreateAccountLink = styled.Text`
  font-family: 'GothamCondensed-Medium';
  font-size: ${Math.min(width * 0.053, 21)}px;
  color: #236a79;
  margin-left: 6px;
`;

export const FieldErrorText = styled.Text`
  font-family: 'GothamCondensed-Medium';
  font-size: ${Math.min(width * 0.042, 16)}px;
  color: #ff3b3b;
  margin-top: 5px;
  margin-bottom: -3px;
  padding-left: 4px;
`;