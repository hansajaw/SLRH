// app/settings/change-password.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  Alert,
  Platform,
  ActivityIndicator,
  KeyboardAvoidingView,
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../context/ThemeContext";

const API_BASE = __DEV__
  ? Platform.OS === "android"
    ? "http://10.0.2.2:3001"
    : "http://localhost:3001"
  : "https://slrh-4cql.vercel.app";

export default function ChangePassword() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const insets = useSafeAreaInsets();
  const { palette } = useTheme();

  const submit = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      return Alert.alert("Missing fields", "Please fill all fields.");
    }
    if (newPassword !== confirmPassword) {
      return Alert.alert("Mismatch", "New password and confirmation do not match.");
    }

    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("token");
      const res = await fetch(`${API_BASE}/api/v1/users/change-password`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok)
        return Alert.alert("Error", data?.message ?? "Failed to change password");

      Alert.alert("Success", "Password updated successfully.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch {
      Alert.alert("Network Error", "Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: palette.background, paddingTop: -50 }}
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={{
            padding: 20,
            paddingBottom: 40 + insets.bottom,
          }}
          showsVerticalScrollIndicator={false}
        >
          <Text
            style={{
              fontSize: 22,
              fontWeight: "900",
              color: palette.text,
              marginBottom: 30,
            }}
          >
            Change Password
          </Text>

          <View style={{ gap: 16 }}>
            <InputField
              label="Current Password"
              value={currentPassword}
              onChangeText={setCurrentPassword}
              secureTextEntry
              placeholder="Enter current password"
              palette={palette}
            />
            <InputField
              label="New Password"
              value={newPassword}
              onChangeText={setNewPassword}
              secureTextEntry
              placeholder="Enter new password"
              palette={palette}
            />
            <InputField
              label="Confirm New Password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              placeholder="Confirm new password"
              palette={palette}
            />

            <Pressable
              onPress={submit}
              disabled={loading}
              style={{
                backgroundColor: palette.accent,
                borderRadius: 12,
                height: 50,
                alignItems: "center",
                justifyContent: "center",
                marginTop: 10,
                flexDirection: "row",
                gap: 8,
              }}
            >
              {loading ? (
                <ActivityIndicator color={palette.background} />
              ) : (
                <>
                  <Ionicons name="lock-closed-outline" size={18} color={palette.background} />
                  <Text
                    style={{
                      color: palette.background,
                      fontWeight: "900",
                      fontSize: 16,
                    }}
                  >
                    Save Changes
                  </Text>
                </>
              )}
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

/* -------------------- Reusable Input Field -------------------- */
function InputField({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry,
  palette,
}: {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
  palette: any;
}) {
  return (
    <View>
      <Text
        style={{
          color: palette.textSecondary,
          fontWeight: "700",
          marginBottom: 6,
          fontSize: 14,
        }}
      >
        {label}
      </Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={palette.textSecondary + "80"}
        secureTextEntry={secureTextEntry}
        style={{
          borderWidth: 1,
          borderColor: palette.border,
          backgroundColor: palette.card,
          borderRadius: 12,
          paddingHorizontal: 14,
          paddingVertical: 12,
          color: palette.text,
          fontSize: 15,
        }}
      />
    </View>
  );
}
