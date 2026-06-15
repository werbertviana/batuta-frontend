import styled from 'styled-components/native';
import FastImage from 'react-native-fast-image';
import { Animated } from 'react-native';

export const TouchableButton = styled.TouchableOpacity`
    align-items: center;
    justify-content: center;
`;

export const ButtonOuterCircle = styled.View`
    width: 130px;
    height: 130px;
    border-radius: 65px;

    background-color: #FFFFFF;

    border-width: 8px;
    border-color: #D2D3D5;

    align-items: center;
    justify-content: center;
`;

export const ButtonInnerArea = styled.View`
    width: 96px;
    height: 96px;

    align-items: center;
    justify-content: center;

    position: relative;
`;

export const ButtonDepthCircle = styled.View`
    position: absolute;

    width: 92px;
    height: 92px;
    border-radius: 46px;

    top: 5px;

    background-color: ${({ isActive }) => (isActive ? '#1F6D7A' : '#A8A8A8')};
`;

export const ButtonFaceAnimated = styled(Animated.View)`
    position: absolute;

    top: -5px;

    width: 92px;
    height: 92px;

    align-items: center;
    justify-content: center;
`;

export const ButtonFaceCircle = styled.View`
    width: 92px;
    height: 92px;
    border-radius: 46px;

    background-color: ${({ isActive }) => (isActive ? '#3FB4C8' : '#CFCFCF')};

    align-items: center;
    justify-content: center;
`;

export const ButtonIcon = styled(FastImage)`
    width: 58px;
    height: 58px;
`;