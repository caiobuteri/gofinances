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

  function getLastTransactionDate(collection: DataListProps[], type: 'positive' | 'negative'){

    const lastTransaction = new Date(
      Math.max.apply(Math, collection
      .filter(transaction => transaction.type === type)
      .map(transaction => new Date(transaction.date).getTime())));    
    
    return `${lastTransaction.getDate()} de ${lastTransaction.toLocaleString('pt-BR', { month: 'long' })}`
  }

  async function loadTransactions(){
    const dataKey = '@gofinances:transactions';
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
    
    console.log(lastTransactionEntry);
    console.log(lastTransactionExpensive);

    const total = entriesTotal - expensiveTotal;

    setHighlitghData({
      entries: {
        amount: entriesTotal.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        }),
        lastTransaction: `Última entrada dia ${lastTransactionEntry}`
      },
      expensives: {
        amount: expensiveTotal.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        }),
        lastTransaction: `Última saída dia ${lastTransactionExpensive}`
      },
      total: {
        amount: total.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        }),
        lastTransaction: totalInterval
      }
    })
    setTransactions(transactionsFormatted)
    setIsLoading(false);
  }

  useEffect(() => {
    // const dataKey = '@gofinances:transactions';
    // AsyncStorage.removeItem(dataKey);

    loadTransactions();
  }, []);

  useEffect(() => {
    // console.log(highligthData)
  }, [highligthData])

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
