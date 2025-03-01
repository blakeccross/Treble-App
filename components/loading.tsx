import { useRef, useEffect } from "react";
import { Button, StyleSheet, View } from "react-native";
import LottieView from "lottie-react-native";

const loadingMusicNote = require("../assets/lottie/loadingMusicNote.json");

export default function LoadingIndicator() {
  return (
    <LottieView
      autoPlay
      //   ref={animation}
      style={{
        width: 200,
        height: 200,
      }}
      // Find more Lottie files at https://lottiefiles.com/featured
      source={loadingMusicNote}
    />
  );
}
