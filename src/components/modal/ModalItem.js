import React from 'react';
import { TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import {
  ModalContainer,
  ContentView,
  PracticeView,
  ContentText,
  PracticeText,
  XPText,
  IconImage,
} from './ModalItemStyles';

const iconMap = {
  Introdução: require('../../assets/icons/introducao.png'),
  'Notas Musicais': require('../../assets/icons/notas.png'),
  'Pauta Musical': require('../../assets/icons/pauta.png'),
  'Clave Musical': require('../../assets/icons/clave.png'),
  'Figuras de Notas': require('../../assets/icons/figuras_notas.png'),
  'Figuras de Pausas': require('../../assets/icons/pausas.png'),
  'Duração dos Valores': require('../../assets/icons/valores.png'),
  'Compasso Musical': require('../../assets/icons/compasso.png'),
};

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

const getIcon = (title) => iconMap[title] || iconMap.Introdução;

function ModalItem({ onClose, title, practiceRoute, content }) {
  const navigation = useNavigation();

  const handleContentPress = () => {
    onClose();

    const contentKey = String(content ?? '');
    const routeName = contentRouteMap[contentKey] || title;

    if (!routeName) return;

    navigation.navigate(routeName, { content: contentKey });
  };

  const handlePracticePress = () => {
    onClose();

    const routeName = practiceRoute || practiceRouteMap[title];

    if (!routeName) return;

    navigation.navigate(routeName);
  };

  return (
    <ModalContainer>
      <IconImage source={getIcon(title)} resizeMode="contain" />

      <TouchableOpacity activeOpacity={0.8} onPress={handleContentPress}>
        <ContentView>
          <ContentText>CONTEÚDO</ContentText>
        </ContentView>
      </TouchableOpacity>

      <TouchableOpacity activeOpacity={0.8} onPress={handlePracticePress}>
        <PracticeView>
          <PracticeText>
            PRATICAR + <XPText>XP</XPText>
          </PracticeText>
        </PracticeView>
      </TouchableOpacity>
    </ModalContainer>
  );
}

export default ModalItem;