// src/screens/home/components/HomeModals.js

import React from 'react';

import BonusLifeModal from '../../../components/modal/BonusLifeModal';
import EloUpModal from '../../../components/modal/EloUpModal';

function HomeModals({
  bonusModal,
  eloModal,
}) {
  return (
    <>
      <BonusLifeModal
        {...bonusModal}
      />

      <EloUpModal
        {...eloModal}
      />
    </>
  );
}

export default React.memo(HomeModals);