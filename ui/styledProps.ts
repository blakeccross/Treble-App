import { useAppTheme } from "@/theme/ThemeContext";
import {
  Dimensions,
  type GestureResponderEvent,
  StyleProp,
  TextStyle,
  ViewStyle,
} from "react-native";
import {
  resolveColor,
  resolveFontSize,
  resolveLineHeight,
  resolveRadius,
  resolveSpace,
  resolveSize,
  type TokenValue,
} from "./resolveToken";

export type LayoutProps = {
  flex?: number;
  flexDirection?: ViewStyle["flexDirection"];
  flexGrow?: number;
  flexShrink?: number;
  flexWrap?: ViewStyle["flexWrap"];
  alignItems?: ViewStyle["alignItems"];
  alignSelf?: ViewStyle["alignSelf"];
  justifyContent?: ViewStyle["justifyContent"];
  gap?: TokenValue;
  rowGap?: TokenValue;
  columnGap?: TokenValue;
  width?: TokenValue | "100%";
  height?: TokenValue | "100%";
  minWidth?: TokenValue;
  minHeight?: TokenValue;
  maxWidth?: TokenValue;
  maxHeight?: TokenValue;
  padding?: TokenValue;
  paddingTop?: TokenValue;
  paddingBottom?: TokenValue;
  paddingLeft?: TokenValue;
  paddingRight?: TokenValue;
  paddingHorizontal?: TokenValue;
  paddingVertical?: TokenValue;
  margin?: TokenValue;
  marginTop?: TokenValue;
  marginBottom?: TokenValue;
  marginLeft?: TokenValue;
  marginRight?: TokenValue;
  marginHorizontal?: TokenValue;
  marginVertical?: TokenValue;
  top?: TokenValue;
  bottom?: TokenValue;
  left?: TokenValue;
  right?: TokenValue;
  position?: ViewStyle["position"];
  overflow?: ViewStyle["overflow"];
  opacity?: number;
  zIndex?: number;
  borderWidth?: TokenValue;
  borderColor?: TokenValue;
  borderRadius?: TokenValue;
  borderTopLeftRadius?: TokenValue;
  borderTopRightRadius?: TokenValue;
  borderBottomLeftRadius?: TokenValue;
  borderBottomRightRadius?: TokenValue;
  borderBottomWidth?: TokenValue;
  borderBottomColor?: TokenValue;
  borderTopWidth?: TokenValue;
  borderTopColor?: TokenValue;
  borderLeftWidth?: TokenValue;
  borderLeftColor?: TokenValue;
  borderRightWidth?: TokenValue;
  borderRightColor?: TokenValue;
  backgroundColor?: TokenValue;
  /** Android elevation / shadow depth — number or size token (e.g. `$0.25`) */
  elevation?: TokenValue | number;
  elevate?: boolean;
  shadowColor?: TokenValue;
  shadowOffset?: ViewStyle["shadowOffset"];
  shadowOpacity?: number;
  shadowRadius?: number;
};

/** Tamagui-style responsive overrides (from former tamagui.config media) */
export type MediaProps = {
  $xs?: Partial<LayoutProps>;
  $sm?: Partial<LayoutProps>;
  $md?: Partial<LayoutProps>;
  $lg?: Partial<LayoutProps>;
  $xl?: Partial<LayoutProps>;
};

const MEDIA_BREAKPOINTS = {
  $xs: 660,
  $sm: 800,
  $md: 1020,
  $lg: 1280,
  $xl: 1420,
} as const;

export function applyMediaProps<T extends LayoutProps & MediaProps>(
  props: T,
): LayoutProps {
  const width = Dimensions.get("window").width;
  let merged: LayoutProps = { ...props };

  (
    Object.keys(MEDIA_BREAKPOINTS) as (keyof typeof MEDIA_BREAKPOINTS)[]
  ).forEach((key) => {
    const override = props[key];
    if (override && width <= MEDIA_BREAKPOINTS[key]) {
      merged = { ...merged, ...override };
    }
    delete (merged as Record<string, unknown>)[key];
  });

  return merged;
}

