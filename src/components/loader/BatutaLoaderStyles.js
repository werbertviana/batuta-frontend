import styled from 'styled-components/native';
import { Animated } from 'react-native';

export const Container = styled.SafeAreaView`
  flex: 1;
  background-color: #ffffff;
  align-items: center;
  justify-content: center;
`;

export const LoaderArea = styled.View`
  width: 140px;
  height: 120px;
  align-items: center;
  justify-content: center;
`;

export const MainNote = styled.Text`
  font-size: 62px;
  color: #34b1c7;
`;

export const FloatingNote = styled(Animated.Text)`
  position: absolute;
  font-size: 24px;
  color: #34b1c7;
`;

export const EqualizerContainer = styled.View`
  flex-direction: row;
  align-items: flex-end;
  justify-content: center;
  height: 34px;
  margin-top: 10px;
`;

export const EqualizerBar = styled(Animated.View)`
  width: 7px;
  height: 18px;
  border-radius: 8px;
  background-color: #34b1c7;
  margin-horizontal: 3px;
`;

export const LoadingText = styled.Text`
  margin-top: 14px;
  font-family: GothamCondensed-Medium;
  font-size: 20px;
  color: #96989a;
  text-align: center;
`;