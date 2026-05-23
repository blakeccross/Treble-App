// Flattened Radix palettes (replaces legacy theme/index lightColors / darkColors)

import {
  blue,
  blueDark,
  gray,
  grayDark,
  green,
  greenDark,
  orange,
  orangeDark,
  pink,
  pinkDark,
  purple,
  purpleDark,
  red,
  redDark,
  yellow,
  yellowDark,
} from "./palettes";

export const lightColors = {
  ...blue,
  ...gray,
  ...green,
  ...orange,
  ...pink,
  ...purple,
  ...red,
  ...yellow,
};

export const darkColors = {
  ...blueDark,
  ...grayDark,
  ...greenDark,
  ...orangeDark,
  ...pinkDark,
  ...purpleDark,
  ...redDark,
  ...yellowDark,
};
