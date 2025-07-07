"use client";

import type React from "react";

import { createContext, useContext, useState, useEffect } from "react";

type Settings = {
  fontSize: number;
  editorTheme: string;
  keyboardShortcuts: boolean;
  autoSave: boolean;
  wordWrap: boolean;
};

type SettingsContextType = {
  settings: Settings;
  updateSettings: (settings: Partial<Settings>) => void;
  openSettings: () => void;
  closeSettings: () => void;
};

const defaultSettings: Settings = {
  fontSize: 14,
  editorTheme: "dracula",
  keyboardShortcuts: true,
  autoSave: true,
  wordWrap: false,
};

const SettingsContext = createContext<SettingsContextType | undefined>(
  undefined
);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<Settings>(defaultSettings);

  useEffect(() => {
    // Load settings from localStorage on initial render
    const savedSettings = localStorage.getItem("ide-settings");
    if (savedSettings) {
      try {
        setSettings(JSON.parse(savedSettings));
      } catch (error) {
        console.error("Failed to parse settings:", error);
      }
    }
  }, []);

  useEffect(() => {
    // Save settings to localStorage when they change
    localStorage.setItem("ide-settings", JSON.stringify(settings));
  }, [settings]);

  const updateSettings = (newSettings: Partial<Settings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  const openSettings = () => {
    // This would typically open a settings modal or panel
    console.log("Settings opened");
  };
  const closeSettings = () => {
    // This would typically close a settings modal or panel
    console.log("Settings closed");
  };

  return (
    <SettingsContext.Provider
      value={{ settings, updateSettings, openSettings, closeSettings }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export const useSettings = (): SettingsContextType => {
  const context = useContext(SettingsContext);

  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }

  return context;
};
