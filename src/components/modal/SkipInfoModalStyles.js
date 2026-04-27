// src/components/modal/SkipInfoModalStyles.js

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
  padding: 26px 22px 22px 22px;
  align-items: center;
  elevation: 10;
`;

export const Title = styled.Text`
  font-family: 'GothamCondensed-Bold';
  font-size: 32px;
  color: #34b1c7;
  text-align: center;
  margin-bottom: 10px;
`;

export const Message = styled.Text`
  font-family: 'GothamCondensed-Book';
  font-size: 21px;
  color: #333333;
  text-align: center;
  line-height: 30px;
  margin-bottom: 14px;
`;

export const DividerRow = styled.View`
  width: 100%;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin-bottom: 18px;
`;

export const DividerLine = styled.View`
  flex: 1;
  height: 1px;
  background-color: #e6e6e6;
`;

export const DividerIcon = styled.View`
  width: 10px;
  height: 10px;
  border-radius: 5px;
  background-color: #34b1c7;
  margin-horizontal: 12px;
`;

export const CheckboxRow = styled.TouchableOpacity`
  width: 100%;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
`;

export const CheckboxBox = styled.View`
  width: 28px;
  height: 28px;
  border-width: 2px;
  border-color: #34b1c7;
  border-radius: 8px;
  justify-content: center;
  align-items: center;
  margin-bottom: 10px;
`;

export const CheckboxMark = styled.Text`
  font-family: 'GothamCondensed-Bold';
  font-size: 18px;
  color: #34b1c7;
`;

export const CheckboxText = styled.Text`
  font-family: 'GothamCondensed-Book';
  font-size: 17px;
  color: #333333;
  text-align: center;
  line-height: 24px;
`;

export const Button = styled.TouchableOpacity`
  width: 100%;
  background-color: #34b1c7;
  border-color: #236a79;
  border-radius: 12px;
  justify-content: center;
  align-items: center;
  height: 58px;
  border-bottom-width: 4px;
  border-left-width: 0.5px;
  border-right-width: 0.5px;
`;

export const ButtonText = styled.Text`
  font-family: 'GothamCondensed-Medium';
  font-size: 26px;
  color: #ffffff;
`;