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

// 1️⃣ Check environment variable
const envUrl = process.env.EXPO_PUBLIC_API_URL;

// 2️⃣ Check app.json extras (optional)
const extraUrl = (Constants?.expoConfig?.extra as any)?.apiUrl;

// 3️⃣ Platform-based fallback
const fallbackUrl =
  Platform.OS === "android"
    ? "http://10.0.2.2:3001"
    : "http://localhost:3001";

// 4️⃣ Pick final base
const base = (envUrl || extraUrl || fallbackUrl).replace(/\/$/, "");

// 5️⃣ Create Axios instance
export const api = axios.create({
  baseURL: `${base}/api/v1`,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// 6️⃣ Optional logging (useful for debugging)
console.log("🌍 API Base URL:", `${base}/api/v1`);

// 7️⃣ Optional interceptors for centralized error handling
// api.interceptors.response.use(
//   (res) => res,
//   (err) => {
//     console.error("❌ API Error:", err.response?.data || err.message);
//     return Promise.reject(err);
//   }
// );
