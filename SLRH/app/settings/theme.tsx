import React from "react";
import { View, Text, Pressable, StyleSheet, ScrollView } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSettings, ThemeChoice } from "../store/settings";

const THEMES: ThemeChoice[] = ["System", "Light", "Dark"];

export default function ThemeScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { theme, setTheme } = useSettings();

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
          {THEMES.map((t, i) => (
            <Pressable key={t} onPress={() => setTheme(t)} style={[s.row, i !== THEMES.length - 1 && s.rowBorder]}>
              <Text style={[s.rowText, theme === t && { color: "#00E0C6", fontWeight: "900" }]}>{t}</Text>
              {theme === t && <Ionicons name="checkmark" size={18} color="#00E0C6" />}
            </Pressable>
          ))}
        </View>
        <Text style={s.hint}>Connect this to your theme provider to apply app-wide.</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#0b0b0b" },
  top: { paddingHorizontal: 16, paddingBottom: 8, flexDirection: "row", alignItems: "center" },
  topBtn: { width: 36, height: 36, borderRadius: 18, alignItems: "center", justifyContent: "center" },
  topTitle: { flex: 1, color: "#fff", fontSize: 20, fontWeight: "900", textAlign: "center" },

  card: { margin: 16, backgroundColor: "#101522", borderRadius: 16, borderWidth: 1, borderColor: "#1b2338" },
  row: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 14, paddingVertical: 14 },
  rowBorder: { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: "rgba(255,255,255,0.06)" },
  rowText: { color: "#fff", fontWeight: "800" },
  hint: { color: "#9AA0A6", marginHorizontal: 16, marginTop: 8 },
});
