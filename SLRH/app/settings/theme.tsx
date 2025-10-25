import React from "react";
import { View, Text, Pressable, StyleSheet, ScrollView } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import Header from "../../components/Header";
import { Ionicons } from "@expo/vector-icons";
import { useSettings, ThemeChoice } from "../store/settings";

const THEMES: ThemeChoice[] = ["System", "Light", "Dark"];

export default function ThemeScreen() {
  const insets = useSafeAreaInsets();
  const { theme, setTheme } = useSettings();

  return (
    <SafeAreaView style={s.safe} edges={["top", "bottom"]}>
      <Header title="Theme" />

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
  card: { margin: 16, backgroundColor: "#101522", borderRadius: 16, borderWidth: 1, borderColor: "#1b2338" },
  row: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 14, paddingVertical: 14 },
  rowBorder: { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: "rgba(255,255,255,0.06)" },
  rowText: { color: "#fff", fontWeight: "800" },
  hint: { color: "#9AA0A6", marginHorizontal: 16, marginTop: 8 },
});
