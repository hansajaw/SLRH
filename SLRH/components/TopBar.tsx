import { View, Pressable, Text } from 'react-native';
import { router, useNavigation } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function TopBar({ title = 'SLRH' }: { title?: string }) {
  const nav = useNavigation<any>();
  const go = (path: string) => (router as any).push(path);

  return (
    <View
      style={{
        height: 56,
        backgroundColor: '#0b0b0b',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        borderBottomColor: '#111',
        borderBottomWidth: 1,
      }}
    >
      {/* Drawer menu */}
      <Pressable onPress={() => nav?.openDrawer?.()} style={{ padding: 8, marginRight: 8 }}>
        <Ionicons name="menu" size={24} color="#fff" />
      </Pressable>

      <Text style={{ color: '#fff', fontSize: 18, fontWeight: '800', flex: 1 }}>{title}</Text>

      {/* Search */}
      <Pressable onPress={() => go('/search/index')} style={{ padding: 8, marginRight: 8 }}>
        <Ionicons name="search" size={22} color="#fff" />
      </Pressable>

      {/* Profile */}
      <Pressable onPress={() => go('/profile/index')} style={{ padding: 8 }}>
        <Ionicons name="person-circle" size={24} color="#fff" />
      </Pressable>
    </View>
  );
}
