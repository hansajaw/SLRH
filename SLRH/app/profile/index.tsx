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
import * as ImagePicker from "expo-image-picker";
import { Stack, Link, useRouter, type Href } from "expo-router";
import { useUser } from "../../context/UserContext";
import { useTheme } from "../../context/ThemeContext"; // 🎨

export default function UserProfile() {
  const { user, logout, updateAvatar } = useUser();
  const { palette } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
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

  const onEdit = () => router.push("/profile/edit" as Href);
  const openSettings = () => router.push("/settings" as Href);

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
            router.replace("/auth/login" as Href);
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
    <SafeAreaView style={[s.safe, { backgroundColor: palette.background }]}>
      <Stack.Screen
        options={{
          title: "",
          headerRight: () => (
            <Link href={"/settings" as Href} asChild>
              <Pressable style={{ paddingHorizontal: 8 }}>
                <Ionicons name="settings-outline" size={22} color={palette.text} />
              </Pressable>
            </Link>
          ),
        }}
      />

      <ScrollView
        contentContainerStyle={{
          paddingBottom: 20 + insets.bottom,
          paddingHorizontal: 16,
          alignItems: "center",
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* AVATAR & NAME SECTION */}
        <View style={[s.headerWrap, { marginTop: 12 }]}>
          <View
            style={[
              s.avatarWrap,
              { borderColor: palette.accent },
            ]}
          >
            {me.avatarUri ? (
              <Image source={{ uri: me.avatarUri }} style={s.avatar} />
            ) : (
              <View
                style={[
                  s.avatar,
                  {
                    backgroundColor: palette.input,
                    alignItems: "center",
                    justifyContent: "center",
                  },
                ]}
              >
                <Text
                  style={{
                    color: palette.accent,
                    fontWeight: "900",
                    fontSize: 32,
                  }}
                >
                  {me.fullName?.[0] ?? "U"}
                </Text>
              </View>
            )}
            <Pressable
              style={[
                s.cameraBtn,
                { backgroundColor: palette.accent, borderColor: palette.background },
              ]}
              onPress={pickAvatar}
            >
              <Ionicons
                name={uploading ? "time-outline" : "camera-outline"}
                size={18}
                color={palette.background}
              />
            </Pressable>
          </View>

          <Text style={[s.name, { color: palette.text }]}>{me.fullName}</Text>
          <Text style={[s.email, { color: palette.textSecondary }]}>{me.email}</Text>
        </View>

        {/* CONTACT INFO */}
        <View style={s.section}>
          <Text style={[s.sectionTitle, { color: palette.text }]}>
            Contact Information
          </Text>
          <View
            style={[
              s.card,
              { backgroundColor: palette.card, borderColor: palette.border },
            ]}
          >
            <InfoRow icon="mail-outline" label="Email" value={me.email} color={palette} />
            <InfoRow icon="call-outline" label="Phone" value={me.phone} color={palette} />
          </View>
        </View>

        {/* ADDRESS */}
        <View style={s.section}>
          <Text style={[s.sectionTitle, { color: palette.text }]}>Address</Text>
          <View
            style={[
              s.card,
              { backgroundColor: palette.card, borderColor: palette.border },
            ]}
          >
            <InfoRow icon="home-outline" label="Address 1" value={me.address1} color={palette} />
            <InfoRow icon="home-outline" label="Address 2" value={me.address2} color={palette} />
            <View style={s.row}>
              <InfoRow icon="location-outline" label="City" value={me.city} flex color={palette} />
              <InfoRow icon="pricetag-outline" label="ZIP" value={me.zip} color={palette} />
            </View>
          </View>
        </View>

        {/* ACTION BUTTONS */}
        <View style={{ paddingVertical: 20, width: "100%", gap: 12 }}>
          <Pressable
            style={[s.btn, { backgroundColor: palette.accent }]}
            onPress={onEdit}
          >
            <Ionicons name="create-outline" size={18} color={palette.background} />
            <Text style={[s.btnTxt, { color: palette.background }]}>Edit Profile</Text>
          </Pressable>

          <Pressable
            style={[
              s.btn,
              {
                backgroundColor: "transparent",
                borderWidth: 1,
                borderColor: palette.accent,
              },
            ]}
            onPress={openSettings}
          >
            <Ionicons name="settings-outline" size={18} color={palette.accent} />
            <Text style={[s.btnTxt, { color: palette.accent }]}>Open Settings</Text>
          </Pressable>

          <Pressable
            style={[
              s.btn,
              {
                backgroundColor: "transparent",
                borderWidth: 1,
                borderColor: palette.border,
              },
            ]}
            onPress={confirmSignOut}
          >
            <Ionicons name="log-out-outline" size={18} color={palette.text} />
            <Text style={[s.btnTxt, { color: palette.text }]}>Sign Out</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function InfoRow({
  icon,
  label,
  value,
  flex,
  color,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value?: string;
  flex?: boolean;
  color: any;
}) {
  return (
    <View style={[s.infoRow, flex && { flex: 1 }]}>
      <View style={s.infoLabel}>
        <Ionicons name={icon} size={14} color={color.accent} />
        <Text style={[s.label, { color: color.textSecondary }]}>{label}</Text>
      </View>
      <Text style={[s.value, { color: color.text }]} numberOfLines={1}>
        {value || "-"}
      </Text>
    </View>
  );
}

const s = StyleSheet.create({
  safe: { paddingTop:-50},
  headerWrap: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  avatarWrap: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    marginBottom: 12,
    position: "relative",
  },
  avatar: { width: 94, height: 94, borderRadius: 47 },
  cameraBtn: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
  },
  name: { fontSize: 22, fontWeight: "900", marginBottom: 4 },
  email: { fontSize: 14, fontWeight: "600" },

  section: { width: "100%", marginTop: 8 },
  sectionTitle: { fontSize: 14, fontWeight: "700", marginBottom: 12 },
  card: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    gap: 12,
  },
  infoRow: { gap: 6 },
  infoLabel: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 4,
  },
  label: { fontSize: 12, fontWeight: "600" },
  value: { fontSize: 14, fontWeight: "700" },
  row: { flexDirection: "row", gap: 12 },
  btn: {
    height: 48,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  btnTxt: { fontWeight: "900", fontSize: 15 },
});
