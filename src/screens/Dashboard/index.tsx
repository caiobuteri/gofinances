import React from 'react';

import { HighLightCard } from '../../components/HighlightCard';
import { TransactionCard, TransactionCardProps } from '../../components/TransactionCard';

import { 
  Container,
  Header,
  UserWrapper,
  UserInfo,
  User,
  Photo,
  UserGreeting,
  UserName,
  Icon,
  HighLightCards,
  Transaction,
  Title,
  TransactionList,
  LogoutButton
} from './styles';

export interface DataListProps extends TransactionCardProps {
  id: string
;}

export default function Dashboard(){
  
  const data : DataListProps[] = [{
    id: '1',
    title: 'Desenvolvimento de sites', 
    amount: 'R$ 12.000,00',
    category: {
      name: 'Vendas',
      icon: 'dollar-sign'
    },
    date: '13/04/2020',
    type: 'positive',
  }, 
  {
    id: '2',
    title: 'Hamburgueria Pizzy', 
    amount: 'R$ 59,00',
    category: {
      name: 'Alimentação',
      icon: 'coffee'
    },
    date: '10/04/2020',
    type: 'negative',
  }, 
  {
    id: '3',
    title: 'Aluguel do apartamento', 
    amount: 'R$ 1.200,00',
    category: {
      name: 'Casa',
      icon: 'shopping-bag'
    },
    date: '10/04/2020',
    type: 'negative',
  }];
  
  return (
    <Container>
      <Header>
        <UserWrapper>
          <UserInfo>
            <Photo source={{uri: 'https://avatars.githubusercontent.com/u/54895327?v=4'}}/>
            <User>
              <UserGreeting>Olá,</UserGreeting>
              <UserName>Buteri</UserName>
            </User>
          </UserInfo>
          <LogoutButton onPress={() => {}} >
            <Icon name="power"/>
          </LogoutButton>
        </UserWrapper>
      </Header>
      
      <HighLightCards
      >
        <HighLightCard title="Entradas" amount="R$ 17.400,00" lastTransaction="Última transação dia 13 de Abril"  type="up" />
        <HighLightCard title="Saídas" amount="R$ 1.259,00" lastTransaction="Última transação dia 03 de Abril." type="down" />
        <HighLightCard title="Total" amount="R$ 13.141,00" lastTransaction="01 a 16 de Abril" type="total" />
      </HighLightCards>
      
      <Transaction>
        <Title>
          Listagem
        </Title>

        <TransactionList 
          data={data}
          renderItem={({item}) => <TransactionCard data={item}/>}
          keyExtractor={item => item.id}
        />

      </Transaction>
    </Container>
  )
}
