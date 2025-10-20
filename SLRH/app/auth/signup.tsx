import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import SafeScreen from "../../components/SafeScreen";
import { useUser } from "../../context/UserContext";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [showPw2, setShowPw2] = useState(false);
  const [agree, setAgree] = useState(false);
  const [loading, setLoading] = useState(false);

  const { signup } = useUser();

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
      await signup(email.split("@")[0], email, pw);

      // If signup succeeded → go to profile setup
      router.push({ pathname: "/auth/profile-setup", params: { email } });
    } catch (e: any) {
      console.log("Signup error:", e?.response?.data || e?.message || e);
      const message =
        e?.response?.data?.message ||
        (e?.message?.includes("Network")
          ? "Cannot reach server. Is the backend running on port 3001?"
          : "Please try again.");
      Alert.alert("Signup failed", message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeScreen bg="#0b0b0b">
      <LinearGradient
        colors={["#0E2322", "#0b0b0b"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ height: 140 }}
      />

      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
        <Text style={s.title}>Create Your Account</Text>
        <Text style={s.subtitle}>Join the racing community now</Text>

        <Text style={s.label}>Email Address</Text>
        <TextInput
          value={email}
          onChangeText={setEmail}
          placeholder="you@email.com"
          placeholderTextColor="#777"
          style={s.input}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <Text style={s.label}>Password</Text>
        <View style={s.inputWrap}>
          <TextInput
            value={pw}
            onChangeText={setPw}
            placeholder="••••••••"
            placeholderTextColor="#777"
            style={[s.input, { paddingRight: 44 }]}
            secureTextEntry={!showPw}
          />
          <Pressable
            onPress={() => setShowPw((v) => !v)}
            hitSlop={10}
            style={s.eyeBtn}
            accessibilityLabel={showPw ? "Hide password" : "Show password"}
          >
            <Ionicons name={showPw ? "eye-off" : "eye"} size={20} color="#9adbd2" />
          </Pressable>
        </View>

        <Text style={s.label}>Confirm Password</Text>
        <View style={s.inputWrap}>
          <TextInput
            value={pw2}
            onChangeText={setPw2}
            placeholder="••••••••"
            placeholderTextColor="#777"
            style={[s.input, { paddingRight: 44 }]}
            secureTextEntry={!showPw2}
          />
          <Pressable
            onPress={() => setShowPw2((v) => !v)}
            hitSlop={10}
            style={s.eyeBtn}
            accessibilityLabel={showPw2 ? "Hide password" : "Show password"}
          >
            <Ionicons name={showPw2 ? "eye-off" : "eye"} size={20} color="#9adbd2" />
          </Pressable>
        </View>

        {/* Agree to Terms */}
        <Pressable style={s.checkRow} onPress={() => setAgree(!agree)}>
          <View
            style={[
              s.checkbox,
              agree && { backgroundColor: "#00E0C6", borderColor: "#00E0C6" },
            ]}
          >
            {agree && <Ionicons name="checkmark" size={16} color="#001018" />}
          </View>
          <Text style={s.agreeText}>
            I agree to the <Text style={s.link}>Terms of Service</Text> and{" "}
            <Text style={s.link}>Privacy Policy</Text>.
          </Text>
        </Pressable>

        {/* Continue Button */}
        <Pressable
          onPress={onContinue}
          style={[s.primaryBtn, loading && { opacity: 0.6 }]}
          disabled={loading}
        >
          <Text style={s.primaryText}>{loading ? "Please wait…" : "Continue"}</Text>
        </Pressable>

        {/* Social Logins */}
        <Pressable style={s.socialBtn} accessibilityLabel="Continue with Google">
          <Ionicons name="logo-google" size={18} color="#fff" />
          <Text style={s.socialText}>Continue with Google</Text>
        </Pressable>

        <Pressable style={s.socialBtn} accessibilityLabel="Continue with Facebook">
          <Ionicons name="logo-facebook" size={18} color="#1877F2" />
          <Text style={s.socialText}>Continue with Facebook</Text>
        </Pressable>

        <Text style={[s.footerText, { marginTop: 20 }]}>
          Already have an account?{" "}
          <Text style={s.link} onPress={() => router.push("/auth/login")}>
            Log in
          </Text>
        </Text>
      </ScrollView>
    </SafeScreen>
  );
}

const s = StyleSheet.create({
  scroll: { paddingHorizontal: 20, paddingTop: 10, paddingBottom: 60 },
  title: { fontSize: 24, fontWeight: "900", color: "#EFFFFB", marginBottom: 4 },
  subtitle: { color: "#9adbd2", marginBottom: 16, fontWeight: "600" },
  label: { color: "#CFF9F3", fontWeight: "700", marginTop: 12, marginBottom: 6 },
  inputWrap: { position: "relative" },
  input: {
    backgroundColor: "#101418",
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 48,
    borderColor: "#1a2232",
    borderWidth: 1,
    color: "#fff",
  },
  eyeBtn: {
    position: "absolute",
    right: 12,
    top: (48 - 24) / 2,
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  checkRow: { flexDirection: "row", alignItems: "center", gap: 8, marginTop: 18 },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderColor: "#aaa",
    borderWidth: 1.4,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
  },
  agreeText: { color: "#d9e9e7", flex: 1, flexWrap: "wrap" },
  link: { color: "#00E0C6", fontWeight: "800" },
  primaryBtn: {
    marginTop: 20,
    height: 48,
    backgroundColor: "#00E0C6",
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryText: { color: "#001018", fontWeight: "900", fontSize: 16 },
  socialBtn: {
    marginTop: 12,
    height: 48,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#1a2232",
    backgroundColor: "#0f1620",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  socialText: { color: "#EFFFFB", fontWeight: "700" },
  footerText: { color: "#9adbd2", textAlign: "center", fontWeight: "600" },
});
