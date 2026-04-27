import styled from 'styled-components/native';

const getBackgroundColor = (type) => {
  if (type === 'success') return '#2E7D32';
  if (type === 'error') return '#B3261E';
  if (type === 'info') return '#2F6FDB';
  return '#2F2F2F';
};

const getIconBackgroundColor = (type) => {
  if (type === 'success') return '#5AC85A';
  if (type === 'error') return '#FF5A5A';
  if (type === 'info') return '#6EA8FF';
  return '#FFC107';
};

export const ToastContainer = styled.View`
  position: absolute;
  bottom: 105px;
  align-self: center;
  flex-direction: row;
  align-items: center;
  background-color: ${({ type }) => getBackgroundColor(type)};
  padding-vertical: 12px;
  padding-horizontal: 18px;
  border-radius: 12px;
  min-width: 250px;
  elevation: 10;
  z-index: 99;
`;

export const ToastIconCircle = styled.View`
  width: 34px;
  height: 34px;
  border-radius: 17px;
  background-color: ${({ type }) => getIconBackgroundColor(type)};
  justify-content: center;
  align-items: center;
  margin-right: 12px;
`;

export const ToastIconText = styled.Text`
  color: #111111;
  font-size: 22px;
  font-family: 'GothamCondensed-Bold';
  line-height: 24px;
`;

export const ToastMessage = styled.Text`
  color: #ffffff;
  font-family: 'GothamCondensed-Medium';
  font-size: 22px;
`;