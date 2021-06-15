import React from 'react';
import { TouchableOpacityProps } from 'react-native';

import { Container, Icon, Title } from './style';

interface Props extends TouchableOpacityProps {
  title: 'Income' | 'Outcome';
  type: 'up' | 'down';
  isActive: boolean;
}

const Icons = {
  up: 'arrow-up-circle',
  down: 'arrow-down-circle'
}

export function TransactionTypeButton({ title, type, isActive, ...rest } : Props){
  
  return (
    <Container type={type} isActive={isActive} {...rest}>
      <Icon name={Icons[type]} type={type}/>
      <Title>
        {title}
      </Title>
    </Container>
  );
}