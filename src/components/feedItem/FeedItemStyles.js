import styled from 'styled-components/native';
import { Animated } from 'react-native';

export const TouchableFeedItem = styled.View`
    margin-top: 46px;
    align-items: center;
    position: relative;
`;

export const FloatingTitleView = styled(Animated.View)`
    position: absolute;
    top: -34px;
    width: 270px;
    align-items: center;
    z-index: 10;
`;

export const TitleView = styled.SafeAreaView`
    position: relative;
    justify-content: center;
    align-items: center;

    min-height: 52px;
    max-width: 180px;

    border-radius: 8px;
    background-color: #FFFFFF;

    border-color: #CCCCCC;
    border-width: 2px;
    border-bottom-width: 4px;

    padding-vertical: 4px;
    padding-horizontal: 12px;
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

export const TextFeedTitle = styled.Text`
    font-size: 28px;
    line-height: 26px;
    font-family: GothamCondensed-Medium;
    text-align: center;
    z-index: 2;
`;