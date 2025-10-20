import React from "react";
import { View, Text, Pressable, StyleSheet, Switch, ScrollView } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSettings } from "../store/settings";

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const sset = useSettings();

  return (
    <SafeAreaView style={s.safe} edges={["top", "bottom"]}>
      <View style={[s.top, { paddingTop: Math.max(8, insets.top * 0.25) }]}>
        <Pressable onPress={() => router.back()} hitSlop={10} style={s.topBtn}>
          <Ionicons name="chevron-back" size={22} color="#fff" />
        </Pressable>
        <Text style={s.topTitle}>Settings</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 16 + insets.bottom }}>
        <Section title="Account">
          <SettingLink icon="person-circle-outline" title="Profile" onPress={() => router.push("/profile")} />
          <SettingLink
            icon="shield-checkmark-outline"
            title="Security"
            subtitle="Password & 2-step verification"
            onPress={() => router.push("/settings/security")}
          />
        </Section>

        <Section title="Preferences">
          <SettingLink
            icon="language-outline"
            title="Language"
            subtitle={sset.language}
            onPress={() => router.push("/settings/language")}
          />
          <SettingLink
            icon="color-palette-outline"
            title="Theme"
            subtitle={sset.theme}
            onPress={() => router.push("/settings/theme")}
          />
        </Section>

        <Section title="Notifications">
          <SettingSwitch
            icon="notifications-outline"
            title="Push Notifications"
            value={sset.pushEnabled}
            onValueChange={sset.setPush}
          />
          <SettingSwitch
            icon="mail-outline"
            title="Email Updates"
            value={sset.emailEnabled}
            onValueChange={sset.setEmail}
          />
        </Section>

        <Section title="Privacy & Data">
          <SettingSwitch
            icon="analytics-outline"
            title="Share anonymous analytics"
            value={sset.analyticsAllowed}
            onValueChange={sset.setAnalytics}
          />
        </Section>
      </ScrollView>
    </SafeAreaView>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={s.section}>
      <Text style={s.sectionTitle}>{title}</Text>
      <View style={{ marginTop: 8 }}>{children}</View>
    </View>
  );
}

function SettingLink({
  icon,
  title,
  subtitle,
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle?: string;
  onPress?: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={s.row}>
      <Ionicons name={icon} size={20} color="#9adbd2" style={{ width: 28 }} />
      <View style={{ flex: 1 }}>
        <Text style={s.rowTitle}>{title}</Text>
        {!!subtitle && <Text style={s.rowSub}>{subtitle}</Text>}
      </View>
      <Ionicons name="chevron-forward" size={18} color="#9AA0A6" />
    </Pressable>
  );
}

function SettingSwitch({
  icon,
  title,
  value,
  onValueChange,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  value: boolean;
  onValueChange: (v: boolean) => void;
}) {
  return (
    <View style={s.row}>
      <Ionicons name={icon} size={20} color="#9adbd2" style={{ width: 28 }} />
      <Text style={[s.rowTitle, { flex: 1 }]}>{title}</Text>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: "#2b2b2b", true: "#00E0C6" }}
        thumbColor="#fff"
      />
    </View>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#0b0b0b" },
  top: { paddingHorizontal: 16, paddingBottom: 8, backgroundColor: "#0b0b0b", flexDirection: "row", alignItems: "center" },
  topBtn: { width: 36, height: 36, borderRadius: 18, alignItems: "center", justifyContent: "center" },
  topTitle: { flex: 1, color: "#fff", fontSize: 20, fontWeight: "900", textAlign: "center" },

  section: { marginHorizontal: 16, marginTop: 12, padding: 12, backgroundColor: "#101522", borderRadius: 16, borderWidth: 1, borderColor: "#1b2338" },
  sectionTitle: { color: "#e8f6f4", fontWeight: "900", fontSize: 14 },

  row: { flexDirection: "row", alignItems: "center", paddingVertical: 12, gap: 10, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: "rgba(255,255,255,0.06)" },
  rowTitle: { color: "#fff", fontWeight: "800" },
  rowSub: { color: "#A7AFB5", marginTop: 2 },
});