const LAYOUT_PROP_KEYS = new Set<string>([
  "flex",
  "flexDirection",
  "flexGrow",
  "flexShrink",
  "flexWrap",
  "alignItems",
  "alignSelf",
  "justifyContent",
  "gap",
  "rowGap",
  "columnGap",
  "width",
  "height",
  "minWidth",
  "minHeight",
  "maxWidth",
  "maxHeight",
  "padding",
  "paddingTop",
  "paddingBottom",
  "paddingLeft",
  "paddingRight",
  "paddingHorizontal",
  "paddingVertical",
  "margin",
  "marginTop",
  "marginBottom",
  "marginLeft",
  "marginRight",
  "marginHorizontal",
  "marginVertical",
  "top",
  "bottom",
  "left",
  "right",
  "position",
  "overflow",
  "opacity",
  "zIndex",
  "borderWidth",
  "borderColor",
  "borderRadius",
  "borderTopLeftRadius",
  "borderTopRightRadius",
  "borderBottomLeftRadius",
  "borderBottomRightRadius",
  "borderBottomWidth",
  "borderBottomColor",
  "borderTopWidth",
  "borderTopColor",
  "borderLeftWidth",
  "borderLeftColor",
  "borderRightWidth",
  "borderRightColor",
  "backgroundColor",
  "elevation",
  "elevate",
  "shadowColor",
  "shadowOffset",
  "shadowOpacity",
  "shadowRadius",
  "$xs",
  "$sm",
  "$md",
  "$lg",
  "$xl",
]);

const STYLED_ONLY_KEYS = new Set([
  "onPress",
  "theme",
  "transition",
  "pressStyle",
  "style",
  "children",
  "color",
]);

const TEXT_STYLED_KEYS = new Set([
  "fontSize",
  "fontWeight",
  "fontFamily",
  "lineHeight",
  "letterSpacing",
  "textAlign",
  "textDecorationLine",
]);

const TEXT_STYLED_ONLY_KEYS = new Set([
  "theme",
  "transition",
  "style",
  "children",
  "color",
]);

export function splitStyledTextProps<T extends Record<string, unknown>>(
  props: T,
) {
  const styled: Record<string, unknown> = {};
  const rest: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(props)) {
    const isStyledKey =
      LAYOUT_PROP_KEYS.has(key) ||
      TEXT_STYLED_KEYS.has(key) ||
      TEXT_STYLED_ONLY_KEYS.has(key) ||
      key.startsWith("$");
    if (isStyledKey) {
      if (!TEXT_STYLED_ONLY_KEYS.has(key)) styled[key] = value;
    } else {
      rest[key] = value;
    }
  }

  return {
    styled: styled as TextProps & MediaProps,
    rest: rest as Omit<T, keyof TextProps | keyof MediaProps>,
  };
}

export function splitStyledViewProps<T extends Record<string, unknown>>(
  props: T,
) {
  const layout: Record<string, unknown> = {};
  const rest: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(props)) {
    if (LAYOUT_PROP_KEYS.has(key) || STYLED_ONLY_KEYS.has(key)) {
      if (!STYLED_ONLY_KEYS.has(key)) layout[key] = value;
    } else {
      rest[key] = value;
    }
  }

  return {
    layout: layout as LayoutProps & MediaProps,
    rest: rest as Omit<T, keyof LayoutProps | keyof MediaProps>,
  };
}

type TextProps = LayoutProps & {
  color?: TokenValue;
  fontSize?: TokenValue;
  fontWeight?: TextStyle["fontWeight"] | string | number;
  fontFamily?: string;
  lineHeight?: TokenValue;
  letterSpacing?: number;
  textAlign?: TextStyle["textAlign"];
  textDecorationLine?: TextStyle["textDecorationLine"];
  numberOfLines?: number;
};

type ThemeCtx = ReturnType<typeof useAppTheme>;

const sp = (ctx: ThemeCtx, v?: TokenValue) =>
  resolveSpace(v, ctx.tokens, ctx.name);
