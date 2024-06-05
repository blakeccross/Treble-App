import * as React from "react";
import { StyleSheet, Text, View } from "react-native";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import type Animated from "react-native-reanimated";
import { Extrapolate, interpolate } from "react-native-reanimated";
import Carousel, { ICarouselInstance } from "react-native-reanimated-carousel";
import { MENU_ITEMS } from "@/utils/sample-data";

import { window } from "@/utils";

const PAGE_WIDTH = window.width;
const PAGE_HEIGHT = window.height; // Added to handle vertical animation

export default function ModuleNavigation() {
  const r = React.useRef<ICarouselInstance>(null);
  const itemSize = 300;
  const centerOffset = PAGE_WIDTH / 2 - itemSize / 2;

  const dataLength = 18;

  const sideItemCount = 3;
  const sideItemWidth = (PAGE_WIDTH - itemSize) / (2 * sideItemCount);
  const sideItemHeight = (PAGE_HEIGHT - itemSize) / (2 * sideItemCount);
  const cardHeight = 300;

  const animationStyle = React.useCallback(
    (value: number) => {
      "worklet";

      const itemOffsetInput = new Array(sideItemCount * 2 + 1).fill(null).map((_, index) => index - sideItemCount);

      const itemOffset = interpolate(
        value,
        // e.g. [0,1,2,3,4,5,6] -> [-3,-2,-1,0,1,2,3]
        itemOffsetInput,
        itemOffsetInput.map((item) => {
          if (item < 0) {
            return (-itemSize + sideItemHeight) * Math.abs(item); // Adjusted for vertical
          } else if (item > 0) {
            return (itemSize - sideItemHeight) * (Math.abs(item) - 1); // Adjusted for vertical
          }
          return 0;
        }) as number[]
      );

      const translate = interpolate(value, [-1, 0, 1], [-itemSize, 0, itemSize]) + centerOffset - itemOffset;

      const height = interpolate(value, [-1, 0, 1], [cardHeight, itemSize, cardHeight], Extrapolate.CLAMP); // Adjusted for vertical
      const width = PAGE_WIDTH;

      // Calculate the translation needed to grow from the top
      const translateYFromTop = translate - (itemSize - height) / 2;

      return {
        transform: [
          {
            translateY: translate, // Changed to translateY for vertical
          },
        ],
        height, // Changed to height for vertical
        width,
        overflow: "hidden",
      };
    },
    [centerOffset, itemSize, sideItemHeight, sideItemCount]
  );

  return (
    <View style={{ flex: 1 }}>
      {/* <Text>Welcome Back</Text> */}
      <Carousel
        ref={r}
        width={PAGE_WIDTH}
        vertical
        height={PAGE_WIDTH / 2}
        style={{
          width: PAGE_WIDTH,
          height: "100%",
        }}
        loop={false}
        //windowSize={Math.round(dataLength / 2)}
        scrollAnimationDuration={1500}
        // autoPlay={isAutoPlay}
        // autoPlayInterval={isFast ? 100 : 1200}
        data={MENU_ITEMS}
        renderItem={({ index, animationValue, item }) => (
          <Item
            animationValue={animationValue}
            index={index}
            key={index}
            title={item.module_name}
            backgroundColor={item.background_color}
            onPress={() =>
              r.current?.scrollTo({
                count: animationValue.value,
                animated: true,
              })
            }
          />
        )}
        customAnimation={animationStyle as any}
      />
    </View>
  );
}

const Item: React.FC<{
  index: number;
  animationValue: Animated.SharedValue<number>;
  onPress?: () => void;
  title: string;
  backgroundColor: string;
}> = ({ index, onPress, title, backgroundColor }) => {
  return (
    <TouchableWithoutFeedback onPress={onPress} containerStyle={{ flex: 1 }} style={{ flex: 1 }}>
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          overflow: "visible",
          alignItems: "center",
        }}
      >
        <View style={[styles.box, { backgroundColor: backgroundColor }]}>
          {/* <SBImageItem showIndex={false} key={index} style={styles.image} index={index} /> */}
          <Text
            style={{
              color: "#262525",
              fontWeight: "600",
              fontSize: 30,
              // width: 100,
              textAlign: "left",
              padding: 10,
            }}
          >
            {title.toUpperCase()}
          </Text>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  box: {
    width: PAGE_WIDTH,
    height: 300,
    overflow: "visible",
    borderRadius: 20,
  },
  transform: {
    transform: [{ perspective: 900 }, { rotateX: "-20deg" }],
  },
});
