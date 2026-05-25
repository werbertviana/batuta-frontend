// src/navigation/StackNavigation.js

import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

// Auth
import LoginScreen from '../screens/auth/LoginScreen';
import SignupScreen from '../screens/auth/SignupScreen';
import ForgotPasswordScreen from '../screens/auth/ForgotPasswordScreen';
import ResetPasswordScreen from '../screens/auth/ResetPasswordScreen';

// Home / Tabs
import Home from '../pages/home/Home';
import TabNavigation from './TabNavigation';

// Conteúdos Lição 01
import Introducao from '../pages/conteudo/licao01/introducao/Introducao';
import Notas from '../pages/conteudo/licao01/notas/Notas';
import Pauta from '../pages/conteudo/licao01/pauta/Pauta';
import Clave from '../pages/conteudo/licao01/clave/Clave';

// Conteúdos Lição 02
import FigurasNotas from '../pages/conteudo/licao02/figuras-notas/FigurasNotas';
import FigurasPausas from '../pages/conteudo/licao02/figuras-pausas/FigurasPausas';
import DuracaoValores from '../pages/conteudo/licao02/duracao-valores/DuracaoValores';
import Compasso from '../pages/conteudo/licao02/compasso/Compasso';

// Bônus
import BonusClave from '../pages/bonus/licao01/clave/BonusClave';

// Atividades Lição 01
import AtivIntro from '../pages/atividades/licao01/introducao/AtivIntro';
import AtivNotas from '../pages/atividades/licao01/notas/AtivNotas';
import AtivClave from '../pages/atividades/licao01/clave/AtivClave';
import AtivPauta from '../pages/atividades/licao01/pauta/AtivPauta';

// Atividades Lição 02
import AtivFigNotas from '../pages/atividades/licao02/figuras-notas/AtivFigNotas';
import AtivFigPausas from '../pages/atividades/licao02/figuras-pausas/AtivFigPausas';
import AtivDuracao from '../pages/atividades/licao02/duracao-valores/AtivDuracao';
import AtivCompasso from '../pages/atividades/licao02/compasso/AtivCompasso';

// Resultado
import ResumoAtividade from '../pages/resumoAtividade/ResumoAtividade';
import GameOver from '../pages/gameOver/GameOver';

const Stack = createStackNavigator();

function StackNavigation() {
  return (
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{ headerShown: false }}
    >
      {/* Auth */}
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />

      {/* Home / Tabs */}
      <Stack.Screen name="Tab" component={TabNavigation} />
      <Stack.Screen name="Home" component={Home} />

      {/* Conteúdos Lição 01 */}
      <Stack.Screen name="Introdução" component={Introducao} />
      <Stack.Screen name="Pauta Musical" component={Pauta} />
      <Stack.Screen name="Notas Musicais" component={Notas} />
      <Stack.Screen name="Clave Musical" component={Clave} />

      {/* Conteúdos Lição 02 */}
      <Stack.Screen name="Figuras de Notas" component={FigurasNotas} />
      <Stack.Screen name="Figuras de Pausas" component={FigurasPausas} />
      <Stack.Screen name="Duração dos Valores" component={DuracaoValores} />
      <Stack.Screen name="Compasso Musical" component={Compasso} />

      {/* Bônus */}
      <Stack.Screen name="BonusClave" component={BonusClave} />

      {/* Atividades Lição 01 */}
      <Stack.Screen name="AtivIntro" component={AtivIntro} />
      <Stack.Screen name="AtivPauta" component={AtivPauta} />
      <Stack.Screen name="AtivNotas" component={AtivNotas} />
      <Stack.Screen name="AtivClave" component={AtivClave} />

      {/* Atividades Lição 02 */}
      <Stack.Screen name="AtivFigNotas" component={AtivFigNotas} />
      <Stack.Screen name="AtivFigPausas" component={AtivFigPausas} />
      <Stack.Screen name="AtivCompasso" component={AtivCompasso} />
      <Stack.Screen name="AtivDuracao" component={AtivDuracao} />

      {/* Resultado */}
      <Stack.Screen name="ResumoAtividade" component={ResumoAtividade} />
      <Stack.Screen name="GameOver" component={GameOver} />
    </Stack.Navigator>
  );
}

export default StackNavigation;