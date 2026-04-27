import styled from 'styled-components/native';

export const SkipView = styled.TouchableOpacity`
  width: 40%;
  height: 60px;
  justify-content: center;
  align-items: center;
  border-radius: 12px;
  border-color: ${({ disabled }) => (disabled ? '#CFCFCF' : '#D2D3D5')};
  background-color: ${({ isDisabled }) => (isDisabled ? '#F1F1F1' : '#FFFFFF')};
  border-width: 2px;
  border-bottom-width: 4px;
`;

export const SkipContent = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

export const SkipText = styled.Text`
  font-family: GothamCondensed-Medium;
  text-align: center;
  color: ${({ disabled }) => (disabled ? '#9A9A9A' : '#000000')};
  font-size: 30px;
`;

export const SkipDivider = styled.View`
  width: 2px;
  height: 26px;
  background-color: ${({ disabled }) => (disabled ? '#CFCFCF' : '#D2D3D5')};
  margin-horizontal: 10px;
`;

export const SkipCounter = styled.Text`
  font-family: GothamCondensed-Medium;
  text-align: center;
  color: ${({ disabled }) => (disabled ? '#9A9A9A' : '#3CB6CC')};
  font-size: 26px;
`;