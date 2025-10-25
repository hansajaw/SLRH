import { View, Text, Pressable, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function Header({ title }: { title: string }) {
  const { top } = useSafeAreaInsets();

  return (
    <View style={[s.header, { paddingTop: top + 12 }]}>
      <Pressable onPress={() => router.back()} style={s.backBtn}>
        <Ionicons name="arrow-back" size={24} color="#fff" />
      </Pressable>
      <Text style={s.title}>{title}</Text>
    </View>
  );
}

const s = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 12,
    backgroundColor: '#0b0b0b',
    borderBottomWidth: 1,
    borderBottomColor: '#1a1a1a',
  },
  backBtn: {
    position: 'absolute',
    left: 16,
    bottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
});
