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
import { useRouter } from "expo-router";
import { useUser } from "../../context/UserContext";
import { useTheme } from "../../context/ThemeContext";

export default function EditProfile() {
  const { user, updateProfile } = useUser();
  const { palette } = useTheme();
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
    <SafeAreaView
      style={[s.safe, { backgroundColor: palette.background }]}
      edges={["top", "bottom"]}
    >

      {/* ======= Form ======= */}
      <ScrollView contentContainerStyle={{ paddingBottom: 20 + insets.bottom }}>
        <View
          style={[
            s.card,
            { backgroundColor: palette.card, borderColor: palette.border },
          ]}
        >
          {Object.entries(form).map(([key, value]) => (
            <View key={key} style={{ marginBottom: 12 }}>
              <Text style={[s.label, { color: palette.text }]}>
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </Text>
              <TextInput
                style={[
                  s.input,
                  {
                    backgroundColor: palette.input,
                    color: palette.text,
                    borderColor: palette.border,
                  },
                ]}
                placeholder={`Enter ${key}`}
                placeholderTextColor={palette.textSecondary}
                value={value}
                onChangeText={(t) => setForm({ ...form, [key]: t })}
              />
            </View>
          ))}

          <Pressable
            style={[s.btn, { backgroundColor: palette.accent }]}
            onPress={onSave}
          >
            <Text style={[s.btnText, { color: palette.background }]}>
              Save Changes
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { paddingTop:-50},

  card: {
    marginHorizontal: 16,
    marginTop: 20,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
  },
  label: { fontWeight: "900", marginBottom: 4 },
  input: {
    height: 46,
    borderRadius: 12,
    paddingHorizontal: 12,
    borderWidth: 1,
  },
  btn: {
    height: 46,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 16,
  },
  btnText: { fontWeight: "900", fontSize: 16 },
});
