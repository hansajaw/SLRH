import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Alert,
  ScrollView,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import api from "../../utils/api"; 

export default function SecuritySettings() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [oldPwd, setOldPwd] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChangePassword = async () => {
    if (!oldPwd || !newPwd) {
      Alert.alert("Error", "Please enter both old and new passwords.");
      return;
    }

    try {
      setLoading(true);
      const res = await api.post("/users/change-password", {
        oldPassword: oldPwd,
        newPassword: newPwd,
      });
      Alert.alert("Success", res.data.message || "Password updated successfully");
      setOldPwd("");
      setNewPwd("");
      router.back();
    } catch (err: any) {
      console.error(err);
      const msg =
        err?.response?.data?.message || "Could not update password. Try again.";
      Alert.alert("Error", msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={s.safe} edges={["top", "bottom"]}>
      <View style={[s.top, { paddingTop: Math.max(8, insets.top * 0.25) }]}>
        <Pressable onPress={() => router.back()} hitSlop={10} style={s.topBtn}>
          <Ionicons name="chevron-back" size={22} color="#fff" />
        </Pressable>
        <Text style={s.topTitle}>Security</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 16 + insets.bottom }}>
        <View style={s.card}>
          <Text style={s.label}>Change Password</Text>

          <TextInput
            value={oldPwd}
            onChangeText={setOldPwd}
            placeholder="Old password"
            placeholderTextColor="#8a8f98"
            secureTextEntry
            style={s.input}
          />

          <TextInput
            value={newPwd}
            onChangeText={setNewPwd}
            placeholder="New password"
            placeholderTextColor="#8a8f98"
            secureTextEntry
            style={s.input}
          />

          <Pressable
            style={[
              s.btn,
              { backgroundColor: loading ? "#6cb9b0" : "#00E0C6" },
            ]}
            onPress={handleChangePassword}
            disabled={loading}
          >
            <Text style={[s.btnText, { color: "#001018" }]}>
              {loading ? "Updating..." : "Update Password"}
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#0b0b0b" },
  top: {
    paddingHorizontal: 16,
    paddingBottom: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  topBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  topTitle: {
    flex: 1,
    color: "#fff",
    fontSize: 20,
    fontWeight: "900",
    textAlign: "center",
  },
  card: {
    marginHorizontal: 16,
    marginTop: 12,
    padding: 14,
    backgroundColor: "#101522",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#1b2338",
  },
  label: { color: "#eaf7f5", fontWeight: "900", marginBottom: 8 },
  input: {
    height: 46,
    borderRadius: 12,
    paddingHorizontal: 12,
    backgroundColor: "#0b0f1a",
    borderWidth: 1,
    borderColor: "#1a2440",
    color: "#fff",
    marginBottom: 10,
  },
  btn: {
    height: 46,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  btnText: { fontWeight: "900" },
});
