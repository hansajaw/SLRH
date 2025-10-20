import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Switch,
  Alert,
  Keyboard,
  TouchableWithoutFeedback,
  ActivityIndicator,
} from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import SafeScreen from "../../components/SafeScreen";
import { useUser } from "../../context/UserContext";
import api from "../../utils/api";

const S = { xs: 6, sm: 10, md: 16, lg: 24, xl: 32, xxl: 40 };

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [remember, setRemember] = useState(true); // ✅ default true
  const [loading, setLoading] = useState(false);
  const { login } = useUser();

  /* -------- Handle Login -------- */
  async function onLogin() {
    if (!email || !password) {
      Alert.alert("Missing info", "Please enter email and password.");
      return;
    }
    try {
      setLoading(true);
      await login(email.trim(), password.trim(), remember);
      Alert.alert("Welcome", "Logged in successfully!");
      router.replace("/"); // ✅ correct route
    } catch (e: any) {
      console.log("Login error:", e?.response?.data || e?.message || e);
      const message =
        e?.response?.data?.message ??
        (e?.message?.includes("Network") ? "Network error — check your connection." : "Invalid email or password.");
      Alert.alert("Login failed", message);
    } finally {
      setLoading(false);
    }
  }

  /* -------- Forgot Password -------- */
  async function onForgot() {
    if (!email) {
      Alert.alert("Forgot Password", "Enter your email above first.");
      return;
    }
    try {
      setLoading(true);
      const { data } = await api.post("/auth/forgot", { email: email.trim() });
      if (data?.resetToken) {
        Alert.alert(
          "Reset Link (Dev Mode)",
          "A reset token was generated:\n\n" + data.resetToken
        );
      } else {
        Alert.alert(
          "Reset",
          data?.message ?? "If this email exists, a reset link was sent."
        );
      }
    } catch (e: any) {
      console.log("Forgot error:", e?.response?.data || e?.message);
      Alert.alert(
        "Reset failed",
        e?.response?.data?.message ?? "Unable to send reset link. Try again."
      );
    } finally {
      setLoading(false);
    }
  }

  /* -------- Render -------- */
  return (
    <SafeScreen bg="#0b0b0b">
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={{ flex: 1 }}>
          <LinearGradient
            colors={["#0E2322", "#0b0b0b"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={{ height: S.xxl + 80 }}
          />

          <View style={s.contentBottom}>
            {/* ---------- Title ---------- */}
            <View style={{ gap: S.sm }}>
              <Text style={s.title}>Welcome Back!</Text>
              <Text style={s.subtitle}>
                Please enter your email & password to access your account.
              </Text>
            </View>

            {/* ---------- Form ---------- */}
            <View style={s.card}>
              <Text style={s.label}>Email Address</Text>
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="you@email.com"
                placeholderTextColor="#8ecac1"
                style={s.input}
                autoCapitalize="none"
                keyboardType="email-address"
              />

              <Text style={[s.label, { marginTop: S.md }]}>Password</Text>
              <View style={s.inputWrap}>
                <TextInput
                  value={password}
                  onChangeText={setPassword}
                  placeholder="••••••••"
                  placeholderTextColor="#8ecac1"
                  style={[s.input, { paddingRight: 44 }]}
                  secureTextEntry={!showPw}
                />
                <Pressable
                  onPress={() => setShowPw((v) => !v)}
                  hitSlop={10}
                  style={s.eyeBtn}
                  accessibilityLabel={showPw ? "Hide password" : "Show password"}
                >
                  <Ionicons
                    name={showPw ? "eye-off" : "eye"}
                    size={20}
                    color="#9adbd2"
                  />
                </Pressable>
              </View>

              {/* ---------- Remember + Forgot ---------- */}
              <View style={[s.row, { marginTop: S.md }]}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: S.xs }}>
                  <Switch
                    value={remember}
                    onValueChange={setRemember}
                    thumbColor={remember ? "#00E0C6" : "#555"}
                    trackColor={{ true: "#00E0C622", false: "#333" }}
                  />
                  <Text style={s.small}>Remember Me</Text>
                </View>

                <Pressable onPress={onForgot}>
                  <Text style={[s.small, { color: "#00E0C6" }]}>
                    Forgot Password?
                  </Text>
                </Pressable>
              </View>
            </View>

            {/* ---------- Buttons ---------- */}
            <View style={{ gap: S.sm, marginTop: S.lg }}>
              <Pressable
                onPress={onLogin}
                style={[s.primaryBtn, loading && { opacity: 0.6 }]}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#001018" />
                ) : (
                  <Text style={s.primaryText}>Log in</Text>
                )}
              </Pressable>

              <Pressable style={s.socialBtn}>
                <Ionicons name="logo-google" size={18} color="#00E0C6" />
                <Text style={s.socialText}>Continue with Google</Text>
              </Pressable>

              <Pressable style={s.socialBtn}>
                <Ionicons name="logo-facebook" size={18} color="#00E0C6" />
                <Text style={s.socialText}>Continue with Facebook</Text>
              </Pressable>
            </View>

            {/* ---------- Footer ---------- */}
            <Text style={[s.small, { textAlign: "center", marginTop: S.lg }]}>
              New here?{" "}
              <Text
                onPress={() => router.push("/auth/signup")}
                style={{ color: "#00E0C6", fontWeight: "700" }}
              >
                Sign up
              </Text>
            </Text>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </SafeScreen>
  );
}

/* -------------------- Styles -------------------- */
const s = StyleSheet.create({
  contentBottom: {
    flex: 1,
    paddingHorizontal: S.lg,
    justifyContent: "flex-end",
    paddingBottom: S.xl,
    gap: S.md,
  },
  card: {
    backgroundColor: "#0f1418",
    borderWidth: 1,
    borderColor: "#1a2232",
    borderRadius: 16,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    color: "#EFFFFB",
    letterSpacing: 0.25,
    lineHeight: 30,
  },
  subtitle: { color: "#8ecac1", lineHeight: 22 },
  label: {
    color: "#EFFFFB",
    fontWeight: "600",
    letterSpacing: 0.2,
    marginTop: 6,
  },
  inputWrap: { position: "relative" },
  input: {
    backgroundColor: "#101418",
    borderRadius: 14,
    paddingHorizontal: 16,
    height: 50,
    borderColor: "#1a2232",
    borderWidth: 1,
    color: "#fff",
    marginTop: 6,
  },
  eyeBtn: {
    position: "absolute",
    right: 12,
    top: 6 + (50 - 24) / 2,
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  small: { color: "#8ecac1", lineHeight: 18 },
  primaryBtn: {
    height: 50,
    backgroundColor: "#00E0C6",
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#00E0C6",
    shadowOpacity: 0.25,
    shadowRadius: 12,
  },
  primaryText: {
    color: "#001018",
    fontWeight: "800",
    letterSpacing: 0.4,
  },
  socialBtn: {
    height: 50,
    backgroundColor: "#101418",
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    borderWidth: 1,
    borderColor: "#1a2232",
  },
  socialText: {
    color: "#EFFFFB",
    fontWeight: "600",
    letterSpacing: 0.2,
  },
});
