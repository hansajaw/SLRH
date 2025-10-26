import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { AxiosError } from "axios";
import SafeScreen from "../../components/SafeScreen";
import { useUser } from "../../context/UserContext";
import { api } from "../../lib/api";
import { useTheme } from "../../context/ThemeContext";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [showPw2, setShowPw2] = useState(false);
  const [agree, setAgree] = useState(false);
  const [loading, setLoading] = useState(false);
  const { palette } = useTheme();
  const { login } = useUser();

  function validate() {
    if (!email || !pw || !pw2) return "Please fill in all fields.";
    if (!email.includes("@")) return "Enter a valid email address.";
    if (pw.length < 6) return "Password must be at least 6 characters long.";
    if (pw !== pw2) return "Passwords do not match.";
    if (!agree) return "You must agree to the Terms and Privacy Policy.";
    return "";
  }

  async function onContinue() {
    const err = validate();
    if (err) return Alert.alert("Check details", err);

    try {
      setLoading(true);
      await api.post("/auth/signup", {
        email: email.trim(),
        password: pw,
        confirmPassword: pw2,
      });
      await login(email.trim(), pw, true);
      router.push({ pathname: "/auth/profile-setup", params: { email } });
    } catch (error) {
      const e = error as AxiosError<{ message?: string }>;
      const message =
        e?.response?.data?.message ||
        (e?.message?.includes("Network")
          ? "Cannot reach server. Is the backend running?"
          : "Please try again.");
      Alert.alert("Signup failed", message);
    } finally {
      setLoading(false);
    }
  }

  function onGoogle() {
    Alert.alert("Google Sign-up", "Hook your Google OAuth flow here.");
  }
  function onFacebook() {
    Alert.alert("Facebook Sign-up", "Hook your Facebook OAuth flow here.");
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
            <Text style={[s.title, { color: palette.text }]}>Create Account</Text>
            <Text style={[s.subtitle, { color: palette.textSecondary }]}>
              Join the racing community now
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

              <Text style={[s.label, { marginTop: 16, color: palette.text }]}>
                Password
              </Text>
              <View style={s.inputWrap}>
                <TextInput
                  value={pw}
                  onChangeText={setPw}
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

              <Text style={[s.label, { marginTop: 16, color: palette.text }]}>
                Confirm Password
              </Text>
              <View style={s.inputWrap}>
                <TextInput
                  value={pw2}
                  onChangeText={setPw2}
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
                  secureTextEntry={!showPw2}
                />
                <Pressable onPress={() => setShowPw2(!showPw2)} style={s.eyeBtn}>
                  <Ionicons
                    name={showPw2 ? "eye-off" : "eye"}
                    size={20}
                    color={palette.accent}
                  />
                </Pressable>
              </View>

              {/* Agree */}
              <Pressable style={s.checkRow} onPress={() => setAgree(!agree)}>
                <View
                  style={[
                    s.checkbox,
                    {
                      borderColor: agree ? palette.accent : palette.textSecondary,
                      backgroundColor: agree ? palette.accent : "transparent",
                    },
                  ]}
                >
                  {agree && (
                    <Ionicons name="checkmark" size={16} color={palette.background} />
                  )}
                </View>
                <Text style={[s.agreeText, { color: palette.textSecondary }]}>
                  I agree to the{" "}
                  <Text style={{ color: palette.accent, fontWeight: "800" }}>
                    Terms of Service
                  </Text>{" "}
                  and{" "}
                  <Text style={{ color: palette.accent, fontWeight: "800" }}>
                    Privacy Policy
                  </Text>
                  .
                </Text>
              </Pressable>
            </View>

            {/* Buttons */}
            <View style={{ gap: 12, marginTop: 20, width: "100%" }}>
              <Pressable
                onPress={onContinue}
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
                    Continue
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
                  Sign up with Google
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
                  Sign up with Facebook
                </Text>
              </Pressable>
            </View>

            <Text
              style={[
                s.footerText,
                { color: palette.textSecondary, marginTop: 20 },
              ]}
            >
              Already have an account?{" "}
              <Text
                style={{ color: palette.accent, fontWeight: "800" }}
                onPress={() => router.push("/auth/login")}
              >
                Log in
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
  checkRow: { flexDirection: "row", alignItems: "center", gap: 8, marginTop: 14 },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1.4,
    alignItems: "center",
    justifyContent: "center",
  },
  agreeText: { flex: 1, flexWrap: "wrap" },
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
  footerText: { textAlign: "center", fontWeight: "600"}
})
