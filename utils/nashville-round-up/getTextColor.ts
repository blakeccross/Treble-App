import { red } from "@tamagui/themes";

export const getTextColor = (value: string) => {
  if (!value) return "black";
  return value.includes("m") || value.includes("°") ? red.red10 : "black";
};
