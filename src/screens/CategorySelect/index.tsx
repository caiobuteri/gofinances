import React from 'react';
import { categories } from '../../utils/categories';
import { Container, Header, Title, Category, Icon, Name, Separator, Footer } from './style';

import { CategorySelectButton2 } from '../../components/Forms/CategorySelectButton2';
import { FlatList } from 'react-native';

interface Category {
  key: string;
  name: string
}

interface Props {
  category: Category;
  setCategory: (category: Category) => void;
  closeSelectCategory: () => void;
}

export function CategorySelect({ category, setCategory, closeSelectCategory } : Props){
  
  function handleCategorySelect(item: Category){
    setCategory(item)
  }
  
  return (
    <Container>
      <Header>
        <Title>Categoria</Title>
      </Header>

      <FlatList 
        data={categories}
        style={{ flex: 1, width: '100%' }}
        keyExtractor={(item) => item.key}
        renderItem={({ item }) => (
          <Category
            onPress={() => handleCategorySelect(item)}
            isActive={category.key === item.key}
          >
            <Icon name={item.icon} />
            <Name>{item.name}</Name>
          </Category>
        )}
        ItemSeparatorComponent={() => <Separator />}
      />

      <Footer>
        <CategorySelectButton2 title="Selecionar" onPress={closeSelectCategory}/>
      </Footer>
    </Container>
  );
}