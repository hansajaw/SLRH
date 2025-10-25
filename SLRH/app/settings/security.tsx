import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Alert,
  ScrollView,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import Header from "../../components/Header";
import api from "../../utils/api"; 

export default function SecuritySettings() {
  const insets = useSafeAreaInsets();

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
      <Header title="Security" />

      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
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
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#0b0b0b" },
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
