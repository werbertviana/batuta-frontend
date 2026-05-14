// src/pages/profile/Profile.js

import React from 'react';
import { ScrollView } from 'react-native';

import BatutaLoader from '../../components/loader/BatutaLoader';

import DeleteAccountModal from '../../components/modal/DeleteAccountModal';
import ProfilePhotoModal from '../../components/modal/ProfilePhotoModal';
import RemovePhotoModal from '../../components/modal/RemovePhotoModal';

import ProfileAvatar from './components/ProfileAvatar';
import ProfileDataSection from './components/ProfileDataSection';
import ProfileSecuritySection from './components/ProfileSecuritySection';
import ProfileAccountSection from './components/ProfileAccountSection';
import ProfileSaveFeedback from './components/ProfileSaveFeedback';

import useProfileController from './hooks/useProfileController';

import { Container, Content } from './ProfileStyles';

const profileHeader = require('../../assets/images/perfil/perfil.png');
const defaultAvatar = require('../../assets/images/perfil/default.png');

const iconDados = require('../../assets/images/perfil/dados.png');
const iconSeguranca = require('../../assets/images/perfil/seguranca.png');
const iconConta = require('../../assets/images/perfil/conta.png');
const iconCamera = require('../../assets/images/perfil/camera.png');
const iconSave = require('../../assets/images/perfil/save.png');

const danger = '#ff3b3b';

function Profile() {
  const profile = useProfileController({ defaultAvatar });

  if (!profile.isProfileReady) {
    return <BatutaLoader />;
  }

  return (
    <Container>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        <Content>
          <ProfileAvatar
            profileHeader={profileHeader}
            avatarSource={profile.avatarSource}
            avatarUrl={profile.avatarUrl}
            iconCamera={iconCamera}
            isUploadingAvatar={profile.isUploadingAvatar}
            onChangePhoto={profile.handleChangePhoto}
          />

          <ProfileDataSection
            iconDados={iconDados}
            name={profile.name}
            username={profile.username}
            email={profile.email}
            nameError={profile.nameError}
            usernameError={profile.usernameError}
            emailError={profile.emailError}
            setName={profile.setName}
            setUsername={profile.setUsername}
            setEmail={profile.setEmail}
            setNameError={profile.setNameError}
            setUsernameError={profile.setUsernameError}
            setEmailError={profile.setEmailError}
            setGeneralError={profile.setGeneralError}
            setSuccessMessage={profile.setSuccessMessage}
          />

          <ProfileSecuritySection
            iconSeguranca={iconSeguranca}
            currentPassword={profile.currentPassword}
            newPassword={profile.newPassword}
            confirmPassword={profile.confirmPassword}
            currentPasswordError={profile.currentPasswordError}
            newPasswordError={profile.newPasswordError}
            confirmPasswordError={profile.confirmPasswordError}
            showCurrentPassword={profile.showCurrentPassword}
            showNewPassword={profile.showNewPassword}
            showConfirmPassword={profile.showConfirmPassword}
            setCurrentPassword={profile.setCurrentPassword}
            setNewPassword={profile.setNewPassword}
            setConfirmPassword={profile.setConfirmPassword}
            setCurrentPasswordError={profile.setCurrentPasswordError}
            setNewPasswordError={profile.setNewPasswordError}
            setConfirmPasswordError={profile.setConfirmPasswordError}
            setShowCurrentPassword={profile.setShowCurrentPassword}
            setShowNewPassword={profile.setShowNewPassword}
            setShowConfirmPassword={profile.setShowConfirmPassword}
            setGeneralError={profile.setGeneralError}
            setSuccessMessage={profile.setSuccessMessage}
          />

          <ProfileSaveFeedback
            generalError={profile.generalError}
            successMessage={profile.successMessage}
            iconSave={iconSave}
            isSaving={profile.isSaving}
            onSave={profile.handleSaveChanges}
          />

          <ProfileAccountSection
            iconConta={iconConta}
            danger={danger}
            isDeletingAccount={profile.isDeletingAccount}
            onDeleteAccount={profile.handleDeleteAccount}
          />
        </Content>
      </ScrollView>

      <ProfilePhotoModal
        visible={profile.showPhotoModal}
        hasAvatar={!!profile.avatarUrl}
        avatarSource={profile.avatarSource}
        loading={profile.isUploadingAvatar}
        onClose={profile.handleClosePhotoModal}
        onOpenCamera={profile.handleOpenCameraFromModal}
        onOpenGallery={profile.handleOpenGalleryFromModal}
        onRemovePhoto={profile.handleRemovePhotoFromModal}
      />

      <RemovePhotoModal
        visible={profile.showRemovePhotoModal}
        loading={profile.isUploadingAvatar}
        onCancel={profile.handleCancelRemovePhoto}
        onConfirm={profile.handleConfirmRemovePhoto}
      />

      <DeleteAccountModal
        visible={profile.showDeleteAccountModal}
        loading={profile.isDeletingAccount}
        onCancel={profile.handleCancelDeleteAccount}
        onConfirm={profile.handleConfirmDeleteAccount}
      />
    </Container>
  );
}

export default Profile;