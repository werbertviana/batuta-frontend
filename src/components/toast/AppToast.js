import React from 'react';

import {
  ToastContainer,
  ToastIconCircle,
  ToastIconText,
  ToastMessage,
} from './AppToastStyles';

function getToastIcon(type) {
  if (type === 'success') return '✓';
  if (type === 'error') return '×';
  if (type === 'info') return 'i';
  return '!';
}

export default function AppToast({
  visible,
  message,
  type = 'warning',
  bottom = 105,
}) {
  if (!visible || !message) return null;

  return (
    <ToastContainer
      pointerEvents="none"
      type={type}
      style={{
        bottom,
        shadowColor: '#000',
        shadowOpacity: 0.25,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 4 },
      }}
    >
      <ToastIconCircle type={type}>
        <ToastIconText>{getToastIcon(type)}</ToastIconText>
      </ToastIconCircle>

      <ToastMessage>{message}</ToastMessage>
    </ToastContainer>
  );
}