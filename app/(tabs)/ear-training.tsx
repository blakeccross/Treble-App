import { AudioWaveform, Lock, Play } from "@tamagui/lucide-icons";
import { BlurView } from "expo-blur";
import { Image } from "expo-image";
import { Href, useRouter } from "expo-router";
import { Dimensions } from "react-native";
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

const blurhash =
  "|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";

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
    backgroundImage: require("@/assets/images/pitch_perfect.png"),
    route: "/pitch-perfect",
    disabled: false,
  },
  {
    title: "Nashville Roundup",
    description: `Test your ear in this\nfast paced matching game`,
    backgroundImage: require("@/assets/images/nashville_round_up_poster.png"),
    route: "/nashville-round-up",
    disabled: false,
  },
  {
    title: "Chord Detective",
    description: `Identify the chord`,
    backgroundImage: require("@/assets/images/hassaan-here-bKfkhVRAJTQ-unsplash.jpg"),
    route: "/name-that-chord",
    disabled: true,
  },
  {
    title: "Interval Training",
    description: `Test your ear in a\nfast pace matching game`,
    backgroundImage: require("@/assets/images/blue_shapes.jpg"),
    route: "/interval-training",
    disabled: false,
  },
];

export default function TabTwoScreen() {
  const router = useRouter();
  const sv = useSharedValue<number>(0);
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      "worklet";
      sv.value = event.contentOffset.y;
    },
  });
  return (
    <View flex={1} backgroundColor={"$background"}>
      <SafeAreaView edges={["top"]} />
      <ScreenHeader sv={sv} title="Ear Training" />
      <Animated.ScrollView onScroll={scrollHandler} scrollEventThrottle={16} style={{ padding: 15 }} showsVerticalScrollIndicator={false}>
        <XStack alignItems="center" gap={"$2"} marginBottom="$4">
          <AudioWaveform />
          <H2 fontWeight={800}>Ear Training</H2>
        </XStack>
        <YStack gap={"$4"} marginBottom="$15">
          {games.map((game) => (
            <Card
              key={game.title}
              elevate
              // bordered
              pressStyle={{ scale: 0.95 }}
              // animation="bouncy"
              borderRadius={"$8"}
              overflow="hidden"
              height={400}
              flex={1}
              onPress={() => {
                game.disabled ? null : router.push(game.route as Href<string>);
              }}
            >
              <Card.Background>
                <Image
                  style={{ flex: 1, width: "100%" }}
                  source={game.backgroundImage}
                  placeholder={{ blurhash }}
                  contentFit="cover"
                  transition={1000}
                />
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
          ))}
        </YStack>
      </Animated.ScrollView>
    </View>
  );
}
