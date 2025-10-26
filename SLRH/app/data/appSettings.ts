import AsyncStorage from "@react-native-async-storage/async-storage";

/* -------------------------------------------------------------------------- */
/*                                 Types                                      */
/* -------------------------------------------------------------------------- */

export type ThemeMode = "light" | "dark" | "system";

export type AppSettings = {
  /** user’s preferred theme */
  theme: ThemeMode;
  /** whether notifications are muted */
  notificationsMuted: boolean;
};

const KEY = "app_settings_v1";

export const defaultSettings: AppSettings = {
  theme: "system",
  notificationsMuted: false,
};


export const lightPalette = {
    isDark: false,
  background: "#F5F5F5",        // Light concrete/track grey
  card: "#FFFFFF",               // Pure white for contrast
  input: "#ECECEC",              // Soft grey input
  text: "#0A0A0A",               // Deep black
  textSecondary: "#5A5A5A",      // Dark grey
  border: "#D4D4D4",             // Light border
  accent: "#FF4500",             // Racing orange-red (fire!)
  accentAlt: "#FFD700",          // Gold (winner's trophy)
  success: "#00D26A",            // Victory green
  warning: "#FF8C00",            // Caution flag orange
  overlay: "rgba(0,0,0,0.08)",
};

export const darkPalette = {
    isDark: true,
  background: "#0A0A0A",         // Deep black (night racing)
  card: "#1A1A1A",               // Dark carbon fiber
  input: "#252525",              // Matte black input
  text: "#FFFFFF",               // Pure white
  textSecondary: "#A8A8A8",      // Silver grey
  border: "#2A2A2A",             // Dark border
  accent: "#FF3D00",             // Burning red-orange 🔥
  accentAlt: "#FFD700",          // Championship gold
  success: "#00FF7F",            // Neon green (go flag)
  warning: "#FFA500",            // Warning orange
  overlay: "rgba(0,0,0,0.6)",
};

/** Load settings from AsyncStorage. Falls back to defaults on error. */
export async function loadSettings(): Promise<AppSettings> {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    if (raw) {
      return { ...defaultSettings, ...JSON.parse(raw) };
    }
  } catch (err) {
    console.warn("Failed to load app settings:", err);
  }
  return defaultSettings;
}

/** Save settings to AsyncStorage. */
export async function saveSettings(next: AppSettings): Promise<void> {
  try {
    await AsyncStorage.setItem(KEY, JSON.stringify(next));
  } catch (err) {
    console.warn("Failed to save app settings:", err);
  }
}
