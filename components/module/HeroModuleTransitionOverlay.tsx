import type { HeroSourceRect } from "@/context/module-hero-transition";
import { Image } from "expo-image";
import React, { useEffect, useRef } from "react";
import { StyleSheet } from "react-native";
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

const blurhash =
  "|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";

type Props = {
  uri: string;
  imageSourceRect: HeroSourceRect;
  imageTargetRect: HeroSourceRect;
  direction?: "forward" | "reverse";
  onComplete: () => void;
};

/**
 * Flies the module poster from source window coords into the target frame.
 */
export function HeroModuleTransitionOverlay({
  uri,
  imageSourceRect,
  imageTargetRect,
  direction = "forward",
  onComplete,
}: Props) {
  const progress = useSharedValue(direction === "reverse" ? 1 : 0);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    const from = direction === "reverse" ? 1 : 0;
    const to = direction === "reverse" ? 0 : 1;
    progress.value = from;
    progress.value = withTiming(
      to,
      { duration: 400, easing: Easing.bezier(0.25, 0.1, 0.25, 1) },
      (finished) => {
        if (finished) runOnJS(onCompleteRef.current)();
      },
    );
  }, [progress, direction, uri, imageSourceRect, imageTargetRect]);

  const imageStyle = useAnimatedStyle(() => {
    const p = progress.value;
    const x = imageSourceRect.x + (imageTargetRect.x - imageSourceRect.x) * p;
    const y = imageSourceRect.y + (imageTargetRect.y - imageSourceRect.y) * p;
    const w =
      imageSourceRect.width +
      (imageTargetRect.width - imageSourceRect.width) * p;
    const h =
      imageSourceRect.height +
      (imageTargetRect.height - imageSourceRect.height) * p;
    const r = 26 * (1 - p);
    return {
      position: "absolute",
      left: x,
      top: y,
      width: w,
      height: h,
      borderRadius: r,
      overflow: "hidden",
      zIndex: 100000,
      elevation: 24,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 12 },
      shadowOpacity: 0.35,
      shadowRadius: 20,
    };
  });

  return (
    <Animated.View style={imageStyle} pointerEvents="none">
      <Image
        source={uri}
        style={StyleSheet.absoluteFill}
        placeholder={{ blurhash }}
        contentFit="cover"
        transition={0}
      />
    </Animated.View>
  );
}
