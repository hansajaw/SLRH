// app/_layout.tsx
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Drawer } from 'expo-router/drawer';
import { View, Platform } from 'react-native';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      {/* Transparent system bars so your page visuals bleed underneath */}
      <StatusBar style="light" translucent backgroundColor="transparent" />

      {/* Keep root transparent; each screen paints its own background */}
      <View style={{ flex: 1, backgroundColor: 'transparent' }}>
        <Drawer
          screenOptions={{
            headerShown: false,

            // Drawer visuals
            drawerStyle: { backgroundColor: '#0b0b0b' },
            drawerActiveTintColor: '#00E0C6',
            drawerInactiveTintColor: '#fff',

            // Optional: Android drawer animation style
            drawerType: Platform.OS === 'android' ? 'front' : 'slide',
            // You can also tweak the dim overlay:
            // overlayColor: 'rgba(0,0,0,0.25)',
          }}
        >
          {/* Tabs at root */}
          <Drawer.Screen name="(tabs)" options={{ title: 'SLRH' }} />
          <Drawer.Screen name="search/index" options={{ title: 'Search' }} />
          <Drawer.Screen name="profile/index" options={{ title: 'My Profile' }} />
        </Drawer>
      </View>
    </SafeAreaProvider>
  );
}
