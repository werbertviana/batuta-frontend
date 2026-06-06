import styled from 'styled-components/native';
import FastImage from 'react-native-fast-image';

export const ModalContainer = styled.SafeAreaView`
  background-color: #1F6D7A;
  border-radius: 16px;
  width: 300px;
  padding-top: 12px;
  padding-bottom: 12px;
  justify-content: center;
  align-items: center;
  border-width: 1px;
  border-color: #2F8B9A;

  shadow-color: #000;
  shadow-offset: 0px 10px;
  shadow-opacity: 0.42;
  shadow-radius: 22px;

  elevation: 18;
`;

export const ContentView = styled.SafeAreaView`
  margin: 10px;
  align-items: center;
  background-color: #49BCD4;
  border-radius: 10px;
  border-color: #BBDAE5;
  border-bottom-width: 4px;
  border-left-width: 0.5px;
  border-right-width: 0.5px;
  justify-content: center;
  width: 240px;
  height: 50px;
`;

export const PracticeView = styled.SafeAreaView`
  margin: 10px;
  align-items: center;
  background-color: #FFFFFF;
  border-radius: 10px;
  border-color: #D7EEF4;
  border-bottom-width: 4px;
  border-left-width: 0.5px;
  border-right-width: 0.5px;
  justify-content: center;
  width: 240px;
  height: 50px;
`;

export const ContentText = styled.Text`
  font-family: GothamCondensed-Medium;
  font-size: 29px;
  color: #FFFFFF;
`;

export const PracticeText = styled.Text`
  font-family: GothamCondensed-Medium;
  font-size: 29px;
  color: #3CB1C7;
`;

export const XPText = styled.Text`
  color: #DAA520;
  font-family: GothamCondensed-Medium;
`;

export const IconImage = styled(FastImage)`
  margin: 10px;
  width: 230px;
  height: 46px;
`;

export const Triangle = styled.SafeAreaView`
  width: 0;
  height: 0;
  border-left-width: 10px;
  border-right-width: 10px;
  border-top-width: 15px;
  border-left-color: transparent;
  border-right-color: transparent;
  border-top-color: #1F6D7A;
`;