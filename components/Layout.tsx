import { View, Text, KeyboardAvoidingView, Platform } from 'react-native';
import React from 'react';
import { Provider } from 'react-redux';
import { store } from '@/store/store';



const Layout = ({children}: {children: React.ReactNode}) => {
  return (
    <KeyboardAvoidingView
    style ={{flex:1}}
    behavior = {Platform.OS === "ios" ? "padding": "height"}
    keyboardVerticalOffset={Platform.OS === "ios" ? -64 :0}
    >
    <Provider store={store}>
        {children}
    </Provider>
    </KeyboardAvoidingView>
  )
}

export default Layout