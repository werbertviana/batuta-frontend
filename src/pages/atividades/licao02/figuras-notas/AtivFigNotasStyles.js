import styled from 'styled-components/native';
import FastImage from 'react-native-fast-image';
import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const cardWidth = Math.min(width * 0.55, 160);
const cardHeight = Math.min(height * 0.27, 230);

export const AtivContainer = styled.SafeAreaView`
    flex: 1;
    background-color: #ffffff;
    align-items: center;
`;

export const ContentContainer = styled.View`
    flex: 1;
    width: 100%;
    padding-horizontal: 10px;
`;

export const AlternativasContainer = styled.View`
    width: 100%;
    align-items: center;
    justify-content: center;
    flex-direction: row;
    flex-wrap: wrap;
    margin-top: 8px;
`;

export const AlternativaContainer = styled.TouchableOpacity`
    align-items: center;
    width: ${cardWidth}px;
    height: ${cardHeight}px;
    border-radius: 12px;
    border-color: #D2D3D5;
    background-color: #FFFFFF;
    border-width: 4px;
    margin: 6px;
`;

export const AlternativaContainer2 = styled.TouchableOpacity`
    justify-content: center;
    align-items: center;
    width: ${Math.min(width * 0.86, 350)}px;
    min-height: ${Math.min(Math.max(height * 0.11, 105), 110)}px;
    border-radius: 12px;
    border-color: #D2D3D5;
    background-color: #FFFFFF;
    border-width: 4px;
    margin-vertical: 6px;
    padding-vertical: 10px;
    padding-horizontal: 18px;
    position: relative;
`;

export const CircleContainer = styled.SafeAreaView`
    align-self: flex-start;
    align-items: center;
    position: absolute;
    justify-content: center;
    width: 28px;
    height: 28px;
    border-radius: 100px;
    border-color: #D2D3D5;
    background-color: #FFFFFF;
    border-width: 4px;
    top: 6px;
    left: 6px;
    z-index: 2;
`;

export const CircleInline = styled.SafeAreaView`
    position: absolute;
    left: 6px;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    border-radius: 100px;
    border-color: #D2D3D5;
    background-color: #FFFFFF;
    border-width: 4px;
`;

export const ImageContainer = styled.SafeAreaView`
    width: 100%;
    height: 100%;
    align-items: center;
    justify-content: center;
    padding: 8px;
`;

export const ButtonContainer = styled.SafeAreaView`
    width: 100%;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
    padding-horizontal: 12px;
    padding-bottom: 22px;
`;

export const SkipView = styled.TouchableOpacity`
    width: 40%;
    height: 56px;
    justify-content: center;
    align-items: center;
    border-radius: 12px;
    border-color: #D2D3D5;
    background-color: #FFFFFF;
    border-width: 1px;
    border-bottom-width: 4px;
`;

export const NextView = styled.TouchableOpacity`
    width: 40%;
    height: 56px;
    justify-content: center;
    align-items: center;
    border-radius: 12px;
    background-color: #61BE4B;
    border-bottom-width: 4px;
    border-color: #38752B;
    border-left-width: 0.005px;
    border-right-width: 0.005px;
`;

export const NivelContainer = styled.SafeAreaView`
    margin-top: 4px;
    margin-bottom: 2px;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    min-height: 36px;
`;

export const DivisorLine = styled.SafeAreaView`
    width: 90%;
    height: 2px;
    background-color: #D2D3D5;
    border-radius: 5px;
    align-items: center;
    justify-content: center;
`;

export const ImageIcon = styled(FastImage)`
    position: absolute;
    width: 35px;
    height: 35px;
`;

export const Text02 = styled.Text`
    font-family: GothamCondensed-Medium;
    text-align: center;
    color: black;
    font-size: 21px;
`;

export const Text01 = styled.Text`
    font-family: GothamCondensed-Medium;
    text-align: center;
    color: white;
    font-size: 22px;
`;

export const QuestaoText = styled.Text`
    font-family: GothamCondensed-Medium;
    text-align: center;
    color: black;
    font-size: ${Math.min(width * 0.065, 26)}px;
    line-height: ${Math.min(width * 0.075, 30)}px;
    padding-horizontal: 16px;
    margin-top: 2px;
`;

export const AlternativaText = styled.Text`
    font-family: GothamCondensed-Medium;
    text-align: center;
    color: black;
    font-size: 20px;
    width: 100%;
    padding-left: 22px;
`;

export const ImageAlternativa = styled(FastImage)`
    width: ${Math.min(cardWidth * 0.68, 88)}px;
    height: ${Math.min(cardHeight * 0.78, 165)}px;
`;

export const ImageAlternativa2 = styled(FastImage)`
    width: 280px;
    height: 100px;
`;