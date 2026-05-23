import { HeroModuleTransitionOverlay } from "@/components/module/HeroModuleTransitionOverlay";
import type {
  HeroSourceRect,
  ModuleHeroPayload,
  ModuleHeroReversePayload,
} from "@/context/module-hero-transition";
import { Image } from "expo-image";
import React, { useCallback, useRef, useState } from "react";
import { Dimensions, Modal, StyleSheet, View as RNView } from "react-native";
import Animated, {
  Easing,
  Extrapolation,
  interpolate,
  SharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import { ArrowLeft, Button, ChevronLeft, H1, H5, View, YStack } from "@/ui";
const blurhash =
  "|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";

const AnimatedLinearGradient = Animated.createAnimatedComponent(View);
const AnimatedView = Animated.createAnimatedComponent(View);
const AnimatedImage = Animated.createAnimatedComponent(Image);

const posterSize = Dimensions.get("screen").height / 2;
const headerTop = 44 - 16;

function ScreenHeader({
  sv,
  title,
  onBackPress,
}: {
  sv: SharedValue<number>;
  title: string;
  onBackPress?: () => void;
}) {
  const inset = useSafeAreaInsets();
  const opacityAnim = useAnimatedStyle(() => {
    const visibilityThreshold = posterSize - (headerTop + inset.top);
    const opacity = interpolate(
      sv.value,
      [(visibilityThreshold / 4) * 3, visibilityThreshold + 1],
      [0, 1],
    );
    return {
      opacity,
      transform: [
        {
          scale: interpolate(
            sv.value,
            [
              ((posterSize - (headerTop + inset.top)) / 4) * 3,
              posterSize - (headerTop + inset.top) + 1,
            ],
            [0.98, 1],
            Extrapolation.CLAMP,
          ),
        },
        {
          translateY: interpolate(
            sv.value,
            [
              ((posterSize - (headerTop + inset.top)) / 4) * 3,
              posterSize - (headerTop + inset.top) + 1,
            ],
            [-10, 0],
            Extrapolation.CLAMP,
          ),
        },
      ],
      paddingTop: inset.top === 0 ? 8 : inset.top,
      pointerEvents: opacity > 0.95 ? "auto" : "none", // Disable touches if not fully visible
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
      borderBottomWidth={StyleSheet.hairlineWidth * 2}
      borderBottomColor={"$borderColor"}
    >
      <View
        width={"$3"}
        height={"$3"}
        alignItems="center"
        justifyContent="center"
        onPress={() => (onBackPress ? onBackPress() : router.back())}
      >
        <ChevronLeft size={"$2"} />
      </View>

      <H5 fontWeight="normal">{title}</H5>
      <View width={"$2"} />
    </AnimatedView>
  );
}

function PosterImage({
  sv,
  image,
  title,
  revealSV,
  posterLayerRef,
  titleTargetRef,
  onPosterLayerLayout,
}: {
  sv: SharedValue<number>;
  image: string;
  title: string;
  revealSV: SharedValue<number>;
  posterLayerRef: React.RefObject<RNView | null>;
  titleTargetRef: React.RefObject<RNView | null>;
  onPosterLayerLayout?: () => void;
}) {
  const inset = useSafeAreaInsets();
  const opacityAnim = useAnimatedStyle(() => {
    const scrollOp = interpolate(
      sv.value,
      [0, posterSize - (headerTop + inset.top) / 0.9],
      [1, 0],
      Extrapolation.CLAMP,
    );
    return {
      opacity: scrollOp * revealSV.value,
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
      <RNView
        ref={posterLayerRef}
        collapsable={false}
        style={StyleSheet.absoluteFill}
        onLayout={onPosterLayerLayout}
      >
        <AnimatedImage
          style={[styles.imageStyle, scaleAnim]}
          source={image}
          placeholder={{ blurhash }}
          contentFit="cover"
          transition={1000}
        />
        <RNView
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            justifyContent: "flex-end",
            alignItems: "center",
            paddingHorizontal: 20,
            paddingBottom: 24,
            zIndex: 10,
          }}
        >
          <RNView
            ref={titleTargetRef}
            collapsable={false}
            style={{ alignSelf: "stretch", alignItems: "flex-start" }}
          >
            <H1 fontWeight="normal" textAlign="left" style={{ color: "white" }}>
              {title}
            </H1>
          </RNView>
        </RNView>
        <AnimatedLinearGradient
          style={[{ position: "absolute", inset: 0 }, scaleAnim]}
          //colors={[`rgba(0,0,0,${0})`, `rgba(0,0,0,${0.1})`, `rgba(0,0,0,${0.3})`, `rgba(0,0,0,${0.5})`, `rgba(0,0,0,${0.8})`, `rgba(0,0,0,${1})`]}
        />
      </RNView>
    </Animated.View>
  );
}

export function StickyHeader({
  image,
  title,
  children,
  onBackPress,
  heroTransition,
  onHeroTransitionEnd,
  onBeginReverseTransition,
}: {
  image: string;
  title: string;
  children: React.ReactElement;
  onBackPress?: () => void;
  heroTransition?: ModuleHeroPayload | null;
  onHeroTransitionEnd?: () => void;
  onBeginReverseTransition?: (payload: ModuleHeroReversePayload) => void;
}) {
  const inset = useSafeAreaInsets();
  const sv = useSharedValue<number>(0);
  const posterLayerRef = useRef<RNView>(null);
  const titleTargetRef = useRef<RNView>(null);
  const didMeasureHeroTarget = useRef(false);
  const [heroTargets, setHeroTargets] = useState<{
    poster: HeroSourceRect;
    title: HeroSourceRect;
  } | null>(null);
  const posterRevealSV = useSharedValue(heroTransition ? 0 : 1);
  const [flyVisible, setFlyVisible] = useState(!!heroTransition);

  const onFlyDone = useCallback(() => {
    posterRevealSV.value = withTiming(1, {
      duration: 160,
      easing: Easing.out(Easing.cubic),
    });
    setFlyVisible(false);
    onHeroTransitionEnd?.();
  }, [onHeroTransitionEnd, posterRevealSV]);

  const onPosterLayerLayout = useCallback(() => {
    if (!heroTransition || didMeasureHeroTarget.current) return;
    didMeasureHeroTarget.current = true;
    requestAnimationFrame(() => {
      posterLayerRef.current?.measureInWindow((px, py, pw, ph) => {
        const posterRect = { x: px, y: py, width: pw, height: ph };
        const fallbackTitle: HeroSourceRect = {
          x: px + 20,
          y: py + ph - 120,
          width: pw - 40,
          height: 96,
        };
        if (titleTargetRef.current) {
          titleTargetRef.current.measureInWindow((tx, ty, tw, th) => {
            const titleRect =
              tw > 2 && th > 2
                ? { x: tx, y: ty, width: tw, height: th }
                : fallbackTitle;
            setHeroTargets({ poster: posterRect, title: titleRect });
          });
        } else {
          setHeroTargets({ poster: posterRect, title: fallbackTitle });
        }
      });
    });
  }, [heroTransition]);

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

  const handleBack = useCallback(() => {
    const goBack = () => {
      if (onBackPress) {
        onBackPress();
      } else {
        router.back();
      }
    };

    if (!heroTransition || !onBeginReverseTransition) {
      goBack();
      return;
    }

    const startReverse = (
      overviewPosterRect: HeroSourceRect,
      overviewTitleRect: HeroSourceRect,
    ) => {
      onBeginReverseTransition({
        forward: heroTransition,
        overviewPosterRect,
        overviewTitleRect,
      });
      goBack();
    };

    if (heroTargets) {
      startReverse(heroTargets.poster, heroTargets.title);
      return;
    }

    posterLayerRef.current?.measureInWindow((px, py, pw, ph) => {
      const posterRect = { x: px, y: py, width: pw, height: ph };
      const fallbackTitle: HeroSourceRect = {
        x: px + 20,
        y: py + ph - 120,
        width: pw - 40,
        height: 96,
      };
      if (titleTargetRef.current) {
        titleTargetRef.current.measureInWindow((tx, ty, tw, th) => {
          startReverse(
            posterRect,
            tw > 2 && th > 2
              ? { x: tx, y: ty, width: tw, height: th }
              : fallbackTitle,
          );
        });
      } else {
        startReverse(posterRect, fallbackTitle);
      }
    });
  }, [heroTransition, heroTargets, onBeginReverseTransition, onBackPress]);

  return (
    <YStack flex={1} backgroundColor="$background">
      <ScreenHeader sv={sv} title={title} onBackPress={handleBack} />
      <PosterImage
        sv={sv}
        image={image}
        title={title}
        revealSV={posterRevealSV}
        posterLayerRef={posterLayerRef}
        titleTargetRef={titleTargetRef}
        onPosterLayerLayout={heroTransition ? onPosterLayerLayout : undefined}
      />
      {flyVisible && heroTransition && heroTargets ? (
        <Modal visible transparent animationType="none" statusBarTranslucent>
          <RNView style={styles.heroModalRoot} pointerEvents="none">
            <HeroModuleTransitionOverlay
              uri={heroTransition.uri}
              imageSourceRect={heroTransition.sourceRect}
              imageTargetRect={heroTargets.poster}
              onComplete={onFlyDone}
            />
          </RNView>
        </Modal>
      ) : null}
      <Animated.ScrollView
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
      >
        <View position="absolute" top={inset.top} left="$4" zIndex={100}>
          <Button circular theme={"alt1"} onPress={handleBack}>
            <ArrowLeft size="$3" />
          </Button>
        </View>
        <Animated.View style={[animatedScrollStyle, { paddingBottom: 40 }]}>
          {children}
        </Animated.View>
      </Animated.ScrollView>
    </YStack>
  );
}

const styles = StyleSheet.create({
  heroModalRoot: {
    flex: 1,
  },
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
