import { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../utils/api";

/* -------------------- Types -------------------- */
type User = {
  _id?: string;
  email: string;
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
        if (storedToken) {
          setToken(storedToken);
          api.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`;
          if (storedUser) setUser(JSON.parse(storedUser));
          else await loadMe();
        }
      } catch (err) {
        console.warn("Error restoring user:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  /* -------- Signup -------- */
  async function signup(email: string, password: string, confirmPassword: string) {
    const { data } = await api.post("/auth/signup", { email, password, confirmPassword });
    setToken(data.token);
    setUser(data.user);
    api.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;
    await AsyncStorage.setItem("token", data.token);
    await AsyncStorage.setItem("user", JSON.stringify(data.user));
  }

  /* -------- Login -------- */
  async function login(email: string, password: string, remember: boolean = false) {
    const { data } = await api.post("/auth/login", { email, password });
    setToken(data.token);
    setUser(data.user);
    api.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;

    await AsyncStorage.setItem("token", data.token);
    await AsyncStorage.setItem("user", JSON.stringify(data.user));
    if (remember) await AsyncStorage.setItem("remember", "true");
  }

  /* -------- Load profile -------- */
  async function loadMe() {
    const { data } = await api.get("/users/me");
    setUser(data.user);
    await AsyncStorage.setItem("user", JSON.stringify(data.user));
  }

  /* -------- Update profile -------- */
  async function updateProfile(profile: Partial<User>) {
    const { data } = await api.patch("/users/me", profile);
    setUser(data.user);
    await AsyncStorage.setItem("user", JSON.stringify(data.user));
  }

  /* -------- Update avatar -------- */
  async function updateAvatar(uri: string) {
    try {
      setUser((prev) => (prev ? { ...prev, avatarUri: uri } : prev));
      const updated = { ...user, avatarUri: uri };
      await AsyncStorage.setItem("user", JSON.stringify(updated));
    } catch (err) {
      console.warn("Avatar update failed:", err);
    }
  }

  /* -------- Change password -------- */
  async function changePassword(oldPassword: string, newPassword: string) {
    await api.post("/users/change-password", { oldPassword, newPassword });
  }

  /* -------- Logout -------- */
  async function logout() {
    try {
      await AsyncStorage.multiRemove(["token", "user", "remember"]);
    } catch {}
    setUser(null);
    setToken(null);
    delete api.defaults.headers.common["Authorization"];
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
