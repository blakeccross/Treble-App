import { createAnimations } from "@tamagui/animations-react-native";
import { createInterFont } from "@tamagui/font-inter";
import { createMedia } from "@tamagui/react-native-media-driver";
import { shorthands } from "@tamagui/shorthands";
import { blue, blueDark, themes, whiteA } from "@tamagui/themes";
import { createFont, createTamagui } from "tamagui";
import { tokens } from "./theme";

const animations = createAnimations({
  bouncy: {
    type: "spring",
    damping: 10,
    mass: 0.9,
    stiffness: 100,
  },
  lazy: {
    type: "spring",
    damping: 20,
    stiffness: 60,
  },
  quick: {
    type: "spring",
    damping: 20,
    mass: 1.2,
    stiffness: 250,
  },
});
const headingFont = createInterFont();
const systemFont = createFont({
  family: "VAG",
  size: {
    1: 12,
    2: 13,
    3: 14,
    4: 15,
    5: 16,
    6: 18,
    7: 20,
    8: 23,
    9: 30,
    10: 46,
    11: 55,
    12: 62,
    13: 72,
    14: 92,
    15: 114,
    16: 134,
  },
  lineHeight: headingFont.lineHeight,
  // weight: {
  //   1: "300",
  //   // 2 will be 300
  //   3: "600",
  // },
  letterSpacing: {
    1: 0.7,
    // 2: 1,
    // 3 will be -1
  },
  // (native only) swaps out fonts by face/style
  face: {
    100: { normal: "VAG", italic: "VAG" },
    200: { normal: "VAG", italic: "VAG" },
    300: { normal: "VAG", italic: "VAG" },
    600: { normal: "VAGMedium", italic: "VAGMedium" },
    800: { normal: "VAGBold", italic: "VAGBold" },
  },
});

// const headingFont = createInterFont();
// const bodyFont = createInterFont();

const config = createTamagui({
  animations,
  // defaultTheme: "dark",
  shouldAddPrefersColorThemes: false,
  themeClassNameOnRoot: false,
  shorthands,
  fonts: {
    heading: systemFont,
    body: systemFont,
  },
  themes: {
    ...themes,
    light_Button: {
      background: blue.blue10,
      fontWeight: 600,
      // backgroundFocus: "#424242",
      // backgroundHover: "#282828",
      backgroundPress: blueDark.blue9,
      // backgroundStrong: "#191919",
      // backgroundTransparent: "#151515",
      // borderColor: "red",
      // borderColorFocus: "red",
      // borderColorHover: "transparent",
      // borderColorPress: "red",
      color: "#fff",
      // colorFocus: "#a5a5a5",
      // colorHover: "#a5a5a5",
      // colorPress: "#fff",
      // colorTransparent: "#a5a5a5",
      // placeholderColor: "#424242",
    },
    white_button: {
      background: "#fff",
      fontWeight: 600,
      // backgroundFocus: "#424242",
      // backgroundHover: "#282828",
      backgroundPress: blueDark.blue9,
      // backgroundStrong: "#191919",
      // backgroundTransparent: "#151515",
      // borderColor: "red",
      // borderColorFocus: "red",
      // borderColorHover: "transparent",
      // borderColorPress: "red",
      // color: "#fff",
      // colorFocus: "#a5a5a5",
      // colorHover: "#a5a5a5",
      // colorPress: "#fff",
      // colorTransparent: "#a5a5a5",
      // placeholderColor: "#424242",
    },
  },
  tokens,
  media: createMedia({
    xs: { maxWidth: 660 },
    sm: { maxWidth: 800 },
    md: { maxWidth: 1020 },
    lg: { maxWidth: 1280 },
    xl: { maxWidth: 1420 },
    xxl: { maxWidth: 1600 },
    gtXs: { minWidth: 660 + 1 },
    gtSm: { minWidth: 800 + 1 },
    gtMd: { minWidth: 1020 + 1 },
    gtLg: { minWidth: 1280 + 1 },
    short: { maxHeight: 820 },
    tall: { minHeight: 820 },
    hoverNone: { hover: "none" },
    pointerCoarse: { pointer: "coarse" },
  }),
});

export type AppConfig = typeof config;

declare module "tamagui" {
  // overrides TamaguiCustomConfig so your custom types
  // work everywhere you import `tamagui`
  interface TamaguiCustomConfig extends AppConfig {}
}

declare module "@tamagui/core" {
  interface TamaguiCustomConfig extends AppConfig {}
}

export default config;
