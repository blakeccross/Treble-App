import { window } from "@/utils";
import React from "react";
import { View, Text, StyleSheet } from "react-native";

const Chip = ({ number, color }: { number: number; color: string }) => {
  return (
    <View style={[styles.fish, { backgroundColor: color }]}>
      <Text style={styles.text}>{number}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  fish: {
    width: window.width * 0.3,
    height: window.width * 0.3,
    margin: 30,
    borderRadius: 500,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 15,
    borderColor: "white",
    borderStyle: "dotted",
    shadowColor: "#5a5a5a",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  text: {
    fontFamily: "Verdana",
    textAlign: "center",
    lineHeight: 70,
    fontSize: 17,
    color: "black",
  },
});

export default function PlayButton() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Chip number={1} color="#fd5f72" />
    </View>
  );
}
