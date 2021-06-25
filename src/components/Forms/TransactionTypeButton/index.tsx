import React from 'react';
import { RectButtonProps } from 'react-native-gesture-handler';

import { Container, Icon, Title, Button } from './style';

interface Props extends RectButtonProps {
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
    <Container type={type} isActive={isActive}>
      <Button 
        {...rest}
      >

        <Icon name={Icons[type]} type={type}/>
        <Title>
          {title}
        </Title>
      </Button>
    </Container>
  );
}