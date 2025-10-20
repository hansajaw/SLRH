// app/profile/edit.tsx
import React, { useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet, Alert, ScrollView } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useUser } from "../../context/UserContext";

export default function EditProfile() {
  const { user, updateProfile } = useUser();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [form, setForm] = useState({
    fullName: user?.fullName || "",
    phone: user?.phone || "",
    address1: user?.address1 || "",
    address2: user?.address2 || "",
    city: user?.city || "",
    zip: user?.zip || "",
  });

  const onSave = async () => {
    try {
      await updateProfile(form);
      Alert.alert("Success", "Profile updated successfully");
      router.back();
    } catch (err: any) {
      Alert.alert("Error", err.message || "Failed to update profile");
    }
  };

  return (
    <SafeAreaView style={s.safe} edges={["top", "bottom"]}>
      <View style={[s.top, { paddingTop: Math.max(8, insets.top * 0.25) }]}>
        <Pressable onPress={() => router.back()} hitSlop={10} style={s.topBtn}>
          <Ionicons name="chevron-back" size={22} color="#fff" />
        </Pressable>
        <Text style={s.topTitle}>Edit Profile</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 20 + insets.bottom }}>
        <View style={s.card}>
          {Object.entries(form).map(([key, value]) => (
            <View key={key} style={{ marginBottom: 12 }}>
              <Text style={s.label}>{key.charAt(0).toUpperCase() + key.slice(1)}</Text>
              <TextInput
                style={s.input}
                placeholder={`Enter ${key}`}
                placeholderTextColor="#888"
                value={value}
                onChangeText={(t) => setForm({ ...form, [key]: t })}
              />
            </View>
          ))}

          <Pressable style={[s.btn, { backgroundColor: "#00E0C6" }]} onPress={onSave}>
            <Text style={[s.btnText, { color: "#001018" }]}>Save Changes</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#0b0b0b" },
  top: { paddingHorizontal: 16, paddingBottom: 8, flexDirection: "row", alignItems: "center" },
  topBtn: { width: 36, height: 36, borderRadius: 18, alignItems: "center", justifyContent: "center" },
  topTitle: { flex: 1, color: "#fff", fontSize: 20, fontWeight: "900", textAlign: "center" },
  card: { marginHorizontal: 16, marginTop: 12, padding: 14, backgroundColor: "#101522", borderRadius: 16, borderWidth: 1, borderColor: "#1b2338" },
  label: { color: "#eaf7f5", fontWeight: "900", marginBottom: 4 },
  input: {
    height: 46,
    borderRadius: 12,
    paddingHorizontal: 12,
    backgroundColor: "#0b0f1a",
    borderWidth: 1,
    borderColor: "#1a2440",
    color: "#fff",
  },
  btn: { height: 46, borderRadius: 12, alignItems: "center", justifyContent: "center", marginTop: 12 },
  btnText: { fontWeight: "900" },
});
