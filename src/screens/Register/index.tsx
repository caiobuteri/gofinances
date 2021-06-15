import React, { useState } from 'react';

import { Input } from '../../components/Forms/Input';
import { Container, Header, Title, Form, Fields, TransactionTypes } from './style';

import { Button } from '../../components/Forms/Button';
import { TransactionTypeButton } from '../../components/Forms/TransactionTypeButton';
import { CategorySelect } from '../../components/Forms/CategorySelect';

export function Register(){
  const [ transactionType, setTransactionType ] = useState('');

  function handleTransactionTypeSelect(type: 'up' | 'down'){
    setTransactionType(type);
  }

  return (
    <Container>
      <Header>
        <Title>Meu título</Title>
      </Header>

      <Form>
        <Fields>
          <Input placeholder="Nome" />
          <Input placeholder="Preço" />

          <TransactionTypes>
            <TransactionTypeButton
              isActive={transactionType === 'up'} 
              title="Income" 
              type="up" 
              onPress={() => handleTransactionTypeSelect('up')} 
            />
            
            <TransactionTypeButton
              isActive={transactionType === 'down'}
              title="Outcome" 
              type="down" 
              onPress={() => handleTransactionTypeSelect('down')} 
            />
          </TransactionTypes>

          <CategorySelect title="Categoria" />

        </Fields>
        

        <Button title="enviar"/>
      </Form>

    </Container>
  )
}