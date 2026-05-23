import React from "react";

export type IconStyleContextValue = {
  color?: string;
};

export const IconStyleContext = React.createContext<IconStyleContextValue>({});

export function IconStyleProvider({
  color,
  children,
}: {
  color?: string;
  children: React.ReactNode;
}) {
  const parent = React.useContext(IconStyleContext);
  const value = color ?? parent.color;
  if (!value) return <>{children}</>;
  return <IconStyleContext.Provider value={{ color: value }}>{children}</IconStyleContext.Provider>;
}
