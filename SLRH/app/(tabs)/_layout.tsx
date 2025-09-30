// app/(tabs)/_layout.tsx
import * as React from 'react';
import { View } from 'react-native';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function TabsLayout() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,

        // keep your active color
        tabBarActiveTintColor: '#00E0C6',

        // make the bar visually transparent & floating above content
        tabBarStyle: {
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          elevation: 0,          // Android
          borderTopWidth: 0,     // iOS
          backgroundColor: 'transparent',
          // add bottom inset so items don't collide with the gesture bar
          paddingBottom: Math.max(insets.bottom, 8),
          // a little top padding for nicer touch targets
          paddingTop: 6,
        },

        // explicitly render a transparent background behind the bar
        tabBarBackground: () => (
          <View style={{ flex: 1, backgroundColor: 'transparent' }} />
        ),

        // keep screen bg separate; your screens (via SafeScreen) set their own bg
        sceneStyle: {
          backgroundColor: 'transparent',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => <Ionicons name="home" color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="live/index"
        options={{
          title: 'Live',
          tabBarIcon: ({ color, size }) => <Ionicons name="radio" color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="media/index"
        options={{
          title: 'Media',
          tabBarIcon: ({ color, size }) => <Ionicons name="images" color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="blog/index"
        options={{
          title: 'Blog',
          tabBarIcon: ({ color, size }) => <Ionicons name="newspaper" color={color} size={size} />,
        }}
      />
    </Tabs>
  );
}
