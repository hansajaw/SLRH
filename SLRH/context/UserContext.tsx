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

  async function signup(email: string, password: string, confirmPassword: string) {
    try {
      console.log("📡 POST", api.defaults.baseURL + "/auth/signup");
      const { data } = await api.post("/auth/signup", { email, password, confirmPassword });
      setToken(data.token);
      setUser(data.user);
      api.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;
      await AsyncStorage.setItem("token", data.token);
      await AsyncStorage.setItem("user", JSON.stringify(data.user));
    } catch (err) {
      console.error("❌ Signup error:", err);
      throw err;
    }
  }

  async function login(email: string, password: string, remember: boolean = false) {
    try {
      console.log("📡 POST", api.defaults.baseURL + "/auth/login");
      const { data } = await api.post("/auth/login", { email, password });
      setToken(data.token);
      setUser(data.user);
      api.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;
      await AsyncStorage.setItem("token", data.token);
      await AsyncStorage.setItem("user", JSON.stringify(data.user));
      if (remember) await AsyncStorage.setItem("remember", "true");
    } catch (err) {
      console.error("❌ Login error:", err);
      throw err;
    }
  }

  async function loadMe() {
    try {
      console.log("📡 GET", api.defaults.baseURL + "/users/me");
      const { data } = await api.get("/users/me");
      setUser(data.user);
      await AsyncStorage.setItem("user", JSON.stringify(data.user));
    } catch (err) {
      console.error("❌ LoadMe error:", err);
      throw err;
    }
  }

  async function updateProfile(profile: Partial<User>) {
    try {
      console.log("📡 PATCH", api.defaults.baseURL + "/users/me");
      const { data } = await api.patch("/users/me", profile);
      setUser(data.user);
      await AsyncStorage.setItem("user", JSON.stringify(data.user));
    } catch (err) {
      console.error("❌ Update profile error:", err);
      throw err;
    }
  }

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

  async function changePassword(oldPassword: string, newPassword: string) {
    try {
      console.log("📡 POST", api.defaults.baseURL + "/users/change-password");
      await api.post("/users/change-password", { oldPassword, newPassword });
      console.log("✅ Password changed successfully");
    } catch (err) {
      console.error("❌ Change password error:", err);
      throw err;
    }
  }

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
