import { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { api } from "../lib/api";

/* -------------------- Types -------------------- */
type User = {
  _id?: string;
  email: string;
  fullName?: string;
  phone?: string;
  address1?: string;
  address2?: string;
  city?: string;
  zip?: string;
  avatarUri?: string;
  caption?: string;
};

type Ctx = {
  user: User | null;
  token: string | null;
  loading: boolean;
  login(email: string, password: string, remember?: boolean): Promise<void>;
  signup(email: string, password: string, confirmPassword: string): Promise<void>;
  updateProfile(data: Partial<User>): Promise<void>;
  updateAvatar(uri: string): Promise<void>;
  loadMe(): Promise<void>;
  changePassword(oldPassword: string, newPassword: string): Promise<void>;
  logout(): Promise<void>;
};

const UserCtx = createContext<Ctx>(null as any);

/* -------------------- Provider -------------------- */
export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  /* -------- Load stored auth on startup -------- */
  useEffect(() => {
    (async () => {
      try {
        const storedToken = await AsyncStorage.getItem("token");
        const storedUser = await AsyncStorage.getItem("user");

        console.log("🔄 Restoring session | Token:", !!storedToken, "| User:", !!storedUser);

        if (storedToken) {
          setToken(storedToken);
          api.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`;
          if (storedUser) {
            setUser(JSON.parse(storedUser));
          } else {
            await loadMe();
          }
        }
      } catch (err) {
        console.warn("⚠️ Error restoring user session:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  /* -------- Signup -------- */
  async function signup(email: string, password: string, confirmPassword: string) {
    try {
      const endpoint = "/api/v1/auth/signup";
      console.log("📡 POST", api.defaults.baseURL + endpoint);
      const { data } = await api.post(endpoint, { email, password, confirmPassword });

      setToken(data.token);
      setUser(data.user);
      api.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;

      await AsyncStorage.setItem("token", data.token);
      await AsyncStorage.setItem("user", JSON.stringify(data.user));
    } catch (err: any) {
      console.error("❌ Signup error:", err.response?.data || err.message);
      throw err;
    }
  }

  /* -------- Login -------- */
  async function login(email: string, password: string, remember: boolean = false) {
    try {
      const endpoint = "/api/v1/auth/login";
      console.log("📡 POST", api.defaults.baseURL + endpoint);
      const { data } = await api.post(endpoint, { email, password });

      setToken(data.token);
      setUser(data.user);
      api.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;

      await AsyncStorage.setItem("token", data.token);
      await AsyncStorage.setItem("user", JSON.stringify(data.user));
      if (remember) await AsyncStorage.setItem("remember", "true");
    } catch (err: any) {
      console.error("❌ Login error:", err.response?.data || err.message);
      throw err;
    }
  }

  /* -------- Load profile -------- */
  async function loadMe() {
    try {
      const endpoint = "/api/v1/users/me";
      console.log("📡 GET", api.defaults.baseURL + endpoint);
      const { data } = await api.get(endpoint);
      setUser(data.user);
      await AsyncStorage.setItem("user", JSON.stringify(data.user));
    } catch (err: any) {
      console.error("❌ LoadMe error:", err.response?.data || err.message);
      throw err;
    }
  }

  /* -------- Update profile -------- */
  async function updateProfile(profile: Partial<User>) {
    try {
      const endpoint = "/api/v1/users/me";
      console.log("📡 PATCH", api.defaults.baseURL + endpoint);
      const { data } = await api.patch(endpoint, profile);
      setUser(data.user);
      await AsyncStorage.setItem("user", JSON.stringify(data.user));
    } catch (err: any) {
      console.error("❌ Update profile error:", err.response?.data || err.message);
      throw err;
    }
  }

  /* -------- Update avatar -------- */
  async function updateAvatar(uri: string) {
    try {
      console.log("🖼️ Updating avatar:", uri);
      setUser((prev) => (prev ? { ...prev, avatarUri: uri } : prev));
      const updated = { ...user, avatarUri: uri };
      await AsyncStorage.setItem("user", JSON.stringify(updated));
    } catch (err) {
      console.warn("⚠️ Avatar update failed:", err);
      throw err;
    }
  }

  /* -------- Change password -------- */
  async function changePassword(oldPassword: string, newPassword: string) {
    try {
      const endpoint = "/api/v1/users/change-password";
      console.log("📡 POST", api.defaults.baseURL + endpoint);
      await api.post(endpoint, { oldPassword, newPassword });
      console.log("✅ Password changed successfully");
    } catch (err: any) {
      console.error("❌ Change password error:", err.response?.data || err.message);
      throw err;
    }
  }

  /* -------- Logout -------- */
  async function logout() {
    try {
      console.log("🚪 Logging out...");
      await AsyncStorage.multiRemove(["token", "user", "remember"]);
      setUser(null);
      setToken(null);
      delete api.defaults.headers.common["Authorization"];
      console.log("✅ Logout complete");
    } catch (err) {
      console.warn("⚠️ Logout error:", err);
    }
  }

  return (
    <UserCtx.Provider
      value={{
        user,
        token,
        loading,
        login,
        signup,
        updateProfile,
        updateAvatar,
        loadMe,
        changePassword,
        logout,
      }}
    >
      {children}
    </UserCtx.Provider>
  );
}

export const useUser = () => useContext(UserCtx);
