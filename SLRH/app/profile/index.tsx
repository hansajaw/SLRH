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
  const { user, logout, updateAvatar } = useUser(); 
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
      <ScrollView contentContainerStyle={{ paddingBottom: 20 + insets.bottom }} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <LinearGradient colors={['#1a1a1a', '#0b0b0b']} style={s.header}>
          <Pressable onPress={() => router.back()} style={s.backBtn}>
            <Text style={s.backIcon}>‹</Text>
            <Text style={s.backTxt}>Back</Text>
          </Pressable>

          <View style={s.avatarWrap}>
            {me.avatarUri ? (
              <Image source={{ uri: me.avatarUri }} style={s.avatar} />
            ) : (
              <View style={[s.avatar, s.avatarFallback]}>
                <Text style={s.avatarInitial}>{me.fullName?.[0] ?? "U"}</Text>
              </View>
            )}
            <Pressable style={s.cameraBtn} onPress={pickAvatar}>
              <Ionicons name={uploading ? "time-outline" : "camera-outline"} size={18} color="#000" />
            </Pressable>
          </View>

          <Text style={s.name}>{me.fullName}</Text>
          <Text style={s.email}>{me.email}</Text>
        </LinearGradient>

        {/* Contact Info */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>Contact Information</Text>
          <View style={s.card}>
            <InfoRow icon="mail-outline" label="Email" value={me.email} />
            <InfoRow icon="call-outline" label="Phone" value={me.phone} />
          </View>
        </View>

        {/* Address */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>Address</Text>
          <View style={s.card}>
            <InfoRow icon="home-outline" label="Address 1" value={me.address1} />
            <InfoRow icon="home-outline" label="Address 2" value={me.address2} />
            <View style={s.row}>
              <InfoRow icon="location-outline" label="City" value={me.city} flex />
              <InfoRow icon="pricetag-outline" label="ZIP" value={me.zip} />
            </View>
          </View>
        </View>

        {/* Actions */}
        <View style={{ padding: 16, gap: 12 }}>
          <Pressable style={[s.btn, s.btnPrimary]} onPress={onEdit}>
            <Ionicons name="create-outline" size={18} color="#000" />
            <Text style={s.btnTxt}>Edit Profile</Text>
          </Pressable>

          <Pressable style={[s.btn, s.btnSecondary]} onPress={onSecurity}>
            <Ionicons name="shield-checkmark-outline" size={18} color="#00E0C6" />
            <Text style={[s.btnTxt, { color: "#00E0C6" }]}>Security Settings</Text>
          </Pressable>

          <Pressable style={[s.btn, s.btnDanger]} onPress={confirmSignOut}>
            <Ionicons name="log-out-outline" size={18} color="#fff" />
            <Text style={[s.btnTxt, { color: "#fff" }]}>Sign Out</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function InfoRow({ icon, label, value, flex }: { icon: keyof typeof Ionicons.glyphMap; label: string; value?: string; flex?: boolean }) {
  return (
    <View style={[s.infoRow, flex && { flex: 1 }]}>
      <View style={s.infoLabel}>
        <Ionicons name={icon} size={14} color="#00E0C6" />
        <Text style={s.label}>{label}</Text>
      </View>
      <Text style={s.value} numberOfLines={1}>{value || "-"}</Text>
    </View>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#0b0b0b" },

  header: {
    paddingTop: 16,
    paddingBottom: 24,
    alignItems: "center",
  },
  backBtn: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    paddingHorizontal: 16,
    gap: 4,
    marginBottom: 16,
  },
  backIcon: { color: "#fff", fontSize: 28, fontWeight: "400", marginTop: -2 },
  backTxt: { color: "#fff", fontSize: 16, fontWeight: "700" },

  avatarWrap: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: "#00E0C6",
    marginBottom: 12,
    position: "relative",
  },
  avatar: { width: 94, height: 94, borderRadius: 47 },
  avatarFallback: {
    backgroundColor: "#1a1a1a",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarInitial: { color: "#00E0C6", fontWeight: "900", fontSize: 32 },
  cameraBtn: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#00E0C6",
    alignItems: "center",
    justifyContent: "center",
  },

  name: { color: "#fff", fontSize: 22, fontWeight: "900", marginBottom: 4 },
  email: { color: "#999", fontSize: 14, fontWeight: "600" },

  section: { padding: 16, paddingTop: 8 },
  sectionTitle: { color: "#fff", fontSize: 14, fontWeight: "700", marginBottom: 12, letterSpacing: 0.5 },
  card: {
    backgroundColor: "#1a1a1a",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#222",
    padding: 16,
    gap: 12,
  },

  infoRow: { gap: 6 },
  infoLabel: { flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 4 },
  label: { color: "#999", fontSize: 12, fontWeight: "600" },
  value: { color: "#fff", fontSize: 14, fontWeight: "700" },
  row: { flexDirection: "row", gap: 12 },

  btn: {
    height: 48,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  btnPrimary: { backgroundColor: "#00E0C6" },
  btnSecondary: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#00E0C6",
  },
  btnDanger: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#333",
  },
  btnTxt: { color: "#000", fontWeight: "900", fontSize: 15 },
});