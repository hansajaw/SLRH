import { View, Text } from 'react-native';
import SafeScreen from '../../../components/SafeScreen';
import TopBar from '../../../components/TopBar';

export default function LiveTab() {
  return (
    <SafeScreen bg="#0b0b0b">
      <TopBar title="Live" />
      <View style={{ flex: 1, padding: 16 }}>
        <Text style={{ color: '#fff' }}>Live screen placeholder</Text>
      </View>
    </SafeScreen>
  );
}
