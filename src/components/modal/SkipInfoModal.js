// src/components/modal/SkipInfoModal.js

import React, { useState, useEffect } from 'react';
import { Modal } from 'react-native';

import {
  Overlay,
  Container,
  Title,
  Message,
  DividerRow,
  DividerLine,
  DividerIcon,
  CheckboxRow,
  CheckboxBox,
  CheckboxMark,
  CheckboxText,
  Button,
  ButtonText,
} from './SkipInfoModalStyles';

export default function SkipInfoModal({
  visible,
  onClose,
  onDisableNextTime,
  maxSkips = 2,
}) {
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (visible) {
      setChecked(false);
    }
  }, [visible]);

  const handleClose = () => {
    if (checked && onDisableNextTime) {
      onDisableNextTime();
    }

    onClose?.();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
    >
      <Overlay>
        <Container>
          <Title>Sobre os pulos 🦘</Title>

          <Message>
            Você pode pular até {maxSkips} questões por atividade.{'\n'}
            Pular não tira vida, mas também não conta como acerto.
          </Message>

          <DividerRow>
            <DividerLine />
            <DividerIcon></DividerIcon>
            <DividerLine />
          </DividerRow>

          <CheckboxRow
            activeOpacity={0.85}
            onPress={() => setChecked((prev) => !prev)}
          >
            <CheckboxBox>{checked && <CheckboxMark>✓</CheckboxMark>}</CheckboxBox>

            <CheckboxText>
              Não mostrar essa mensagem{'\n'}novamente
            </CheckboxText>
          </CheckboxRow>

          <Button activeOpacity={0.85} onPress={handleClose}>
            <ButtonText>ENTENDI</ButtonText>
          </Button>
        </Container>
      </Overlay>
    </Modal>
  );
}