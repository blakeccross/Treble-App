import React, { ReactElement } from "react";
import { StyleSheet, View } from "react-native";
import Animated, { useAnimatedStyle, useAnimatedGestureHandler, withSpring, useSharedValue, useDerivedValue } from "react-native-reanimated";
import { Gesture, GestureDetector, PanGestureHandler, PanGestureHandlerGestureEvent } from "react-native-gesture-handler";
import { between, useVector } from "react-native-redash";

import { calculateLayout, lastOrder, Offset, remove, reorder, WORD_HEIGHT, SENTENCE_HEIGHT, MARGIN_LEFT, MARGIN_TOP } from "./layout";

import Placeholder from "./placeholder";

interface SortableWordProps {
  offsets: Offset[];
  children: ReactElement<{ id: number }>;
  index: number;
  containerWidth: number;
}

const SortableWord = ({ offsets, index, children, containerWidth }: SortableWordProps) => {
  const offset = offsets[index]!;
  const isGestureActive = useSharedValue(false);
  const isAnimating = useSharedValue(false);
  const translation = useVector();
  const isInBank = useDerivedValue(() => offset.order.value === -1);

  // Define a spring configuration with higher damping to reduce bounce
  const springConfig = {
    damping: 20, // Higher damping to reduce bounce
    stiffness: 90, // Adjust stiffness to control the speed of the spring
    mass: 1,
    overshootClamping: false,
    restDisplacementThreshold: 0.01,
    restSpeedThreshold: 0.01,
  };
  // Shared values for context
  const contextX = useSharedValue(0);
  const contextY = useSharedValue(0);

  const panGesture = Gesture.Pan()
    .onBegin((e) => {
      if (isInBank.value) {
        translation.x.value = offset.originalX.value - MARGIN_LEFT;
        translation.y.value = offset.originalY.value + MARGIN_TOP;
      } else {
        translation.x.value = offset.x.value;
        translation.y.value = offset.y.value;
      }
      contextX.value = translation.x.value;
      contextY.value = translation.y.value;
      isGestureActive.value = true;
    })
    .onUpdate((e) => {
      translation.x.value = contextX.value + e.translationX;
      translation.y.value = contextY.value + e.translationY;

      if (isInBank.value && translation.y.value < SENTENCE_HEIGHT) {
        offset.order.value = lastOrder(offsets);
        calculateLayout(offsets, containerWidth);
      } else if (!isInBank.value && translation.y.value > SENTENCE_HEIGHT) {
        offset.order.value = -1;
        remove(offsets, index);
        calculateLayout(offsets, containerWidth);
      }

      for (let i = 0; i < offsets.length; i++) {
        const o = offsets[i];
        if (i === index && o.order.value !== -1) {
          continue;
        }
        if (between(translation.x.value, o.x.value, o.x.value + o.width.value) && between(translation.y.value, o.y.value, o.y.value + WORD_HEIGHT)) {
          reorder(offsets, offset.order.value, o.order.value);
          calculateLayout(offsets, containerWidth);
          break;
        }
      }
    })
    .onEnd((e) => {
      isAnimating.value = true;
      translation.x.value = withSpring(offset.x.value, { velocity: e.velocityX, ...springConfig }, () => (isAnimating.value = false));
      translation.y.value = withSpring(offset.y.value, { velocity: e.velocityY, ...springConfig });
      isGestureActive.value = false;
    });

  const translateX = useDerivedValue(() => {
    if (isGestureActive.value) {
      return translation.x.value;
    }
    return withSpring(isInBank.value ? offset.originalX.value - MARGIN_LEFT : offset.x.value, springConfig);
  });
  const translateY = useDerivedValue(() => {
    if (isGestureActive.value) {
      return translation.y.value;
    }
    return withSpring(isInBank.value ? offset.originalY.value + MARGIN_TOP : offset.y.value, springConfig);
  });
  const style = useAnimatedStyle(() => {
    return {
      position: "absolute",
      top: 0,
      left: 0,
      zIndex: isGestureActive.value || isAnimating.value ? 100 : 0,
      width: offset.width.value,
      height: WORD_HEIGHT,
      transform: [{ translateX: translateX.value }, { translateY: translateY.value }],
    } as any;
  });
  return (
    <>
      <Placeholder offset={offset} />
      <Animated.View style={style}>
        <GestureDetector gesture={panGesture}>
          <Animated.View style={StyleSheet.absoluteFill}>{children}</Animated.View>
        </GestureDetector>
      </Animated.View>
    </>
  );
};

export default SortableWord;
