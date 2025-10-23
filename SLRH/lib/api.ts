// lib/api.ts
import axios from "axios";
import Constants from "expo-constants";
import { Platform } from "react-native";

/**
 * Determine base URL priority:
 * 1) EXPO_PUBLIC_API_URL from .env (recommended)
 * 2) expo.extra.apiUrl from app.json (fallback)
 * 3) Defaults:
 *    - Android emulator → http://10.0.2.2:3001
 *    - iOS simulator / Web → http://localhost:3001
 *
 * Final baseURL becomes `${base}/api/v1`
 */

const envUrl = process.env.EXPO_PUBLIC_API_URL;
const extraUrl = (Constants?.expoConfig?.extra as any)?.apiUrl;
const fallbackUrl =
  Platform.OS === "android"
    ? "http://10.0.2.2:3001"
    : "http://localhost:3001";

const base = (envUrl || extraUrl || fallbackUrl).replace(/\/$/, "");

export const api = axios.create({
  baseURL: `${base}/api/v1`,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

console.log("🌍 API Base URL:", `${base}/api/v1`);
