import { AnimationObject } from "lottie-react-native";

export interface OnboardingData {
  id: number;
  animation: AnimationObject;
  text: string;
  textColor: string;
  backgroundColor: string;
}

/** Calm, airy onboarding backdrops — content-forward, low saturation */
const data: OnboardingData[] = [
  {
    id: 1,
    animation: require("../assets/lottie/gradient-shapes.json"),
    text: "Master music theory through bite-sized lessons and clear progression",
    textColor: "#111111",
    backgroundColor: "#E8EEF5",
  },
  {
    id: 2,
    animation: require("../assets/lottie/circles.json"),
    text: "Learn, practice, and level up with a calm, focused experience",
    textColor: "#111111",
    backgroundColor: "#F5F5F7",
  },
  {
    id: 3,
    animation: require("../assets/lottie/floatingMusicNotes.json"),
    text: "Track your progress and unlock new skills at your own pace",
    textColor: "#111111",
    backgroundColor: "#EDEAF7",
  },
];

export default data;
