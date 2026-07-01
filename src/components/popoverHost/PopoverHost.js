import React from 'react';
import {
  Dimensions,
  Pressable,
  View,
} from 'react-native';

import ActionPopover from '../actionPopover/ActionPopover';

const { width: screenWidth } = Dimensions.get('window');

const POPOVER_WIDTH = 280;

function PopoverHost({
  popover,
  isClosing,
  getPointerTop,
  onClose,
  onAnimationEnd,
  onPressContent,
  onPressPractice,
}) {
  if (!popover) {
    return null;
  }

  return (
    <View
      pointerEvents="box-none"
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
      }}
    >
      {/* Backdrop */}
      <Pressable
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        }}
        onPress={onClose}
      />

      {/* Popover */}
      <View
        pointerEvents={isClosing ? 'none' : 'auto'}
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
          title={
            popover.itemData?.title ||
            'Conteúdo bloqueado'
          }
          message={
            popover.itemData?.message ??
            'Complete a atividade anterior para desbloquear esse aqui!'
          }
          pointerStyle={{
            left: popover.pointerLeft,
            top: getPointerTop(popover.type),
          }}
          isClosing={isClosing}
          onAnimationEnd={onAnimationEnd}
          onPressContent={() =>
            onPressContent(popover.itemData)
          }
          onPressPractice={() =>
            onPressPractice(popover.itemData)
          }
        />
      </View>
    </View>
  );
}

export default PopoverHost;