// app/_layout.tsx
import "react-native-gesture-handler";
import * as React from "react";
import {
  StatusBar,
  BackHandler,
  Alert,
  View,
  Pressable,
  StyleSheet,
} from "react-native";
import { Drawer } from "expo-router/drawer";
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useRouter, useSegments } from "expo-router";
import { useFonts } from "expo-font";
import Ionicons from "@expo/vector-icons/Ionicons";
import * as SplashScreen from "expo-splash-screen";

import SideMenu from "../components/SideMenu";
import { UserProvider, useUser } from "../context/UserContext";
import { CartProvider } from "../context/CartContext";
import { LiveProvider } from "../context/LiveContext";
import { ThemeProvider, useTheme } from "../context/ThemeContext";

SplashScreen.preventAutoHideAsync();

/* ---------------------- AuthGate ---------------------- */
function AuthGate({ children }: { children: React.ReactNode }) {
  const { token, loadMe } = useUser();
  const router = useRouter();

  React.useEffect(() => {
    (async () => {
      if (!token) {
        router.replace("/auth/login");
      } else {
        try {
          await loadMe();
        } catch {
          // optional toast
        }
      }
    })();
  }, [token]);

  return <>{children}</>;
}

/* ---------------------- HeaderBack (Reusable) ---------------------- */
function HeaderBack() {
  const { palette } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  return (
    <View
      style={[
        styles.header,
        {
          paddingTop: insets.top + 4,
          borderBottomColor: palette.border,
          backgroundColor: palette.background,
        },
      ]}
    >
      <Pressable onPress={() => router.back()} hitSlop={10} style={styles.backBtn}>
        <Ionicons name="chevron-back" size={24} color={palette.text} />
      </Pressable>
    </View>
  );
}

/* ---------------------- Root Layout ---------------------- */
export default function RootLayout() {
  const router = useRouter();
  const segments = useSegments();

  const [fontsLoaded] = useFonts({
    ...Ionicons.font,
  });

  React.useEffect(() => {
    if (fontsLoaded) SplashScreen.hideAsync();
  }, [fontsLoaded]);

  // Android hardware back handling
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

    const subscription = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );
    return () => subscription.remove();
  }, [router, segments]);

  if (!fontsLoaded) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider>
          <UserProvider>
            <CartProvider>
              <LiveProvider>
                <AuthGate>
                  <DrawerWithAutoHeader />
                </AuthGate>
              </LiveProvider>
            </CartProvider>
          </UserProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

/* ---------------------- Drawer Wrapper + Auto Header ---------------------- */
function DrawerWithAutoHeader() {
  const { palette, isDark } = useTheme();
  const segments = useSegments();

  // Detect pages
  const isTabPage = segments[0] === "(tabs)";
  const isAuthPage = segments[0] === "auth"; // ✅ new check
  const showHeader = !isTabPage && !isAuthPage; // ✅ hide header for auth pages

  return (
    <>
      <StatusBar
        barStyle={isDark ? "light-content" : "dark-content"}
        backgroundColor={palette.background}
      />

      <View style={{ flex: 1, backgroundColor: palette.background }}>
        {/* ✅ Show back button only for non-tab, non-auth pages */}
        {showHeader && <HeaderBack />}

        <Drawer
          drawerContent={(props) => <SideMenu {...props} />}
          screenOptions={{
            headerShown: false,
            drawerType: "front",
            overlayColor: "rgba(0,0,0,0.5)",
            drawerStyle: {
              width: 320,
              backgroundColor: palette.card,
            },
            sceneStyle: { backgroundColor: palette.background },
            drawerActiveTintColor: palette.accent,
            drawerInactiveTintColor: palette.textSecondary,
            swipeEdgeWidth: 60,
          }}
        >
          {/* Tab Screens (hidden from drawer list) */}
          <Drawer.Screen name="(tabs)" options={{ drawerItemStyle: { display: "none" } }} />

          {/* Sub-pages (non-tab, no drawer entry) */}
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

          {/* ✅ Ensure header/back appears for these profile pages too */}
          <Drawer.Screen name="people/driver/[id]" options={{ drawerItemStyle: { display: "none" } }} />
          <Drawer.Screen name="people/team/[id]" options={{ drawerItemStyle: { display: "none" } }} />

          {/* ✅ Auth pages (no header shown) */}
          <Drawer.Screen name="auth/login" options={{ drawerItemStyle: { display: "none" } }} />
          <Drawer.Screen name="auth/signup" options={{ drawerItemStyle: { display: "none" } }} />
        </Drawer>
      </View>
    </>
  );
}

/* ---------------------- Styles ---------------------- */
const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    paddingHorizontal: 12,
    paddingBottom: 6, // compact to reduce gap below header
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
});
