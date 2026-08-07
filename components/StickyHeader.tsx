import { GlassBackButton } from "@/components/GlassBackButton";
import { getModulePosterImageUrl, getModulePosterVideoUrl } from "@/constants/modulePosters";
import { VideoView, useVideoPlayer } from "expo-video";
import { Image } from "expo-image";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Dimensions,
  StyleSheet,
  View as RNView,
  type NativeSyntheticEvent,
  type TextLayoutEventData,
} from "react-native";
import Animated, {
  Easing,
  Extrapolation,
  interpolate,
  runOnJS,
  SharedValue,
  useAnimatedReaction,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import { H1, H5, View, YStack } from "@/ui";

const AnimatedLinearGradient = Animated.createAnimatedComponent(View);
const AnimatedView = Animated.createAnimatedComponent(View);
const AnimatedImage = Animated.createAnimatedComponent(Image);

const posterSize = Dimensions.get("screen").height / 2;
const headerTop = 44 - 16;

const titleStyle = { color: "white" as const };

function AnimatedTitleLine({
  text,
  index,
  lineCount,
  progress,
}: {
  text: string;
  index: number;
  lineCount: number;
  progress: SharedValue<number>;
}) {
  const lineStyle = useAnimatedStyle(() => {
    const stagger = 1 / Math.max(lineCount, 1);
    const start = index * stagger * 0.75;
    const end = Math.min(start + stagger * 1.1, 1);
    const t = interpolate(
      progress.value,
      [start, end],
      [0, 1],
      Extrapolation.CLAMP,
    );
    return {
      opacity: t,
      transform: [
        {
          translateY: interpolate(t, [0, 1], [22, 0], Extrapolation.CLAMP),
        },
      ],
    };
  });

  return (
    <Animated.View style={[styles.titleLine, lineStyle]}>
      <H1 fontWeight="normal" textAlign="left" style={titleStyle}>
        {text}
      </H1>
    </Animated.View>
  );
}

function PosterHeroTitle({
  title,
  revealSV,
}: {
  title: string;
  revealSV: SharedValue<number>;
}) {
  const [lines, setLines] = useState<string[]>([]);
  const progress = useSharedValue(0);
  const hasAnimated = useRef(false);

  const animateLines = useCallback(() => {
    if (lines.length === 0) return;
    hasAnimated.current = true;
    progress.value = 0;
    progress.value = withTiming(1, {
      duration: 380 + lines.length * 110,
      easing: Easing.out(Easing.cubic),
    });
  }, [lines.length, progress]);

  const onTextLayout = useCallback(
    (e: NativeSyntheticEvent<TextLayoutEventData>) => {
      const next = e.nativeEvent.lines.map((line) => line.text);
      if (next.length === 0) return;
      setLines((prev) => {
        if (
          prev.length === next.length &&
          prev.every((line, i) => line === next[i])
        ) {
          return prev;
        }
        hasAnimated.current = false;
        return next;
      });
    },
    [],
  );

  useAnimatedReaction(
    () => revealSV.value,
    (value, previous) => {
      if (value >= 1 && previous !== null && previous < 1) {
        runOnJS(animateLines)();
      }
    },
    [animateLines],
  );

  useEffect(() => {
    if (lines.length === 0 || hasAnimated.current) return;
    if (revealSV.value >= 1) {
      animateLines();
    }
  }, [lines, animateLines, revealSV]);

  const measured = lines.length > 0;

  return (
    <>
      <H1
        fontWeight="normal"
        textAlign="left"
        style={[
          titleStyle,
          measured ? styles.titleMeasureHidden : styles.titleMeasurePending,
        ]}
        onTextLayout={onTextLayout}
      >
        {title}
      </H1>
      {measured ? (
        <RNView style={styles.titleLines} pointerEvents="none">
          {lines.map((line, index) => (
            <AnimatedTitleLine
              key={`${index}-${line}`}
              text={line}
              index={index}
              lineCount={lines.length}
              progress={progress}
            />
          ))}
        </RNView>
      ) : null}
    </>
  );
}

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
      <GlassBackButton
        compact
        onMedia={false}
        onPress={() => (onBackPress ? onBackPress() : router.back())}
      />

      <H5 fontWeight="normal">{title}</H5>
      <View width={"$2"} />
    </AnimatedView>
  );
}

