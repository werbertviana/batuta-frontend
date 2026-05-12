// =============================
// PROGRESS HELPERS - HOME
// =============================

/**
 * Soma todos os itens das lições anteriores
 */
export const getLessonTotalItemsBefore = (feeds, lessonNumber) => {
  return feeds
    .filter((lesson) => Number(lesson.lesson) < Number(lessonNumber))
    .reduce((total, lesson) => total + (lesson.items?.length || 0), 0);
};

/**
 * Retorna o index da lição atual com base no progressLevel
 */
export const getCurrentLessonIndex = (feeds, progressLevel) => {
  if (!feeds.length) return 0;

  let accumulatedItems = 0;

  for (let i = 0; i < feeds.length; i += 1) {
    const lesson = feeds[i];
    const totalItems = lesson.items?.length || 0;

    const lessonStartProgress = accumulatedItems + 1;
    const lessonEndProgress = accumulatedItems + totalItems;

    if (
      progressLevel >= lessonStartProgress &&
      progressLevel <= lessonEndProgress
    ) {
      return i;
    }

    accumulatedItems += totalItems;
  }

  return feeds.length - 1;
};

/**
 * Verifica se a lição está desbloqueada
 */
export const isLessonUnlocked = (feeds, lessonNumber, progressLevel) => {
  if (Number(lessonNumber) === 1) return true;

  const previousLessonsTotal = getLessonTotalItemsBefore(
    feeds,
    lessonNumber,
  );

  return progressLevel > previousLessonsTotal;
};

/**
 * Verifica se a lição está bloqueada
 */
export const isLessonBlocked = (feeds, lessonNumber, progressLevel) => {
  return !isLessonUnlocked(feeds, lessonNumber, progressLevel);
};

/**
 * Verifica se o item da lição está ativo (liberado)
 */
export const isItemActive = (feeds, lesson, index, progressLevel) => {
  const lessonNumber = Number(lesson.lesson);

  if (isLessonBlocked(feeds, lessonNumber, progressLevel)) return false;

  const previousLessonsTotal = getLessonTotalItemsBefore(
    feeds,
    lessonNumber,
  );

  const progressInLesson = Math.max(
    0,
    progressLevel - previousLessonsTotal,
  );

  const allowed = Math.min(progressInLesson, lesson.items.length);

  return index < allowed;
};

/**
 * Gera a chave do item desbloqueado para animação
 */
export const getUnlockKeyByProgressLevel = (feeds, targetProgressLevel) => {
  let count = 0;

  for (const lesson of feeds) {
    const items = lesson.items || [];

    for (const item of items) {
      count += 1;

      if (count === Number(targetProgressLevel)) {
        return `${lesson.lesson}:${item.id}`;
      }
    }
  }

  return null;
};