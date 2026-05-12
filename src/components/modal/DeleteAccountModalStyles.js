// src/components/modal/DeleteAccountModalStyles.js

import styled from 'styled-components/native';

export const Overlay = styled.View`
  flex: 1;
  background-color: rgba(0, 0, 0, 0.58);
  align-items: center;
  justify-content: center;
  padding: 24px;
`;

export const DeleteContainer = styled.View`
  width: 100%;
  max-width: 340px;
  background-color: #ffffff;
  padding: 28px 24px 24px;
  border-radius: 28px;
  align-items: center;
  justify-content: center;
  elevation: 8;
  shadow-color: #000000;
  shadow-opacity: 0.18;
  shadow-radius: 12px;
  shadow-offset: 0px 4px;
`;

export const DeleteIconWrapper = styled.View`
  width: 92px;
  height: 92px;
  border-radius: 46px;
  background-color: #fff3f3;
  border-width: 3px;
  border-color: #ff3b3b;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
`;

export const DeleteIconCircle = styled.Text`
  font-family: 'GothamCondensed-Medium';
  font-size: 58px;
  line-height: 62px;
  color: #ff3b3b;
  text-align: center;
`;

export const DeleteTitle = styled.Text`
  font-family: 'GothamCondensed-Medium';
  font-size: 32px;
  color: #222222;
  text-align: center;
  margin-bottom: 10px;
`;

export const DeleteMessage = styled.Text`
  font-family: 'GothamCondensed-Book';
  font-size: 25px;
  line-height: 27px;
  color: #444444;
  text-align: center;
  margin-bottom: 22px;
`;

export const ButtonsRow = styled.View`
  width: 100%;
  flex-direction: row;
  gap: 10px;
`;

export const CancelButton = styled.TouchableOpacity`
  flex: 1;
  background-color: #f2f2f2;
  border-color: #c7c7c7;
  border-radius: 12px;
  justify-content: center;
  align-items: center;
  height: 56px;
  border-bottom-width: 4px;
  border-left-width: 0.5px;
  border-right-width: 0.5px;
`;

export const CancelButtonText = styled.Text`
  font-family: 'GothamCondensed-Medium';
  color: #444444;
  font-size: 24px;
`;

export const ConfirmButton = styled.TouchableOpacity`
  flex: 1;
  background-color: #ff3b3b;
  border-color: #a62222;
  border-radius: 12px;
  justify-content: center;
  align-items: center;
  height: 56px;
  border-bottom-width: 4px;
  border-left-width: 0.5px;
  border-right-width: 0.5px;
`;

export const ConfirmButtonText = styled.Text`
  font-family: 'GothamCondensed-Medium';
  color: #ffffff;
  font-size: 24px;
`;