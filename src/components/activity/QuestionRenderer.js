// src/components/activity/QuestionRenderer.js

import React from 'react';
import { View } from 'react-native';

import {
  AlternativasContainer,
  QuestaoText,
} from './activityStyles';

import AlternativeText from './AlternativeText';
import AlternativeImage from './AlternativeImage';

function QuestionRenderer({
  questao,
  respostaSelecionada,
  onSelect,
  disabled,
  imageMap,
  activityStyles = {},
}) {
  const tipoRaw =
    typeof questao?.tipo === 'string'
      ? questao.tipo.toLowerCase()
      : '';

  const tipo = tipoRaw === 'texto' ? 'texto' : 'figura';

  const QuestionTextComponent = activityStyles.QuestaoText || QuestaoText;

  const AlternativesContainerComponent =
    activityStyles.AlternativasContainer || AlternativasContainer;

  return (
    <View>
      <QuestionTextComponent>{questao.questao}</QuestionTextComponent>

      <AlternativesContainerComponent
        style={
          tipo === 'texto'
            ? {
                flexDirection: 'column',
                flexWrap: 'nowrap',
                justifyContent: 'flex-start',
              }
            : null
        }
      >
        {questao.opcoes.map((item) =>
          tipo === 'texto' ? (
            <AlternativeText
              key={item.alternativa}
              alternativa={item.alternativa}
              texto={item.texto}
              selected={respostaSelecionada === item.alternativa}
              onPress={() => onSelect(item.alternativa)}
              disabled={disabled}
              activityStyles={activityStyles}
            />
          ) : (
            <AlternativeImage
              key={item.alternativa}
              alternativa={item.alternativa}
              imagem={item.imagem}
              imageMap={imageMap}
              selected={respostaSelecionada === item.alternativa}
              onPress={() => onSelect(item.alternativa)}
              disabled={disabled}
              activityStyles={activityStyles}
            />
          ),
        )}
      </AlternativesContainerComponent>
    </View>
  );
}

export default QuestionRenderer;