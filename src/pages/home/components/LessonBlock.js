// src/screens/home/components/LessonBlock.js

import React from 'react';
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
  isOnlyLesson2Blocked,
  height,
  compactLesson1IconWidth,
  compactLesson1IconHeight,
  compactLesson1BoardHeight,
  lockedLessonIconWidth,
  lockedLessonIconHeight,
  lockedCardWidth,
  lockedCardHeight,
  lockedCardMarginBottom,
  recentlyUnlockedKey,
  unlockGlowSize,
  getLessonIcon,
  isItemActive,
  onOpenLockedLesson,
  onClearUnlockAnimation,
}) {
  const itens = lesson.items || [];

  if (isBlocked) {
    return (
      <FeedContainer style={{ alignItems: 'center', marginTop: 4 }}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => onOpenLockedLesson(lesson.lesson)}
        >
          <View style={{ alignItems: 'center', opacity: 0.5 }}>
            <LessonContainer>
              <IconLesson
                source={getLessonIcon(lesson.lesson, true)}
                resizeMode="contain"
                style={{
                  width: lockedLessonIconWidth,
                  height: lockedLessonIconHeight,
                  marginBottom: 8,
                }}
              />
            </LessonContainer>

            <View
              style={{
                width: lockedCardWidth,
                height: lockedCardHeight,
                backgroundColor: '#fff',
                borderRadius: 16,
                marginBottom: lockedCardMarginBottom,
              }}
            />
          </View>
        </TouchableOpacity>
      </FeedContainer>
    );
  }

  return (
    <FeedContainer
      style={
        isOnlyLesson2Blocked
          ? { marginTop: Math.max(height * 0.02, 20) }
          : undefined
      }
    >
      <LessonContainer>
        <IconLesson
          resizeMode="contain"
          source={getLessonIcon(lesson.lesson)}
          style={
            isOnlyLesson2Blocked && String(lesson.lesson) === '1'
              ? {
                  width: compactLesson1IconWidth,
                  height: compactLesson1IconHeight,
                  marginBottom: 8,
                }
              : undefined
          }
        />
      </LessonContainer>

      <Background
        resizeMode="contain"
        source={Bg}
        style={
          isOnlyLesson2Blocked && String(lesson.lesson) === '1'
            ? {
                height: compactLesson1BoardHeight,
                marginBottom: 8,
              }
            : undefined
        }
      >
        <ItemContainer>
          {itens.map((item, index) => {
            const unlockKey = `${lesson.lesson}:${item.id}`;
            const isRecentlyUnlocked = recentlyUnlockedKey === unlockKey;

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
                  title={item.title}
                  icon={item.icon}
                  content={item.content}
                  isActive={isItemActive(lesson, index)}
                  practiceRoute={item.practiceRoute}
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