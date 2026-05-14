import styled from 'styled-components/native';
import { Dimensions } from 'react-native';
import { fonts } from '../../styles/fonts';

const { width, height } = Dimensions.get('window');

const gray = '#D2D3D5';
const textGray = '#5F5F5F';

const sectionTitleSize = Math.min(width * 0.062, 26);

export const Container = styled.View`
  flex: 1;
  background-color: #ffffff;
  padding: 18px 18px 0 18px;
`;

export const Content = styled.View`
  width: 100%;
  align-items: center;
`;

export const HeaderImage = styled.Image`
  width: ${Math.min(width * 0.82, 340)}px;
  height: ${Math.min(height * 0.12, 90)}px;
  margin-top: 10px;
  margin-bottom: 22px;
`;

export const CurrentSection = styled.View`
  width: 100%;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin-top: 8px;
`;

export const CurrentIcon = styled.Image`
  width: ${Math.min(width * 0.23, 92)}px;
  height: ${Math.min(width * 0.23, 92)}px;
`;

export const DividerVertical = styled.View`
  width: 2px;
  height: ${Math.min(height * 0.18, 150)}px;
  background-color: ${gray};
  margin: 0 18px;
`;

export const CurrentInfo = styled.View`
  flex: 1;
  align-items: center;
`;

export const CurrentEloBox = styled.View`
  width: 100%;
  align-items: center;
  justify-content: center;
`;

export const CurrentEloTitleImage = styled.Image`
  width: 100%;
  height: ${Math.min(height * 0.09, 74)}px;
`;

export const CurrentDescription = styled.Text`
  font-size: ${Math.min(width * 0.05, 21)}px;
  font-family: ${fonts.regular};
  color: ${textGray};
  text-align: center;
  margin-top: 12px;
  line-height: ${Math.min(width * 0.061, 26)}px;
`;

export const Separator = styled.View`
  width: 100%;
  height: 2px;
  background-color: ${gray};
  margin: 24px 0 18px 0;
`;

export const SectionTitle = styled.Text`
  font-size: ${sectionTitleSize}px;
  font-family: ${fonts.medium};
  color: ${textGray};
  text-align: center;
  line-height: ${sectionTitleSize + 7}px;
  margin-bottom: 14px;
`;

export const ElosGridImage = styled.Image`
  width: 92%;
  height: ${Math.min(height * 0.35, 310)}px;
  margin-top: 0px;
  margin-bottom: 8px;
`;

export const ArrowLine = styled.View`
  width: 84%;
  height: 2px;
  background-color: ${gray};
  align-self: center;
  margin-top: 2px;
  margin-bottom: 24px;
  position: relative;
`;

export const Arrow = styled.View`
  width: 0;
  height: 0;
  border-top-width: 16px;
  border-bottom-width: 16px;
  border-left-width: 28px;
  border-top-color: transparent;
  border-bottom-color: transparent;
  border-left-color: ${gray};
  position: absolute;
  right: -28px;
  top: -15px;
`;

export const FactorsTitle = styled.Text`
  font-size: ${Math.min(width * 0.06, 25)}px;
  font-family: ${fonts.medium};
  color: ${textGray};
  text-align: center;
  line-height: ${Math.min(width * 0.074, 31)}px;
  margin-bottom: 20px;
`;

export const ProgressaoDesempenhoImage = styled.Image`
  width: 84%;
  height: ${Math.min(height * 0.17, 150)}px;
  margin-top: 2px;
  margin-bottom: 18px;
`;