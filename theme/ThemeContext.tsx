import { useColorScheme } from "@/hooks/useColorScheme";
import React, { createContext, useContext, useMemo } from "react";
import { getSubTheme, getTheme, type ThemeTokens } from "./themes";

type ThemeName = "light" | "dark";

type ThemeContextValue = {
  name: ThemeName;
  tokens: ThemeTokens;
  subTheme: string | null;
};

const ThemeContext = createContext<ThemeContextValue>({
  name: "light",
  tokens: getTheme("light"),
  subTheme: null,
});

export function AppThemeProvider({ children }: { children: React.ReactNode }) {
  const scheme = useColorScheme() ?? "light";
  const name: ThemeName = scheme === "dark" ? "dark" : "light";

  const value = useMemo(
    () => ({
      name,
      tokens: getTheme(name),
      subTheme: null as string | null,
    }),
    [name],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useAppTheme() {
  return useContext(ThemeContext);
}

export function Theme({
  name,
  children,
}: {
  name?: string | null;
  children: React.ReactNode;
}) {
  const parent = useContext(ThemeContext);
  const subTheme = name ?? null;

  const value = useMemo(() => {
    const tokens = subTheme
      ? { ...parent.tokens, ...getSubTheme(parent.name, subTheme) }
      : parent.tokens;
    return { ...parent, tokens, subTheme };
  }, [parent, subTheme]);

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}
