import React, { useMemo } from 'react';
import { ScrollView } from 'react-native';
import { useAuth } from '../../contexts/AuthContext';

import {
  Container,
  Content,
  HeaderImage,
  CurrentSection,
  CurrentIcon,
  DividerVertical,
  CurrentInfo,
  CurrentEloBox,
  CurrentEloTitleImage,
  CurrentDescription,
  Separator,
  SectionTitle,
  ElosGridImage,
  ArrowLine,
  Arrow,
  FactorsTitle,
  ProgressaoDesempenhoImage,
} from './ElosStyles';

const elosHeader = require('../../assets/images/elos/elos.png');
const elosGrid = require('../../assets/images/elos/elos_grid.png');
const progressaoDesempenho = require('../../assets/images/elos/progressao_desempenho.png');

const iconFerro = require('../../assets/images/elos/ferro.png');
const iconBronze = require('../../assets/images/elos/bronze.png');
const iconPrata = require('../../assets/images/elos/prata.png');
const iconOuro = require('../../assets/images/elos/ouro.png');
const iconPlatina = require('../../assets/images/elos/platina.png');
const iconDiamante = require('../../assets/images/elos/diamante.png');
const iconMaestro = require('../../assets/images/elos/maestro.png');

const tituloFerro = require('../../assets/images/elos/titulo_ferro.png');
const tituloBronze = require('../../assets/images/elos/titulo_bronze.png');
const tituloPrata = require('../../assets/images/elos/titulo_prata.png');
const tituloOuro = require('../../assets/images/elos/titulo_ouro.png');
const tituloPlatina = require('../../assets/images/elos/titulo_platina.png');
const tituloDiamante = require('../../assets/images/elos/titulo_diamante.png');
const tituloMaestro = require('../../assets/images/elos/titulo_maestro.png');

const ELOS = [
  {
    key: 'ferro',
    image: iconFerro,
    titleImage: tituloFerro,
    description:
      'Parabéns! Toda jornada tem um começo e você deu o primeiro passo rumo ao conhecimento musical',
  },
  {
    key: 'bronze',
    image: iconBronze,
    titleImage: tituloBronze,
    description:
      'Você está evoluindo e começando a fortalecer sua base musical.',
  },
  {
    key: 'prata',
    image: iconPrata,
    titleImage: tituloPrata,
    description:
      'Seu desempenho mostra constância e progresso nos estudos musicais.',
  },
  {
    key: 'ouro',
    image: iconOuro,
    titleImage: tituloOuro,
    description:
      'Você já demonstra domínio maior e dedicação na sua jornada musical.',
  },
  {
    key: 'platina',
    image: iconPlatina,
    titleImage: tituloPlatina,
    description:
      'Seu conhecimento musical está ficando cada vez mais refinado.',
  },
  {
    key: 'diamante',
    image: iconDiamante,
    titleImage: tituloDiamante,
    description:
      'Você alcançou um nível avançado de desempenho no Batuta.',
  },
  {
    key: 'maestro',
    image: iconMaestro,
    titleImage: tituloMaestro,
    description:
      'Excelente! Você chegou ao mais alto nível da jornada musical.',
  },
];

function normalizeElo(elo) {
  return String(elo || 'ferro').toLowerCase();
}

export default function Elos() {
  const { user } = useAuth();

  const currentEloKey = normalizeElo(user?.elo);

  const currentElo = useMemo(() => {
    return ELOS.find(item => item.key === currentEloKey) || ELOS[0];
  }, [currentEloKey]);

  return (
    <Container>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24 }}
      >
        <Content>
          <HeaderImage source={elosHeader} resizeMode="contain" />

          <CurrentSection>
            <CurrentIcon source={currentElo.image} resizeMode="contain" />

            <DividerVertical />

            <CurrentInfo>
              <CurrentEloBox>
                <CurrentEloTitleImage
                  source={currentElo.titleImage}
                  resizeMode="contain"
                />
              </CurrentEloBox>

              <CurrentDescription>{currentElo.description}</CurrentDescription>
            </CurrentInfo>
          </CurrentSection>

          <Separator />

          <SectionTitle>
            O jogo divide os jogadores em 7 níveis de escalonamento (Elos)
          </SectionTitle>

          <ElosGridImage source={elosGrid} resizeMode="contain" />

          <ArrowLine>
            <Arrow />
          </ArrowLine>

          <FactorsTitle>
            Para determinar o posicionamento são utilizados dois fatores:
          </FactorsTitle>

          <ProgressaoDesempenhoImage
            source={progressaoDesempenho}
            resizeMode="contain"
          />
        </Content>
      </ScrollView>
    </Container>
  );
}