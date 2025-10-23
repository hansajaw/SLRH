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

export default function ProfileSetup() {
  const { email } = useLocalSearchParams<{ email?: string }>();
  const { updateProfile } = useUser();

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
        console.log("Selected avatar:", res.assets[0].uri);
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
      console.log("Updating profile:", { fullName, phone, addr1, addr2, city, zip, avatarUri });
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
      console.log("Profile updated successfully");
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
    <SafeScreen bg="#0b0b0b">
      <LinearGradient
        colors={["#0E2322", "#0b0b0b"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={s.header}
      />
      <Pressable onPress={() => router.back()} style={s.backBtn}>
        <Ionicons name="chevron-back" size={22} color="#EFFFFB" />
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
            <Text style={s.title}>Profile Setup</Text>
            <Text style={s.subtitle}>Add your Details</Text>

            <View style={[s.card, { alignItems: "center", marginTop: 12, marginBottom: 10 }]}>
              <View style={s.avatarWrap}>
                {avatarUri ? (
                  <Image source={{ uri: avatarUri }} style={s.avatar} />
                ) : (
                  <Ionicons name="person" size={48} color="#8ecac1" />
                )}
                <Pressable onPress={pickAvatar} style={s.editBadge}>
                  <Ionicons name="camera" size={16} color="#001018" />
                </Pressable>
              </View>
              <Text style={s.small}>
                {avatarUri ? "Tap to change photo" : "Add a profile photo"}
              </Text>
              {!!email && <Text style={[s.small, { marginTop: 6 }]}>Email: {email}</Text>}
            </View>

            <View style={[s.card, { gap: 10 }]}>
              <Text style={s.section}>👤 Basic Info</Text>
              <Text style={s.label}>Full Name</Text>
              <TextInput
                value={fullName}
                onChangeText={setFullName}
                style={s.input}
                placeholder="John Perera"
                placeholderTextColor="#8ecac1"
              />
              <Text style={s.label}>Phone Number</Text>
              <TextInput
                value={phone}
                onChangeText={setPhone}
                style={s.input}
                placeholder="+94 7X XXX XXXX"
                keyboardType="phone-pad"
                placeholderTextColor="#8ecac1"
              />
            </View>

            <View style={[s.card, { gap: 10, marginTop: 12 }]}>
              <Text style={s.section}>📍 Address</Text>
              <Text style={s.label}>Address Line 1</Text>
              <TextInput
                value={addr1}
                onChangeText={setAddr1}
                style={s.input}
                placeholder="Street / House No."
                placeholderTextColor="#8ecac1"
              />
              <Text style={s.label}>Address Line 2</Text>
              <TextInput
                value={addr2}
                onChangeText={setAddr2}
                style={s.input}
                placeholder="Area"
                placeholderTextColor="#8ecac1"
              />
              <View style={{ flexDirection: "row", gap: 12 }}>
                <View style={{ flex: 1 }}>
                  <Text style={s.label}>City</Text>
                  <TextInput
                    value={city}
                    onChangeText={setCity}
                    style={s.input}
                    placeholder="City"
                    placeholderTextColor="#8ecac1"
                  />
                </View>
                <View style={{ width: 130 }}>
                  <Text style={s.label}>Zip Code</Text>
                  <TextInput
                    value={zip}
                    onChangeText={setZip}
                    style={s.input}
                    placeholder="00000"
                    keyboardType="number-pad"
                    placeholderTextColor="#8ecac1"
                  />
                </View>
              </View>
            </View>

            <Pressable
              onPress={onCreate}
              style={[s.primaryBtn, loading && { opacity: 0.6 }]}
              disabled={loading}
            >
              <Text style={s.primaryText}>
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
    backgroundColor: "#101418",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#1a2232",
  },
  content: { flex: 1, paddingHorizontal: 16 },
  card: {
    backgroundColor: "#0f1418",
    borderWidth: 1,
    borderColor: "#1a2232",
    borderRadius: 16,
    padding: 16,
  },
  title: { fontSize: 22, fontWeight: "800", color: "#EFFFFB" },
  subtitle: { color: "#8ecac1", marginTop: 6 },
  small: { color: "#8ecac1" },
  section: { color: "#9CD7D0", fontWeight: "800", marginBottom: 4 },
  avatarWrap: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: "#101418",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    overflow: "visible",
    borderWidth: 2,
    borderColor: "#1a2232",
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
    backgroundColor: "#00E0C6",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#0b0b0b",
  },
  label: {
    color: "#EFFFFB",
    marginTop: 8,
    marginBottom: 6,
    fontWeight: "600",
  },
  input: {
    backgroundColor: "#101418",
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 46,
    borderColor: "#1a2232",
    borderWidth: 1,
    color: "#fff",
  },
  primaryBtn: {
    marginTop: 16,
    height: 46,
    backgroundColor: "#00E0C6",
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    shadowColor: "#00E0C6",
    shadowOpacity: 0.25,
    shadowRadius: 12,
  },
  primaryText: { color: "#001018", fontWeight: "800" },
});