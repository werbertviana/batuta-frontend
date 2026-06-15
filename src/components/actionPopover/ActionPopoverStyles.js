import styled from 'styled-components/native';

export const ActionPopoverContainer = styled.View`
    position: absolute;

    width: 280px;

    background-color: #1F6D7A;
    border-radius: 12px;

    padding: 16px;

    z-index: 9999;
    elevation: 9999;

    shadow-color: #000;
    shadow-offset: 0px 8px;
    shadow-opacity: 0.25;
    shadow-radius: 12px;
`;

export const ActionPopoverPointer = styled.View`
    position: absolute;

    top: -10px;
    left: 50%;

    width: 20px;
    height: 20px;

    background-color: #1F6D7A;

    transform: rotate(45deg);
`;

export const ActionButtonPrimary = styled.TouchableOpacity`
    width: 100%;
    height: 56px;

    background-color: #49BCD4;

    border-radius: 8px;

    border-bottom-width: 6px;
    border-bottom-color: #AEE7F2;

    align-items: center;
    justify-content: center;

    margin-bottom: 14px;
`;

export const ActionButtonSecondary = styled.TouchableOpacity`
    width: 100%;
    height: 56px;

    background-color: #FFFFFF;

    border-radius: 8px;

    border-bottom-width: 6px;
    border-bottom-color: #DDDDDD;

    align-items: center;
    justify-content: center;
`;

export const ActionButtonTextPrimary = styled.Text`
    color: #FFFFFF;

    font-size: 30px;
    font-family: GothamCondensed-Medium;
`;

export const ActionButtonTextSecondary = styled.Text`
    color: #2FAFC4;

    font-size: 30px;
    font-family: GothamCondensed-Medium;
`;