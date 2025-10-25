import { View, Text, Pressable, StyleSheet } from 'react-native';
import React, { useContext } from 'react';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ThemeContext } from '../app/_layout';

export default function Header({ title }: { title: string }) {
  const { top } = useSafeAreaInsets();
  const theme = useContext(ThemeContext);

  const headerBg = theme === 'dark' ? '#0b0b0b' : '#f0f0f0';
  const headerBorderColor = theme === 'dark' ? '#1a1a1a' : '#e0e0e0';
  const textColor = theme === 'dark' ? '#fff' : '#000';
  const iconColor = theme === 'dark' ? '#fff' : '#000';

  return (
    <View style={[s.header, { paddingTop: top + 12, backgroundColor: headerBg, borderBottomColor: headerBorderColor }]}>
      <Pressable onPress={() => router.back()} style={s.backBtn}>
        <Ionicons name="arrow-back" size={24} color={iconColor} />
      </Pressable>
      <Text style={[s.title, { color: textColor }]}>{title}</Text>
    </View>
  );
}

const s = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 12,
    borderBottomWidth: 1,
  },
  backBtn: {
    position: 'absolute',
    left: 16,
    bottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});
