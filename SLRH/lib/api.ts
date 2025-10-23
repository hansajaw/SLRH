import axios from "axios";
import Constants from "expo-constants";
import { Platform, Alert } from "react-native";

/**
 * ✅ Determine Base API URL
 *
 * Priority order:
 * 1️⃣ process.env.EXPO_PUBLIC_API_URL (from .env)
 * 2️⃣ Constants.expoConfig.extra.apiUrl (from app.json if set)
 * 3️⃣ Fallback:
 *     - Android Emulator → http://10.0.2.2:3001
 *     - iOS Simulator/Web → http://localhost:3001
 */

const envUrl = process.env.EXPO_PUBLIC_API_URL;
const extraUrl = (Constants?.expoConfig?.extra as any)?.apiUrl;
const fallbackUrl =
  Platform.OS === "android"
    ? "http://10.0.2.2:3001"
    : "http://localhost:3001";

const base = (envUrl || extraUrl || fallbackUrl).replace(/\/$/, "");

/* ---------------------------------------------------
   ✅ Create Axios instance
--------------------------------------------------- */
export const api = axios.create({
  baseURL: `${base}/api/v1`,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

console.log("🌍 API Base URL:", `${base}/api/v1`);

/* ---------------------------------------------------
   ✅ Request Interceptor (Logs all outgoing requests)
--------------------------------------------------- */
api.interceptors.request.use(
  (config) => {
    console.log(
      `➡️ [REQUEST] ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`
    );
    return config;
  },
  (error) => {
    console.error("❌ [REQUEST ERROR]", error.message);
    return Promise.reject(error);
  }
);

/* ---------------------------------------------------
   ✅ Response Interceptor (Handles errors gracefully)
--------------------------------------------------- */
api.interceptors.response.use(
  (response) => {
    console.log(`✅ [RESPONSE] ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    // Network issues (offline, DNS, timeout)
    if (error.code === "ECONNABORTED" || error.message === "Network Error") {
      console.warn("⚠️ [NETWORK WARNING] Server unreachable or offline");
      Alert.alert(
        "Connection Error",
        "Cannot connect to the server. Please check your internet connection and try again."
      );
    }

    // Handle backend response errors
    if (error.response) {
      const { status, data } = error.response;
      console.error(`❌ [API ERROR ${status}]`, data);

      // Common cases: 401 Unauthorized, 404 Not Found, 500 Server Error
      if (status === 401) {
        Alert.alert("Unauthorized", "Your session has expired. Please log in again.");
      } else if (status === 404) {
        Alert.alert("Not Found", "Requested resource could not be found.");
      } else if (status >= 500) {
        Alert.alert("Server Error", "The server encountered an error. Please try later.");
      }
    }

    return Promise.reject(error);
  }
);
