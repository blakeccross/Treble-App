import React from "react";

import { MARGIN_LEFT, MARGIN_TOP, Offset, WORD_HEIGHT } from "./layout";
import { lightColors } from "@tamagui/themes";
import { View } from "tamagui";

interface PlaceholderProps {
  offset: Offset;
}

const Placeholder = ({ offset }: PlaceholderProps) => {
  return (
    <View
      position="absolute"
      top={offset.originalY.value + MARGIN_TOP + 2}
      left={offset.originalX.value - MARGIN_LEFT + 2}
      width={offset.width.value - 4}
      borderRadius={8}
      height={WORD_HEIGHT - 4}
      backgroundColor={"$gray4"}
    />
  );
};

export default Placeholder;
