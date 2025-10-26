import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import SafeScreen from "../../components/SafeScreen";
import { useUser } from "../../context/UserContext";
import { useTheme } from "../../context/ThemeContext";
import api from "../../utils/api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);
  const { login } = useUser();
  const { palette } = useTheme();

  async function onLogin() {
    if (!email || !password) {
      Alert.alert("Missing info", "Please enter email and password.");
      return;
    }
    try {
      setLoading(true);
      await login(email.trim(), password.trim(), remember);
      router.replace("/(tabs)");
    } catch (e: any) {
      const message =
        e?.response?.data?.message ??
        (e?.message?.includes("Network")
          ? "Network error — check your connection."
          : "Invalid email or password.");
      Alert.alert("Login failed", message);
    } finally {
      setLoading(false);
    }
  }

  function onGoogle() {
    Alert.alert("Google Sign-in", "Hook your Google OAuth flow here.");
  }
  function onFacebook() {
    Alert.alert("Facebook Sign-in", "Hook your Facebook OAuth flow here.");
  }

  return (
    <SafeScreen bg={palette.background}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={[s.container, { backgroundColor: palette.background }]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={s.centerBox}>
            <Text style={[s.title, { color: palette.text }]}>Welcome Back!</Text>
            <Text style={[s.subtitle, { color: palette.textSecondary }]}>
              Sign in to continue your racing journey
            </Text>

            {/* Input Card */}
            <View
              style={[
                s.card,
                { backgroundColor: palette.card, borderColor: palette.border },
              ]}
            >
              <Text style={[s.label, { color: palette.text }]}>Email Address</Text>
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="you@email.com"
                placeholderTextColor={palette.textSecondary}
                style={[
                  s.input,
                  {
                    backgroundColor: palette.input,
                    color: palette.text,
                    borderColor: palette.border,
                  },
                ]}
                autoCapitalize="none"
                keyboardType="email-address"
              />

              <Text style={[s.label, { color: palette.text, marginTop: 16 }]}>
                Password
              </Text>
              <View style={s.inputWrap}>
                <TextInput
                  value={password}
                  onChangeText={setPassword}
                  placeholder="••••••••"
                  placeholderTextColor={palette.textSecondary}
                  style={[
                    s.input,
                    {
                      backgroundColor: palette.input,
                      color: palette.text,
                      borderColor: palette.border,
                      paddingRight: 44,
                    },
                  ]}
                  secureTextEntry={!showPw}
                />
                <Pressable onPress={() => setShowPw(!showPw)} style={s.eyeBtn}>
                  <Ionicons
                    name={showPw ? "eye-off" : "eye"}
                    size={20}
                    color={palette.accent}
                  />
                </Pressable>
              </View>
            </View>

            {/* Buttons */}
            <View style={{ gap: 12, marginTop: 20, width: "100%" }}>
              <Pressable
                onPress={onLogin}
                style={[
                  s.primaryBtn,
                  { backgroundColor: palette.accent },
                  loading && { opacity: 0.6 },
                ]}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color={palette.background} />
                ) : (
                  <Text style={[s.primaryText, { color: palette.background }]}>
                    Log In
                  </Text>
                )}
              </Pressable>

              <Pressable
                onPress={onGoogle}
                style={[
                  s.socialBtn,
                  { backgroundColor: palette.input, borderColor: palette.border },
                ]}
              >
                <Ionicons name="logo-google" size={18} color={palette.accent} />
                <Text style={[s.socialText, { color: palette.text }]}>
                  Continue with Google
                </Text>
              </Pressable>

              <Pressable
                onPress={onFacebook}
                style={[
                  s.socialBtn,
                  { backgroundColor: palette.input, borderColor: palette.border },
                ]}
              >
                <Ionicons name="logo-facebook" size={18} color={palette.accent} />
                <Text style={[s.socialText, { color: palette.text }]}>
                  Continue with Facebook
                </Text>
              </Pressable>
            </View>

            <Text
              style={[
                s.footerText,
                { color: palette.textSecondary, marginTop: 20 },
              ]}
            >
              New here?{" "}
              <Text
                style={{ color: palette.accent, fontWeight: "700" }}
                onPress={() => router.push("/auth/signup")}
              >
                Sign up
              </Text>
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeScreen>
  );
}

const s = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  centerBox: { alignItems: "center", width: "100%" },
  title: { fontSize: 26, fontWeight: "900", marginBottom: 4 },
  subtitle: { fontSize: 14, marginBottom: 20 },
  card: {
    width: "100%",
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
  },
  label: { fontWeight: "700", marginBottom: 4 },
  input: {
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 14,
    height: 48,
  },
  inputWrap: { position: "relative" },
  eyeBtn: {
    position: "absolute",
    right: 12,
    top: (48 - 24) / 2,
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryBtn: {
    height: 50,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryText: { fontWeight: "900", fontSize: 16 },
  socialBtn: {
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  socialText: { fontWeight: "600" },
  footerText: { textAlign: "center", fontWeight: "600" },
});
