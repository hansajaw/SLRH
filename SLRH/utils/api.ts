import axios from "axios";

const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  timeout: 10000, // 10 seconds
});

console.log("🔗 Using API base:", process.env.EXPO_PUBLIC_API_URL);

export default api;
