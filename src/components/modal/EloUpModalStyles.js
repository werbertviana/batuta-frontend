// EloUpModalStyles.js

import styled from 'styled-components/native';

export const Overlay = styled.View`
  flex: 1;
  background-color: rgba(0, 0, 0, 0.45);
  justify-content: center;
  align-items: center;
  padding: 24px;
`;

export const Container = styled.View`
  width: 100%;
  max-width: 720px;
  background-color: #ffffff;
  border-radius: 28px;
  padding: 28px 24px 24px 24px;
  align-items: center;
  elevation: 8;
`;

export const Title = styled.Text`
  font-family: 'GothamCondensed-Bold';
  font-size: 34px;
  color: #3cb6cc;
  text-align: center;
  margin-bottom: 10px;
`;

export const Message = styled.Text`
  font-family: 'GothamCondensed-Book';
  font-size: 22px;
  color: #333333;
  text-align: center;
  line-height: 30px;
  margin-bottom: 22px;
`;

export const EloHighlight = styled.Text`
  font-family: 'GothamCondensed-Bold';
  font-size: 34px;
  color: #333333;
  text-align: center;
`;

export const ArrowText = styled.Text`
  font-size: 28px;
  color: #3cb6cc;
  margin-vertical: 6px;
`;

export const Button = styled.TouchableOpacity`
  width: 100%;
  background-color: #34b1c7;
  border-color: #236a79;
  border-radius: 12px;
  justify-content: center;
  align-items: center;
  height: 58px;
  margin-top: 25px;
  border-bottom-width: 4px;
  border-left-width: 0.5px;
  border-right-width: 0.5px;
`;

export const ButtonText = styled.Text`
  font-family: 'GothamCondensed-Medium';
  font-size: 30px;
  color: #ffffff;
`;