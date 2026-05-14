// src/pages/profile/components/ProfileSaveFeedback.js

import React from 'react';

import {
  FieldErrorText,
  SuccessText,
  SaveButton,
  SaveContent,
  SaveIcon,
  SaveButtonText,
} from '../ProfileStyles';

function ProfileSaveFeedback({
  generalError,
  successMessage,
  iconSave,
  isSaving,
  onSave,
}) {
  return (
    <>
      {generalError ? (
        <FieldErrorText>{generalError}</FieldErrorText>
      ) : null}

      {successMessage ? (
        <SuccessText>{successMessage}</SuccessText>
      ) : null}

      <SaveButton
        activeOpacity={0.85}
        onPress={onSave}
        disabled={isSaving}
      >
        <SaveContent>
          <SaveIcon source={iconSave} resizeMode="contain" />

          <SaveButtonText>
            {isSaving ? 'SALVANDO...' : 'SALVAR ALTERAÇÕES'}
          </SaveButtonText>
        </SaveContent>
      </SaveButton>
    </>
  );
}

export default ProfileSaveFeedback;