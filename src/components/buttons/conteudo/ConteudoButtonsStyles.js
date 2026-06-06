import styled from 'styled-components/native';
import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const hasSmallHeight = height < 760;

const buttonMarginHorizontal = 32;
const buttonWidth = width - buttonMarginHorizontal * 2;

const buttonHeight = 55;
const buttonRadius = 14;
const buttonMarginBottom = 10;

const fontSize = hasSmallHeight ? 32 : 35;

export const ButtonBase = styled.View`
  width: ${buttonWidth}px;
  height: ${buttonHeight}px;
  border-radius: ${buttonRadius}px;
  align-self: center;
  align-items: center;
  justify-content: center;
  margin-bottom: ${buttonMarginBottom}px;
`;

export const NextView = styled(ButtonBase)`
  background-color: #2fafc4;
  border-bottom-width: 4px;
  border-bottom-color: #1d7685;
  border-left-width: 0.5px;
  border-left-color: #1d7685;
  border-right-width: 0.5px;
  border-right-color: #1d7685;
`;

export const DoneView = styled(ButtonBase)`
  background-color: #9b66b3;
  border-bottom-width: 4px;
  border-bottom-color: #70417f;
  border-left-width: 0.5px;
  border-left-color: #70417f;
  border-right-width: 0.5px;
  border-right-color: #70417f;
`;

export const SkipView = styled(ButtonBase)`
  background-color: #ffffff;
  border-width: 2px;
  border-color: #d6d6d6;
  border-bottom-width: 4px;
`;

export const PrevView = styled(ButtonBase)`
  background-color: #ffffff;
  border-width: 2px;
  border-color: #d6d6d6;
  border-bottom-width: 4px;
`;

export const TextPrimary = styled.Text`
  color: #ffffff;
  font-size: ${fontSize}px;
  font-family: GothamCondensed-Medium;
  letter-spacing: 0.5px;
  text-align: center;
  padding-horizontal: 8px;
`;

export const TextSecondary = styled.Text`
  color: #1f1f1f;
  font-size: ${fontSize}px;
  font-family: GothamCondensed-Medium;
  letter-spacing: 0.4px;
  text-align: center;
  padding-horizontal: 8px;
`;