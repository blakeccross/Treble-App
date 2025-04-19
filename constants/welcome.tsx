import { blue, green, orange, purple, yellow } from "@tamagui/themes";
import { AnimationObject } from "lottie-react-native";

export interface OnboardingData {
  id: number;
  animation: AnimationObject;
  text: string;
  textColor: string;
  backgroundColor: string;
}

const data: OnboardingData[] = [
  {
    id: 1,
    animation: require("../assets/lottie/gradient-shapes.json"),
    text: "Master music theory through bite-sized lessons and fun quizzes",
    textColor: "white",
    backgroundColor: blue.blue10,
  },
  {
    id: 2,
    animation: require("../assets/lottie/circles.json"),
    text: "Train your ears, crush quizzes, and level up your music smarts",
    textColor: "#1e2169",
    backgroundColor: yellow.yellow10,
  },
  {
    id: 3,
    animation: require("../assets/lottie/floatingMusicNotes.json"),
    text: "Track your progress, unlock new levels, and make learning music fun",
    textColor: purple.purple1,
    backgroundColor: orange.orange10,
  },
];

export default data;
