// src/components/modal/ProfilePhotoModal.js

import React from 'react';
import { Modal } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';

import {
  Overlay,
  PhotoContainer,
  PhotoAvatarWrapper,
  PhotoAvatarImage,
  PhotoAvatarFallback,
  PhotoTitle,
  PhotoMessage,
  OptionButton,
  OptionLeft,
  OptionText,
  RemoveButton,
  RemoveText,
  CancelButton,
  CancelButtonText,
} from './ProfilePhotoModalStyles';

function ProfilePhotoModal({
  visible,
  hasAvatar = false,
  avatarSource,
  loading = false,
  onClose,
  onOpenCamera,
  onOpenGallery,
  onRemovePhoto,
}) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Overlay>
        <PhotoContainer>
          <PhotoAvatarWrapper>
            {avatarSource ? (
              <PhotoAvatarImage
                source={avatarSource}
                resizeMode={hasAvatar ? 'cover' : 'contain'}
              />
            ) : (
              <PhotoAvatarFallback>
                <Feather name="camera" size={44} color="#34b1c7" />
              </PhotoAvatarFallback>
            )}
          </PhotoAvatarWrapper>

          <PhotoTitle>Alterar foto</PhotoTitle>

          <PhotoMessage>
            Escolha como deseja atualizar sua foto de perfil.
          </PhotoMessage>

          <OptionButton
            activeOpacity={0.85}
            disabled={loading}
            onPress={onOpenCamera}
          >
            <OptionLeft>
              <Feather name="camera" size={24} color="#34b1c7" />
              <OptionText>TIRAR FOTO</OptionText>
            </OptionLeft>

            <Feather name="chevron-right" size={24} color="#111111" />
          </OptionButton>

          <OptionButton
            activeOpacity={0.85}
            disabled={loading}
            onPress={onOpenGallery}
          >
            <OptionLeft>
              <Feather name="image" size={24} color="#34b1c7" />
              <OptionText>ESCOLHER DA GALERIA</OptionText>
            </OptionLeft>

            <Feather name="chevron-right" size={24} color="#111111" />
          </OptionButton>

          {hasAvatar ? (
            <RemoveButton
              activeOpacity={0.85}
              disabled={loading}
              onPress={onRemovePhoto}
            >
              <OptionLeft>
                <Feather name="trash-2" size={24} color="#ff3b3b" />
                <RemoveText>REMOVER FOTO</RemoveText>
              </OptionLeft>

              <Feather name="chevron-right" size={24} color="#111111" />
            </RemoveButton>
          ) : null}

          <CancelButton
            activeOpacity={0.85}
            disabled={loading}
            onPress={onClose}
          >
            <CancelButtonText>
              {loading ? 'AGUARDE...' : 'CANCELAR'}
            </CancelButtonText>
          </CancelButton>
        </PhotoContainer>
      </Overlay>
    </Modal>
  );
}

export default ProfilePhotoModal;