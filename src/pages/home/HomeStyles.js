import styled from 'styled-components/native';
import { Dimensions } from 'react-native'; 
import FastImage from 'react-native-fast-image';


const { width } = Dimensions.get('window'); // Pegando as dimensões da tela

export const HomeContainer = styled.SafeAreaView`
    flex: 1;
    background-color: #ffffff;
`;

export const FeedContainer = styled.SafeAreaView`
    flex: 1;
    background-color: #ffffff;
    justify-content: center;
    align-items: center;
    margin-top: 20px;
`;

export const Background = styled.ImageBackground`
    width: ${width}px;  
    height: 455px;
    justify-content: center;
    align-items: center;
    margin-bottom: 20px; 
`;

export const ItemContainer = styled.SafeAreaView`
    justify-content: center;
    align-items: center; 
    flex-direction: row;
    flex-wrap: wrap;
`;

export const IconLesson = styled(FastImage)`
    width: 260px;
    height: 100px; 
`;

export const LessonContainer = styled.SafeAreaView`
    width: 100%;
    align-items: center;
    justify-content: center;
    margin-bottom: 16px;
`;

export const DivisorLine = styled.SafeAreaView`
  width: 90%;
  height: 3px;
  background-color: #D2D3D5;
  border-radius: 5px;
  align-items: center;
`;  

