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