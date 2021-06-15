import 'styled-components';
import { MyTheme } from './theme';

declare module 'styled-components/native' {
  export interface DefaultTheme extends MyTheme {}
}