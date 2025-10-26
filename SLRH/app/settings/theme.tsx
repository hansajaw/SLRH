// SLRH/app/settings/theme.tsx
import React, { useEffect, useState } from "react";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
  Switch,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import {
  defaultSettings,
  loadSettings,
  saveSettings,
  type AppSettings,
  type ThemeMode,
} from "../data/appSettings";

const THEMES: ThemeMode[] = ["system", "light", "dark"];

export default function ThemeScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      const s = await loadSettings();
      setSettings(s);
      setLoaded(true);
    })();
  }, []);

  const setTheme = async (t: ThemeMode) => {
    const next = { ...settings, theme: t };
    setSettings(next);
    await saveSettings(next);
    // TODO: if you have a theme provider (nativewind / paper / custom),
    // also call your provider setter here to apply immediately.
  };

  if (!loaded) {
    return (
      <SafeAreaView style={s.safe} edges={["top", "bottom"]}>
        <View style={[s.top, { paddingTop: Math.max(8, insets.top * 0.25) }]}>
          <Pressable onPress={() => router.back()} hitSlop={10} style={s.topBtn}>
            <Ionicons name="chevron-back" size={22} color="#fff" />
          </Pressable>
          <Text style={s.topTitle}>Theme</Text>
          <View style={{ width: 36 }} />
        </View>
        <View style={s.loadingWrap}>
          <Text style={s.loading}>Loading…</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={s.safe} edges={["top", "bottom"]}>
      <View style={[s.top, { paddingTop: Math.max(8, insets.top * 0.25) }]}>
        <Pressable onPress={() => router.back()} hitSlop={10} style={s.topBtn}>
          <Ionicons name="chevron-back" size={22} color="#fff" />
        </Pressable>
        <Text style={s.topTitle}>Theme</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 16 + insets.bottom }}>
        <View style={s.card}>
          {THEMES.map((t, i) => {
            const isActive = settings.theme === t;
            const label =
              t === "system"
                ? "System"
                : t === "light"
                ? "Light"
                : "Dark";

            return (
              <Pressable
                key={t}
                onPress={() => setTheme(t)}
                style={[s.row, i !== THEMES.length - 1 && s.rowBorder]}
              >
                <Text style={[s.rowText, isActive && s.rowTextActive]}>
                  {label}
                </Text>
                {isActive && <Ionicons name="checkmark" size={18} color="#00E0C6" />}
              </Pressable>
            );
          })}
        </View>

        <Text style={s.hint}>
          This setting is saved on your device. If you use a theme provider (e.g.,
          nativewind or Paper), connect it to apply app-wide immediately.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#0b0b0b" },
  top: { paddingHorizontal: 16, paddingBottom: 8, flexDirection: "row", alignItems: "center" },
  topBtn: { width: 36, height: 36, borderRadius: 18, alignItems: "center", justifyContent: "center" },
  topTitle: { flex: 1, color: "#fff", fontSize: 20, fontWeight: "900", textAlign: "center" },

  loadingWrap: { flex: 1, alignItems: "center", justifyContent: "center" },
  loading: { color: "#fff" },

  card: { margin: 16, backgroundColor: "#101522", borderRadius: 16, borderWidth: 1, borderColor: "#1b2338" },
  row: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 14, paddingVertical: 14 },
  rowBorder: { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: "rgba(255,255,255,0.06)" },
  rowText: { color: "#fff", fontWeight: "800" },
  rowTextActive: { color: "#00E0C6", fontWeight: "900" },
  hint: { color: "#9AA0A6", marginHorizontal: 16, marginTop: 8 },
});
