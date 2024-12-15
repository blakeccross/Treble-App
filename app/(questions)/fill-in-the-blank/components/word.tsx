import React from "react";
import { Text, StyleSheet } from "react-native";

import { WORD_HEIGHT } from "./layout";
import { Paragraph, View } from "tamagui";

const styles = StyleSheet.create({
  root: {
    padding: 4,
  },
  container: {
    paddingHorizontal: 6,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    borderWidth: 1,
    // borderColor: "#E8E6E8",
    // backgroundColor: "white",
    height: WORD_HEIGHT - 8,
  },
  text: {
    // fontFamily: "Nunito-Regular",
    fontSize: 19,
  },
  shadow: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 8,
    borderBottomWidth: 3,
    // borderColor: "#E8E6E8",
    top: 4,
  },
});

interface WordProps {
  id: number;
  option_text: string;
}

const Word = ({ id, option_text }: WordProps) => {
  return (
    <View style={styles.root}>
      <View>
        <View style={{ ...styles.container }} borderColor={"$gray3"} backgroundColor={"$gray1"}>
          <Paragraph style={styles.text}>{option_text}</Paragraph>
        </View>
        <View style={styles.shadow} borderColor={"$gray5"} />
      </View>
    </View>
  );
};

export default Word;
