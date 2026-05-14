// src/components/header/HeaderStyles.js

import styled from 'styled-components/native';
import FastImage from 'react-native-fast-image';

export const HeaderContainer = styled.SafeAreaView`
    height: 60px;
    flex-direction: row;
    align-items: center;
    justify-content: space-around;
    background-color: #ffffff;
    border-bottom-width: 1px;
    border-bottom-color: #D2D3D5;
`;

export const BatutasContainer = styled.SafeAreaView`
    flex-direction: row;
    align-items: center;
    justify-content: center;
`;

export const XpContainer = styled.SafeAreaView`
    flex-direction: row;
    align-items: center;
    justify-content: center;
`;

export const LifeContainer = styled.SafeAreaView`
    flex-direction: row;
    justify-content: center;
    align-items: center;
`;

export const LogoImage = styled(FastImage)`
    width: 35px;
    height: 35px;
`;

export const BatutasImage = styled(FastImage)`
    width: 35px;
    height: 35px;
`;

export const XpImage = styled(FastImage)`
    width: 35px;
    height: 35px;
`;

export const LifeImage = styled(FastImage)`
    width: 40px;
    height: 40px;
`;

export const BatutaText = styled.Text`
    font-family: DINRoundPro-Medi;
    font-size: 28px;
    color: #FC48A2;
    margin-left: 5px;
`;

export const LifeText = styled.Text`
    font-family: DINRoundPro-Medi;
    font-size: 28px;
    margin-left: 5px;
    color: #FC4848;
`;

export const XpText = styled.Text`
    font-family: DINRoundPro-Medi;
    font-size: 28px;
    margin-left: 5px;
    color: #FDC500;
`;

export const LogoutButton = styled.TouchableOpacity`
    padding: 6px;
    align-items: center;
    justify-content: center;
`;