// utils/api.ts
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Android Emulator -> http://10.0.2.2:<port>
const base = (process.env.EXPO_PUBLIC_API_URL || "http://10.0.2.2:3001").replace(/\/$/, "");

const api = axios.create({
  baseURL: `${base}/api/v1`,
  headers: { "Content-Type": "application/json" },
  timeout: 15000,
});

// attach token
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
export { api };
