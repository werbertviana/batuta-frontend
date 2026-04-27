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
  font-size: 28px;
  text-align: center;
  color: #333333;
  margin-bottom: 16px;
`;

export const MessageContainer = styled.View`
  margin-bottom: 18px;
`;

export const MessageText = styled.Text`
  font-family: 'GothamCondensed-Medium';
  font-size: 22px;
  text-align: center;
  color: ${({ variant }) => (variant === 'success' ? '#27ae60' : '#e74c3c')};
  margin-bottom: 6px;
`;

export const MessageSubText = styled.Text`
  font-family: 'GothamCondensed-Book';
  font-size: 20px;
  text-align: center;
  color: #333333;
`;

export const InfoBox = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding-vertical: 8px;
`;

export const InfoLabel = styled.Text`
  font-family: 'GothamCondensed-Medium';
  font-size: 22px;
  color: #333333;
`;

export const InfoValue = styled.Text`
  font-family: 'GothamCondensed-Medium';
  font-size: 22px;
  color: #333333;
`;

export const InfoIcon = styled.Image`
  width: 22px;
  height: 22px;
  margin-left: 8px;
`;

export const PercentText = styled(InfoValue)`
  color: #27ae60;
`;

export const XPValue = styled.Text`
  font-family: 'GothamCondensed-Medium';
  font-size: 20px;
  color: #333333;
`;

export const Divider = styled.View`
  height: 2px;
  background-color: #e0e0e0;
  margin-top: 10px;
  margin-bottom: 12px;
`;

export const Divider2 = styled.View`
  height: 2px;
  background-color: #e0e0e0;
  margin-top: 4px;
  margin-bottom: 4px;
`;

export const ButtonsRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-top: 4px;
`;

export const ActionButton = styled.TouchableOpacity`
  flex: 1;
  height: 52px;
  justify-content: center;
  align-items: center;
  margin-right: 15px;
  border-radius: 12px;
  border-bottom-width: 4px;
  border-left-width: 0.005px;
  border-right-width: 0.005px;
  border-color: #7a477c;
  background-color: #af74b0;
`;

export const ActionButton2 = styled.TouchableOpacity`
  flex: 1;
  height: 52px;
  justify-content: center;
  align-items: center;
  border-radius: 12px;
  border-bottom-width: 4px;
  border-left-width: 0.005px;
  border-right-width: 0.005px;
  border-color: #236a79;
  background-color: #3cb1c7;
`;

export const ActionButtonText = styled.Text`
  font-family: 'GothamCondensed-Medium';
  font-size: 28px;
  color: #ffffff;
`;
