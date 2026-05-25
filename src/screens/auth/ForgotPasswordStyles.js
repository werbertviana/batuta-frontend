// src/screens/auth/ForgotPasswordStyles.js

import styled from 'styled-components/native';
import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const contentWidth = '82%';

export const Background = styled.ImageBackground`
  flex: 1;
  background-color: white;
  align-items: center;
`;

export const ForgotContainer = styled.View`
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
  margin-bottom: 10px;
`;

export const LogoImage = styled.Image`
  width: ${Math.min(width * 0.38, 150)}px;
  height: ${Math.min(width * 0.38, 150)}px;
`;

export const Subtitle = styled.Text`
  width: ${contentWidth};
  text-align: center;
  font-family: 'GothamCondensed-Book';
  font-size: ${Math.min(width * 0.05, 20)}px;
  line-height: ${Math.min(width * 0.06, 24)}px;
  color: #5b5b5b;
  margin-top: 4px;
  margin-bottom: 18px;
`;

export const SuccessBox = styled.View`
  width: ${contentWidth};
  min-height: 52px;
  background-color: #e8f8ec;
  border-width: 1.5px;
  border-color: #34b85a;
  border-radius: 14px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding-horizontal: 14px;
  padding-vertical: 8px;
  margin-bottom: 14px;
`;

export const SuccessIconCircle = styled.View`
  width: 26px;
  height: 26px;
  border-radius: 13px;
  background-color: #34b85a;
  align-items: center;
  justify-content: center;
  margin-right: 8px;
`;

export const SuccessText = styled.Text`
  flex: 1;
  font-family: 'GothamCondensed-Medium';
  font-size: ${Math.min(width * 0.043, 17)}px;
  line-height: ${Math.min(width * 0.052, 21)}px;
  color: #1f7d3b;
`;

export const Form = styled.View`
  width: ${contentWidth};
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

export const FieldErrorText = styled.Text`
  font-family: 'GothamCondensed-Medium';
  font-size: ${Math.min(width * 0.042, 16)}px;
  color: #ff3b3b;
  margin-top: 5px;
  margin-bottom: -3px;
  padding-left: 4px;
`;

export const PrimaryButton = styled.TouchableOpacity`
  width: ${contentWidth};
  height: ${Math.min(height * 0.072, 62)}px;
  justify-content: center;
  align-items: center;
  border-radius: 14px;
  background-color: #3cb1c7;
  border-bottom-width: 4px;
  border-color: #236a79;
  margin-top: 26px;
  margin-bottom: 18px;
  opacity: ${({ disabled }) => (disabled ? 0.65 : 1)};
  border-left-width: 0.5px;
  border-right-width: 0.5px;
`;

export const ButtonText = styled.Text`
  font-family: 'GothamCondensed-Medium';
  font-size: ${Math.min(width * 0.074, 28)}px;
  color: #ffffff;
  letter-spacing: 1px;
`;

export const LoginRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

export const LoginText = styled.Text`
  font-family: 'GothamCondensed-Medium';
  font-size: ${Math.min(width * 0.051, 20)}px;
  color: #222222;
`;

export const LoginLink = styled.Text`
  font-family: 'GothamCondensed-Medium';
  font-size: ${Math.min(width * 0.053, 21)}px;
  color: #236a79;
  margin-left: 6px;
`;