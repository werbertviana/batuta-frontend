// src/screens/home/helpers/homeLessonAssets.js

import Licao01 from '../../../assets/images/home/licao01_active.png';
import Licao02 from '../../../assets/images/home/licao02_active.png';
import Licao02Inactive from '../../../assets/images/home/licao02_inactive.png';

export const getLessonIcon = (lessonNumber, blocked = false) => {
  if (String(lessonNumber) === '1') return Licao01;

  if (String(lessonNumber) === '2') {
    return blocked ? Licao02Inactive : Licao02;
  }

  return blocked ? Licao02Inactive : Licao02;
};