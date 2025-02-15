import Animated, { BounceIn, FadeOut, PinwheelIn, SlideInLeft } from "react-native-reanimated";
import { H1 } from "tamagui";
import { window } from "@/utils";
import { X } from "@tamagui/lucide-icons";

export default function AnswerFeedback({ isCorrect }: { isCorrect: boolean | undefined }) {
  if (isCorrect) {
    return (
      <Animated.View
        style={{
          backgroundColor: "#EFBF04",
        }}
        entering={SlideInLeft.duration(500)}
        exiting={FadeOut.duration(1000)}
      >
        <Animated.View entering={BounceIn.duration(1000)} exiting={FadeOut.duration(1000)} style={{}}>
          <H1
            textAlign="center"
            textShadowColor={"#745c006e"}
            textShadowRadius={10}
            textShadowOffset={{ width: 2, height: 2 }}
            fontWeight={800}
            color={"white"}
            // themeInverse
          >
            Correct!
          </H1>
        </Animated.View>
      </Animated.View>
    );
  } else {
    return (
      <Animated.View
        style={{
          justifyContent: "center",
          alignItems: "center",
        }}
        entering={PinwheelIn.duration(500)}
        exiting={FadeOut.duration(1000)}
      >
        <X size="$10" color="$red10" />
      </Animated.View>
    );
  }
}
