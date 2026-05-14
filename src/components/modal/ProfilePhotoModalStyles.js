// src/components/modal/ProfilePhotoModalStyles.js

import styled from 'styled-components/native';

export const Overlay = styled.View`
  flex: 1;
  background-color: rgba(0, 0, 0, 0.58);
  align-items: center;
  justify-content: center;
  padding: 24px;
`;

export const PhotoContainer = styled.View`
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

export const PhotoAvatarWrapper = styled.View`
  width: 96px;
  height: 96px;
  border-radius: 48px;
  background-color: #ffffff;
  border-width: 3px;
  border-color: #34b1c7;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
  overflow: hidden;
`;

export const PhotoAvatarImage = styled.Image`
  width: 86px;
  height: 86px;
  border-radius: 43px;
`;

export const PhotoAvatarFallback = styled.View`
  width: 86px;
  height: 86px;
  border-radius: 43px;
  background-color: #f3fbfd;
  align-items: center;
  justify-content: center;
`;

export const PhotoTitle = styled.Text`
  font-family: 'GothamCondensed-Medium';
  font-size: 32px;
  color: #222222;
  text-align: center;
  margin-bottom: 10px;
`;

export const PhotoMessage = styled.Text`
  font-family: 'GothamCondensed-Book';
  font-size: 24px;
  line-height: 27px;
  color: #444444;
  text-align: center;
  margin-bottom: 20px;
`;

export const OptionButton = styled.TouchableOpacity`
  width: 100%;
  min-height: 56px;
  border-radius: 14px;
  background-color: #f6fbfc;
  border-width: 1.5px;
  border-color: #d7eef3;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 0 14px;
  margin-bottom: 10px;
`;

export const OptionLeft = styled.View`
  flex-direction: row;
  align-items: center;
  flex: 1;
`;

export const OptionText = styled.Text`
  font-family: 'GothamCondensed-Medium';
  font-size: 23px;
  color: #222222;
  margin-left: 12px;
`;

export const RemoveButton = styled.TouchableOpacity`
  width: 100%;
  min-height: 56px;
  border-radius: 14px;
  background-color: #fff3f3;
  border-width: 1.5px;
  border-color: #ffd1d1;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 0 14px;
  margin-bottom: 10px;
`;

export const RemoveText = styled.Text`
  font-family: 'GothamCondensed-Medium';
  font-size: 23px;
  color: #ff3b3b;
  margin-left: 12px;
`;

export const CancelButton = styled.TouchableOpacity`
  width: 100%;
  background-color: #34b1c7;
  border-color: #236a79;
  border-radius: 12px;
  justify-content: center;
  align-items: center;
  height: 56px;
  border-bottom-width: 4px;
  border-left-width: 0.5px;
  border-right-width: 0.5px;
  margin-top: 6px;
`;

export const CancelButtonText = styled.Text`
  font-family: 'GothamCondensed-Medium';
  color: #ffffff;
  font-size: 25px;
`;