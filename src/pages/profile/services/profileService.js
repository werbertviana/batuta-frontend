// src/pages/profile/services/profileService.js

export const API_BASE_URL = 'http://10.0.2.2:3000/api';
export const API_PUBLIC_URL = 'http://10.0.2.2:3000';

export async function parseResponseError(response) {
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

function getBackendError(errorResponse) {
  return errorResponse?.error || errorResponse;
}

async function safeJson(response) {
  const text = await response.text();

  if (!text) return null;

  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

export async function updateProfileDataRequest({
  userId,
  name,
  username,
  email,
}) {
  const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
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
    throw getBackendError(errorResponse);
  }

  return response.json();
}

export async function updatePasswordRequest({
  userId,
  currentPassword,
  newPassword,
}) {
  const response = await fetch(`${API_BASE_URL}/users/${userId}/password`, {
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
    throw getBackendError(errorResponse);
  }

  return safeJson(response);
}

export async function setPasswordRequest({ userId, newPassword }) {
  const response = await fetch(`${API_BASE_URL}/users/${userId}/set-password`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      newPassword,
    }),
  });

  if (!response.ok) {
    const errorResponse = await parseResponseError(response);
    throw getBackendError(errorResponse);
  }

  return safeJson(response);
}

export async function uploadAvatarRequest({ userId, formData }) {
  const response = await fetch(`${API_BASE_URL}/users/${userId}/avatar`, {
    method: 'PATCH',
    body: formData,
  });

  if (!response.ok) {
    const errorResponse = await parseResponseError(response);
    throw getBackendError(errorResponse);
  }

  return response.json();
}

export async function removeAvatarRequest(userId) {
  const response = await fetch(`${API_BASE_URL}/users/${userId}/avatar`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    const errorResponse = await parseResponseError(response);
    throw getBackendError(errorResponse);
  }

  return response.json();
}

export async function deleteAccountRequest({
  userId,
  password,
  googleIdToken,
}) {
  const body = googleIdToken
    ? { googleIdToken }
    : {
        password,
        currentPassword: password,
      };

  const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorResponse = await parseResponseError(response);
    throw getBackendError(errorResponse);
  }

  return true;
}