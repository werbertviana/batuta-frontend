import styled from 'styled-components/native';

export const LockedPopoverContainer = styled.View`
  width: 280px;

  background-color: #f4f4f4;
  border-width: 3px;
  border-color: #cfcfcf;
  border-radius: 12px;

  padding: 18px 16px 16px 16px;

  align-items: center;
`;

export const LockedPopoverPointer = styled.View`
  position: absolute;

  width: 22px;
  height: 22px;

  top: -13px;

  background-color: #f4f4f4;

  border-left-width: 3px;
  border-top-width: 3px;
  border-color: #cfcfcf;

  transform: rotate(45deg);
`;

export const LockedPopoverTitle = styled.Text`
  font-family: 'Souses';
  font-size: 26px;
  color: #6f6f6f;

  text-align: center;
  margin-bottom: 8px;
`;

export const LockedPopoverMessage = styled.Text`
  font-family: 'Souses';
  font-size: 20px;
  color: #777777;

  text-align: center;
  line-height: 25px;

  margin-bottom: 14px;
`;

export const LockedButton = styled.TouchableOpacity`
  width: 100%;
  height: 58px;

  border-radius: 8px;
  background-color: #bfc1c3;

  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

export const LockedButtonIconBox = styled.View`
  position: absolute;
  left: 18px;

  width: 32px;
  height: 32px;

  align-items: center;
  justify-content: center;
`;

export const LockedButtonText = styled.Text`
  font-family: 'Souses';
  font-size: 27px;
  color: #7a7a7a;

  text-align: center;
`;