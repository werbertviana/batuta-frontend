import React from 'react';

import {
  SkipView,
  SkipContent,
  SkipText,
  SkipDivider,
  SkipCounter,
} from './SkipButtonStyles';

const SkipButton = ({
  onPress,
  children,
  disabled = false,
  usedSkips,
  maxSkips,
  onDisabledPress,
}) => {
  const hasCounter =
    typeof usedSkips === 'number' && typeof maxSkips === 'number';

  const handlePress = () => {
    if (disabled) {
      if (onDisabledPress) onDisabledPress();
      return;
    }

    if (onPress) onPress();
  };

  return (
    <SkipView onPress={handlePress} activeOpacity={0.8} disabled={false} isDisabled={disabled}>
      <SkipContent>
        <SkipText disabled={disabled}>{children || 'PULAR'}</SkipText>

        {hasCounter && (
          <>
            <SkipDivider disabled={disabled} />
            <SkipCounter disabled={disabled}>
              {usedSkips}/{maxSkips}
            </SkipCounter>
          </>
        )}
      </SkipContent>
    </SkipView>
  );
};

export default SkipButton;