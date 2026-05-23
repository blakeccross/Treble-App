import { useAppTheme } from "@/theme/ThemeContext";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  AudioWaveform,
  Award,
  BarChart2,
  Check,
  ChevronLeft,
  ChevronRight,
  CircleCheck,
  CircleX,
  CreditCard,
  Gamepad2,
  Heart,
  HeartCrack,
  HelpCircle,
  Lock,
  LockOpen,
  Moon,
  Music,
  Pause,
  Play,
  RefreshCw,
  Settings,
  Share,
  Sparkles,
  Star,
  Sun,
  SunMoon,
  Trophy,
  User,
  Volume2,
  X,
  type LucideIcon,
} from "lucide-react-native";
import React, { useContext } from "react";
import { IconStyleContext } from "./IconStyleContext";
import { resolveColor, resolveSize, type TokenValue } from "./resolveToken";

/** Tamagui lucide-icons default */
const DEFAULT_ICON_SIZE = 24;

export type IconProps = {
  color?: TokenValue | string;
  fill?: string;
  size?: TokenValue | number;
  marginTop?: number;
  strokeWidth?: number;
};

function resolveIconSize(size: TokenValue | number | undefined, tokens: ReturnType<typeof useAppTheme>["tokens"], name: ReturnType<typeof useAppTheme>["name"]) {
  if (typeof size === "number") return size;
  if (size === undefined) return DEFAULT_ICON_SIZE;
  return resolveSize(size, tokens, name) ?? DEFAULT_ICON_SIZE;
}

function resolveIconColor(
  color: TokenValue | string | undefined,
  inheritedColor: string | undefined,
  tokens: ReturnType<typeof useAppTheme>["tokens"],
  name: ReturnType<typeof useAppTheme>["name"]
) {
  if (color !== undefined) {
    if (typeof color === "string" && !color.startsWith("$")) return color;
    return resolveColor(color, tokens, name) ?? inheritedColor ?? resolveColor("$color", tokens, name);
  }
  if (inheritedColor) return inheritedColor;
  return resolveColor("$color", tokens, name);
}

function createIcon(IconComponent: LucideIcon) {
  return function ThemedIcon({ color, fill, size, marginTop, strokeWidth = 2 }: IconProps) {
    const { tokens, name } = useAppTheme();
    const { color: inheritedColor } = useContext(IconStyleContext);
    const resolvedSize = resolveIconSize(size, tokens, name);
    const resolvedColor = resolveIconColor(color, inheritedColor, tokens, name);
    return (
      <IconComponent
        size={resolvedSize}
        color={resolvedColor}
        fill={fill ?? "none"}
        style={marginTop ? { marginTop } : undefined}
        strokeWidth={strokeWidth}
      />
    );
  };
}

export const ArrowLeftIcon = createIcon(ArrowLeft);
export { ArrowLeftIcon as ArrowLeft };
export const ArrowRightIcon = createIcon(ArrowRight);
export { ArrowRightIcon as ArrowRight };
export const ArrowUpRightIcon = createIcon(ArrowUpRight);
export { ArrowUpRightIcon as ArrowUpRight };
export const AudioWaveformIcon = createIcon(AudioWaveform);
export { AudioWaveformIcon as AudioWaveform };
export const AwardIcon = createIcon(Award);
export { AwardIcon as Award };
export const BarChart2Icon = createIcon(BarChart2);
export { BarChart2Icon as BarChart2 };
export const CheckIcon = createIcon(Check);
export { CheckIcon as Check };
export const ChevronLeftIcon = createIcon(ChevronLeft);
export { ChevronLeftIcon as ChevronLeft };
export const ChevronRightIcon = createIcon(ChevronRight);
export { ChevronRightIcon as ChevronRight };
export const CircleCheckIcon = createIcon(CircleCheck);
export { CircleCheckIcon as CircleCheck };
export const CircleXIcon = createIcon(CircleX);
export { CircleXIcon as CircleX };
export const CreditCardIcon = createIcon(CreditCard);
export { CreditCardIcon as CreditCard };
export const Gamepad = createIcon(Gamepad2);
export const HeartIcon = createIcon(Heart);
export { HeartIcon as Heart };
export const HeartCrackIcon = createIcon(HeartCrack);
export { HeartCrackIcon as HeartCrack };
export const HelpCircleIcon = createIcon(HelpCircle);
export { HelpCircleIcon as HelpCircle };
export const LockIcon = createIcon(Lock);
export { LockIcon as Lock };
export const LockOpenIcon = createIcon(LockOpen);
export { LockOpenIcon as LockOpen };
export const MoonIcon = createIcon(Moon);
export { MoonIcon as Moon };
export const MusicIcon = createIcon(Music);
export { MusicIcon as Music };
export const PauseIcon = createIcon(Pause);
export { PauseIcon as Pause };
export const PlayIcon = createIcon(Play);
export { PlayIcon as Play };
export const RefreshCwIcon = createIcon(RefreshCw);
export { RefreshCwIcon as RefreshCw };
export const SettingsIcon = createIcon(Settings);
export { SettingsIcon as Settings };
export const ShareIcon = createIcon(Share);
export { ShareIcon as Share };
export const Sparkle = createIcon(Sparkles);
export const StarIcon = createIcon(Star);
export { StarIcon as Star };
export const StarFull = createIcon(Star);
export const SunIcon = createIcon(Sun);
export { SunIcon as Sun };
export const SunMoonIcon = createIcon(SunMoon);
export { SunMoonIcon as SunMoon };
export const TrophyIcon = createIcon(Trophy);
export { TrophyIcon as Trophy };
export const UserIcon = createIcon(User);
export { UserIcon as User };
export const Volume2Icon = createIcon(Volume2);
export { Volume2Icon as Volume2 };
export const XIcon = createIcon(X);
export { XIcon as X };
