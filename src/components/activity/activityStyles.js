// src/components/activity/activityStyles.js

import styled from 'styled-components/native';
import FastImage from 'react-native-fast-image';
import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const cardWidth = Math.min(width * 0.55, 160);
const cardHeight = Math.min(height * 0.26, 230);

export const QuestaoText = styled.Text`
  font-family: DINRoundPro-Medi;
  font-size: ${Math.min(width * 0.065, 26)}px;
  line-height: ${Math.min(width * 0.075, 30)}px;
  color: #222;
  text-align: center;
  padding-horizontal: 16px;
  margin-top: 2px;
`;

export const AlternativasContainer = styled.View`
  width: 100%;
  align-items: center;
  justify-content: center;
  flex-direction: row;
  flex-wrap: wrap;
  margin-top: 8px;
`;

export const AlternativaContainer = styled.TouchableOpacity`
  width: ${cardWidth}px;
  height: ${cardHeight}px;
  border-width: 4px;
  border-color: #d2d3d5;
  border-radius: 12px;
  margin: 6px;
  align-items: center;
  justify-content: center;
  background-color: #ffffff;
`;

export const AlternativaContainer2 = styled.TouchableOpacity`
  width: ${Math.min(width * 0.86, 350)}px;
  min-height: ${Math.min(Math.max(height * 0.11, 105), 110)}px;
  border-width: 4px;
  border-color: #d2d3d5;
  border-radius: 12px;
  margin-vertical: 6px;
  padding-vertical: 10px;
  padding-horizontal: 18px;
  align-items: center;
  justify-content: center;
  position: relative;
  background-color: #ffffff;
`;

export const ImageContainer = styled.View`
  align-items: center;
  justify-content: center;
`;

export const CircleContainer = styled.View`
  position: absolute;
  top: 6px;
  left: 6px;
  width: 28px;
  height: 28px;
  border-radius: 14px;
  border-width: 4px;
  border-color: #d2d3d5;
  align-items: center;
  justify-content: center;
  background-color: #ffffff;
  z-index: 2;
`;

export const CircleInline = styled.View`
  position: absolute;
  left: 6px;
  width: 28px;
  height: 28px;
  border-radius: 14px;
  border-width: 4px;
  border-color: #d2d3d5;
  align-items: center;
  justify-content: center;
  background-color: #ffffff;
`;

export const CircleText = styled.Text`
  font-family: DINRoundPro-Medi;
  font-size: 14px;
  color: #222;
`;

export const AlternativaText = styled.Text`
  font-family: DINRoundPro-Medi;
  font-size: 20px;
  color: #222;
  text-align: center;
  width: 100%;
  padding-left: 8px;
`;

export const ImageAlternativa = styled(FastImage)`
  width: ${Math.min(cardWidth * 0.68, 88)}px;
  height: ${Math.min(cardHeight * 0.78, 165)}px;
`;