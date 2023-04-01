import { create } from "zustand";
import backend from "../data/BackendFactory";
import { Accent, Theme } from "../types";

interface ThemeStore {
    theme: Theme;
    accent: Accent;
    setTheme: (theme: Partial<{ theme: Theme; accent: Accent }>) => void;
}

const themeStr = localStorage.getItem("theme");

let theme: { theme: Theme; accent: Accent } = {
    theme: "theme-dark",
    accent: "theme-accent-default",
};

if (themeStr) {
    const themeLocalStore = JSON.parse(themeStr) as { theme: Theme; accent: Accent };
    theme = { ...themeLocalStore };
}

export const useThemeStore = create<ThemeStore>()((set) => ({
    theme: theme.theme,
    accent: theme.accent,
    setTheme: (newTheme: Partial<{ theme: Theme; accent: Accent }>) =>
        set((current) => {
            backend.instance.setTheme({ ...newTheme });
            return { ...current, ...newTheme };
        }),
}));
