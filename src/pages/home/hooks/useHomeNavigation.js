// src/screens/home/hooks/useHomeNavigation.js

const contentRouteMap = {
  '1': 'Introdução',
  '2': 'Pauta Musical',
  '3': 'Clave Musical',
  '4': 'Notas Musicais',
  '5': 'Figuras de Notas',
  '6': 'Figuras de Pausas',
  '7': 'Duração dos Valores',
  '8': 'Compasso Musical',
};

const practiceRouteMap = {
  Introdução: 'AtivIntro',
  'Pauta Musical': 'AtivPauta',
  'Clave Musical': 'AtivClave',
  'Notas Musicais': 'AtivNotas',
  'Figuras de Notas': 'AtivFigNotas',
  'Figuras de Pausas': 'AtivFigPausas',
  'Duração dos Valores': 'AtivDuracao',
  'Compasso Musical': 'AtivCompasso',
};

function useHomeNavigation({
  navigation,
  hasSeenTutorial,
  handlePopoverAnimationEnd,
}) {
  const handleNavigateContent = itemData => {
    if (!itemData) return;

    const contentKey = String(itemData.content ?? '');
    const routeName = contentRouteMap[contentKey] || itemData.title;

    handlePopoverAnimationEnd();

    if (!routeName) return;

    if (!hasSeenTutorial('content')) {
      navigation.navigate('Tutorial', {
        tutorialKey: 'content',
        returnTo: routeName,
        returnParams: {
          content: contentKey,
        },
        resetAfterFinish: false,
      });

      return;
    }

    navigation.navigate(routeName, {
      content: contentKey,
    });
  };

  const handleNavigatePractice = itemData => {
    if (!itemData) return;

    const routeName =
      itemData.practiceRoute ||
      practiceRouteMap[itemData.title];

    handlePopoverAnimationEnd();

    if (!routeName) return;

    if (!hasSeenTutorial('activity')) {
      navigation.navigate('Tutorial', {
        tutorialKey: 'activity',
        returnTo: routeName,
        resetAfterFinish: false,
      });

      return;
    }

    navigation.navigate(routeName);
  };

  return {
    handleNavigateContent,
    handleNavigatePractice,
  };
}

export default useHomeNavigation;