function PosterVideoBackground({
  videoSource,
  imageSource,
  style,
}: {
  videoSource: string;
  imageSource: string | null;
  style: object;
}) {
  const [videoReady, setVideoReady] = useState(false);
  const player = useVideoPlayer(videoSource, (videoPlayer) => {
    videoPlayer.loop = false;
    videoPlayer.muted = true;
    videoPlayer.play();
  });

  useEffect(() => {
    setVideoReady(false);
  }, [videoSource]);

  return (
    <Animated.View style={[styles.imageStyle, style]}>
      {imageSource && !videoReady ? (
        <Image
          source={imageSource}
          style={StyleSheet.absoluteFill}
          contentFit="cover"
          cachePolicy="memory-disk"
          priority="high"
        />
      ) : null}
      <VideoView
        style={StyleSheet.absoluteFill}
        player={player}
        nativeControls={false}
        contentFit="cover"
        allowsVideoFrameAnalysis={false}
        onFirstFrameRender={() => setVideoReady(true)}
      />
    </Animated.View>
  );
}

function PosterImageBackground({
  source,
  style,
}: {
  source: string;
  style: object;
}) {
  return (
    <AnimatedImage
      style={[styles.imageStyle, style]}
      source={source}
      contentFit="cover"
    />
  );
}

function PosterImage({
  sv,
  poster,
  title,
  revealSV,
}: {
  sv: SharedValue<number>;
  poster: string | null | undefined;
  title: string;
  revealSV: SharedValue<number>;
}) {
  const inset = useSafeAreaInsets();
  const videoSource = getModulePosterVideoUrl(poster);
  const imageSource = getModulePosterImageUrl(poster);

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
      <RNView collapsable={false} style={StyleSheet.absoluteFill}>
        {videoSource ? (
          <PosterVideoBackground
            videoSource={videoSource}
            imageSource={imageSource}
            style={scaleAnim}
          />
        ) : imageSource ? (
          <PosterImageBackground source={imageSource} style={scaleAnim} />
        ) : null}
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
            collapsable={false}
            style={{ alignSelf: "stretch", alignItems: "flex-start" }}
          >
            <PosterHeroTitle key={title} title={title} revealSV={revealSV} />
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
  poster,
  title,
  children,
  onBackPress,
}: {
  poster: string | null | undefined;
  title: string;
  children: React.ReactElement;
  onBackPress?: () => void;
}) {
  const inset = useSafeAreaInsets();
  const sv = useSharedValue<number>(0);
  const posterRevealSV = useSharedValue(1);

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
    if (onBackPress) {
      onBackPress();
    } else {
      router.back();
    }
  }, [onBackPress]);

  return (
    <YStack flex={1} backgroundColor="$background">
      <ScreenHeader sv={sv} title={title} onBackPress={handleBack} />
      <PosterImage
        sv={sv}
        poster={poster}
        title={title}
        revealSV={posterRevealSV}
      />
      <Animated.ScrollView
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
      >
        <View position="absolute" top={inset.top} left="$4" zIndex={100}>
          <GlassBackButton onPress={handleBack} />
        </View>
        <Animated.View style={[animatedScrollStyle, { paddingBottom: 40 }]}>
          {children}
        </Animated.View>
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
  titleMeasurePending: {
    opacity: 0,
  },
  titleMeasureHidden: {
    position: "absolute",
    opacity: 0,
    left: 0,
    right: 0,
    pointerEvents: "none",
  },
  titleLines: {
    alignSelf: "stretch",
    overflow: "hidden",
  },
  titleLine: {
    overflow: "hidden",
  },
});
