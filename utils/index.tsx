import type { ScaledSize } from "react-native";
import { Dimensions } from "react-native";

export const window: ScaledSize = Dimensions.get("window");

export const isSmallScreen = window.width < 768;
export const isMediumScreen = window.width >= 768 && window.width <= 1024;
export const isLargeScreen = window.width > 1024;
