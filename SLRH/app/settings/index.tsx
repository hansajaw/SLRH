import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  Switch,
  Alert,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useTheme } from "../../context/ThemeContext";

const MODES: Array<{
  key: "system" | "light" | "dark";
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
}> = [
  { key: "system", label: "Use System Theme", icon: "phone-portrait-outline" },
  { key: "light", label: "Light", icon: "sunny-outline" },
  { key: "dark", label: "Dark", icon: "moon-outline" },
];

export default function SettingsScreen() {
  const { theme, palette, setTheme } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [muted, setMuted] = useState(false);

  const handleMuteToggle = (value: boolean) => {
    setMuted(value);
    Alert.alert(
      value ? "Notifications Muted" : "Notifications Unmuted",
      value
        ? "You’ll no longer receive app notifications."
        : "Notifications have been re-enabled."
    );
  };

  return (
    <SafeAreaView
      style={[s.safe, { backgroundColor: palette.background, paddingBottom: insets.bottom }]}
    >
      <ScrollView
        contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* 🌗 Theme Section */}
        <View
          style={[
            s.card,
            { backgroundColor: palette.card, borderColor: palette.border },
          ]}
        >
          <Text style={[s.sectionTitle, { color: palette.text }]}>Appearance</Text>
          <Text style={[s.sub, { color: palette.textSecondary }]}>
            Choose how SLRH looks across the app.
          </Text>

          <View style={{ height: 10 }} />
          {MODES.map((m) => {
            const active = theme === m.key;
            return (
              <Pressable
                key={m.key}
                onPress={() => setTheme(m.key)}
                style={[
                  s.row,
                  {
                    backgroundColor: active ? palette.accent + "1A" : "transparent",
                    borderColor: active ? palette.accent : palette.border,
                  },
                ]}
              >
                <View
                  style={[
                    s.leftIcon,
                    {
                      backgroundColor: palette.background,
                      borderColor: palette.border,
                    },
                  ]}
                >
                  <Ionicons
                    name={m.icon}
                    size={16}
                    color={active ? palette.accent : palette.textSecondary}
                  />
                </View>
                <Text style={[s.optionLabel, { color: palette.text }]}>
                  {m.label}
                </Text>
                <Ionicons
                  name={active ? "radio-button-on" : "radio-button-off"}
                  size={20}
                  color={active ? palette.accent : palette.textSecondary}
                />
              </Pressable>
            );
          })}
        </View>

        {/* 👤 Account Section */}
        <View
          style={[
            s.card,
            { backgroundColor: palette.card, borderColor: palette.border },
          ]}
        >
          <Text style={[s.sectionTitle, { color: palette.text }]}>Account</Text>

          <Pressable
            style={[s.row, { borderColor: palette.border }]}
            onPress={() => router.push("/settings/changePassword")}
          >
            <View
              style={[
                s.leftIcon,
                { backgroundColor: palette.background, borderColor: palette.border },
              ]}
            >
              <Ionicons name="lock-closed-outline" size={16} color={palette.accent} />
            </View>
            <Text style={[s.optionLabel, { color: palette.text }]}>
              Change Password
            </Text>
            <Ionicons name="chevron-forward" size={18} color={palette.textSecondary} />
          </Pressable>

          <View style={[s.row, { borderColor: palette.border }]}>
            <View
              style={[
                s.leftIcon,
                { backgroundColor: palette.background, borderColor: palette.border },
              ]}
            >
              <Ionicons name="notifications-outline" size={16} color={palette.accent} />
            </View>
            <Text style={[s.optionLabel, { color: palette.text }]}>
              Mute Notifications
            </Text>
            <Switch
              value={muted}
              onValueChange={handleMuteToggle}
              thumbColor={muted ? palette.accent : palette.border}
              trackColor={{
                true: palette.accent + "33",
                false: palette.border,
              }}
            />
          </View>
        </View>

        {/* 📜 Legal Section */}
        <View
          style={[
            s.card,
            { backgroundColor: palette.card, borderColor: palette.border },
          ]}
        >
          <Text style={[s.sectionTitle, { color: palette.text }]}>Legal</Text>

          <Pressable
            style={[s.row, { borderColor: palette.border }]}
            onPress={() => router.push("/legal/privacy")}
          >
            <View
              style={[
                s.leftIcon,
                { backgroundColor: palette.background, borderColor: palette.border },
              ]}
            >
              <Ionicons name="shield-checkmark-outline" size={16} color={palette.accent} />
            </View>
            <Text style={[s.optionLabel, { color: palette.text }]}>
              Privacy Policy
            </Text>
            <Ionicons name="chevron-forward" size={18} color={palette.textSecondary} />
          </Pressable>

          <Pressable
            style={[s.row, { borderColor: palette.border }]}
            onPress={() => router.push("/legal/terms")}
          >
            <View
              style={[
                s.leftIcon,
                { backgroundColor: palette.background, borderColor: palette.border },
              ]}
            >
              <Ionicons name="document-text-outline" size={16} color={palette.accent} />
            </View>
            <Text style={[s.optionLabel, { color: palette.text }]}>
              Terms & Conditions
            </Text>
            <Ionicons name="chevron-forward" size={18} color={palette.textSecondary} />
          </Pressable>
        </View>

        {/* ⚙️ Other Section */}
        <View
          style={[
            s.card,
            { backgroundColor: palette.card, borderColor: palette.border },
          ]}
        >
          <Text style={[s.sectionTitle, { color: palette.text }]}>General</Text>

          <Pressable
            style={[s.row, { borderColor: palette.border }]}
            onPress={() =>
              Alert.alert("Coming Soon", "Support and feedback options coming soon!")
            }
          >
            <View
              style={[
                s.leftIcon,
                { backgroundColor: palette.background, borderColor: palette.border },
              ]}
            >
              <Ionicons name="chatbubble-outline" size={16} color={palette.accent} />
            </View>
            <Text style={[s.optionLabel, { color: palette.text }]}>
              Contact Support
            </Text>
            <Ionicons name="chevron-forward" size={18} color={palette.textSecondary} />
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

/* -------------------- Styles -------------------- */
const s = StyleSheet.create({
  safe: { paddingTop:-50},
  top: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  card: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
    marginBottom: 16,
  },
  sectionTitle: { fontSize: 16, fontWeight: "900" },
  sub: { marginTop: 4 },
  row: {
    marginTop: 10,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  leftIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  optionLabel: { flex: 1, fontWeight: "700" },
});
