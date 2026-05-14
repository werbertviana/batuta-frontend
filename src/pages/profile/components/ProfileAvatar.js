// src/pages/profile/components/ProfileAvatar.js

import React from 'react';

import {
  HeaderImage,
  AvatarWrapper,
  AvatarCircle,
  AvatarImageWrapper,
  AvatarImage,
  AvatarLoadingOverlay,
  AvatarLoadingText,
  CameraButton,
  CameraIcon,
  ChangePhotoText,
} from '../ProfileStyles';

function ProfileAvatar({
  profileHeader,
  avatarSource,
  avatarUrl,
  iconCamera,
  isUploadingAvatar,
  onChangePhoto,
}) {
  return (
    <>
      <HeaderImage source={profileHeader} resizeMode="contain" />

      <AvatarWrapper>
        <AvatarCircle>
          <AvatarImageWrapper>
            <AvatarImage
              source={avatarSource}
              resizeMode={avatarUrl ? 'cover' : 'contain'}
            />

            {isUploadingAvatar ? (
              <AvatarLoadingOverlay>
                <AvatarLoadingText>...</AvatarLoadingText>
              </AvatarLoadingOverlay>
            ) : null}
          </AvatarImageWrapper>
        </AvatarCircle>

        <CameraButton activeOpacity={0.8} onPress={onChangePhoto}>
          <CameraIcon source={iconCamera} resizeMode="contain" />
        </CameraButton>

        <ChangePhotoText onPress={onChangePhoto}>
          {isUploadingAvatar ? 'Enviando foto...' : 'Mudar foto'}
        </ChangePhotoText>
      </AvatarWrapper>
    </>
  );
}

export default ProfileAvatar;