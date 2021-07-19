import React, { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { ActivityIndicator } from 'react-native';
import { useTheme } from 'styled-components';

import { HighLightCard } from '../../components/HighlightCard';
import { TransactionCard, TransactionCardProps } from '../../components/TransactionCard';

import 'intl';
import 'intl/locale-data/jsonp/pt-BR';

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
  LogoutButton,
  LoadContainer
} from './styles';
import { useAuth } from '../../hooks/auth';

export interface DataListProps extends TransactionCardProps {
  id: string
}

interface HighligthProps {
  amount: string;
  lastTransaction: string;
}

interface HighligthData {
  entries: HighligthProps,
  expensives: HighligthProps,
  total: HighligthProps
}

export default function Dashboard(){
  const [ isLoading, setIsLoading ] = useState(true);
  const [ transactions, setTransactions ] = useState<DataListProps[]>([]);
  const [ highligthData, setHighlitghData ] = useState<HighligthData>({} as HighligthData);
  const theme = useTheme();

  const { signOut, user } = useAuth();

  function getLastTransactionDate(collection: DataListProps[], type: 'positive' | 'negative'){

    const collectionFilttered = collection
    .filter(transaction => transaction.type === type)

    if(collectionFilttered.length === 0){
      return 0
    }

    const lastTransaction = new Date(
      Math.max.apply(Math, collectionFilttered
      .map(transaction => new Date(transaction.date).getTime())));    
    
    return `${lastTransaction.getDate()} de ${lastTransaction.toLocaleString('pt-BR', { month: 'long' })}`
  }

  async function loadTransactions(){
    const dataKey = `@gofinances:transactions_user:${user.id}`;
    const response = await AsyncStorage.getItem(dataKey);
    const transactions: DataListProps[] = response ? JSON.parse(response) : [];

    let entriesTotal = 0;
    let expensiveTotal = 0;


    const transactionsFormatted = transactions.map( (item: DataListProps) => {
      
      if(item.type === 'positive'){
        entriesTotal += Number(item.amount);
      } else {
        expensiveTotal += Number(item.amount);
      }
    
      const amount = Number(item.amount).toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      });

      const date = Intl.DateTimeFormat('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit',
      }).format(new Date(item.date));
      
      return {
        id: item.id,
        name: item.name,
        amount,
        date,
        type: item.type,
        category: item.category
      }
    });

    const lastTransactionEntry = getLastTransactionDate(transactions, 'positive')
    const lastTransactionExpensive = getLastTransactionDate(transactions, 'negative')
    const totalInterval = `01 a ${lastTransactionEntry > lastTransactionExpensive ? lastTransactionEntry : lastTransactionExpensive}`
    
    const total = entriesTotal - expensiveTotal;

    setHighlitghData({
      entries: {
        amount: entriesTotal.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        }),
        lastTransaction: lastTransactionEntry === 0 ? 
        'Nenhuma entrada foi registrada' :
        `Última entrada dia ${lastTransactionEntry}`
      },
      expensives: {
        amount: expensiveTotal.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        }),
        lastTransaction: lastTransactionExpensive === 0 ? 
        'Nehuma saída foi registrada' : 
        `Última saída dia ${lastTransactionExpensive}`
      },
      total: {
        amount: total.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        }),
        lastTransaction: lastTransactionExpensive === 0 && lastTransactionEntry === 0 ? 
        'Nehum movimento foi registrado' : 
        totalInterval
      }
    })
    setTransactions(transactionsFormatted)
    setIsLoading(false);
  }

  useFocusEffect(useCallback(() => {
    loadTransactions();
  }, []));

  return (
    <Container>
      {
        isLoading ? 
        <LoadContainer>
          <ActivityIndicator 
            color={theme.colors.primary}
            size="large"
          />
        </LoadContainer> : 
      <>
        <Header>
          <UserWrapper>
            <UserInfo>
              <Photo source={{uri: user.photo}}/>
              <User>
                <UserGreeting>Olá,</UserGreeting>
                <UserName>{user.name}</UserName>
              </User>
            </UserInfo>
            <LogoutButton onPress={signOut} >
              <Icon name="power"/>
            </LogoutButton>
          </UserWrapper>
        </Header>
        
        <HighLightCards
        >
          <HighLightCard title="Entradas" amount={highligthData?.entries?.amount} lastTransaction={highligthData.entries.lastTransaction}  type="up" />
          <HighLightCard title="Saídas" amount={highligthData?.expensives?.amount} lastTransaction={highligthData.expensives.lastTransaction} type="down" />
          <HighLightCard title="Total" amount={highligthData?.total?.amount} lastTransaction={highligthData.total.lastTransaction} type="total" />
        </HighLightCards>
        
        <Transaction>
          <Title>
            Listagem
          </Title>

          <TransactionList 
            data={transactions}
            renderItem={({item}) => <TransactionCard data={item}/>}
            keyExtractor={item => item.id}
          />

        </Transaction>
      </>
      }
    </Container>
  )
}
