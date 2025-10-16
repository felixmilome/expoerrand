import { Image } from 'expo-image';
import { View, Text } from 'react-native';

import { Link } from 'expo-router';
import tw from "twrnc"
import { SafeAreaView } from 'react-native-safe-area-context';
import Container from '@/components/ui/Container';
import SearchBar from '@/components/SearchBar';
import NavOptions from '@/components/NavOptions';



export default function HomeScreen() {
  return (
    // <View>
    //   <Text>bhkjbjb</Text>
    // </View>
    <Container >
      <Image source={{uri:"https://i.ibb.co.com/Xz5pKDQ/logo-black.png"}}
       style={tw`w-24 h-10`}
       contentFit='contain'/>
       <SearchBar/>
       <NavOptions/>
    </Container>
  );
}

