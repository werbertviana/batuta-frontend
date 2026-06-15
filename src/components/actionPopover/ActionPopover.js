import React from 'react';

import {
  ActionButtonPrimary,
  ActionButtonSecondary,
  ActionButtonTextPrimary,
  ActionButtonTextSecondary,
  ActionPopoverContainer,
  ActionPopoverPointer,
} from './ActionPopoverStyles';

function ActionPopover({
  style,
  pointerStyle,
  onPressContent,
  onPressPractice,
}) {
  return (
    <ActionPopoverContainer style={style}>
      <ActionPopoverPointer style={pointerStyle} />

      <ActionButtonPrimary activeOpacity={0.85} onPress={onPressContent}>
        <ActionButtonTextPrimary>CONTEÚDO</ActionButtonTextPrimary>
      </ActionButtonPrimary>

      <ActionButtonSecondary activeOpacity={0.85} onPress={onPressPractice}>
        <ActionButtonTextSecondary>PRATICAR + XP</ActionButtonTextSecondary>
      </ActionButtonSecondary>
    </ActionPopoverContainer>
  );
}

export default ActionPopover;