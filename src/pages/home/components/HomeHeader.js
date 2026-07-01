// src/screens/home/components/HomeHeader.js

import React from 'react';

import Header from '../../../components/header/Header';

function HomeHeader({
  xpPoints,
  batutaPoints,
  lifePoints,
}) {
  return (
    <Header
      xpPoints={xpPoints}
      batutaPoints={batutaPoints}
      lifePoints={lifePoints}
    />
  );
}

export default React.memo(HomeHeader);