// app/_layout.tsx
import "react-native-gesture-handler";
import React, { useEffect, useMemo, useState, createContext } from "react";
import { StatusBar, Appearance, View } from "react-native";
import { useRouter } from "expo-router";
import { Drawer } from "expo-router/drawer";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useFonts } from "expo-font";
import Ionicons from "@expo/vector-icons/Ionicons";
import * as SplashScreen from "expo-splash-screen";

import SideMenu from "../components/SideMenu";
import { UserProvider, useUser } from "../context/UserContext";
import { CartProvider } from "../context/CartContext";
import { LiveProvider } from "../context/LiveContext";
// optional: import { useSettings } from "../app/store/settings";

SplashScreen.preventAutoHideAsync();

export const ThemeContext = createContext<"light" | "dark">("dark");

function AuthGate({ children }: { children: React.ReactNode }) {
  const { token, loadMe } = useUser();
  const router = useRouter();

  useEffect(() => {
    (async () => {
      try {
        if (!token) {
          router.replace("/auth/login");
        } else {
          await loadMe().catch(() => {});
        }
      } catch (err) {
        console.warn("AuthGate error:", err);
      }
    })();
  }, [token]);

  return <>{children}</>;
}

export default function RootLayout() {
  const [colorScheme, setColorScheme] = useState(Appearance.getColorScheme());
  const currentTheme: "light" | "dark" = colorScheme === "dark" ? "dark" : "light";

  // ✅ Load icon fonts
  const [fontsLoaded] = useFonts({ ...Ionicons.font });

  useEffect(() => {
    const sub = Appearance.addChangeListener(({ colorScheme }) =>
      setColorScheme(colorScheme)
    );
    return () => sub.remove();
  }, []);

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync().catch(() => {});
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return <View style={{ flex: 1, backgroundColor: "#000" }} />;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <UserProvider>
          <CartProvider>
            <LiveProvider>
              <ThemeContext.Provider value={currentTheme}>
                <AuthGate>
                  <StatusBar
                    barStyle={currentTheme === "dark" ? "light-content" : "dark-content"}
                  />
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
                    <Drawer.Screen
                      name="(tabs)"
                      options={{ drawerItemStyle: { display: "none" } }}
                    />
                    <Drawer.Screen
                      name="store/index"
                      options={{ drawerItemStyle: { display: "none" } }}
                    />
                    <Drawer.Screen
                      name="sponsors/index"
                      options={{ drawerItemStyle: { display: "none" } }}
                    />
                    <Drawer.Screen
                      name="fanzone/ratings"
                      options={{ drawerItemStyle: { display: "none" } }}
                    />
                    <Drawer.Screen
                      name="fanzone/polls"
                      options={{ drawerItemStyle: { display: "none" } }}
                    />
                    <Drawer.Screen
                      name="about/index"
                      options={{ drawerItemStyle: { display: "none" } }}
                    />
                    <Drawer.Screen
                      name="cart/index"
                      options={{ drawerItemStyle: { display: "none" } }}
                    />
                    <Drawer.Screen
                      name="checkout/index"
                      options={{ drawerItemStyle: { display: "none" } }}
                    />
                    <Drawer.Screen
                      name="race/index"
                      options={{ drawerItemStyle: { display: "none" } }}
                    />
                    <Drawer.Screen
                      name="race/live/[id]"
                      options={{ drawerItemStyle: { display: "none" } }}
                    />
                    <Drawer.Screen
                      name="racing/[id]"
                      options={{ drawerItemStyle: { display: "none" } }}
                    />
                  </Drawer>
                </AuthGate>
              </ThemeContext.Provider>
            </LiveProvider>
          </CartProvider>
        </UserProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
