import axios from "axios";
import Constants from "expo-constants";
import { Platform, Alert } from "react-native";

const PROD_URL = "https://slrh-4cql.vercel.app/api/v1"; 
const LOCAL_ANDROID = "http://10.0.2.2:3001/api/v1";    
const LOCAL_IOS = "http://localhost:3001/api/v1";

let baseURL = PROD_URL;

if (__DEV__) {
  baseURL = Platform.OS === "android" ? LOCAL_ANDROID : LOCAL_IOS;
}

console.log("🌍 Using API base URL:", baseURL);

export const api = axios.create({
  baseURL,
  timeout: 15000,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use(
  (config) => {
    console.log(`➡️ [REQUEST] ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
    return config;
  },
  (error) => {
    console.error("❌ [REQUEST ERROR]", error.message);
    return Promise.reject(error);
  }
);

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
        "Cannot reach the server. Please check your connection or try again."
      );
    }

    if (error.response) {
      const { status, data } = error.response;
      console.error(`❌ [API ERROR ${status}]`, data);

      if (status === 401) {
        Alert.alert("Unauthorized", "Session expired. Please log in again.");
      } else if (status === 404) {
        Alert.alert("Not Found", "Requested resource not found.");
      } else if (status >= 500) {
        Alert.alert("Server Error", "The server encountered an error. Try again later.");
      }
    }

    return Promise.reject(error);
  }
);
