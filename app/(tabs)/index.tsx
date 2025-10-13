import { Image } from 'expo-image';
import { Platform, StyleSheet, View, Text } from 'react-native';

import { Link } from 'expo-router';
import tw from "twrnc"
import { SafeAreaView } from 'react-native-safe-area-context';
import Container from '@/components/ui/Container';


export default function HomeScreen() {
  return (
    <Container >
 
      <View style= {tw`bg-red-200`}>
        <Text>Errand App</Text>
      </View>
    </Container>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
