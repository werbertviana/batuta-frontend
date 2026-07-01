// src/screens/home/components/HomeFeed.js

import React from 'react';
import { View } from 'react-native';

import HomeHeader from './HomeHeader';
import HomeLessonList from './HomeLessonList';

function HomeFeed({
  header,
  list,
  lesson,
}) {
  return (
    <View style={{ flex: 1 }}>
      <HomeHeader {...header} />

      <HomeLessonList
        {...list}
        lesson={lesson}
      />
    </View>
  );
}

export default React.memo(HomeFeed);