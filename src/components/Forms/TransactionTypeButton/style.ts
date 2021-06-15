import styled, { css } from "styled-components/native";

import { TouchableOpacity } from 'react-native';

import { Feather } from "@expo/vector-icons"; 
import { RFValue } from "react-native-responsive-fontsize";

interface IconProps {
  type: 'up' | 'down';
}

interface ContainerProps {
  isActive: boolean;
  type: 'up' | 'down';
}

export const Container = styled(TouchableOpacity)<ContainerProps>`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  
  width: 48%;
  padding: 16px;

  border-radius: 5px;

  border-width: ${({isActive}) => isActive ? 0 : 1.5 }px;
  border-style: solid;
  border-color: ${({theme}) => theme.colors.text};

  ${({isActive, type}) => isActive && type === 'up' && css`
    background-color: ${({ theme }) => theme.colors.succes_light};
  `};

  ${({isActive, type}) => isActive && type === 'down' && css`
    background-color: ${({ theme }) => theme.colors.attention_light};
  `};

`;

export const Icon = styled(Feather)<IconProps>`
  font-size: ${RFValue(24)}px;
  margin-right: 12px;
  color: ${({ theme, type }) => 
  type === 'up' ? 
  theme.colors.success : 
  theme.colors.attention};
`;

export const Title = styled.Text`
  font-size: ${RFValue(14)}px;
  font-family: ${({theme}) => theme.fonts.regular};
`;