const sz = (ctx: ThemeCtx, v?: TokenValue) =>
  resolveSize(v, ctx.tokens, ctx.name);
const rad = (ctx: ThemeCtx, v?: TokenValue) =>
  resolveRadius(v, ctx.tokens, ctx.name);
const fs = (ctx: ThemeCtx, v?: TokenValue) =>
  resolveFontSize(v, ctx.tokens, ctx.name);
const lh = (ctx: ThemeCtx, v?: TokenValue) =>
  resolveLineHeight(v, ctx.tokens, ctx.name);
const col = (ctx: ThemeCtx, v?: TokenValue) =>
  resolveColor(v, ctx.tokens, ctx.name);

export function useResolvedViewStyle(
  props: LayoutProps & MediaProps,
  extra?: ViewStyle,
): ViewStyle {
  const theme = useAppTheme();
  const resolvedProps = applyMediaProps(props);
  const gap = sp(theme, resolvedProps.gap);

  const style: ViewStyle = {
    flex: resolvedProps.flex,
    flexDirection: resolvedProps.flexDirection,
    flexGrow: resolvedProps.flexGrow,
    flexShrink: resolvedProps.flexShrink,
    flexWrap: resolvedProps.flexWrap,
    alignItems: resolvedProps.alignItems,
    alignSelf: resolvedProps.alignSelf,
    justifyContent: resolvedProps.justifyContent,
    gap,
    rowGap: sp(theme, resolvedProps.rowGap) ?? gap,
    columnGap: sp(theme, resolvedProps.columnGap) ?? gap,
    width:
      resolvedProps.width === "100%" ? "100%" : sz(theme, resolvedProps.width),
    height:
      resolvedProps.height === "100%"
        ? "100%"
        : sz(theme, resolvedProps.height),
    minWidth: sz(theme, resolvedProps.minWidth),
    minHeight: sz(theme, resolvedProps.minHeight),
    maxWidth: sz(theme, resolvedProps.maxWidth),
    maxHeight: sz(theme, resolvedProps.maxHeight),
    padding: sp(theme, resolvedProps.padding),
    paddingTop: sp(theme, resolvedProps.paddingTop),
    paddingBottom: sp(theme, resolvedProps.paddingBottom),
    paddingLeft: sp(theme, resolvedProps.paddingLeft),
    paddingRight: sp(theme, resolvedProps.paddingRight),
    paddingHorizontal: sp(theme, resolvedProps.paddingHorizontal),
    paddingVertical: sp(theme, resolvedProps.paddingVertical),
    margin: sp(theme, resolvedProps.margin),
    marginTop: sp(theme, resolvedProps.marginTop),
    marginBottom: sp(theme, resolvedProps.marginBottom),
    marginLeft: sp(theme, resolvedProps.marginLeft),
    marginRight: sp(theme, resolvedProps.marginRight),
    marginHorizontal: sp(theme, resolvedProps.marginHorizontal),
    marginVertical: sp(theme, resolvedProps.marginVertical),
    top: sp(theme, resolvedProps.top),
    bottom: sp(theme, resolvedProps.bottom),
    left: sp(theme, resolvedProps.left),
    right: sp(theme, resolvedProps.right),
    position: resolvedProps.position,
    overflow: resolvedProps.overflow,
    opacity: resolvedProps.opacity,
    zIndex: resolvedProps.zIndex,
    borderWidth: sp(theme, resolvedProps.borderWidth),
    borderBottomWidth: sp(theme, resolvedProps.borderBottomWidth),
    borderBottomColor: col(theme, resolvedProps.borderBottomColor),
    borderTopWidth: sp(theme, resolvedProps.borderTopWidth),
    borderTopColor: col(theme, resolvedProps.borderTopColor),
    borderLeftWidth: sp(theme, resolvedProps.borderLeftWidth),
    borderLeftColor: col(theme, resolvedProps.borderLeftColor),
    borderRightWidth: sp(theme, resolvedProps.borderRightWidth),
    borderRightColor: col(theme, resolvedProps.borderRightColor),
    borderColor: col(theme, resolvedProps.borderColor),
    borderRadius: rad(theme, resolvedProps.borderRadius),
    borderTopLeftRadius: rad(theme, resolvedProps.borderTopLeftRadius),
    borderTopRightRadius: rad(theme, resolvedProps.borderTopRightRadius),
    borderBottomLeftRadius: rad(theme, resolvedProps.borderBottomLeftRadius),
    borderBottomRightRadius: rad(theme, resolvedProps.borderBottomRightRadius),
    backgroundColor: col(theme, resolvedProps.backgroundColor),
    elevation: resolvedProps.elevate
      ? 4
      : resolvedProps.elevation != null
        ? typeof resolvedProps.elevation === "number"
          ? resolvedProps.elevation
          : sz(theme, resolvedProps.elevation)
        : undefined,
    shadowColor: col(theme, resolvedProps.shadowColor),
    shadowOffset: resolvedProps.shadowOffset,
    shadowOpacity: resolvedProps.shadowOpacity,
    shadowRadius: resolvedProps.shadowRadius,
    ...extra,
  };

  return Object.fromEntries(
    Object.entries(style).filter(([, v]) => v !== undefined),
  ) as ViewStyle;
}

