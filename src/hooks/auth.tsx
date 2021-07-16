import React, { createContext, ReactNode, useContext, useState, useEffect } from "react";

import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Google from 'expo-google-app-auth';
import * as AppleAuthentication from 'expo-apple-authentication';

interface AuthProviderProps {
  children: ReactNode;
}

interface User {
  id: string;
  name: string;
  email: string;
  photo?: string;
}

interface IAuthContextData {
  user: User;
  signInWithGoogle(): Promise<void>;
  signInWithApple(): Promise<void>;
  signOut(): Promise<void>;
  userStorageLoading: boolean;
}

const AuthContext = createContext({} as IAuthContextData);

function AuthProvider({ children } : AuthProviderProps){
  const [ user, setUser ] = useState<User>({} as User);
  const [ userStorageLoading, setUserStorageLoading ] = useState(true);

  const userStorageKey = '@gofinances:user';

  useEffect(() => {
    async function getUserData(){
      const userStoraged = await AsyncStorage.getItem(userStorageKey)
      if(userStoraged){
        const userLogged = JSON.parse(userStoraged) as User;
        setUser(userLogged);
      }

      setUserStorageLoading(false);
    }

    getUserData()
  }, []);

  async function signInWithGoogle(){
    try {
      const result = await Google.logInAsync({
        iosClientId: '515235227172-oq02vsjppktacodlk3uam7nmlfk33lbh.apps.googleusercontent.com',
        androidClientId: '515235227172-t5k3reda3suj1ote50d7engehlo13q7a.apps.googleusercontent.com',
        scopes: ['profile', 'email']
      });

      if(result.type === 'success'){
        const userLogged = {
         id: result.user.id!,
         email: result.user.email!,
         name: result.user.name!,
         photo: result.user.photoUrl! 
        }

        setUser(userLogged);
        await AsyncStorage.setItem(userStorageKey, JSON.stringify(userLogged));
      }
    } catch(error) {
      throw new Error(error)
    }
  }

  async function signInWithApple(){
    try {
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ]
      });

      if(credential){
        const name = credential.fullName!.givenName!;
        const photo = `https://ui-avatars.com/api/?name=${name}&length=1`
        const userLogged = {
          id: credential.user,
          email: credential.email!,
          name,
          photo
        }

        setUser(userLogged);
        await AsyncStorage.setItem(userStorageKey, JSON.stringify(userLogged));
      }
    } catch(error) {
        throw new Error(error);
    }
  }

  async function signOut(){
    setUser({} as User);
    await AsyncStorage.removeItem(userStorageKey);
  }

  return (
    <AuthContext.Provider value={{ user, signInWithGoogle, signInWithApple, signOut, userStorageLoading }}>
      { children }
    </AuthContext.Provider>
  )
}

function useAuth(){
  const context = useContext(AuthContext)

  return context;
}

export { AuthProvider, useAuth }