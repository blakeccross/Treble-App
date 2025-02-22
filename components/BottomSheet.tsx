import React, { useEffect } from "react";
import { StyleSheet, TouchableOpacity, useWindowDimensions } from "react-native";
import { Gesture, GestureDetector, MouseButton } from "react-native-gesture-handler";
import Animated, { ReduceMotion, useAnimatedStyle, Easing, useSharedValue, withDelay, withTiming, withSpring } from "react-native-reanimated";
import { window } from "../utils";
import { GetThemeValueForKey, Paragraph, View } from "tamagui";
import { SafeAreaView } from "react-native-safe-area-context";

export default function BottomSheet({
  isOpen,
  setIsOpen,
  height,
  backgroundColor,
  duration = 700,
  dismissOnOverlayPress = true,
  children,
}: {
  isOpen: boolean;
  setIsOpen: any;
  height?: string | number;
  backgroundColor?: GetThemeValueForKey<"backgroundColor">;
  duration?: number;
  dismissOnOverlayPress?: boolean;
  children: any;
}) {
  const { height: windowHeight } = useWindowDimensions();

  const modalHeight = useSharedValue(500);
  const progress = useSharedValue(1);

  // const progress = useDerivedValue(() => withTiming(isOpen ? 0 : 1, { duration }));
  useEffect(() => {
    if (typeof height === "string") {
      if (height.includes("%")) {
        const percent = Number(height.replace("%", "")) * 0.01 * window.height;
        modalHeight.value = percent;
      }
    } else if (typeof height === "number") {
      modalHeight.value = height;
    }
  }, [height]);

  useEffect(() => {
    if (isOpen) {
      progress.value = withSpring(0, { duration, clamp: { max: 0 } });
      // progress.value = withTiming(0, { duration, easing: Easing.inOut(Easing.quad), reduceMotion: ReduceMotion.System });
    } else {
      progress.value = withTiming(1, { duration, easing: Easing.inOut(Easing.quad), reduceMotion: ReduceMotion.System });
    }
  }, [isOpen]);

  const sheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: progress.value * 2 * modalHeight.value }],
    height: modalHeight.value,
  }));

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: 1 - progress.value,
    zIndex: isOpen ? 1 : withDelay(duration, withTiming(-1, { duration: 0 })),
  }));

  const panGesture = Gesture.Pan()
    .onChange((e) => {
      const gestureAmount = e.translationY / windowHeight / (modalHeight.value / windowHeight);
      if (gestureAmount > 0 && isOpen && dismissOnOverlayPress) progress.value = gestureAmount;
    })
    .onEnd((e) => {
      const gestureAmount = e.translationY / windowHeight / (modalHeight.value / windowHeight);
      if (gestureAmount > 0 && dismissOnOverlayPress) {
        // const secondHeightPoint = 200;
        // progress.value = withTiming(secondHeightPoint / windowHeight, { duration });
        setIsOpen(false);
      }
    })
    .runOnJS(true);

  return (
    <>
      <Animated.View style={[sheetStyles.backdrop, backdropStyle]}>
        <TouchableOpacity style={{ flex: 1 }} onPress={() => dismissOnOverlayPress && setIsOpen(false)} />
      </Animated.View>
      <GestureDetector gesture={panGesture}>
        <Animated.View
          onLayout={(e) => {
            if (!height) modalHeight.value = e.nativeEvent.layout.height;
          }}
          style={[sheetStyles.sheet, sheetStyle]}
        >
          <View
            backgroundColor={backgroundColor ? backgroundColor : "$background"}
            flex={1}
            padding={"$3"}
            borderTopLeftRadius={"$10"}
            borderTopRightRadius={"$10"}
          >
            <View alignItems="center" paddingBottom={"$2"}>
              <View width={"$10"} backgroundColor={"$gray8"} height={"$0.5"} borderRadius={50}></View>
            </View>
            {children}
            <SafeAreaView edges={["bottom"]} />
          </View>
        </Animated.View>
      </GestureDetector>
    </>
  );
}

const sheetStyles = StyleSheet.create({
  sheet: {
    width: "100%",
    position: "absolute",
    bottom: 0,
    zIndex: 100_000,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
  },
});
