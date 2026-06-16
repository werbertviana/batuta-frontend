// src/components/actionPopover/ActionPopoverStyles.js

import styled from 'styled-components/native';

export const ActionPopoverContainer = styled.View`
  position: absolute;

  width: 280px;

  background-color: ${({ variant }) =>
    variant === 'locked' ? '#f4f4f4' : '#1F6D7A'};

  border-radius: 12px;

  ${({ variant }) =>
    variant === 'locked'
      ? `
        border-width: 3px;
        border-color: #cfcfcf;
        padding: 18px 16px 16px 16px;
        align-items: center;
      `
      : `
        padding: 16px;
      `}

  z-index: 9999;
  elevation: 9999;

  shadow-color: #000;
  shadow-offset: 0px 8px;
  shadow-opacity: 0.25;
  shadow-radius: 12px;
`;

export const ActionPopoverPointer = styled.View`
  position: absolute;

  top: -10px;
  left: 50%;

  width: 20px;
  height: 20px;

  background-color: ${({ variant }) =>
    variant === 'locked' ? '#f4f4f4' : '#1F6D7A'};

  ${({ variant }) =>
    variant === 'locked'
      ? `
        border-left-width: 3px;
        border-top-width: 3px;
        border-color: #cfcfcf;
      `
      : ``}

  transform: rotate(45deg);
`;

export const ActionButtonPrimary = styled.TouchableOpacity`
  width: 100%;
  height: 56px;

  background-color: #49BCD4;

  border-radius: 8px;

  border-bottom-width: 6px;
  border-bottom-color: #AEE7F2;

  align-items: center;
  justify-content: center;

  margin-bottom: 14px;
`;

export const ActionButtonSecondary = styled.TouchableOpacity`
  width: 100%;
  height: 56px;

  background-color: #FFFFFF;

  border-radius: 8px;

  border-bottom-width: 6px;
  border-bottom-color: #DDDDDD;

  align-items: center;
  justify-content: center;
`;

export const ActionButtonTextPrimary = styled.Text`
  color: #FFFFFF;

  font-size: 30px;
  font-family: GothamCondensed-Medium;
`;

export const ActionButtonTextSecondary = styled.Text`
  color: #2FAFC4;

  font-size: 30px;
  font-family: GothamCondensed-Medium;
`;

export const LockedPopoverTitle = styled.Text`
  font-family: GothamCondensed-Bold;
  font-size: 34px;
  color: #6f6f6f;

  text-align: center;
  margin-bottom: 10px;
`;

export const LockedPopoverMessage = styled.Text`
  font-family: GothamCondensed-Medium;
  font-size: 24px;
  color: #777777;

  text-align: center;
  line-height: 28px;

  margin-bottom: 16px;
`;

export const LockedButton = styled.TouchableOpacity`
  width: 100%;
  height: 58px;

  border-radius: 8px;
  background-color: #bfc1c3;

  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

export const LockedButtonIconBox = styled.View`
  position: absolute;
  left: 18px;

  width: 32px;
  height: 32px;

  align-items: center;
  justify-content: center;
`;

export const LockedButtonText = styled.Text`
  font-family: GothamCondensed-Bold;
  font-size: 32px;
  color: #7a7a7a;
  text-align: center;
`;