import { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, Switch, Alert } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import SafeScreen from '../../components/SafeScreen';

const BASE = process.env.EXPO_PUBLIC_API_URL ?? 'http://10.0.2.2:3001';

// spacing scale (tweak these to taste)
const S = {
  xs: 6,
  sm: 10,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 40,
};

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const go = (path: string) => (router as any).push(path);

  async function onLogin() {
    if (!email || !password) {
      Alert.alert('Missing info', 'Please enter email and password.');
      return;
    }
    try {
      setLoading(true);
      Alert.alert('Success', 'Logged in (mock).');
    } catch (e: any) {
      Alert.alert('Login failed', e.message ?? 'Try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeScreen bg="#fff">
      {/* Taller header for airy top space */}
      <LinearGradient
        colors={['#C5B6FF', '#E7E0FF', '#FFFFFF']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={{ height: S.xxl + 80 }}
      />

      <Pressable onPress={() => router.back()} style={s.backBtn}>
        <Ionicons name="chevron-back" size={22} color="#000" />
      </Pressable>

      {/* Bottom-pinned content with roomy gaps */}
      <View style={s.contentBottom}>
        <View style={{ gap: S.sm }}>
          <Text style={s.title}>Welcome Back !!!</Text>
          <Text style={s.subtitle}>
            Please enter your email & password to access your account
          </Text>
        </View>

        <View style={{ gap: S.sm, marginTop: S.lg }}>
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
        </View>

        <View style={{ gap: S.sm, marginTop: S.md }}>
          <Text style={s.label}>Password</Text>
          <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder="••••••••"
            placeholderTextColor="#999"
            style={s.input}
            secureTextEntry
          />
        </View>

        <View style={[s.row, { marginTop: S.md }]}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: S.xs }}>
            <Switch value={remember} onValueChange={setRemember} />
            <Text style={s.small}>Remember Me</Text>
          </View>
          <Text style={[s.small, { color: '#7965D6' }]}>Forgot Password?</Text>
        </View>

        <View style={{ gap: S.sm, marginTop: S.lg }}>
          <Pressable
            onPress={onLogin}
            style={[s.primaryBtn, loading && { opacity: 0.6 }]}
            disabled={loading}
          >
            <Text style={s.primaryText}>{loading ? 'Please wait…' : 'Log in'}</Text>
          </Pressable>

          <Pressable style={s.socialBtn}>
            <Ionicons name="logo-google" size={18} color="#000" />
            <Text style={s.socialText}>Continue with Google</Text>
          </Pressable>

          <Pressable style={s.socialBtn}>
            <Ionicons name="logo-facebook" size={18} color="#1877F2" />
            <Text style={s.socialText}>Continue with Facebook</Text>
          </Pressable>
        </View>

        <Text style={[s.small, { textAlign: 'center', marginTop: S.lg }]}>
          New here?{' '}
          <Text onPress={() => go('/auth/signup')} style={{ color: '#7965D6', fontWeight: '700' }}>
            Sign up
          </Text>
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
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
  },

  // relaxed, bottom-pinned layout
  contentBottom: {
    flex: 1,
    paddingHorizontal: S.lg,
    justifyContent: 'flex-end',
    paddingBottom: S.xl, // comfy room above gesture bar
    gap: S.md,           // global gap between groups
  },

  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#111',
    letterSpacing: 0.25,
    lineHeight: 30,
  },
  subtitle: {
    color: '#555',
    lineHeight: 22,      // more line-height for relaxed feel
  },

  label: {
    color: '#111',
    fontWeight: '600',
    letterSpacing: 0.2,
  },

  input: {
    backgroundColor: '#fff',
    borderRadius: 14,
    paddingHorizontal: 16,
    height: 50,
    borderColor: '#eee',
    borderWidth: 1,
    elevation: 2,
    shadowColor: '#0002',
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  small: { color: '#777', lineHeight: 18 },

  primaryBtn: {
    height: 50,
    backgroundColor: '#7c73b9',
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryText: { color: '#fff', fontWeight: '800', letterSpacing: 0.4 },

  socialBtn: {
    height: 50,
    backgroundColor: '#f6f6f8',
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  socialText: { color: '#111', fontWeight: '600', letterSpacing: 0.2 },
});
