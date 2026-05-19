// src/pages/profile/ProfileStyles.js

import styled from 'styled-components/native';
import { Dimensions } from 'react-native';
import { fonts } from '../../styles/fonts';

const { width, height } = Dimensions.get('window');

const teal = '#34b1c7';
const gray = '#D2D3D5';
const textGray = '#5F5F5F';

const avatarSize = Math.min(width * 0.30, 120);
const avatarInnerSize = avatarSize - 16;

export const Container = styled.View`
  flex: 1;
  background-color: #ffffff;
`;

export const Content = styled.View`
  width: 100%;
  padding-horizontal: ${Math.max(width * 0.085, 28)}px;
  padding-top: ${Math.max(height * 0.035, 28)}px;
`;

export const HeaderImage = styled.Image`
  width: 100%;
  height: ${Math.min(height * 0.11, 95)}px;
  margin-bottom: ${Math.max(height * 0.025, 22)}px;
`;

export const AvatarWrapper = styled.View`
  align-items: center;
  margin-bottom: 24px;
`;

export const AvatarCircle = styled.View`
  width: ${avatarSize}px;
  height: ${avatarSize}px;
  border-radius: ${avatarSize / 2}px;
  border-width: 3.5px;
  border-color: ${teal};
  align-items: center;
  justify-content: center;
  background-color: #ffffff;
  padding: 5px;
`;

export const AvatarImageWrapper = styled.View`
  width: ${avatarInnerSize}px;
  height: ${avatarInnerSize}px;
  border-radius: ${avatarInnerSize / 2}px;
  overflow: hidden;
  align-items: center;
  justify-content: center;
`;

export const AvatarImage = styled.Image`
  width: 100%;
  height: 100%;
  border-radius: ${avatarInnerSize / 2}px;
`;

export const AvatarLoadingOverlay = styled.View`
  position: absolute;
  width: ${avatarInnerSize}px;
  height: ${avatarInnerSize}px;
  border-radius: ${avatarInnerSize / 2}px;
  background-color: rgba(0, 0, 0, 0.35);
  align-items: center;
  justify-content: center;
`;

export const AvatarLoadingText = styled.Text`
  color: #ffffff;
  font-size: 24px;
  font-family: ${fonts.bold};
`;

export const CameraButton = styled.TouchableOpacity`
  width: 42px;
  height: 42px;
  border-radius: 24px;
  background-color: ${teal};
  border-width: 4px;
  border-color: #ffffff;
  align-items: center;
  justify-content: center;
  margin-top: -34px;
  margin-left: 92px;
`;

export const CameraIcon = styled.Image`
  width: 20px;
  height: 20px;
`;

export const ChangePhotoText = styled.Text`
  margin-top: 6px;
  font-size: ${Math.min(width * 0.045, 20)}px;
  font-family: ${fonts.medium};
  color: ${textGray};
`;

export const Divider = styled.View`
  width: 100%;
  height: 2px;
  background-color: ${gray};
  margin-vertical: 20px;
`;

export const SectionHeader = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 18px;
`;

export const SectionIconCircle = styled.View`
  width: 34px;
  height: 34px;
  border-radius: 17px;
  align-items: center;
  justify-content: center;
  margin-right: 10px;
`;

export const SectionIconImage = styled.Image`
  width: 34px;
  height: 34px;
`;

export const SectionTitle = styled.Text`
  font-size: ${Math.min(width * 0.055, 24)}px;
  font-family: ${fonts.bold};
  color: ${teal};
`;

export const SecurityHintText = styled.Text`
  font-size: ${Math.min(width * 0.038, 16)}px;
  font-family: ${fonts.regular};
  color: ${textGray};
  line-height: 22px;
  margin-top: -6px;
  margin-bottom: 16px;
`;

export const Label = styled.Text`
  font-size: ${Math.min(width * 0.04, 17)}px;
  font-family: ${fonts.medium};
  color: ${textGray};
  margin-bottom: 6px;
`;

export const InputWrapper = styled.View`
  width: 100%;
  height: ${Math.min(height * 0.062, 56)}px;
  border-width: 2px;
  border-color: ${gray};
  border-radius: 10px;
  flex-direction: row;
  align-items: center;
  padding-horizontal: 14px;
  margin-bottom: 16px;
`;

export const Input = styled.TextInput`
  flex: 1;
  font-size: ${Math.min(width * 0.045, 19)}px;
  font-family: ${fonts.regular};
  color: #111111;
  padding: 0px;
`;

export const EyeButton = styled.TouchableOpacity`
  width: 34px;
  height: 34px;
  align-items: center;
  justify-content: center;
`;

export const SaveButton = styled.TouchableOpacity`
  width: 100%;
  height: ${Math.min(height * 0.070, 58)}px;
  border-radius: 12px;
  background-color: ${teal};
  align-items: center;
  justify-content: center;
  margin-top: 10px;
  border-color: #236a79;
  border-bottom-width: 4px;
  border-left-width: 0.5px;
  border-right-width: 0.5px;
`;

export const SaveContent = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

export const SaveIcon = styled.Image`
  width: 22px;
  height: 22px;
  margin-right: 10px;
`;

export const SaveButtonText = styled.Text`
  color: #ffffff;
  font-size: ${Math.min(width * 0.042, 18)}px;
  font-family: ${fonts.bold};
`;

export const AccountBox = styled.View`
  width: 100%;
`;

export const DeleteButton = styled.TouchableOpacity`
  width: 100%;
  height: ${Math.min(height * 0.070, 58)}px;
  background-color: #ffffff;
  border-width: 2px;
  border-color: ${gray};
  border-radius: 12px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding-horizontal: 16px;
  border-bottom-width: 4px;
`;

export const DeleteLeft = styled.View`
  flex-direction: row;
  align-items: center;
`;

export const DeleteText = styled.Text`
  font-size: ${Math.min(width * 0.042, 18)}px;
  font-family: ${fonts.bold};
  color: #ff3b3b;
`;

export const DeleteHint = styled.Text`
  font-size: ${Math.min(width * 0.033, 14)}px;
  font-family: ${fonts.light};
  color: ${textGray};
  margin-top: 8px;
`;

export const FieldErrorText = styled.Text`
  color: #ff3b3b;
  font-size: 16px;
  font-family: ${fonts.medium};
  margin-top: -10px;
  margin-bottom: 12px;
`;

export const SuccessText = styled.Text`
  color: #2FAFC4;
  font-size: 16px;
  font-family: ${fonts.medium};
  margin-top: -4px;
  margin-bottom: 12px;
`;