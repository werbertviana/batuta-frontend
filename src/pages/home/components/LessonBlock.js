// src/screens/home/components/LessonBlock.js

import React, { useRef } from 'react';
import { View, TouchableOpacity } from 'react-native';

import {
  Background,
  FeedContainer,
  ItemContainer,
  LessonContainer,
  IconLesson,
} from '../HomeStyles';

import FeedItem from '../../../components/feedItem/FeedItem';
import UnlockAnimatedItem from './UnlockAnimatedItem';

const Bg = require('../../../assets/images/home/bg.png');

function LessonBlock({
  lesson,
  isBlocked,
  lockedCardWidth,
  lockedCardHeight,
  lockedCardMarginBottom,
  activeActionKey,
  recentlyUnlockedKey,
  unlockGlowSize,
  getLessonIcon,
  isItemActive,
  onOpenLockedLesson,
  onClearUnlockAnimation,
  isPressingItemRef,
  onOpenActions,
}) {
  const lockedCardRef = useRef(null);
  const itens = lesson.items || [];

  const lockedLessonKey = `locked-lesson-${lesson.lesson}`;
  const isLockedLessonPopoverOpen =
    activeActionKey === lockedLessonKey;

  const handleOpenLockedLesson = () => {
    lockedCardRef.current?.measure(
      (
        fx,
        fy,
        width,
        measuredHeight,
        px,
        py,
      ) => {
        const lockedActionData = {
          key: lockedLessonKey,
          lesson: lesson.lesson,
          index: 1,
          lockedKind: 'lesson',
          message:
            'Complete a lição anterior para desbloquear esse aqui!',
          anchor: {
            pageX: px,
            pageY: py,
            width,
            height: measuredHeight,
            visualHeight: lockedCardHeight,
          },
        };

        onOpenLockedLesson?.(
          lockedActionData,
          callback => {
            lockedCardRef.current?.measure(
              callback,
            );
          },
        );
      },
    );
  };

  if (isBlocked) {
    return (
      <FeedContainer
        style={{
          alignItems: 'center',
          marginTop: 8,
          marginBottom:
            isLockedLessonPopoverOpen
              ? 30
              : -130,
        }}
      >
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={handleOpenLockedLesson}
        >
          <View style={{ alignItems: 'center' }}>
            <LessonContainer>
              <IconLesson
                source={getLessonIcon(
                  lesson.lesson,
                  true,
                )}
                resizeMode="contain"
                style={{
                  marginBottom: 8,
                }}
              />
            </LessonContainer>

            <View
              style={{
                marginBottom:
                  isLockedLessonPopoverOpen
                    ? -20
                    : lockedCardMarginBottom,
              }}
            >
              <View
                ref={lockedCardRef}
                collapsable={false}
                style={{
                  width: lockedCardWidth,
                  height: lockedCardHeight,
                  backgroundColor: '#fff',
                  borderRadius: 16,
                }}
              />
            </View>
          </View>
        </TouchableOpacity>
      </FeedContainer>
    );
  }

  return (
    <FeedContainer>
      <LessonContainer>
        <IconLesson
          resizeMode="contain"
          source={getLessonIcon(lesson.lesson)}
        />
      </LessonContainer>

      <Background
        resizeMode="contain"
        source={Bg}
      >
        <ItemContainer>
          {itens.map((item, index) => {
            const unlockKey = `${lesson.lesson}:${item.id}`;
            const isRecentlyUnlocked =
              recentlyUnlockedKey === unlockKey;

            const itemIsActive = isItemActive(
              lesson,
              index,
            );

            return (
              <UnlockAnimatedItem
                key={item.id}
                active={isRecentlyUnlocked}
                glowSize={unlockGlowSize}
                onTouch={() => {
                  if (isRecentlyUnlocked) {
                    onClearUnlockAnimation();
                  }
                }}
              >
                <FeedItem
                  index={index}
                  lessonNumber={lesson.lesson}
                  title={item.title}
                  icon={item.icon}
                  content={item.content}
                  isActive={itemIsActive}
                  isPressingItemRef={isPressingItemRef}
                  practiceRoute={
                    item.practiceRoute
                  }
                  titleOffsetX={
                    index % 2 === 0
                      ? -18
                      : 18
                  }
                  pointerOffsetX={
                    index % 2 === 0
                      ? 12
                      : -12
                  }
                  onOpenActions={(actionData, measureButtonNativeFn) => {
                    console.log(
                      '🟠 LessonBlock clicou:',
                      lesson.lesson,
                      item.title,
                    );

                    if (itemIsActive) {
                      onOpenActions?.(
                        actionData,
                        measureButtonNativeFn,
                      );
                    } else {
                      onOpenLockedLesson?.(
                        actionData,
                        measureButtonNativeFn,
                      );
                    }
                  }}
                  />
              </UnlockAnimatedItem>
            );
          })}
        </ItemContainer>
      </Background>
    </FeedContainer>
  );
}

export default LessonBlock;