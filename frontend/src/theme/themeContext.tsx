// themeContext.tsx
import { createContext, useContext } from "react";

export const ThemeContext = createContext<{
  toggleTheme: () => void;
  mode: "light" | "dark";
} | undefined>(undefined);

export function useThemeContext() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useThemeContext must be used within a ThemeProvider");
  }
  return context;
}
