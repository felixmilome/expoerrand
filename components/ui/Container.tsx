import { View, Text, Platform } from 'react-native';
import React from 'react';
import tw from "twrnc";
import { SafeAreaView } from 'react-native-safe-area-context';

interface Props {
    children:React.ReactNode,
    className?:string
}

const Container = ({children, className}: Props) => {
  return (
    <SafeAreaView style={tw`bg-white flex-1 ${Platform.OS==='android'?'mt-0':'mt-0'}`}>
        
        <View style={[tw`p-5`, className?tw `${className}` : null]}>
            <Text>Container</Text>
        </View>

  </SafeAreaView>
  )
}

export default Container