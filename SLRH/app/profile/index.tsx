import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Alert,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { useUser } from "../../context/UserContext";

export default function UserProfile() {
  const { user, logout, updateAvatar } = useUser(); // 👈 assumes updateAvatar() in context
  const insets = useSafeAreaInsets();
  const [uploading, setUploading] = useState(false);

  const me = useMemo(
    () => ({
      fullName: user?.fullName ?? "User",
      email: user?.email ?? "unknown@example.com",
      phone: user?.phone ?? "N/A",
      address1: user?.address1 ?? "",
      address2: user?.address2 ?? "",
      city: user?.city ?? "",
      zip: user?.zip ?? "",
      avatarUri: user?.avatarUri,
    }),
    [user]
  );

  const onEdit = () => router.push("/profile/edit" as any);
  const onSecurity = () => router.push("/settings/security" as any);

  const confirmSignOut = () => {
    Alert.alert(
      "Confirm Sign Out",
      "Are you sure you want to sign out?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Sign Out",
          style: "destructive",
          onPress: async () => {
            await logout();
            router.replace("/auth/login" as any);
          },
        },
      ],
      { cancelable: true }
    );
  };

  /* ---------------- Upload Avatar ---------------- */
  const pickAvatar = async () => {
    try {
      const permissionResult =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissionResult.granted) {
        Alert.alert("Permission required", "Please allow access to your gallery.");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const uri = result.assets[0].uri;
        setUploading(true);
        // updateAvatar() should save to your backend or context
        await updateAvatar?.(uri);
        setUploading(false);
      }
    } catch (e) {
      console.warn("Image picker error:", e);
      setUploading(false);
    }
  };

  return (
    <SafeAreaView style={s.safe} edges={["top", "bottom"]}>
      <View style={[s.headerWrap, { paddingTop: Math.max(8, insets.top) }]}>
        <LinearGradient
          colors={["#0E2322", "#0b0b0b"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={s.headerBg}
        >
          {/* ---------- Top Bar ---------- */}
          <View style={s.topRow}>
            <Pressable onPress={() => router.back()} style={s.iconBtn}>
              <Ionicons name="chevron-back" size={22} color="#CFF9F3" />
            </Pressable>
            <Text style={s.title}>Profile</Text>
            <View style={{ width: 40 }} />
          </View>

          {/* ---------- Avatar ---------- */}
          <View style={s.avatarSlot}>
            <View style={s.avatarRing}>
              {me.avatarUri ? (
                <Image source={{ uri: me.avatarUri }} style={s.avatar} />
              ) : (
                <View style={[s.avatar, s.avatarFallback]}>
                  <Text style={s.avatarInitial}>
                    {me.fullName?.[0] ?? "U"}
                  </Text>
                </View>
              )}

              {/* 📸 Upload Button */}
              <Pressable style={s.cameraBtn} onPress={pickAvatar}>
                <Ionicons
                  name={uploading ? "time-outline" : "camera-outline"}
                  size={18}
                  color="#fff"
                />
              </Pressable>
            </View>
          </View>

          <Text style={s.name}>{me.fullName}</Text>
          <Text style={s.email}>{me.email}</Text>
        </LinearGradient>
      </View>

      {/* ---------- Profile Details ---------- */}
      <ScrollView
        contentContainerStyle={{ paddingBottom: 20 + insets.bottom }}
        showsVerticalScrollIndicator={false}
      >
        <View style={s.card}>
          <Field icon="mail-outline" label="Email" value={me.email} />
          <Divider />
          <Field icon="call-outline" label="Phone" value={me.phone} />
        </View>

        <View style={[s.card, { marginTop: 14 }]}>
          <Field icon="home-outline" label="Address line 1" value={me.address1} />
          <Field icon="home-outline" label="Address line 2" value={me.address2} />
          <Divider />
          <View style={s.row}>
            <View style={{ flex: 1 }}>
              <Field
                icon="location-outline"
                label="City"
                value={me.city}
                compact
              />
            </View>
            <View style={{ width: 150 }}>
              <Field
                icon="pricetag-outline"
                label="ZIP / Postal"
                value={me.zip}
                compact
              />
            </View>
          </View>
        </View>

        <View style={{ paddingHorizontal: 16, marginTop: 14 }}>
          <Pressable
            style={[s.primaryBtn, { backgroundColor: "#00E0C6" }]}
            onPress={onEdit}
          >
            <Ionicons name="create-outline" size={18} color="#001018" />
            <Text style={[s.primaryTxt, { color: "#001018" }]}>Edit Profile</Text>
          </Pressable>

          <Pressable
            style={[s.primaryBtn, { backgroundColor: "#ef4444", marginTop: 10 }]}
            onPress={onSecurity}
          >
            <Ionicons name="shield-checkmark-outline" size={18} color="#fff" />
            <Text style={[s.primaryTxt, { color: "#fff" }]}>
              Manage Security
            </Text>
          </Pressable>

          <Pressable
            style={[
              s.primaryBtn,
              {
                backgroundColor: "#101522",
                borderWidth: 1,
                borderColor: "#20293c",
                marginTop: 10,
              },
            ]}
            onPress={confirmSignOut}
          >
            <Ionicons name="log-out-outline" size={18} color="#fff" />
            <Text style={[s.primaryTxt, { color: "#fff" }]}>Sign Out</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

/* ------------------ Small Components ------------------ */
function Field({
  icon,
  label,
  value,
  compact = false,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value?: string;
  compact?: boolean;
}) {
  return (
    <View style={{ marginBottom: compact ? 6 : 12 }}>
      <View style={s.fieldHead}>
        <View style={s.fieldHeadL}>
          <Ionicons name={icon} size={16} color="#9adbd2" />
          <Text style={s.fieldLabel}>{label}</Text>
        </View>
      </View>
      <View style={s.fieldBox}>
        <Text style={s.fieldValue} numberOfLines={1}>
          {value || "-"}
        </Text>
      </View>
    </View>
  );
}

function Divider() {
  return <View style={s.divider} />;
}

/* ------------------ Styles ------------------ */
const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#0b0b0b" },
  headerWrap: { backgroundColor: "#0b0b0b" },
  headerBg: {
    paddingBottom: 18,
    borderBottomWidth: 1,
    borderBottomColor: "#0f1216",
  },
  topRow: { paddingHorizontal: 12, flexDirection: "row", alignItems: "center" },
  iconBtn: { width: 40, height: 40, justifyContent: "center" },
  title: {
    flex: 1,
    textAlign: "center",
    color: "#CFF9F3",
    fontWeight: "900",
    fontSize: 20,
  },

  /* Avatar */
  avatarSlot: { alignItems: "center", marginTop: 8, marginBottom: 10 },
  avatarRing: {
    width: 132,
    height: 132,
    borderRadius: 66,
    borderWidth: 3,
    borderColor: "#00E0C6",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#101418",
    position: "relative",
  },
  avatar: { width: 126, height: 126, borderRadius: 63 },
  avatarFallback: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#1c222a",
  },
  avatarInitial: { color: "#7CF0E1", fontWeight: "900", fontSize: 36 },

  /* Upload button */
  cameraBtn: {
    position: "absolute",
    bottom: 6,
    right: 6,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#00E0C6",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#00E0C6",
    shadowOpacity: 0.6,
    shadowRadius: 6,
  },

  name: {
    color: "#EFFFFB",
    textAlign: "center",
    fontWeight: "900",
    fontSize: 20,
  },
  email: {
    color: "#8ecac1",
    textAlign: "center",
    marginTop: 4,
    fontWeight: "700",
  },

  card: {
    marginHorizontal: 16,
    marginTop: 14,
    padding: 14,
    backgroundColor: "#0f1620",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#1a2232",
  },
  fieldHead: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  fieldHeadL: { flexDirection: "row", alignItems: "center", gap: 6 },
  fieldLabel: { color: "#9AA0A6", fontWeight: "700" },
  fieldBox: {
    marginTop: 6,
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#1d2740",
    backgroundColor: "#0b0f1a",
    justifyContent: "center",
    paddingHorizontal: 12,
  },
  fieldValue: { color: "#fff", fontWeight: "800" },
  divider: {
    height: 1,
    backgroundColor: "rgba(255,255,255,0.06)",
    marginVertical: 8,
  },
  row: { flexDirection: "row", gap: 12 },

  primaryBtn: {
    height: 48,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
  },
  primaryTxt: { fontWeight: "900", fontSize: 15 },
});
