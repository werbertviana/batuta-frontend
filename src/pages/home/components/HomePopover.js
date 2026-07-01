import React from 'react';
import { View, Dimensions } from 'react-native';

import ActionPopover from '../../../components/actionPopover/ActionPopover';

const { width: screenWidth } = Dimensions.get('window');

function HomePopover({
  popover,
  isPopoverClosing,
  getPointerTop,
  handlePopoverAnimationEnd,
  onPressContent,
  onPressPractice,
  POPOVER_WIDTH,
}) {
  if (!popover) {
    return null;
  }

  return (
    <View
      pointerEvents={isPopoverClosing ? 'none' : 'auto'}
      style={{
        position: 'absolute',
        top: popover.top,
        left: (screenWidth - POPOVER_WIDTH) / 2,
        width: POPOVER_WIDTH,
        zIndex: 99999,
        elevation: 20,
      }}
    >
      <ActionPopover
        variant={popover.type}
        title={popover.itemData?.title || 'Conteúdo bloqueado'}
        message={
          popover.itemData?.message ||
          'Complete a atividade anterior para desbloquear esse aqui!'
        }
        pointerStyle={{
          left: popover.pointerLeft,
          top: getPointerTop(popover.type),
        }}
        isClosing={isPopoverClosing}
        onAnimationEnd={handlePopoverAnimationEnd}
        onPressContent={() =>
          onPressContent(popover.itemData)
        }
        onPressPractice={() =>
          onPressPractice(popover.itemData)
        }
      />
    </View>
  );
}

export default HomePopover;