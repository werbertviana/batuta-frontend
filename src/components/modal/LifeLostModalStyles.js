import styled from 'styled-components/native';

export const Overlay = styled.View`
  flex: 1;
  background-color: rgba(0, 0, 0, 0.6);
  justify-content: center;
  align-items: center;
`;

export const Container = styled.View`
  width: 85%;
  padding: 24px;
  background-color: #ffffff;
  border-radius: 20px;
  elevation: 8;
`;

export const Title = styled.Text`
  font-family: 'GothamCondensed-Bold';
  font-size: 30px;
  text-align: center;
  color: #e74c3c;
  margin-bottom: 12px;
`;

export const Message = styled.Text`
  font-family: 'GothamCondensed-Book';
  font-size: 25px;
  text-align: center;
  color: #555555;
`;

export const Message2 = styled.Text`
  font-family: 'GothamCondensed-Medium';
  font-size: 25px;
  text-align: center;
  color: #555555;
`;

export const Button = styled.TouchableOpacity`
  margin-top: 24px;
  height: 52px;
  border-radius: 12px;
  background-color: #34b1c7;
  justify-content: center;
  align-items: center;
  border-bottom-width: 4px;
  border-left-width: 0.5px;
  border-right-width: 0.5px;
  border-color: #236a79;
`;

export const Divider = styled.View`
  height: 2px;
  background-color: #e0e0e0;
  margin-top: 16px;
  margin-bottom: 12px;
`;

export const ActionButton = styled.TouchableOpacity`
  flex: 1;
  height: 52px;
  justify-content: center;
  align-items: center;
  margin-left: 15px;
  border-radius: 12px;
  border-bottom-width: 4px;
  border-left-width: 0.005px;
  border-right-width: 0.005px;
  border-color: #236a79;
  background-color: #3cb1c7;
  padding: 4px;
`;

export const ActionButton2 = styled.TouchableOpacity`
  flex: 1;
  height: 52px;
  justify-content: center;
  align-items: center;
  border-radius: 12px;
  border-bottom-width: 4px;
  border-color: #D2D3D5;
  background-color: #FFFFFF;
  border-width: 2px;
  border-bottom-width: 4px;
`;

export const ActionButtonText = styled.Text`
  font-family: 'GothamCondensed-Medium';
  font-size: 20px;
  color: #ffffff;
`;

export const ActionButtonText2 = styled.Text`
  font-family: 'GothamCondensed-Medium';
  font-size: 20px;
  color: black;
`;

export const ButtonsRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-top: 4px;
`;