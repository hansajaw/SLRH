import React from "react";
import { View, Text, Pressable, StyleSheet, ScrollView } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import Header from "../../components/Header";
import { Ionicons } from "@expo/vector-icons";
import { useSettings, LanguageChoice } from "../store/settings";

const LANGS: LanguageChoice[] = ["English", "සිංහල", "தமிழ்"];

export default function LanguageScreen() {
  const insets = useSafeAreaInsets();
  const { language, setLanguage } = useSettings();

  return (
    <SafeAreaView style={s.safe} edges={["top", "bottom"]}>
      <Header title="Language" />

      <ScrollView contentContainerStyle={{ paddingBottom: 16 + insets.bottom }}>
        <View style={s.card}>
          {LANGS.map((l, i) => (
            <Pressable key={l} onPress={() => setLanguage(l)} style={[s.row, i !== LANGS.length - 1 && s.rowBorder]}>
              <Text style={[s.rowText, language === l && { color: "#00E0C6", fontWeight: "900" }]}>{l}</Text>
              {language === l && <Ionicons name="checkmark" size={18} color="#00E0C6" />}
            </Pressable>
          ))}
        </View>
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
});
