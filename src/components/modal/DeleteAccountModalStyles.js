// src/components/modal/DeleteAccountModalStyles.js

import styled from 'styled-components/native';
import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const modalWidth = Math.min(width * 0.88, 360);
const iconSize = Math.min(width * 0.23, 92);

export const Overlay = styled.View`
  flex: 1;
  background-color: rgba(0, 0, 0, 0.58);
  align-items: center;
  justify-content: center;
  padding: 24px;
`;

export const DeleteContainer = styled.View`
  width: ${modalWidth}px;
  background-color: #ffffff;
  padding: 26px 22px 22px;
  border-radius: 28px;
  align-items: center;
  justify-content: center;
  elevation: 8;
  shadow-color: #000000;
  shadow-opacity: 0.18;
  shadow-radius: 12px;
  shadow-offset: 0px 4px;
`;

export const DeleteIconWrapper = styled.View`
  width: ${iconSize}px;
  height: ${iconSize}px;
  border-radius: ${iconSize / 2}px;
  background-color: #fff3f3;
  border-width: 3px;
  border-color: #ff3b3b;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
`;

export const DeleteIconCircle = styled.Text`
  font-family: 'GothamCondensed-Medium';
  font-size: ${Math.min(width * 0.15, 58)}px;
  line-height: ${Math.min(width * 0.16, 62)}px;
  color: #ff3b3b;
  text-align: center;
`;

export const DeleteTitle = styled.Text`
  font-family: 'GothamCondensed-Medium';
  font-size: ${Math.min(width * 0.09, 34)}px;
  color: #222222;
  text-align: center;
  margin-bottom: 10px;
`;

export const DeleteMessage = styled.Text`
  font-family: 'GothamCondensed-Book';
  font-size: ${Math.min(width * 0.062, 25)}px;
  line-height: ${Math.min(width * 0.072, 29)}px;
  color: #444444;
  text-align: center;
  margin-bottom: 22px;
`;

export const PasswordInputWrapper = styled.View`
  width: 100%;
  height: ${Math.min(height * 0.064, 54)}px;
  border-width: 2px;
  border-color: #d2d3d5;
  border-radius: 12px;
  padding-horizontal: 14px;
  justify-content: center;
  margin-bottom: 8px;
`;

export const PasswordInput = styled.TextInput`
  width: 100%;
  font-family: 'GothamCondensed-Book';
  font-size: ${Math.min(width * 0.058, 23)}px;
  color: #222222;
  padding: 0px;
`;

export const FieldErrorText = styled.Text`
  width: 100%;
  font-family: 'GothamCondensed-Medium';
  font-size: ${Math.min(width * 0.046, 18)}px;
  color: #ff3b3b;
  text-align: center;
  margin-bottom: 12px;
`;

export const ButtonsRow = styled.View`
  width: 100%;
  flex-direction: row;
  gap: 10px;
`;

export const CancelButton = styled.TouchableOpacity`
  flex: 1;
  background-color: #f2f2f2;
  border-color: #c7c7c7;
  border-radius: 12px;
  justify-content: center;
  align-items: center;
  min-height: 58px;
  padding-horizontal: 8px;
  padding-vertical: 6px;
  border-bottom-width: 4px;
  border-left-width: 0.5px;
  border-right-width: 0.5px;
`;

export const CancelButtonText = styled.Text`
  font-family: 'GothamCondensed-Medium';
  color: #444444;
  font-size: ${Math.min(width * 0.062, 24)}px;
  text-align: center;
`;

export const ConfirmButton = styled.TouchableOpacity`
  flex: 1;
  background-color: #ff3b3b;
  border-color: #a62222;
  border-radius: 12px;
  justify-content: center;
  align-items: center;
  min-height: 58px;
  padding-horizontal: 8px;
  padding-vertical: 6px;
  border-bottom-width: 4px;
  border-left-width: 0.5px;
  border-right-width: 0.5px;
`;

export const ConfirmButtonText = styled.Text`
  font-family: 'GothamCondensed-Medium';
  color: #ffffff;
  font-size: ${Math.min(width * 0.051, 20)}px;
  line-height: ${Math.min(width * 0.058, 23)}px;
  text-align: center;
`;