// lib/api.ts
import axios from "axios";
import Constants from "expo-constants";
import { Platform } from "react-native";

/**
 * Base URL priority:
 * 1) EXPO_PUBLIC_API_URL (.env)
 * 2) Constants.expoConfig.extra.apiUrl (fallback)
 * 3) Local defaults for emulator/simulator
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

console.log("🔗 Using API base:", `${base}/api/v1`);
