// src/pages/profile/hooks/useProfileController.js

import { useCallback, useEffect, useState } from 'react';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';

import { useAuth } from '../../../contexts/AuthContext';

import {
  buildSuccessMessage,
  buildAvatarUrl,
  getImageFileName,
  getImageMimeType,
} from '../utils/profileHelpers';

import {
  API_PUBLIC_URL,
  updateProfileDataRequest,
  updatePasswordRequest,
  uploadAvatarRequest,
  removeAvatarRequest,
  deleteAccountRequest,
} from '../services/profileService';

function useProfileController({ defaultAvatar }) {
  const navigation = useNavigation();

  const auth = useAuth();
  const { user, updateUser } = auth;

  const isProfileReady = !!user;

  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [avatarUrl, setAvatarUrl] = useState(null);

  const [showDeleteAccountModal, setShowDeleteAccountModal] = useState(false);
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [showRemovePhotoModal, setShowRemovePhotoModal] = useState(false);

  const [initialName, setInitialName] = useState('');
  const [initialUsername, setInitialUsername] = useState('');
  const [initialEmail, setInitialEmail] = useState('');

  const [nameError, setNameError] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [emailError, setEmailError] = useState('');

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [currentPasswordError, setCurrentPasswordError] = useState('');
  const [newPasswordError, setNewPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

  const [deleteAccountError, setDeleteAccountError] = useState('');

  const [generalError, setGeneralError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    if (!user) return;

    const loadedName = user.name || user.nome || '';
    const loadedUsername = user.username || user.usuario || '';
    const loadedEmail = user.email || '';
    const loadedAvatarUrl = user.avatarUrl || null;

    setName(loadedName);
    setUsername(loadedUsername);
    setEmail(loadedEmail);
    setAvatarUrl(loadedAvatarUrl);

    setInitialName(loadedName);
    setInitialUsername(loadedUsername);
    setInitialEmail(loadedEmail);
  }, [user]);

  function goToLogin() {
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  }

  function clearErrors() {
    setNameError('');
    setUsernameError('');
    setEmailError('');
    setCurrentPasswordError('');
    setNewPasswordError('');
    setConfirmPasswordError('');
    setGeneralError('');
  }

  function clearMessages() {
    clearErrors();
    setSuccessMessage('');
  }

  useFocusEffect(
    useCallback(() => {
      clearMessages();
      setDeleteAccountError('');

      return () => {
        clearMessages();
        setDeleteAccountError('');
      };
    }, []),
  );

  function clearPasswordFields() {
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  }

  function syncAuthUser(updatedUser) {
    if (typeof updateUser === 'function') {
      updateUser(updatedUser);
      return;
    }

    if (typeof auth.setUser === 'function') {
      auth.setUser(updatedUser);
    }
  }

  async function clearAuthSession() {
    if (typeof auth.logout === 'function') {
      await auth.logout();
      return;
    }

    if (typeof auth.signOut === 'function') {
      await auth.signOut();
      return;
    }

    if (typeof auth.setUser === 'function') {
      auth.setUser(null);
    }
  }

  function hasChangedName() {
    return name.trim() !== initialName.trim();
  }

  function hasChangedUsername() {
    return username.trim() !== initialUsername.trim();
  }

  function hasChangedEmail() {
    return email.trim().toLowerCase() !== initialEmail.trim().toLowerCase();
  }

  function hasChangedProfileData() {
    return hasChangedName() || hasChangedUsername() || hasChangedEmail();
  }

  function wantsChangePassword() {
    return currentPassword.trim() || newPassword.trim() || confirmPassword.trim();
  }

  function getChangedFields(changedPassword) {
    const fields = [];

    if (hasChangedName()) fields.push('nome');
    if (hasChangedUsername()) fields.push('usuário');
    if (hasChangedEmail()) fields.push('e-mail');
    if (changedPassword) fields.push('senha');

    return fields;
  }

  function validateProfileFields() {
    if (!user?.id) {
      setGeneralError('Usuário não encontrado na sessão.');
      return false;
    }

    if (!name.trim()) {
      setNameError('Informe seu nome.');
      return false;
    }

    if (name.trim().length < 2) {
      setNameError('O nome precisa ter pelo menos 2 caracteres.');
      return false;
    }

    if (!username.trim()) {
      setUsernameError('Informe seu usuário.');
      return false;
    }

    if (username.trim().length < 3) {
      setUsernameError('O usuário precisa ter pelo menos 3 caracteres.');
      return false;
    }

    if (!email.trim()) {
      setEmailError('Informe seu e-mail.');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email.trim())) {
      setEmailError('Informe um e-mail válido.');
      return false;
    }

    return true;
  }

  function validatePasswordFields() {
    if (!wantsChangePassword()) {
      return true;
    }

    if (!currentPassword.trim()) {
      setCurrentPasswordError('Informe sua senha atual.');
      return false;
    }

    if (!newPassword.trim()) {
      setNewPasswordError('Informe a nova senha.');
      return false;
    }

    if (newPassword.length < 4) {
      setNewPasswordError('A nova senha precisa ter pelo menos 4 caracteres.');
      return false;
    }

    if (!confirmPassword.trim()) {
      setConfirmPasswordError('Confirme a nova senha.');
      return false;
    }

    if (newPassword !== confirmPassword) {
      setConfirmPasswordError('As senhas não conferem.');
      return false;
    }

    return true;
  }

  function validateBeforeSave() {
    const changedProfile = hasChangedProfileData();
    const changedPassword = wantsChangePassword();

    if (!changedProfile && !changedPassword) {
      setGeneralError('Informe os dados que deseja alterar.');
      return false;
    }

    if (!validateProfileFields()) return false;
    if (!validatePasswordFields()) return false;

    return true;
  }

  function handleProfileBackendError(backendError) {
    if (backendError?.code === 'EMAIL_ALREADY_EXISTS') {
      setEmailError('Este e-mail já está em uso.');
      return true;
    }

    if (backendError?.code === 'USERNAME_ALREADY_EXISTS') {
      setUsernameError('Este usuário já está em uso.');
      return true;
    }

    return false;
  }

  function handlePasswordBackendError(backendError) {
    if (backendError?.code === 'CURRENT_PASSWORD_INVALID') {
      setCurrentPasswordError('Senha atual incorreta.');
      return true;
    }

    if (backendError?.code === 'SAME_PASSWORD') {
      setNewPasswordError('A nova senha não pode ser igual à senha atual.');
      return true;
    }

    return false;
  }

  function handleDeleteAccountBackendError(backendError) {
    if (
      backendError?.code === 'CURRENT_PASSWORD_INVALID' ||
      backendError?.code === 'INVALID_PASSWORD' ||
      backendError?.code === 'PASSWORD_REQUIRED'
    ) {
      setDeleteAccountError('Senha atual incorreta.');
      return true;
    }

    if (backendError?.message?.toLowerCase?.().includes('senha')) {
      setDeleteAccountError('Senha atual incorreta.');
      return true;
    }

    return false;
  }

  async function updateProfileData() {
    try {
      const updatedUser = await updateProfileDataRequest({
        userId: user.id,
        name,
        username,
        email,
      });

      const updatedName = updatedUser.name || '';
      const updatedUsername = updatedUser.username || '';
      const updatedEmail = updatedUser.email || '';
      const updatedAvatarUrl = updatedUser.avatarUrl || avatarUrl;

      setName(updatedName);
      setUsername(updatedUsername);
      setEmail(updatedEmail);
      setAvatarUrl(updatedAvatarUrl);

      setInitialName(updatedName);
      setInitialUsername(updatedUsername);
      setInitialEmail(updatedEmail);

      syncAuthUser(updatedUser);

      return true;
    } catch (backendError) {
      if (handleProfileBackendError(backendError)) {
        return false;
      }

      throw new Error(
        backendError?.message || 'Erro ao atualizar dados do perfil.',
      );
    }
  }

  async function updatePassword() {
    try {
      await updatePasswordRequest({
        userId: user.id,
        currentPassword,
        newPassword,
      });

      clearPasswordFields();

      return true;
    } catch (backendError) {
      if (handlePasswordBackendError(backendError)) {
        return false;
      }

      throw new Error(backendError?.message || 'Erro ao alterar senha.');
    }
  }

  async function uploadAvatar(asset) {
    if (!user?.id || !asset?.uri) {
      setGeneralError('Não foi possível selecionar a imagem.');
      return;
    }

    try {
      clearMessages();
      setIsUploadingAvatar(true);

      const formData = new FormData();

      formData.append('avatar', {
        uri: asset.uri,
        type: getImageMimeType(asset),
        name: asset.fileName || getImageFileName(asset.uri),
      });

      const updatedUser = await uploadAvatarRequest({
        userId: user.id,
        formData,
      });

      setAvatarUrl(updatedUser.avatarUrl || null);
      syncAuthUser(updatedUser);

      setSuccessMessage('Foto alterada com sucesso.');

      setTimeout(() => {
        setSuccessMessage('');
      }, 3500);
    } catch (backendError) {
      console.log('ERRO AO ALTERAR FOTO:', backendError);
      setGeneralError(
        backendError?.message ||
          'Não foi possível alterar a foto. Tente novamente.',
      );
    } finally {
      setIsUploadingAvatar(false);
    }
  }

  function handleImagePickerResponse(response) {
    if (response.didCancel) return;

    if (response.errorCode) {
      setGeneralError('Não foi possível selecionar a imagem.');
      return;
    }

    const asset = response.assets?.[0];

    if (!asset?.uri) {
      setGeneralError('Não foi possível carregar a imagem selecionada.');
      return;
    }

    uploadAvatar(asset);
  }

  function openGallery() {
    launchImageLibrary(
      {
        mediaType: 'photo',
        quality: 0.8,
        selectionLimit: 1,
      },
      handleImagePickerResponse,
    );
  }

  function openCamera() {
    launchCamera(
      {
        mediaType: 'photo',
        quality: 0.8,
        saveToPhotos: false,
      },
      handleImagePickerResponse,
    );
  }

  function handleChangePhoto() {
    if (isUploadingAvatar) return;

    setShowPhotoModal(true);
  }

  function handleClosePhotoModal() {
    if (isUploadingAvatar) return;

    setShowPhotoModal(false);
  }

  function handleOpenCameraFromModal() {
    setShowPhotoModal(false);
    openCamera();
  }

  function handleOpenGalleryFromModal() {
    setShowPhotoModal(false);
    openGallery();
  }

  function handleRemovePhotoFromModal() {
    setShowPhotoModal(false);
    setShowRemovePhotoModal(true);
  }

  function handleCancelRemovePhoto() {
    if (isUploadingAvatar) return;

    setShowRemovePhotoModal(false);
  }

  async function handleConfirmRemovePhoto() {
    setShowRemovePhotoModal(false);

    await handleRemoveAvatar();
  }

  async function handleRemoveAvatar() {
    if (!user?.id || isUploadingAvatar || !avatarUrl) return;

    try {
      clearMessages();
      setIsUploadingAvatar(true);

      const updatedUser = await removeAvatarRequest(user.id);

      setAvatarUrl(null);
      syncAuthUser(updatedUser);

      setSuccessMessage('Foto removida com sucesso.');

      setTimeout(() => {
        setSuccessMessage('');
      }, 3500);
    } catch (backendError) {
      console.log('ERRO AO REMOVER FOTO:', backendError);
      setGeneralError(
        backendError?.message ||
          'Não foi possível remover a foto. Tente novamente.',
      );
    } finally {
      setIsUploadingAvatar(false);
    }
  }

  async function deleteAccount(password) {
    clearMessages();
    setDeleteAccountError('');
    setIsDeletingAccount(true);

    try {
      await deleteAccountRequest({
        userId: user.id,
        password,
      });

      setShowDeleteAccountModal(false);

      await clearAuthSession();
      goToLogin();
    } catch (backendError) {
      console.log('ERRO AO EXCLUIR CONTA:', backendError);

      if (handleDeleteAccountBackendError(backendError)) {
        return;
      }

      setDeleteAccountError(
        backendError?.message ||
          'Não foi possível excluir a conta. Tente novamente.',
      );
    } finally {
      setIsDeletingAccount(false);
    }
  }

  function handleDeleteAccount() {
    if (!user?.id || isDeletingAccount) return;

    clearMessages();
    setDeleteAccountError('');
    setShowDeleteAccountModal(true);
  }

  function handleCancelDeleteAccount() {
    if (isDeletingAccount) return;

    setDeleteAccountError('');
    setShowDeleteAccountModal(false);
  }

  async function handleConfirmDeleteAccount(password) {
    if (!password?.trim()) {
      setDeleteAccountError('Digite sua senha para confirmar.');
      return;
    }

    setDeleteAccountError('');

    await deleteAccount(password);
  }

  async function handleSaveChanges() {
    clearMessages();

    if (!validateBeforeSave()) return;

    try {
      setIsSaving(true);

      const changedProfile = hasChangedProfileData();
      const changedPassword = wantsChangePassword();
      const changedFields = getChangedFields(changedPassword);

      let profileUpdated = true;
      let passwordUpdated = true;

      if (changedProfile) {
        profileUpdated = await updateProfileData();
      }

      if (changedPassword) {
        passwordUpdated = await updatePassword();
      }

      if (!profileUpdated || !passwordUpdated) return;

      clearErrors();

      setSuccessMessage(buildSuccessMessage(changedFields));

      setTimeout(() => {
        setSuccessMessage('');
      }, 3500);
    } catch (error) {
      console.log('ERRO AO SALVAR PERFIL:', error);
      setGeneralError('Não foi possível salvar as alterações. Tente novamente.');
    } finally {
      setIsSaving(false);
    }
  }

  const avatarSource = avatarUrl
    ? { uri: `${buildAvatarUrl(avatarUrl, API_PUBLIC_URL)}?t=${Date.now()}` }
    : defaultAvatar;

  return {
    isProfileReady,

    name,
    username,
    email,
    avatarUrl,
    avatarSource,

    showDeleteAccountModal,
    showPhotoModal,
    showRemovePhotoModal,

    nameError,
    usernameError,
    emailError,

    currentPassword,
    newPassword,
    confirmPassword,

    currentPasswordError,
    newPasswordError,
    confirmPasswordError,

    deleteAccountError,

    generalError,
    successMessage,

    isSaving,
    isUploadingAvatar,
    isDeletingAccount,

    showCurrentPassword,
    showNewPassword,
    showConfirmPassword,

    setName,
    setUsername,
    setEmail,

    setNameError,
    setUsernameError,
    setEmailError,

    setCurrentPassword,
    setNewPassword,
    setConfirmPassword,

    setCurrentPasswordError,
    setNewPasswordError,
    setConfirmPasswordError,

    setGeneralError,
    setSuccessMessage,

    setShowCurrentPassword,
    setShowNewPassword,
    setShowConfirmPassword,

    handleChangePhoto,
    handleClosePhotoModal,
    handleOpenCameraFromModal,
    handleOpenGalleryFromModal,
    handleRemovePhotoFromModal,
    handleCancelRemovePhoto,
    handleConfirmRemovePhoto,

    handleSaveChanges,
    handleDeleteAccount,
    handleCancelDeleteAccount,
    handleConfirmDeleteAccount,
  };
}

export default useProfileController;