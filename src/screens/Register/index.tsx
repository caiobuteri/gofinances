import React, { useState } from 'react';
import { useForm } from 'react-hook-form'
import { useAuth } from '../../hooks/auth';

import { Keyboard, Modal, TouchableWithoutFeedback, Alert } from 'react-native';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import AsyncStorage from '@react-native-async-storage/async-storage';
import uuid from 'react-native-uuid';
import { useNavigation } from '@react-navigation/native';

import { Container, Header, Title, Form, Fields, TransactionTypes } from './style';
import { Button } from '../../components/Forms/Button';
import { TransactionTypeButton } from '../../components/Forms/TransactionTypeButton';
import { CategorySelectButton } from '../../components/Forms/CategorySelectButton';
import { CategorySelect } from '../CategorySelect';
import { InputForm } from '../../components/Forms/InputForm';

const schema = Yup.object().shape({
  name: Yup
  .string()
  .required('Nome é obrigatório'),
  amount: Yup
  .number()
  .typeError('Informe um valor numérico')
  .positive('O valor não pode ser negativo')
  .required('Valor é obrigatório')
});

export function Register(){
  const [ transactionType, setTransactionType ] = useState('');
  const [ categoryModalOpen, setCategoryModalOpen ] = useState(false);  
  const [ category, setCategory ] = useState({
    key: 'category',
    name: 'Categoria',
  });

  const navigation = useNavigation();
  const { user } = useAuth();

  const { control, handleSubmit, reset, formState: { errors } } = useForm({ resolver: yupResolver(schema) });

  function handleTransactionTypeSelect(type: 'positive' | 'negative'){
    setTransactionType(type);
  }

  function handleCloseSeletCategoryModal(){
    setCategoryModalOpen(false);
  }

  function handleOpenSeletCategoryModal(){
    setCategoryModalOpen(true);
  }

  interface FormData {
    name: string;
    amount: string;
  }

  async function handleRegister(form: FormData){
    if (!transactionType){
      return Alert.alert('Selecione o tipo da transação');
    }

    if (category.key === 'category'){
      return Alert.alert('Selecione o tipo de categoria');
    }
    
    const newTransaction = {
      id: String(uuid.v4()),
      name: form.name,
      amount: form.amount,
      type: transactionType,
      category: category.key,
      date: new Date()
    }

    try {
      const dataKey = `@gofinances:transactions_user:${user.id}`;

      const data = await AsyncStorage.getItem(dataKey);
      const currentData = data ? JSON.parse(data) : [];

      const dataFormatted = [
        ...currentData,
        newTransaction
      ]

      await AsyncStorage.setItem(dataKey, JSON.stringify(dataFormatted));

      reset();
      setCategory({
        key: 'category',
        name: 'Categoria',
      });
      setTransactionType('');

      navigation.navigate("Listagem");

    } catch (err) {
      console.log(err);
      Alert.alert("Não foi possível salvar")
    }
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <Container>
        <Header>
          <Title>Cadastro</Title>
        </Header>

        <Form>
          <Fields>
            <InputForm
              name="name"
              control={ control }
              placeholder="Nome"
              autoCapitalize='sentences'
              autoCorrect={false}
              error={errors.name && errors.name.message}
            />
            <InputForm
              name="amount"
              control={ control } 
              placeholder="Preço"
              keyboardType="numeric"
              error={errors.amount && errors.amount.message}
            />

            <TransactionTypes>
              <TransactionTypeButton
                isActive={transactionType === 'positive'} 
                title="Income" 
                type="up" 
                onPress={() => handleTransactionTypeSelect('positive')} 
              />
              
              <TransactionTypeButton
                isActive={transactionType === 'negative'}
                title="Outcome" 
                type="down" 
                onPress={() => handleTransactionTypeSelect('negative')} 
              />
            </TransactionTypes>

            <CategorySelectButton title={category.name} onPress={handleOpenSeletCategoryModal} />

          </Fields>
          

          <Button
            title="Enviar"
            onPress={handleSubmit(handleRegister)}
          />
        </Form>

        <Modal visible={categoryModalOpen}>
          <CategorySelect 
            category={category}
            setCategory={setCategory}
            closeSelectCategory={handleCloseSeletCategoryModal}
          />
        </Modal>

      </Container>
    </TouchableWithoutFeedback>
  )
}