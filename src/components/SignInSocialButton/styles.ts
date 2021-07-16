import styled from "styled-components/native";
import { RectButton } from "react-native-gesture-handler";
import { RFValue } from "react-native-responsive-fontsize";

export const Button = styled(RectButton)`
  flex-direction: row;
  align-items: center;

  background-color: ${({theme}) => theme.colors.shape};

  width: ${RFValue(311)}px;
  height: ${RFValue(56)}px;
  margin-bottom: 16px;
  
  border-radius: 5px;
`;
export const ImageContainer = styled.View`
  height: 100%;
  justify-content: center;
  align-items: center;

  padding: ${RFValue(16)}px;
  border-color: ${({theme}) => theme.colors.background};
  border-right-width: 1px;
`;
export const Text = styled.Text`
  flex: 1;
  text-align: center;

  font-family: ${({theme}) => theme.fonts.medium};
  font-size: ${RFValue(14)}px;
`;