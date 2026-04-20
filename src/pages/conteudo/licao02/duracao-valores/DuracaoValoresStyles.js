import styled from 'styled-components/native';
import FastImage from 'react-native-fast-image';

export const HeaderContainer = styled.SafeAreaView`
    width: 100%;
    justify-content: center;
    align-items: center;
    margin-top: 2%;
    padding-bottom: 6px;
    border-bottom-width: 1px;
    border-bottom-color: #D2D3D5;
    background-color: #FFFFFF;
`;

export const Container = styled.SafeAreaView`
    flex: 1;
    width: 100%;
    align-items: center;
    justify-content: flex-start;
    background-color: #FFFFFF;
`;

export const SlideView = styled.SafeAreaView`
    width: 100%;
    height: 65%;
    align-items: center;
    justify-content: center;
`;

export const FlatView = styled.SafeAreaView`
    width: 100%;
    align-items: center;
    justify-content: center;
`;

export const SlideView2 = styled.SafeAreaView`
    width: 100%;
    height: 55%;
    align-items: center;
    justify-content: center;
`;

export const SlideView3 = styled.SafeAreaView`
    height: 90px;
    width: 100%;
    flex-direction: row;
    align-items: center;
    justify-content: space-around;
`;

export const Div = styled.SafeAreaView`
    width: 100%;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    padding-left: 12px;
    padding-right: 12px;
`;

export const DivFinal = styled.SafeAreaView`
    width: 100%;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    margin-bottom: 15px;
    padding-left: 12px;
    padding-right: 12px;
`;

export const DivisorLine2 = styled.SafeAreaView`
    margin-top: 10px;
    width: 100%;
    height: 2px;
    background-color: #D2D3D5;
    border-radius: 5px;
    align-items: center;
    justify-content: center;
`;

export const TouchableHeader = styled.TouchableOpacity`
    position: absolute;
    left: 3%;
    align-self: flex-start;
`;

export const ImageIcon = styled(FastImage)`
    width: 35px;
    height: 35px;
`;

export const ImageTitle = styled(FastImage)`
    width: 225px;
    height: 80px;
`;

export const ImageSound = styled(FastImage)`
    width: 40px;
    height: 40px;
    margin-top: 2px;
    margin-bottom: 2px;
    margin-left: 10px;
    margin-right: 10px;
`;

export const DivisorLine = styled.SafeAreaView`
    width: 40%;
    height: 3px;
    background-color: #D2D3D5;
    border-radius: 5px;
    align-items: center;
`;