import { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, Alert, Image, Platform } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import SafeScreen from '../../components/SafeScreen';
import * as ImagePicker from 'expo-image-picker';

const BASE = process.env.EXPO_PUBLIC_API_URL ?? 'http://10.0.2.2:3001';

export default function ProfileSetup() {
  const { email } = useLocalSearchParams<{ email?: string }>();

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [addr1, setAddr1] = useState('');
  const [addr2, setAddr2] = useState('');
  const [city, setCity] = useState('');
  const [zip, setZip] = useState('');

  // NEW: avatar local uri
  const [avatarUri, setAvatarUri] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);

  async function pickAvatar() {
    // Ask permission (only required on iOS; Android 13+ handles automatically)
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please allow photo library access to choose a profile picture.');
      return;
    }

    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],     // force square crop
      quality: 0.9,
      selectionLimit: 1,
    });

    if (!res.canceled && res.assets?.length) {
      setAvatarUri(res.assets[0].uri);
    }
  }

  async function onCreate() {
    if (!fullName) {
      Alert.alert('Missing name', 'Please enter your full name.');
      return;
    }

    try {
      setLoading(true);

      // Example: send everything in one multipart/form-data payload
      const fd = new FormData();
      if (email) fd.append('email', String(email));
      fd.append('fullName', fullName);
      fd.append('phone', phone);
      fd.append('addressLine1', addr1);
      fd.append('addressLine2', addr2);
      fd.append('city', city);
      fd.append('zip', zip);

      if (avatarUri) {
        // iOS returns "ph://" sometimes; expo-image-picker gives a file:// uri we can send directly
        const filename = avatarUri.split('/').pop() ?? 'avatar.jpg';
        // crudely infer mime from extension
        const ext = filename.split('.').pop()?.toLowerCase();
        const mime = ext === 'png' ? 'image/png' : ext === 'webp' ? 'image/webp' : 'image/jpeg';

        // RN FormData file object shape
        // @ts-ignore - RN types are looser than DOM
        fd.append('avatar', {
          uri: avatarUri,
          name: filename,
          type: mime,
        });
      }

      // TODO: update to your real endpoint
      // const resp = await fetch(`${BASE}/api/v1/auth/profile/setup`, {
      //   method: 'POST',
      //   headers: { 'Accept': 'application/json' },
      //   body: fd,
      // });
      // if (!resp.ok) throw new Error('Failed to save profile');
      // const data = await resp.json();

      Alert.alert('Success', 'Account created.');
      (router as any).replace('/(tabs)');
    } catch (e: any) {
      Alert.alert('Failed', e?.message ?? 'Try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeScreen bg="#fff">
      <LinearGradient colors={['#C5B6FF', '#E7E0FF', '#FFFFFF']} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} style={s.header} />
      <Pressable onPress={() => router.back()} style={s.backBtn}>
        <Ionicons name="chevron-back" size={22} color="#000" />
      </Pressable>

      <View style={s.content}>
        <Text style={s.title}>Profile Setup</Text>
        <Text style={s.subtitle}>Add your Details</Text>

        {/* Avatar picker */}
        <View style={{ alignItems: 'center', marginTop: 12, marginBottom: 10 }}>
          <View style={s.avatarWrap}>
            {avatarUri ? (
              <Image source={{ uri: avatarUri }} style={s.avatar} />
            ) : (
              <Ionicons name="person" size={48} color="#bbb" />
            )}
            <Pressable onPress={pickAvatar} style={s.editBadge} accessibilityRole="button">
              <Ionicons name="camera" size={16} color="#fff" />
            </Pressable>
          </View>
          <Text style={s.small}>{avatarUri ? 'Tap to change photo' : 'Add a profile photo'}</Text>
        </View>

        {!!email && <Text style={[s.small, { marginBottom: 6 }]}>Email: {email}</Text>}

        <Text style={s.label}>Full Name</Text>
        <TextInput value={fullName} onChangeText={setFullName} style={s.input} placeholder="John Perera" placeholderTextColor="#999" />

        <Text style={s.label}>Phone Number</Text>
        <TextInput value={phone} onChangeText={setPhone} style={s.input} placeholder="+94 7X XXX XXXX" keyboardType="phone-pad" placeholderTextColor="#999" />

        <Text style={s.label}>Address Line 1</Text>
        <TextInput value={addr1} onChangeText={setAddr1} style={s.input} placeholder="Street / House No." placeholderTextColor="#999" />

        <Text style={s.label}>Address Line 2</Text>
        <TextInput value={addr2} onChangeText={setAddr2} style={s.input} placeholder="Area" placeholderTextColor="#999" />

        <View style={{ flexDirection: 'row', gap: 12 }}>
          <View style={{ flex: 1 }}>
            <Text style={s.label}>City</Text>
            <TextInput value={city} onChangeText={setCity} style={s.input} placeholder="City" placeholderTextColor="#999" />
          </View>
          <View style={{ width: 130 }}>
            <Text style={s.label}>Zip Code</Text>
            <TextInput value={zip} onChangeText={setZip} style={s.input} placeholder="00000" keyboardType="number-pad" placeholderTextColor="#999" />
          </View>
        </View>

        <Pressable onPress={onCreate} style={[s.primaryBtn, loading && { opacity: 0.6 }]} disabled={loading}>
          <Text style={s.primaryText}>{loading ? 'Saving…' : 'Create Account'}</Text>
        </Pressable>
      </View>
    </SafeScreen>
  );
}

const s = StyleSheet.create({
  header: { height: 100 },
  backBtn: {
    position: 'absolute', top: 16, left: 16, width: 34, height: 34, borderRadius: 10,
    backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center', elevation: 2
  },
  content: { flex: 1, paddingHorizontal: 16, },

  title: { fontSize: 22, fontWeight: '800', color: '#111' },
  subtitle: { color: '#555', marginTop: 6 },
  small: { color: '#666' },

  // Avatar
  avatarWrap: {
    width: 96, height: 96, borderRadius: 48, backgroundColor: '#f1f1f4',
    alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'visible',  
  },
  avatar: { width: '100%', height: '100%' },
  editBadge: {
    position: 'absolute', right: -2, bottom: -2, width: 28, height: 28, borderRadius: 14,
    backgroundColor: '#7c73b9', alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: '#fff'
  },

  label: { color: '#111', marginTop: 12, marginBottom: 6, fontWeight: '600' },
  input: {
    backgroundColor: '#fff', borderRadius: 12, paddingHorizontal: 14, height: 46,
    borderColor: '#eee', borderWidth: 1, elevation: 2, shadowColor: '#0002'
  },

  primaryBtn: {
    marginTop: 16, height: 46, backgroundColor: '#7c73b9', borderRadius: 999,
    alignItems: 'center', justifyContent: 'center', marginBottom: 20
  },
  primaryText: { color: '#fff', fontWeight: '800' },
});
