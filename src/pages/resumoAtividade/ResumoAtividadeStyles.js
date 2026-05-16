import styled from 'styled-components/native';
import { Animated, Dimensions } from 'react-native';
import { fonts } from '../../styles/fonts';

const { width, height } = Dimensions.get('window');

const teal = '#3cb1c7';
const tealBorder = '#236a79';
const purple = '#af74b0';
const purpleBorder = '#7a477c';
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
  padding-top: ${Math.max(height * 0.028, 20)}px;
`;

export const Card = styled.View`
  width: 100%;
  background-color: #ffffff;
  padding: 0px;
`;

export const HeaderImage = styled(Animated.Image)`
  width: 100%;
  height: ${Math.min(height * 0.24, 210)}px;
  margin-bottom: 4px;
  margin-top: 18px;
`;

export const MessageContainer = styled.View`
  margin-bottom: 20px;
`;

export const MessageText = styled.Text`
  font-family: ${fonts.medium};
  font-size: ${Math.min(width * 0.074, 28)}px;
  text-align: center;
  color: ${({ variant }) => (variant === 'success' ? '#27ae60' : '#e74c3c')};
  margin-bottom: 10px;
`;

export const MessageSubText = styled.Text`
  font-family: ${fonts.regular};
  font-size: ${Math.min(width * 0.072, 28)}px;
  text-align: center;
  color: ${textDark};
  line-height: ${Math.min(width * 0.072, 30)}px;
  margin-top: 10px;
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

export const PercentText = styled(InfoValue)`
  color: #27ae60;
`;

export const XPValue = styled.Text`
  font-family: ${fonts.medium};
  font-size: ${Math.min(width * 0.058, 24)}px;
  color: ${textDark};
`;

export const Divider = styled.View`
  height: 2px;
  background-color: ${dividerGray};
  margin-top: 22px;
  margin-bottom: 20px;
`;

export const Divider2 = styled.View`
  height: 2px;
  background-color: ${dividerGray};
  margin-top: 4px;
  margin-bottom: 4px;
`;

export const ButtonsRow = styled.View`
  width: 100%;
  margin-top: 10px;
`;

export const ActionButton2 = styled.TouchableOpacity`
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
  margin-bottom: ${({ isPrimary }) => (isPrimary ? '14px' : '0px')};
`;

export const ActionButton = styled.TouchableOpacity`
  width: 100%;
  height: ${Math.min(height * 0.08, 70)}px;
  justify-content: center;
  align-items: center;
  border-radius: 12px;
  border-bottom-width: 4px;
  border-left-width: 0.5px;
  border-right-width: 0.5px;
  border-color: ${purpleBorder};
  background-color: ${purple};
  margin-bottom: ${({ isPrimary }) => (isPrimary ? '14px' : '0px')};
`;

export const ActionButtonText = styled.Text`
  font-family: ${fonts.medium};
  font-size: ${Math.min(width * 0.07, 30)}px;
  color: #ffffff;
`;