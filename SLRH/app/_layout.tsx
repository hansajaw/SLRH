// app/_layout.tsx
import "react-native-gesture-handler";
import * as React from "react";
import { StatusBar, BackHandler, Alert } from "react-native";
import { Drawer } from "expo-router/drawer";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useRouter, useSegments } from "expo-router";
import { useFonts } from "expo-font";
import Ionicons from "@expo/vector-icons/Ionicons";
import * as SplashScreen from "expo-splash-screen";

import SideMenu from "../components/SideMenu";
import { UserProvider, useUser } from "../context/UserContext";
import { CartProvider } from "../context/CartContext";
import { LiveProvider } from "../context/LiveContext";

SplashScreen.preventAutoHideAsync();

function AuthGate({ children }: { children: React.ReactNode }) {
  const { token, loadMe } = useUser();
  const router = useRouter();

  React.useEffect(() => {
    (async () => {
      if (!token) {
        router.replace("/auth/login");
      } else {
        try {
          await loadMe(); // refresh user on app start
        } catch {
          // optional: show toast
        }
      }
    })();
  }, [token]);

  return <>{children}</>;
}

export default function RootLayout() {
  const router = useRouter();
  const segments = useSegments();

  // ✅ Preload Ionicons font
  const [fontsLoaded] = useFonts({
    ...Ionicons.font,
  });

  React.useEffect(() => {
    if (fontsLoaded) SplashScreen.hideAsync();
  }, [fontsLoaded]);

  // ✅ Global back button handler
  React.useEffect(() => {
    const backAction = () => {
      if (router.canGoBack()) {
        router.back();
        return true;
      }
      if (segments.length === 1 && segments[0] === "(tabs)") {
        Alert.alert("Exit SLRH", "Do you want to close the app?", [
          { text: "Cancel", style: "cancel" },
          { text: "Exit", onPress: () => BackHandler.exitApp() },
        ]);
        return true;
      }
      router.replace("/(tabs)");
      return true;
    };
    const subscription = BackHandler.addEventListener("hardwareBackPress", backAction);
    return () => subscription.remove();
  }, [router, segments]);

  if (!fontsLoaded) return null; 

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <UserProvider>
          <CartProvider>
            <LiveProvider>
              <AuthGate>
                <StatusBar barStyle="light-content" />
                <Drawer
                  drawerContent={(props) => <SideMenu {...props} />}
                  screenOptions={{
                    headerShown: false,
                    drawerType: "front",
                    overlayColor: "rgba(0,0,0,0.5)",
                    drawerStyle: { width: 320, backgroundColor: "#0b0b0b" },
                    sceneStyle: { backgroundColor: "#0b0b0b" },
                    drawerActiveTintColor: "#00E0C6",
                    drawerInactiveTintColor: "#cfd2d6",
                    swipeEdgeWidth: 60,
                  }}
                >
                  <Drawer.Screen name="(tabs)" options={{ drawerItemStyle: { display: "none" } }} />
                  <Drawer.Screen name="store/index" options={{ drawerItemStyle: { display: "none" } }} />
                  <Drawer.Screen name="sponsors/index" options={{ drawerItemStyle: { display: "none" } }} />
                  <Drawer.Screen name="fanzone/ratings" options={{ drawerItemStyle: { display: "none" } }} />
                  <Drawer.Screen name="fanzone/polls" options={{ drawerItemStyle: { display: "none" } }} />
                  <Drawer.Screen name="about/index" options={{ drawerItemStyle: { display: "none" } }} />
                  <Drawer.Screen name="cart/index" options={{ drawerItemStyle: { display: "none" } }} />
                  <Drawer.Screen name="checkout/index" options={{ drawerItemStyle: { display: "none" } }} />
                  <Drawer.Screen name="race/index" options={{ drawerItemStyle: { display: "none" } }} />
                  <Drawer.Screen name="race/live/[id]" options={{ drawerItemStyle: { display: "none" } }} />
                  <Drawer.Screen name="racing/[id]" options={{ drawerItemStyle: { display: "none" } }} />
                </Drawer>
              </AuthGate>
            </LiveProvider>
          </CartProvider>
        </UserProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
