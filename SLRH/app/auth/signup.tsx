import { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, Alert } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import SafeScreen from '../../components/SafeScreen';

const BASE = process.env.EXPO_PUBLIC_API_URL ?? 'http://10.0.2.2:3001';

// keep these in sync with login screen
const HEADER_HEIGHT = 160;   // same gradient height as login
const PULL_UP = -24;         // same negative margin as login

export default function Signup() {
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const [pw2, setPw2] = useState('');
  const [agree, setAgree] = useState(false);
  const [loading, setLoading] = useState(false);
  const go = (p: string) => (router as any).push(p);

  function validate() {
    if (!email || !pw || !pw2) return 'Please fill all the fields.';
    if (!email.includes('@')) return 'Enter a valid email.';
    if (pw.length < 6) return 'Password must be at least 6 characters.';
    if (pw !== pw2) return 'Passwords do not match.';
    if (!agree) return 'Please agree to Terms & Privacy Policy.';
    return '';
  }

  async function onContinue() {
    const err = validate();
    if (err) return Alert.alert('Check form', err);
    try {
      setLoading(true);
      (router as any).push({ pathname: '/auth/profile-setup', params: { email } });
    } catch (e: any) {
      Alert.alert('Signup failed', e.message ?? 'Try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeScreen bg="#fff">
      <LinearGradient
        colors={['#C5B6FF', '#E7E0FF', '#FFFFFF']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={{ height: HEADER_HEIGHT }}
      />

      <Pressable onPress={() => router.back()} style={s.backBtn}>
        <Ionicons name="chevron-back" size={22} color="#000" />
      </Pressable>

      {/* same positioning as login: pulled up slightly to sit on the gradient edge */}
      <View style={s.contentTop}>
        <Text style={s.title}>Welcome to SLRH Racing</Text>
        <Text style={s.subtitle}>Please enter your email & password to access your account</Text>

        <Text style={s.label}>Email Address</Text>
        <TextInput
          value={email}
          onChangeText={setEmail}
          placeholder="you@email.com"
          placeholderTextColor="#999"
          style={s.input}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <Text style={[s.label, { marginTop: 12 }]}>Password</Text>
        <TextInput
          value={pw}
          onChangeText={setPw}
          placeholder="••••••••"
          placeholderTextColor="#999"
          style={s.input}
          secureTextEntry
        />

        <Text style={[s.label, { marginTop: 12 }]}>Confirm Password</Text>
        <TextInput
          value={pw2}
          onChangeText={setPw2}
          placeholder="••••••••"
          placeholderTextColor="#999"
          style={s.input}
          secureTextEntry
        />

        <Pressable onPress={() => setAgree(a => !a)} style={s.checkRow}>
          <View style={[s.checkbox, agree && { backgroundColor: '#7c73b9', borderColor: '#7c73b9' }]}>
            {agree ? <Ionicons name="checkmark" size={16} color="#fff" /> : null}
          </View>
          <Text style={s.small}>
            I agree to SLRH <Text style={{ fontWeight: '800' }}>Terms & Privacy Policy</Text>
          </Text>
        </Pressable>

        <Pressable onPress={onContinue} style={[s.primaryBtn, loading && { opacity: 0.6 }]} disabled={loading}>
          <Text style={s.primaryText}>{loading ? 'Please wait…' : 'Continue'}</Text>
        </Pressable>

        <Pressable style={s.socialBtn}>
          <Ionicons name="logo-google" size={18} color="#000" />
          <Text style={s.socialText}>Continue with Google</Text>
        </Pressable>

        <Pressable style={s.socialBtn}>
          <Ionicons name="logo-facebook" size={18} color="#1877F2" />
          <Text style={s.socialText}>Continue with Facebook</Text>
        </Pressable>

        <Text style={[s.small, { textAlign: 'center', marginTop: 14 }]}>
          Already have an account? <Text style={{ color: '#7965D6' }} onPress={() => go('/auth/login')}>Login</Text>
        </Text>
      </View>
    </SafeScreen>
  );
}

const s = StyleSheet.create({
  backBtn: {
    position: 'absolute',
    top: 16,
    left: 16,
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
  },

  // match login: top-aligned with slight negative margin
  contentTop: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 8,
    marginTop: PULL_UP,  // <- sync with login
    paddingBottom: 16,
  },

  title: { fontSize: 22, fontWeight: '800', color: '#111', marginBottom: 4 },
  subtitle: { color: '#555', marginBottom: 10 },

  label: { color: '#111', marginTop: 12, marginBottom: 8, fontWeight: '600' },
  input: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 46,
    borderColor: '#eee',
    borderWidth: 1,
    elevation: 2,
    shadowColor: '#0002',
  },

  small: { color: '#777' },

  checkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 12,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderColor: '#aaa',
    borderWidth: 1.2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },

  primaryBtn: {
    marginTop: 14,
    height: 46,
    backgroundColor: '#7c73b9',
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryText: { color: '#fff', fontWeight: '800' },

  socialBtn: {
    marginTop: 10,
    height: 46,
    backgroundColor: '#f6f6f8',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  socialText: { color: '#111', fontWeight: '600' },
});
