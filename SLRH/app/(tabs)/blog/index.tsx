import { View, Text } from 'react-native';
import SafeScreen from '../../../components/SafeScreen';
import TopBar from '../../../components/TopBar';

export default function BlogTab() {
  return (
    <SafeScreen bg="#0b0b0b">
      <TopBar title="Blog" />
      <View style={{ flex: 1, padding: 16 }}>
        <Text style={{ color: '#fff' }}>Blog list goes here</Text>
      </View>
    </SafeScreen>
  );
}
