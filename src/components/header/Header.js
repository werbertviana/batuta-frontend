// src/components/header/Header.js

import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../contexts/AuthContext';

import Feather from 'react-native-vector-icons/Feather';

import {
  HeaderContainer,
  LifeImage,
  LogoImage,
  BatutasImage,
  XpImage,
  BatutasContainer,
  XpContainer,
  LifeContainer,
  BatutaText,
  XpText,
  LifeText,
  LogoutButton,
} from './HeaderStyles';

import Logo from '../../assets/icons/logo.png';
import Life from '../../assets/icons/life.png';
import Batutas from '../../assets/icons/batutas.png';
import Xp from '../../assets/icons/xp.png';

const Header = ({
  xpPoints = 0,
  batutaPoints = 0,
  lifePoints = 2,
}) => {
  const navigation = useNavigation();

  const { logout } = useAuth();

  const handleLogout = () => {
    logout();

    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };

  return (
    <HeaderContainer>
      <LogoImage source={Logo} />

      <BatutasContainer>
        <BatutasImage source={Batutas} />

        <BatutaText>
          {batutaPoints}
        </BatutaText>
      </BatutasContainer>

      <XpContainer>
        <XpImage source={Xp} />

        <XpText>
          {xpPoints}
        </XpText>
      </XpContainer>

      <LifeContainer>
        <LifeImage source={Life} />

        <LifeText>
          {lifePoints}
        </LifeText>
      </LifeContainer>

      <LogoutButton
        activeOpacity={0.75}
        onPress={handleLogout}
      >
        <Feather
          name="log-out"
          size={26}
          color="#34b1c7"
        />
      </LogoutButton>
    </HeaderContainer>
  );
};

export default Header;