export function useResolvedTextStyle(
  props: TextProps & MediaProps,
  extra?: TextStyle,
): TextStyle {
  const theme = useAppTheme();
  const {
    fontSize: _fontSize,
    lineHeight: _lineHeight,
    color: _color,
    fontWeight: _fontWeight,
    fontFamily: _fontFamily,
    letterSpacing: _letterSpacing,
    textAlign: _textAlign,
    textDecorationLine: _textDecorationLine,
    ...layoutProps
  } = props;
  const layout = useResolvedViewStyle(layoutProps);

  const fontWeight = props.fontWeight;
  const parsedWeight =
    typeof fontWeight === "number"
      ? String(fontWeight)
      : fontWeight === "bold"
        ? "700"
        : fontWeight === "600"
          ? "600"
          : fontWeight === "800"
            ? "800"
            : fontWeight;

  const style: TextStyle = {
    color: col(theme, props.color ?? "$color"),
    fontSize: fs(theme, props.fontSize),
    fontWeight: parsedWeight as TextStyle["fontWeight"],
    fontFamily: props.fontFamily ?? "Inter",
    lineHeight: lh(theme, props.lineHeight),
    letterSpacing: props.letterSpacing,
    textAlign: props.textAlign,
    textDecorationLine: props.textDecorationLine,
    margin: layout.margin,
    marginTop: layout.marginTop,
    marginBottom: layout.marginBottom,
    marginLeft: layout.marginLeft,
    marginRight: layout.marginRight,
    marginHorizontal: layout.marginHorizontal,
    marginVertical: layout.marginVertical,
  };

  return Object.fromEntries(
    Object.entries({ ...style, ...extra }).filter(([, v]) => v !== undefined),
  ) as TextStyle;
}

export type PressStyleProps = {
  scale?: number;
  backgroundColor?: TokenValue;
};

export type StyledViewProps = LayoutProps &
  MediaProps & {
    style?: StyleProp<ViewStyle>;
    children?: React.ReactNode;
    onPress?: (event: GestureResponderEvent) => void;
    pressStyle?: PressStyleProps;
    /** Cascades to icons (and matches Tamagui styled stacks) */
    color?: TokenValue;
    /** Tamagui compat — ignored on layout primitives; use Theme wrapper for colors */
    theme?: string;
    /** Tamagui compat — ignored */
    transition?: string;
  };

export type StyledTextProps = TextProps &
  MediaProps & {
    style?: StyleProp<TextStyle>;
    children?: React.ReactNode;
    theme?: string;
    transition?: string;
  };

export {
  resolveColor,
  resolveFontSize,
  resolveLineHeight,
  resolveRadius,
  resolveSize,
  resolveSpace,
} from "./resolveToken";
