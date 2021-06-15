export const theme = {
  colors: {
    primary: '#612F74',

    secondary: '#ff672c',
    secondary_light: 'rgba(255, 135, 44, 0.3)',
    
    success: '#12A454',
    succes_light: 'rgba(18, 164, 84, 0.5)',
    
    attention: '#E83F5B',
    attention_light: 'rgba(232, 63, 91, 0.5)',
  
    shape: '#FFF',
    title: '#363F5F',
    text: '#969BD2',
    text_dark: '#363F5F',
    background: '#F0F2F5'
  },

  fonts: {
    regular: 'Poppins_400Regular',
    medium: 'Poppins_500Medium',
    bold: 'Poppins_700Bold'
  }
}

export type MyTheme = typeof theme;