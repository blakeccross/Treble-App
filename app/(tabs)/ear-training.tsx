import { isSmallScreen } from "@/utils";
import { AudioWaveform, Lock, Play } from "@tamagui/lucide-icons";
import { BlurView } from "expo-blur";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { Dimensions, FlatList } from "react-native";
import Animated, {
  Extrapolation,
  interpolate,
  SharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { Button, Card, H2, H5, Paragraph, View, XStack, YStack } from "tamagui";

const blurhash = "A5Pj0^nN_Nt7";

const AnimatedView = Animated.createAnimatedComponent(View);

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
          justifyContent: "center",
        },
      ]}
      alignItems={"center"}
      borderBottomWidth={1}
      borderBottomColor={"$gray5"}
    >
      <H5 fontWeight={600}>{title}</H5>
    </AnimatedView>
  );
}

const games = [
  {
    title: "Pitch Perfect",
    description: `Identify the pitch before the timer ends`,
    backgroundImage: require("@/assets/images/pitch-perfect.jpg"),
    route: "/pitch-perfect" as const,
    disabled: false,
  },
  {
    title: "Nashville Roundup",
    description: `Test your ear in this\nfast paced matching game`,
    backgroundImage: require("@/assets/images/nashville-round-up-poster.jpg"),
    route: "/nashville-round-up" as const,
    disabled: false,
  },
  {
    title: "Interval Training",
    description: `Test your ear in a\nfast pace matching game`,
    backgroundImage: require("@/assets/images/interval-training.jpg"),
    route: "/interval-training" as const,
    disabled: false,
  },
  {
    title: "Chord Detective",
    description: `Identify the chord`,
    backgroundImage: require("@/assets/images/chord-detective.jpg"),
    route: "/name-that-chord" as const,
    disabled: true,
  },
];

const renderItem = ({ item: game, router }: { item: (typeof games)[0]; router: ReturnType<typeof useRouter> }) => {
  return (
    <Card
      key={game.title}
      elevate
      pressStyle={{ scale: 0.95 }}
      animation="bouncy"
      borderRadius={"$8"}
      overflow="hidden"
      height={400}
      flex={1}
      marginHorizontal="$2"
      marginBottom="$4"
      onPress={() => {
        if (!game.disabled) {
          router.push(game.route);
        }
      }}
    >
      <Card.Background>
        <Image style={{ flex: 1, width: "100%" }} source={game.backgroundImage} contentFit="cover" />
      </Card.Background>

      <Card.Footer>
        <BlurView style={{ flex: 1, padding: 20 }} tint="light">
          <XStack justifyContent="space-between">
            <YStack flex={1}>
              <H5 fontWeight={600} color={"$gray1Dark"}>
                {game.title}
              </H5>
              <Paragraph lineHeight={17} color={"$gray1Dark"}>
                {game.description}
              </Paragraph>
            </YStack>
            {game.disabled ? (
              <Button
                borderRadius={"$10"}
                size={"$3"}
                iconAfter={<Lock />}
                themeInverse
                backgroundColor={"white"}
                color={"black"}
                fontWeight={600}
                disabled
              >
                Coming Soon
              </Button>
            ) : (
              <Button
                borderRadius={"$10"}
                size={"$3"}
                iconAfter={<Play />}
                themeInverse
                backgroundColor={"white"}
                color={"black"}
                fontWeight={600}
                disabled
              >
                Play
              </Button>
            )}
          </XStack>
        </BlurView>
      </Card.Footer>
    </Card>
  );
};

export default function EarTraining() {
  const { top } = useSafeAreaInsets();
  const router = useRouter();
  const sv = useSharedValue<number>(0);
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      "worklet";
      sv.value = event.contentOffset.y;
    },
  });

  return (
    <View flex={1} backgroundColor={"$background"} paddingTop={top}>
      <ScreenHeader sv={sv} title="Ear Training" />
      <Animated.ScrollView onScroll={scrollHandler} scrollEventThrottle={16} showsVerticalScrollIndicator={false}>
        <XStack alignItems="center" gap={"$2"} marginBottom="$4" paddingHorizontal={15}>
          <AudioWaveform />
          <H2 fontWeight={800}>Ear Training</H2>
        </XStack>
        <FlatList
          data={games}
          renderItem={({ item }) => renderItem({ item, router })}
          numColumns={isSmallScreen ? 1 : 2}
          scrollEnabled={false}
          contentContainerStyle={{ paddingBottom: 60, paddingHorizontal: 15 }}
          style={{ overflow: "visible" }}
          columnWrapperStyle={isSmallScreen ? undefined : { justifyContent: "space-between" }}
        />
      </Animated.ScrollView>
    </View>
  );
}
