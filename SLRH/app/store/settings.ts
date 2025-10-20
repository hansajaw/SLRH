import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { zustandStorage } from "./storage";

export type ThemeChoice = "System" | "Light" | "Dark";
export type LanguageChoice = "English" | "සිංහල" | "தமிழ்";

type SettingsState = {
  pushEnabled: boolean;
  emailEnabled: boolean;
  analyticsAllowed: boolean;
  language: LanguageChoice;
  theme: ThemeChoice;
  setPush: (b: boolean) => void;
  setEmail: (b: boolean) => void;
  setAnalytics: (b: boolean) => void;
  setLanguage: (l: LanguageChoice) => void;
  setTheme: (t: ThemeChoice) => void;
};

export const useSettings = create<SettingsState>()(
  persist(
    (set) => ({
      pushEnabled: true,
      emailEnabled: false,
      analyticsAllowed: true,
      language: "English",
      theme: "Dark",
      setPush: (b) => set({ pushEnabled: b }),
      setEmail: (b) => set({ emailEnabled: b }),
      setAnalytics: (b) => set({ analyticsAllowed: b }),
      setLanguage: (l) => set({ language: l }),
      setTheme: (t) => set({ theme: t }),
    }),
    {
      name: "slrh-settings",
      storage: createJSONStorage(() => zustandStorage),
      version: 1,
    }
  )
);
