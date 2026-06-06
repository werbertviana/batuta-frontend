import styled from 'styled-components/native';
import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const hasSmallHeight = height < 760;

const buttonMarginHorizontal = 14;
const buttonHeight = hasSmallHeight ? 58 : 64;

const tutorialImageWidth = width * 0.90;
const tutorialImageHeight = height * 0.62;

export const Background = styled.ImageBackground`
  flex: 1;
  width: 100%;
  height: 100%;
`;

export const Container = styled.SafeAreaView`
  flex: 1;
  width: 100%;
  align-items: center;
  justify-content: flex-start;
  background-color: transparent;
`;

export const SlideView = styled.SafeAreaView`
  margin-top: 70px;
  width: 100%;
  align-items: center;
  justify-content: center;
`;

export const ImageContainer = styled.SafeAreaView`
  width: 100%;
  align-items: center;
  justify-content: center;
`;

export const TutorialImage = styled.Image`
  width: ${tutorialImageWidth}px;
  height: ${tutorialImageHeight}px;
`;

export const PrimaryButton = styled.TouchableOpacity`
  background-color: #2fafc4;
  height: ${buttonHeight}px;
  border-radius: 14px;
  align-items: center;
  justify-content: center;
  margin-horizontal: ${buttonMarginHorizontal}px;
  margin-bottom: ${hasSmallHeight ? 12 : 16}px;
  border-bottom-width: 4px;
  border-bottom-color: #1d7685;
  border-left-width: 0.5px;
  border-left-color: #1d7685;
  border-right-width: 0.5px;
  border-right-color: #1d7685;
`;

export const PrimaryButtonText = styled.Text`
  color: #ffffff;
  font-size: ${hasSmallHeight ? 28 : 32}px;
  font-family: GothamCondensed-Medium;
  letter-spacing: 0.5px;
  text-align: center;
  padding-horizontal: 8px;
`;

export const DoneButton = styled.TouchableOpacity`
  background-color: #9b66b3;
  height: ${buttonHeight}px;
  border-radius: 14px;
  align-items: center;
  justify-content: center;
  margin-horizontal: ${buttonMarginHorizontal}px;
  margin-bottom: ${hasSmallHeight ? 12 : 16}px;
  border-bottom-width: 4px;
  border-bottom-color: #70417f;
  border-left-width: 0.5px;
  border-left-color: #70417f;
  border-right-width: 0.5px;
  border-right-color: #70417f;
`;

export const DoneButtonText = styled.Text`
  color: #ffffff;
  font-size: ${hasSmallHeight ? 28 : 32}px;
  font-family: GothamCondensed-Medium;
  letter-spacing: 0.5px;
  text-align: center;
  padding-horizontal: 8px;
`;

export const SecondaryButton = styled.TouchableOpacity`
  height: ${buttonHeight}px;
  border-radius: 14px;
  border-width: 2px;
  border-color: #d6d6d6;
  background-color: #ffffff;
  align-items: center;
  justify-content: center;
  margin-horizontal: ${buttonMarginHorizontal}px;
  margin-bottom: ${hasSmallHeight ? 10 : 16}px;
  border-bottom-width: 6px;
`;

export const SecondaryButtonText = styled.Text`
  color: #1f1f1f;
  font-size: ${hasSmallHeight ? 28 : 32}px;
  font-family: GothamCondensed-Medium;
  letter-spacing: 0.4px;
`;