import { ArrowLeft, ChevronLeft } from "@tamagui/lucide-icons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Dimensions, LayoutChangeEvent, Pressable, SafeAreaView, StyleSheet } from "react-native";
import Animated, {
  Extrapolation,
  interpolate,
  SharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Image } from "expo-image";
// import { LinearGradient } from "react-native-svg";
import { Stack, Text, YStack, XStack, SizableText, View, Button, Paragraph, H5 } from "tamagui";
import { color, size } from "@tamagui/themes";
import { colorTokens } from "@/theme";
import { Link, router } from "expo-router";
const blurhash =
  "|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";

const formatter = Intl.NumberFormat("en-IN");

const AnimatedLinearGradient = Animated.createAnimatedComponent(View);
const AnimatedView = Animated.createAnimatedComponent(View);
const AnimatedImage = Animated.createAnimatedComponent(Image);

const posterSize = Dimensions.get("screen").height / 2;
const headerTop = 44 - 16;

function ScreenHeader({ sv, title }: { sv: SharedValue<number>; title: string }) {
  const inset = useSafeAreaInsets();
  const opacityAnim = useAnimatedStyle(() => {
    return {
      opacity: interpolate(sv.value, [((posterSize - (headerTop + inset.top)) / 4) * 3, posterSize - (headerTop + inset.top) + 1], [0, 1]),
      transform: [
        {
          scale: interpolate(
            sv.value,
            [((posterSize - (headerTop + inset.top)) / 4) * 3, posterSize - (headerTop + inset.top) + 1],
            [0.98, 1],
            Extrapolation.CLAMP
          ),
        },
        {
          translateY: interpolate(
            sv.value,
            [((posterSize - (headerTop + inset.top)) / 4) * 3, posterSize - (headerTop + inset.top) + 1],
            [-10, 0],
            Extrapolation.CLAMP
          ),
        },
      ],
      paddingTop: inset.top === 0 ? 8 : inset.top,
    };
  });
  return (
    <AnimatedView
      backgroundColor={"$background"}
      style={[
        opacityAnim,
        {
          position: "absolute",
          width: "100%",
          paddingHorizontal: 16,
          paddingBottom: 8,
          zIndex: 10,
          flexDirection: "row",
          justifyContent: "space-between",
        },
      ]}
      alignItems={"center"}
      borderBottomWidth={1}
      borderBottomColor={"$gray5"}
    >
      <View width={"$3"} height={"$3"} alignItems="center" justifyContent="center" onPress={() => router.back()}>
        <ChevronLeft size={"$2"} />
      </View>

      <H5 fontWeight={600}>{title}</H5>
      <View width={"$2"} />
    </AnimatedView>
  );
}

function PosterImage({ sv, image, title }: { sv: SharedValue<number>; image: string; title: string }) {
  const inset = useSafeAreaInsets();
  const layoutY = useSharedValue(0);
  const opacityAnim = useAnimatedStyle(() => {
    return {
      opacity: interpolate(sv.value, [0, posterSize - (headerTop + inset.top) / 0.9], [1, 0], Extrapolation.CLAMP),
    };
  });
  const textAnim = useAnimatedStyle(() => {
    return {
      opacity: interpolate(sv.value, [-posterSize / 8, 0, posterSize - (headerTop + inset.top) / 0.8], [0, 1, 0], Extrapolation.CLAMP),
      transform: [
        {
          scale: interpolate(sv.value, [-posterSize / 8, 0, (posterSize - (headerTop + inset.top)) / 2], [1.1, 1, 0.95], "clamp"),
        },
        {
          translateY: interpolate(sv.value, [layoutY.value - 1, layoutY.value, layoutY.value + 1], [0, 0, -1]),
        },
      ],
    };
  });
  const scaleAnim = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: interpolate(sv.value, [-50, 0], [1.3, 1], {
            extrapolateLeft: "extend",
            extrapolateRight: "clamp",
          }),
        },
      ],
    };
  });
  return (
    <Animated.View style={[styles.imageContainer, opacityAnim]}>
      <AnimatedImage style={[styles.imageStyle, scaleAnim]} source={image} placeholder={{ blurhash }} contentFit="cover" transition={1000} />
      <Animated.View
        onLayout={(event: LayoutChangeEvent) => {
          "worklet";
          layoutY.value = event.nativeEvent.layout.y;
        }}
        style={[
          {
            position: "absolute",
            bottom: 0,
            top: 0,
            left: 0,
            right: 0,
            justifyContent: "flex-end",
            alignItems: "center",
            paddingHorizontal: 20,
            zIndex: 10,
          },
          textAnim,
        ]}
      >
        <SizableText numberOfLines={2} color="white" size="$10" fontWeight="bold" textAlign="center">
          {title}
        </SizableText>
        <View position="absolute" top="$0" left="$4">
          <SafeAreaView />

          <Button icon={<ArrowLeft size="$3" />} circular onPress={() => router.back()} theme={"alt1"} />
        </View>
      </Animated.View>
      <AnimatedLinearGradient
        style={[{ position: "absolute", inset: 0 }, scaleAnim]}
        //colors={[`rgba(0,0,0,${0})`, `rgba(0,0,0,${0.1})`, `rgba(0,0,0,${0.3})`, `rgba(0,0,0,${0.5})`, `rgba(0,0,0,${0.8})`, `rgba(0,0,0,${1})`]}
      />
    </Animated.View>
  );
}

export function StickyHeader({ image, title, children }: { image: string; title: string; children: JSX.Element }) {
  const inset = useSafeAreaInsets();
  const sv = useSharedValue<number>(0);
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      "worklet";
      sv.value = event.contentOffset.y;
    },
  });

  const initialTranslateValue = posterSize;

  const animatedScrollStyle = useAnimatedStyle(() => {
    return {
      paddingTop: initialTranslateValue,
    };
  });

  const layoutY = useSharedValue(0);

  const stickyElement = useAnimatedStyle(() => {
    return {
      backgroundColor: "black",
      transform: [
        {
          translateY: interpolate(
            sv.value,
            [layoutY.value - (headerTop + inset.top) - 1, layoutY.value - (headerTop + inset.top), layoutY.value - (headerTop + inset.top) + 1],
            [0, 0, 1]
          ),
        },
      ],
    };
  });
  return (
    <YStack flex={1} backgroundColor="$background">
      <ScreenHeader sv={sv} title={title} />
      <PosterImage sv={sv} image={image} title={title} />
      <Animated.ScrollView onScroll={scrollHandler} scrollEventThrottle={16} style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        <Animated.View style={[animatedScrollStyle, { paddingBottom: 40 }]}>{children}</Animated.View>
      </Animated.ScrollView>
    </YStack>
  );
}

const styles = StyleSheet.create({
  imageContainer: {
    height: Dimensions.get("screen").height / 2,
    width: Dimensions.get("screen").width,
    position: "absolute",
  },
  imageStyle: {
    height: "100%",
    width: "100%",
    resizeMode: "cover",
  },
});
