// src/pages/profile/utils/profileHelpers.js

export function capitalize(value = '') {
  if (!value) return '';

  return value.charAt(0).toUpperCase() + value.slice(1);
}

export function buildSuccessMessage(changedFields = []) {
  if (changedFields.length === 0) {
    return 'Alterações salvas com sucesso.';
  }

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

export function buildAvatarUrl(avatarUrl, apiPublicUrl) {
  if (!avatarUrl) return null;

  if (avatarUrl.startsWith('http')) {
    return avatarUrl;
  }

  return `${apiPublicUrl}${avatarUrl}`;
}

export function getImageFileName(uri) {
  const fallbackName = `avatar-${Date.now()}.jpg`;

  if (!uri) return fallbackName;

  const parts = uri.split('/');
  const fileName = parts[parts.length - 1];

  return fileName || fallbackName;
}

export function getImageMimeType(asset) {
  if (asset?.type) return asset.type;

  const uri = asset?.uri || '';
  const extension = uri.split('.').pop()?.toLowerCase();

  if (extension === 'png') return 'image/png';
  if (extension === 'webp') return 'image/webp';

  return 'image/jpeg';
}