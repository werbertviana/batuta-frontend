// src/components/modal/RemovePhotoModalStyles.js

import styled from 'styled-components/native';

export const Overlay = styled.View`
  flex: 1;
  background-color: rgba(0, 0, 0, 0.58);
  align-items: center;
  justify-content: center;
  padding: 24px;
`;

export const RemoveContainer = styled.View`
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

export const RemoveIconWrapper = styled.View`
  width: 92px;
  height: 92px;
  border-radius: 46px;

  background-color: #fff3f3;

  border-width: 3px;
  border-color: #ffbcbc;

  align-items: center;
  justify-content: center;

  margin-bottom: 16px;
`;

export const RemoveTitle = styled.Text`
  font-family: 'GothamCondensed-Medium';
  font-size: 32px;
  color: #222222;
  text-align: center;
  margin-bottom: 10px;
`;

export const RemoveMessage = styled.Text`
  font-family: 'GothamCondensed-Book';
  font-size: 24px;
  line-height: 27px;
  color: #444444;
  text-align: center;
  margin-bottom: 24px;
`;

export const ButtonsRow = styled.View`
  width: 100%;
  flex-direction: row;
  justify-content: space-between;
`;

export const CancelButton = styled.TouchableOpacity`
  flex: 1;
  height: 56px;
  background-color: #f3f3f3;
  border-color: #c7c7c7;
  border-radius: 12px;
  align-items: center;
  justify-content: center;
  margin-right: 8px;
border-bottom-width: 4px;
  border-left-width: 0.5px;
  border-right-width: 0.5px;
`;

export const CancelButtonText = styled.Text`
  font-family: 'GothamCondensed-Medium';
  color: #444444;
  font-size: 22px;
`;

export const ConfirmButton = styled.TouchableOpacity`
  flex: 1;
  height: 56px;
  background-color: #ff3b3b;
  border-radius: 12px;
  align-items: center;
  justify-content: center;
  margin-left: 8px;
  border-bottom-width: 4px;
  border-bottom-color: #bf1f1f;
border-left-width: 0.5px;
  border-right-width: 0.5px;
`;

export const ConfirmButtonText = styled.Text`
  font-family: 'GothamCondensed-Medium';
  color: #ffffff;
  font-size: 22px;
`;