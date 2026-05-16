import styled from 'styled-components/native';
import { Animated, Dimensions } from 'react-native';
import { fonts } from '../../styles/fonts';

const { width, height } = Dimensions.get('window');

const teal = '#3cb1c7';
const tealBorder = '#236a79';
const gray = '#D2D3D5';
const dividerGray = '#e0e0e0';
const textDark = '#333333';

export const Container = styled.View`
  flex: 1;
  background-color: #ffffff;
`;

export const Content = styled.View`
  flex: 1;
  width: 100%;
  padding-horizontal: ${Math.max(width * 0.055, 18)}px;
  padding-top: ${Math.max(height * 0.035, 26)}px;
`;

export const Card = styled.View`
  width: 100%;
  background-color: #ffffff;
  padding: 0px;
`;

export const HeaderImage = styled(Animated.Image)`
  width: 100%;
  height: ${Math.min(height * 0.3, 250)}px;
`;

export const Message = styled.Text`
  font-family: ${fonts.regular};
  font-size: ${Math.min(width * 0.064, 27)}px;
  text-align: center;
  color: #555555;
  line-height: ${Math.min(width * 0.078, 32)}px;
  margin-bottom: 18px;
`;

export const InfoBox = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding-vertical: 14px;
`;

export const InfoLabel = styled.Text`
  font-family: ${fonts.medium};
  font-size: ${Math.min(width * 0.07, 30)}px;
  color: ${textDark};
`;

export const InfoValue = styled.Text`
  font-family: ${fonts.medium};
  font-size: ${Math.min(width * 0.07, 30)}px;
  color: ${textDark};
`;

export const InfoIcon = styled.Image`
  width: ${Math.min(width * 0.07, 30)}px;
  height: ${Math.min(width * 0.07, 30)}px;
  margin-left: 10px;
`;

export const Divider2 = styled.View`
  height: 2px;
  background-color: ${dividerGray};
  margin-top: 4px;
  margin-bottom: 4px;
`;

export const ProgressBox = styled.View`
  width: 100%;
  align-items: center;
  margin-top: 18px;
  margin-bottom: 18px;
`;

export const ProgressText = styled.Text`
  font-family: ${fonts.regular};
  font-size: ${Math.min(width * 0.06, 25)}px;
  text-align: center;
  color: #777777;
  line-height: ${Math.min(width * 0.074, 31)}px;
`;

export const MessageStrong = styled.Text`
  font-family: ${fonts.medium};
  font-size: ${Math.min(width * 0.066, 28)}px;
  text-align: center;
  color: #555555;
  line-height: ${Math.min(width * 0.08, 33)}px;
`;

export const Divider = styled.View`
  height: 2px;
  background-color: ${dividerGray};
  margin-top: 24px;
  margin-bottom: 24px;
`;

export const ButtonsColumn = styled.View`
  width: 100%;
`;

export const RetryButton = styled.TouchableOpacity`
  width: 100%;
  height: ${Math.min(height * 0.08, 70)}px;
  justify-content: center;
  align-items: center;
  border-radius: 12px;
  border-bottom-width: 4px;
  border-left-width: 0.5px;
  border-right-width: 0.5px;
  border-color: ${tealBorder};
  background-color: ${teal};
  margin-bottom: 14px;
`;

export const ExitButton = styled.TouchableOpacity`
  width: 100%;
  height: ${Math.min(height * 0.08, 70)}px;
  justify-content: center;
  align-items: center;
  border-radius: 12px;
  border-width: 2px;
  border-bottom-width: 4px;
  border-color: ${gray};
  background-color: #ffffff;
`;

export const RetryButtonText = styled.Text`
  font-family: ${fonts.medium};
  font-size: ${Math.min(width * 0.062, 26)}px;
  color: #ffffff;
`;

export const ExitButtonText = styled.Text`
  font-family: ${fonts.medium};
  font-size: ${Math.min(width * 0.062, 26)}px;
  color: ${textDark};
`;