import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { Appearance, ColorSchemeName } from "react-native";
import {
  lightPalette,
  darkPalette,
  loadSettings,
  saveSettings,
  type ThemeMode,
  type AppSettings,
  defaultSettings,
} from "../app/data/appSettings";

type ThemeContextType = {
  theme: ThemeMode;
  isDark: boolean;
  palette: typeof lightPalette;
  setTheme: (mode: ThemeMode) => void;
};

const ThemeContext = createContext<ThemeContextType | null>(null);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);
  const [systemScheme, setSystemScheme] = useState<"light" | "dark" | null>(
    (Appearance.getColorScheme() as "light" | "dark" | null) ?? null
  );

  // Load saved settings
  useEffect(() => {
    (async () => {
      const loaded = await loadSettings();
      setSettings(loaded);
    })();
  }, []);

  // Watch system theme changes when using "system"
  useEffect(() => {
    const sub = Appearance.addChangeListener(({ colorScheme }: { colorScheme: ColorSchemeName }) => {
      setSystemScheme((colorScheme as "light" | "dark" | null) ?? null);
    });
    return () => sub.remove();
  }, []);

  // Resolve palette & isDark based on user selection + system
  const isDark = useMemo(() => {
    if (settings.theme === "dark") return true;
    if (settings.theme === "light") return false;
    return systemScheme === "dark";
  }, [settings.theme, systemScheme]);

  const palette = useMemo(() => (isDark ? darkPalette : lightPalette), [isDark]);

  const setTheme = async (mode: ThemeMode) => {
    const next = { ...settings, theme: mode };
    setSettings(next);
    await saveSettings(next);
  };

  const value = useMemo(
    () => ({ theme: settings.theme, isDark, palette, setTheme }),
    [settings.theme, isDark, palette]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used inside ThemeProvider");
  return ctx;
};
