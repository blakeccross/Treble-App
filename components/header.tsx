import { View, Text } from "react-native";
import React from "react";

type HeaderProps = {
  name: string;
};

const Header = (props: HeaderProps) => {
  return (
    <View style={{ flexDirection: "row", margin: 15 }}>
      <Text style={{ fontWeight: "bold", fontSize: 30, color: "white" }}>{props.name}</Text>
    </View>
  );
};

export default Header;
