import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";
import { Platform, Alert } from "react-native";

/* -------------------- Environment URLs -------------------- */
const PROD_URL = "https://slrh-4cql.vercel.app/api/v1";
const LOCAL_ANDROID = "http://10.0.2.2:3001/api/v1";
const LOCAL_IOS = "http://localhost:3001/api/v1";

let baseURL = PROD_URL;

// Use local API only when developing
if (__DEV__) {
  baseURL = Platform.OS === "android" ? LOCAL_ANDROID : LOCAL_IOS;
}

console.log("🌍 Using API base URL:", baseURL);

/* -------------------- Axios Instance -------------------- */
export const api = axios.create({
  baseURL,
  timeout: 15000,
  headers: { "Content-Type": "application/json" },
});

/* -------------------- Request Interceptor -------------------- */
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log(`➡️ [REQUEST] ${config.method?.toUpperCase()} ${config.baseURL}${config.url} | Token: ${token.substring(0, 10)}...`);
    } else {
      console.log(`➡️ [REQUEST] ${config.method?.toUpperCase()} ${config.baseURL}${config.url} | No token`);
    }
    return config;
  },
  (error) => {
    console.error("❌ [REQUEST ERROR]", error.message);
    return Promise.reject(error);
  }
);

/* -------------------- Response Interceptor -------------------- */
api.interceptors.response.use(
  (response) => {
    console.log(`✅ [RESPONSE] ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    if (error.code === "ECONNABORTED" || error.message === "Network Error") {
      console.warn("⚠️ [NETWORK WARNING] Server unreachable or offline");
      Alert.alert(
        "Connection Error",
        "Cannot reach the server. Please ensure the backend is running on http://10.0.2.2:3001 and check your network."
      );
    }

    if (error.response) {
      const { status, data } = error.response;
      console.error(`❌ [API ERROR ${status}]`, data);

      if (status === 401) {
        Alert.alert("Unauthorized", "Session expired. Please log in again.");
      } else if (status === 404) {
        Alert.alert("Not Found", data?.message || "Requested resource not found. Check if the backend routes are correctly configured.");
      } else if (status >= 500) {
        Alert.alert("Server Error", data?.message || "The server encountered an error. Try again later.");
      }
    }

    return Promise.reject(error);
  }
);