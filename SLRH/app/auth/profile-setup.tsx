import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Alert,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import SafeScreen from "../../components/SafeScreen";
import * as ImagePicker from "expo-image-picker";
import { useUser } from "../../context/UserContext";
import { useTheme } from "../../context/ThemeContext"; // 🎨 Add theme support

export default function ProfileSetup() {
  const { email } = useLocalSearchParams<{ email?: string }>();
  const { updateProfile } = useUser();
  const { palette } = useTheme(); // 🎨

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [addr1, setAddr1] = useState("");
  const [addr2, setAddr2] = useState("");
  const [city, setCity] = useState("");
  const [zip, setZip] = useState("");
  const [avatarUri, setAvatarUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function pickAvatar() {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission needed", "Allow photo library access to choose a profile picture.");
        return;
      }
      const res = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.9,
        selectionLimit: 1,
      });
      if (!res.canceled && res.assets?.length) {
        setAvatarUri(res.assets[0].uri);
      }
    } catch (err) {
      console.error("Avatar picker error:", err);
      Alert.alert("Error", "Failed to pick avatar. Try again.");
    }
  }

  async function onCreate() {
    if (!fullName.trim()) {
      Alert.alert("Missing name", "Please enter your full name.");
      return;
    }

    try {
      setLoading(true);
      await updateProfile({
        fullName,
        phone,
        address1: addr1,
        address2: addr2,
        city,
        zip,
        avatarUri: avatarUri ?? undefined,
        caption: "Fueling your passion for speed. Buckle up!",
      });
      Alert.alert("✅ Success", "Your account has been created!", [
        { text: "OK", onPress: () => router.replace("/(tabs)") },
      ]);
    } catch (e: any) {
      console.error("Profile save error:", e?.response?.data || e);
      Alert.alert("Failed", e?.response?.data?.message ?? "Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeScreen bg={palette.background}>
      <LinearGradient
        colors={[palette.accentAlt, palette.background]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={s.header}
      />

      <Pressable
        onPress={() => router.back()}
        style={[
          s.backBtn,
          {
            backgroundColor: palette.card,
            borderColor: palette.border,
          },
        ]}
      >
        <Ionicons name="chevron-back" size={22} color={palette.text} />
      </Pressable>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 80 }}
        >
          <View style={s.content}>
            <Text style={[s.title, { color: palette.text }]}>Profile Setup</Text>
            <Text style={[s.subtitle, { color: palette.textSecondary }]}>
              Add your details
            </Text>

            {/* Avatar */}
            <View
              style={[
                s.card,
                {
                  backgroundColor: palette.card,
                  borderColor: palette.border,
                  alignItems: "center",
                },
              ]}
            >
              <View
                style={[
                  s.avatarWrap,
                  { backgroundColor: palette.input, borderColor: palette.border },
                ]}
              >
                {avatarUri ? (
                  <Image source={{ uri: avatarUri }} style={s.avatar} />
                ) : (
                  <Ionicons name="person" size={48} color={palette.textSecondary} />
                )}
                <Pressable
                  onPress={pickAvatar}
                  style={[
                    s.editBadge,
                    {
                      backgroundColor: palette.accent,
                      borderColor: palette.background,
                    },
                  ]}
                >
                  <Ionicons name="camera" size={16} color={palette.background} />
                </Pressable>
              </View>
              <Text style={[s.small, { color: palette.textSecondary }]}>
                {avatarUri ? "Tap to change photo" : "Add a profile photo"}
              </Text>
              {!!email && (
                <Text style={[s.small, { color: palette.textSecondary, marginTop: 6 }]}>
                  Email: {email}
                </Text>
              )}
            </View>

            {/* Basic Info */}
            <View
              style={[
                s.card,
                { backgroundColor: palette.card, borderColor: palette.border, gap: 10 },
              ]}
            >
              <Text style={[s.section, { color: palette.accentAlt }]}>👤 Basic Info</Text>
              <Text style={[s.label, { color: palette.text }]}>Full Name</Text>
              <TextInput
                value={fullName}
                onChangeText={setFullName}
                style={[
                  s.input,
                  {
                    backgroundColor: palette.input,
                    color: palette.text,
                    borderColor: palette.border,
                  },
                ]}
                placeholder="John Perera"
                placeholderTextColor={palette.textSecondary}
              />

              <Text style={[s.label, { color: palette.text }]}>Phone Number</Text>
              <TextInput
                value={phone}
                onChangeText={setPhone}
                style={[
                  s.input,
                  {
                    backgroundColor: palette.input,
                    color: palette.text,
                    borderColor: palette.border,
                  },
                ]}
                placeholder="+94 7X XXX XXXX"
                keyboardType="phone-pad"
                placeholderTextColor={palette.textSecondary}
              />
            </View>

            {/* Address */}
            <View
              style={[
                s.card,
                { backgroundColor: palette.card, borderColor: palette.border, marginTop: 12, gap: 10 },
              ]}
            >
              <Text style={[s.section, { color: palette.accentAlt }]}>📍 Address</Text>
              <Text style={[s.label, { color: palette.text }]}>Address Line 1</Text>
              <TextInput
                value={addr1}
                onChangeText={setAddr1}
                style={[
                  s.input,
                  { backgroundColor: palette.input, color: palette.text, borderColor: palette.border },
                ]}
                placeholder="Street / House No."
                placeholderTextColor={palette.textSecondary}
              />

              <Text style={[s.label, { color: palette.text }]}>Address Line 2</Text>
              <TextInput
                value={addr2}
                onChangeText={setAddr2}
                style={[
                  s.input,
                  { backgroundColor: palette.input, color: palette.text, borderColor: palette.border },
                ]}
                placeholder="Area"
                placeholderTextColor={palette.textSecondary}
              />

              <View style={{ flexDirection: "row", gap: 12 }}>
                <View style={{ flex: 1 }}>
                  <Text style={[s.label, { color: palette.text }]}>City</Text>
                  <TextInput
                    value={city}
                    onChangeText={setCity}
                    style={[
                      s.input,
                      { backgroundColor: palette.input, color: palette.text, borderColor: palette.border },
                    ]}
                    placeholder="City"
                    placeholderTextColor={palette.textSecondary}
                  />
                </View>
                <View style={{ width: 130 }}>
                  <Text style={[s.label, { color: palette.text }]}>Zip Code</Text>
                  <TextInput
                    value={zip}
                    onChangeText={setZip}
                    style={[
                      s.input,
                      { backgroundColor: palette.input, color: palette.text, borderColor: palette.border },
                    ]}
                    placeholder="00000"
                    keyboardType="number-pad"
                    placeholderTextColor={palette.textSecondary}
                  />
                </View>
              </View>
            </View>

            {/* Button */}
            <Pressable
              onPress={onCreate}
              style={[
                s.primaryBtn,
                { backgroundColor: palette.accent },
                loading && { opacity: 0.6 },
              ]}
              disabled={loading}
            >
              <Text style={[s.primaryText, { color: palette.background }]}>
                {loading ? "Saving…" : "Create Account"}
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeScreen>
  );
}

const s = StyleSheet.create({
  header: { height: 100 },
  backBtn: {
    position: "absolute",
    top: 16,
    left: 16,
    width: 34,
    height: 34,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
  },
  content: { flex: 1, paddingHorizontal: 16 },
  card: { borderWidth: 1, borderRadius: 16, padding: 16 },
  title: { fontSize: 22, fontWeight: "800" },
  subtitle: { marginTop: 6 },
  small: { fontSize: 13 },
  section: { fontWeight: "800", marginBottom: 4 },
  avatarWrap: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    overflow: "visible",
    marginBottom: 8,
  },
  avatar: { width: "100%", height: "100%", borderRadius: 48 },
  editBadge: {
    position: "absolute",
    right: -2,
    bottom: -2,
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
  },
  label: { marginTop: 8, marginBottom: 6, fontWeight: "600" },
  input: {
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 46,
    borderWidth: 1,
  },
  primaryBtn: {
    marginTop: 16,
    height: 46,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    shadowOpacity: 0.25,
    shadowRadius: 12,
  },
  primaryText: { fontWeight: "800" },
});
