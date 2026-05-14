// src/pages/profile/components/ProfileAccountSection.js

import React from 'react';
import Feather from 'react-native-vector-icons/Feather';

import {
  Divider,
  SectionHeader,
  SectionIconCircle,
  SectionIconImage,
  SectionTitle,
  AccountBox,
  DeleteButton,
  DeleteLeft,
  DeleteText,
  DeleteHint,
} from '../ProfileStyles';

function ProfileAccountSection({
  iconConta,
  danger,
  isDeletingAccount,
  onDeleteAccount,
}) {
  return (
    <>
      <Divider />

      <SectionHeader>
        <SectionIconCircle>
          <SectionIconImage
            source={iconConta}
            resizeMode="contain"
          />
        </SectionIconCircle>

        <SectionTitle>
          CONTA
        </SectionTitle>
      </SectionHeader>

      <AccountBox>
        <DeleteButton
          activeOpacity={0.8}
          onPress={onDeleteAccount}
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
              {isDeletingAccount
                ? 'EXCLUINDO...'
                : 'EXCLUIR CONTA'}
            </DeleteText>
          </DeleteLeft>

          <Feather
            name="chevron-right"
            size={26}
            color="#111111"
          />
        </DeleteButton>

        <DeleteHint>
          A exclusão da conta é permanente e não pode ser desfeita.
        </DeleteHint>
      </AccountBox>
    </>
  );
}

export default ProfileAccountSection;