import styled from 'styled-components/native';
import FastImage from 'react-native-fast-image';
import { Animated } from 'react-native';

export const TouchableFeedItem = styled.TouchableOpacity`
    margin-top: 42px;
    align-items: center;
    position: relative;
`;

export const FloatingTitleView = styled(Animated.View)`
    position: absolute;
    top: -24px;
    width: 270px;
    align-items: center;
    z-index: 10;
`;

export const TitleView = styled.SafeAreaView`
    position: relative;
    justify-content: center;
    align-items: center;

    border-radius: 8px;
    background-color: #FFFFFF;

    border-color: #CCCCCC;
    border-width: 2px;
    border-bottom-width: 4px;

    padding-vertical: 4px;
    padding-horizontal: 14px;
`;

export const TitlePointer = styled.View`
    position: absolute;
    bottom: -9px;
    align-self: center;

    width: 14px;
    height: 14px;

    background-color: #FFFFFF;

    border-right-width: 3px;
    border-bottom-width: 3px;

    border-right-color: #CCCCCC;
    border-bottom-color: #CCCCCC;
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

export const ButtonDepthImage = styled(FastImage)`
    position: absolute;

    width: 92px;
    height: 92px;

    top: 18px;
`;

export const ButtonFaceAnimated = styled(Animated.View)`
    position: absolute;

    top: -5px;

    width: 92px;
    height: 92px;

    align-items: center;
    justify-content: center;
`;

export const ButtonFaceImage = styled(FastImage)`
    width: 92px;
    height: 92px;
`;

export const TextFeedTitle = styled.Text`
    font-size: 28px;
    font-family: GothamCondensed-Medium;
    z-index: 2;
`;