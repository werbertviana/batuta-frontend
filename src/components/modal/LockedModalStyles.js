// src/components/modal/LockedModalStyles.js

import styled from 'styled-components/native';

export const Overlay = styled.View`
  flex: 1;
  background-color: rgba(0, 0, 0, 0.58);
  align-items: center;
  justify-content: center;
  padding: 24px;
`;

export const LockedContainer = styled.View`
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

export const LockedIconWrapper = styled.View`
  width: 92px;
  height: 92px;
  border-radius: 46px;
  background-color: #f3fbfd;
  border-width: 3px;
  border-color: #34b1c7;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
`;

export const LockedIcon = styled.Image`
  width: 54px;
  height: 54px;
`;

export const LockedTitle = styled.Text`
  font-family: 'GothamCondensed-Medium';
  font-size: 32px;
  color: #222222;
  text-align: center;
  margin-bottom: 10px;
`;

export const LockedMessage = styled.Text`
  font-family: 'GothamCondensed-Book';
  font-size: 25px;
  line-height: 27px;
  color: #444444;
  text-align: center;
  margin-bottom: 20px;
`;

export const LockedButton = styled.TouchableOpacity`
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

export const LockedButtonText = styled.Text`
  font-family: 'GothamCondensed-Medium';
  color: #ffffff;
  font-size: 26px;
`;