import { red } from "@/theme/colors";

export const getTextColor = (value: string) => {
  if (!value) return "black";
  return value.includes("m") || value.includes("°") ? red.red10 : "black";
};
