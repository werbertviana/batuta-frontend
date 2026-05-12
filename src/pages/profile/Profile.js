// src/pages/profile/Profile.js

import React, { useEffect, useState } from 'react';
import { Alert, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import Feather from 'react-native-vector-icons/Feather';
import { useAuth } from '../../contexts/AuthContext';
import DeleteAccountModal from '../../components/modal/DeleteAccountModal';

import {
  Container,
  Content,
  HeaderImage,
  AvatarWrapper,
  AvatarCircle,
  AvatarImage,
  AvatarLoadingOverlay,
  AvatarLoadingText,
  CameraButton,
  CameraIcon,
  ChangePhotoText,
  Divider,
  SectionHeader,
  SectionIconCircle,
  SectionIconImage,
  SectionTitle,
  Label,
  InputWrapper,
  Input,
  EyeButton,
  FieldErrorText,
  SuccessText,
  SaveButton,
  SaveContent,
  SaveIcon,
  SaveButtonText,
  AccountBox,
  DeleteButton,
  DeleteLeft,
  DeleteText,
  DeleteHint,
} from './ProfileStyles';

const profileHeader = require('../../assets/images/perfil/perfil.png');
const defaultAvatar = require('../../assets/images/perfil/default.png');

const iconDados = require('../../assets/images/perfil/dados.png');
const iconSeguranca = require('../../assets/images/perfil/seguranca.png');
const iconConta = require('../../assets/images/perfil/conta.png');
const iconCamera = require('../../assets/images/perfil/camera.png');
const iconSave = require('../../assets/images/perfil/save.png');

const API_BASE_URL = 'http://10.0.2.2:3000/api';
const API_PUBLIC_URL = 'http://10.0.2.2:3000';

const teal = '#2FAFC4';
const grayIcon = '#7A7A7A';
const danger = '#ff3b3b';

function capitalize(value) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function buildSuccessMessage(changedFields) {
  if (changedFields.length === 1) {
    return `${capitalize(changedFields[0])} alterado com sucesso.`;
  }

  if (changedFields.length === 2) {
    return `${capitalize(changedFields[0])} e ${changedFields[1]} alterados com sucesso.`;
  }

  const fieldsCopy = [...changedFields];
  const lastField = fieldsCopy.pop();

  return `${capitalize(fieldsCopy.join(', '))} e ${lastField} alterados com sucesso.`;
}

function buildAvatarUrl(avatarUrl) {
  if (!avatarUrl) return null;

  if (avatarUrl.startsWith('http')) {
    return avatarUrl;
  }

  return `${API_PUBLIC_URL}${avatarUrl}`;
}

function getImageFileName(uri) {
  const fallbackName = `avatar-${Date.now()}.jpg`;

  if (!uri) return fallbackName;

  const parts = uri.split('/');
  const fileName = parts[parts.length - 1];

  return fileName || fallbackName;
}

function getImageMimeType(asset) {
  if (asset?.type) return asset.type;

  const uri = asset?.uri || '';
  const extension = uri.split('.').pop()?.toLowerCase();

  if (extension === 'png') return 'image/png';
  if (extension === 'webp') return 'image/webp';

  return 'image/jpeg';
}

function Profile() {
  const navigation = useNavigation();

  const auth = useAuth();
  const { user, updateUser } = auth;

  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [showDeleteAccountModal, setShowDeleteAccountModal] =
  useState(false);

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

  async function parseResponseError(response) {
    const text = await response.text();

    try {
      return text ? JSON.parse(text) : null;
    } catch {
      return {
        error: {
          message: text,
        },
      };
    }
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

  async function updateProfileData() {
    const response = await fetch(`${API_BASE_URL}/users/${user.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: name.trim(),
        username: username.trim().toLowerCase(),
        email: email.trim().toLowerCase(),
      }),
    });

    if (!response.ok) {
      const errorResponse = await parseResponseError(response);
      const backendError = errorResponse?.error || errorResponse;

      if (handleProfileBackendError(backendError)) {
        return false;
      }

      throw new Error(
        backendError?.message || 'Erro ao atualizar dados do perfil.'
      );
    }

    const updatedUser = await response.json();

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
  }

  async function updatePassword() {
    const response = await fetch(`${API_BASE_URL}/users/${user.id}/password`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        currentPassword,
        newPassword,
      }),
    });

    if (!response.ok) {
      const errorResponse = await parseResponseError(response);
      const backendError = errorResponse?.error || errorResponse;

      if (handlePasswordBackendError(backendError)) {
        return false;
      }

      throw new Error(backendError?.message || 'Erro ao alterar senha.');
    }

    clearPasswordFields();

    return true;
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

      const response = await fetch(`${API_BASE_URL}/users/${user.id}/avatar`, {
        method: 'PATCH',
        body: formData,
      });

      if (!response.ok) {
        const errorResponse = await parseResponseError(response);
        const backendError = errorResponse?.error || errorResponse;

        throw new Error(backendError?.message || 'Erro ao atualizar foto.');
      }

      const updatedUser = await response.json();

      setAvatarUrl(updatedUser.avatarUrl || null);
      syncAuthUser(updatedUser);

      setSuccessMessage('Foto alterada com sucesso.');

      setTimeout(() => {
        setSuccessMessage('');
      }, 3500);
    } catch (error) {
      console.log('ERRO AO ALTERAR FOTO:', error);
      setGeneralError('Não foi possível alterar a foto. Tente novamente.');
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
      handleImagePickerResponse
    );
  }

  function openCamera() {
    launchCamera(
      {
        mediaType: 'photo',
        quality: 0.8,
        saveToPhotos: false,
      },
      handleImagePickerResponse
    );
  }

  function handleChangePhoto() {
    if (isUploadingAvatar) return;

    const options = [
      {
        text: 'Câmera',
        onPress: openCamera,
      },
      {
        text: 'Galeria',
        onPress: openGallery,
      },
    ];

    if (avatarUrl) {
      options.push({
        text: 'Remover foto',
        style: 'destructive',
        onPress: handleRemoveAvatar,
      });
    }

    options.push({
      text: 'Cancelar',
      style: 'cancel',
    });

    Alert.alert('Alterar foto', 'Escolha uma opção', options);
  }

  async function handleRemoveAvatar() {
    if (!user?.id || isUploadingAvatar || !avatarUrl) return;

    try {
      clearMessages();
      setIsUploadingAvatar(true);

      const response = await fetch(`${API_BASE_URL}/users/${user.id}/avatar`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorResponse = await parseResponseError(response);
        const backendError = errorResponse?.error || errorResponse;

        throw new Error(backendError?.message || 'Erro ao remover foto.');
      }

      const updatedUser = await response.json();

      setAvatarUrl(null);
      syncAuthUser(updatedUser);

      setSuccessMessage('Foto removida com sucesso.');

      setTimeout(() => {
        setSuccessMessage('');
      }, 3500);
    } catch (error) {
      console.log('ERRO AO REMOVER FOTO:', error);
      setGeneralError('Não foi possível remover a foto. Tente novamente.');
    } finally {
      setIsUploadingAvatar(false);
    }
  }

  async function deleteAccount() {
    clearMessages();
    setIsDeletingAccount(true);

    try {
      const response = await fetch(`${API_BASE_URL}/users/${user.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorResponse = await parseResponseError(response);
        const backendError = errorResponse?.error || errorResponse;

        throw new Error(backendError?.message || 'Erro ao excluir conta.');
      }

      await clearAuthSession();
      goToLogin();
    } catch (error) {
      console.log('ERRO AO EXCLUIR CONTA:', error);
      setGeneralError('Não foi possível excluir a conta. Tente novamente.');
    } finally {
      setIsDeletingAccount(false);
    }
  }

  function handleDeleteAccount() {
    if (!user?.id || isDeletingAccount) return;

    setShowDeleteAccountModal(true);
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
    ? { uri: `${buildAvatarUrl(avatarUrl)}?t=${Date.now()}` }
    : defaultAvatar;

  return (
    <Container>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        <Content>
          <HeaderImage source={profileHeader} resizeMode="contain" />

          <AvatarWrapper>
            <AvatarCircle>
              <AvatarImage
                source={avatarSource}
                resizeMode={avatarUrl ? 'cover' : 'contain'}
              />

              {isUploadingAvatar ? (
                <AvatarLoadingOverlay>
                  <AvatarLoadingText>...</AvatarLoadingText>
                </AvatarLoadingOverlay>
              ) : null}
            </AvatarCircle>

            <CameraButton activeOpacity={0.8} onPress={handleChangePhoto}>
              <CameraIcon source={iconCamera} resizeMode="contain" />
            </CameraButton>

            <ChangePhotoText onPress={handleChangePhoto}>
              {isUploadingAvatar ? 'Enviando foto...' : 'Mudar foto'}
            </ChangePhotoText>
          </AvatarWrapper>

          <Divider />

          <SectionHeader>
            <SectionIconCircle>
              <SectionIconImage source={iconDados} resizeMode="contain" />
            </SectionIconCircle>
            <SectionTitle>MEUS DADOS</SectionTitle>
          </SectionHeader>

          <Label>Nome</Label>
          <InputWrapper>
            <Feather
              name="user"
              size={22}
              color={teal}
              style={{ marginRight: 14 }}
            />
            <Input
              value={name}
              onChangeText={(value) => {
                setName(value);
                setNameError('');
                setGeneralError('');
                setSuccessMessage('');
              }}
              placeholder="Digite seu nome"
              placeholderTextColor="#B0B0B0"
            />
          </InputWrapper>
          {nameError ? <FieldErrorText>{nameError}</FieldErrorText> : null}

          <Label>Usuário</Label>
          <InputWrapper>
            <Feather
              name="at-sign"
              size={22}
              color={teal}
              style={{ marginRight: 14 }}
            />
            <Input
              value={username}
              onChangeText={(value) => {
                setUsername(value);
                setUsernameError('');
                setGeneralError('');
                setSuccessMessage('');
              }}
              autoCapitalize="none"
              placeholder="Digite seu usuário"
              placeholderTextColor="#B0B0B0"
            />
          </InputWrapper>
          {usernameError ? (
            <FieldErrorText>{usernameError}</FieldErrorText>
          ) : null}

          <Label>E-mail</Label>
          <InputWrapper>
            <Feather
              name="mail"
              size={22}
              color={teal}
              style={{ marginRight: 14 }}
            />
            <Input
              value={email}
              onChangeText={(value) => {
                setEmail(value);
                setEmailError('');
                setGeneralError('');
                setSuccessMessage('');
              }}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholder="Digite seu e-mail"
              placeholderTextColor="#B0B0B0"
            />
          </InputWrapper>
          {emailError ? <FieldErrorText>{emailError}</FieldErrorText> : null}

          <Divider />

          <SectionHeader>
            <SectionIconCircle>
              <SectionIconImage source={iconSeguranca} resizeMode="contain" />
            </SectionIconCircle>
            <SectionTitle>SEGURANÇA</SectionTitle>
          </SectionHeader>

          <Label>Senha atual</Label>
          <InputWrapper>
            <Feather
              name="lock"
              size={22}
              color={teal}
              style={{ marginRight: 14 }}
            />
            <Input
              value={currentPassword}
              onChangeText={(value) => {
                setCurrentPassword(value);
                setCurrentPasswordError('');
                setGeneralError('');
                setSuccessMessage('');
              }}
              secureTextEntry={!showCurrentPassword}
              placeholder="Digite sua senha atual"
              placeholderTextColor="#B0B0B0"
            />
            <EyeButton
              onPress={() => setShowCurrentPassword(!showCurrentPassword)}
            >
              <Feather
                name={showCurrentPassword ? 'eye-off' : 'eye'}
                size={22}
                color={grayIcon}
              />
            </EyeButton>
          </InputWrapper>
          {currentPasswordError ? (
            <FieldErrorText>{currentPasswordError}</FieldErrorText>
          ) : null}

          <Label>Nova senha</Label>
          <InputWrapper>
            <Feather
              name="lock"
              size={22}
              color={teal}
              style={{ marginRight: 14 }}
            />
            <Input
              value={newPassword}
              onChangeText={(value) => {
                setNewPassword(value);
                setNewPasswordError('');
                setGeneralError('');
                setSuccessMessage('');
              }}
              secureTextEntry={!showNewPassword}
              placeholder="Digite a nova senha"
              placeholderTextColor="#B0B0B0"
            />
            <EyeButton onPress={() => setShowNewPassword(!showNewPassword)}>
              <Feather
                name={showNewPassword ? 'eye-off' : 'eye'}
                size={22}
                color={grayIcon}
              />
            </EyeButton>
          </InputWrapper>
          {newPasswordError ? (
            <FieldErrorText>{newPasswordError}</FieldErrorText>
          ) : null}

          <Label>Confirmar nova senha</Label>
          <InputWrapper>
            <Feather
              name="lock"
              size={22}
              color={teal}
              style={{ marginRight: 14 }}
            />
            <Input
              value={confirmPassword}
              onChangeText={(value) => {
                setConfirmPassword(value);
                setConfirmPasswordError('');
                setGeneralError('');
                setSuccessMessage('');
              }}
              secureTextEntry={!showConfirmPassword}
              placeholder="Confirme a nova senha"
              placeholderTextColor="#B0B0B0"
            />
            <EyeButton
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              <Feather
                name={showConfirmPassword ? 'eye-off' : 'eye'}
                size={22}
                color={grayIcon}
              />
            </EyeButton>
          </InputWrapper>
          {confirmPasswordError ? (
            <FieldErrorText>{confirmPasswordError}</FieldErrorText>
          ) : null}

          {generalError ? <FieldErrorText>{generalError}</FieldErrorText> : null}

          {successMessage ? <SuccessText>{successMessage}</SuccessText> : null}

          <SaveButton
            activeOpacity={0.85}
            onPress={handleSaveChanges}
            disabled={isSaving}
          >
            <SaveContent>
              <SaveIcon source={iconSave} resizeMode="contain" />
              <SaveButtonText>
                {isSaving ? 'SALVANDO...' : 'SALVAR ALTERAÇÕES'}
              </SaveButtonText>
            </SaveContent>
          </SaveButton>

          <Divider />

          <SectionHeader>
            <SectionIconCircle>
              <SectionIconImage source={iconConta} resizeMode="contain" />
            </SectionIconCircle>
            <SectionTitle>CONTA</SectionTitle>
          </SectionHeader>

          <AccountBox>
            <DeleteButton
              activeOpacity={0.8}
              onPress={handleDeleteAccount}
              disabled={isDeletingAccount}
            >
              <DeleteLeft>
                <Feather
                  name="trash-2"
                  size={22}
                  color={danger}
                  style={{ marginRight: 16 }}
                />
                <DeleteText>
                  {isDeletingAccount ? 'EXCLUINDO...' : 'EXCLUIR CONTA'}
                </DeleteText>
              </DeleteLeft>

              <Feather name="chevron-right" size={26} color="#111111" />
            </DeleteButton>

            <DeleteHint>
              A exclusão da conta é permanente e não pode ser desfeita.
            </DeleteHint>
          </AccountBox>
        </Content>

      </ScrollView>

      <DeleteAccountModal
        visible={showDeleteAccountModal}
        loading={isDeletingAccount}
        onCancel={() => setShowDeleteAccountModal(false)}
        onConfirm={async () => {
          setShowDeleteAccountModal(false);
          await deleteAccount();
        }}
      />
      
    </Container>
  );
}

export default Profile;