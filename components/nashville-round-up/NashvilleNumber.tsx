import { getTextColor } from "@/utils/nashville-round-up/getTextColor";
import { Paragraph, View, Text } from "tamagui";

export default function NashvilleNumber({ text = "", small = false }: { text: string; small?: boolean }) {
  function formatText(text: string, align?: "center" | "left" | "right") {
    if (text.includes("#")) {
      const [before, after] = text.split("#");
      return (
        <Text flexDirection="row" alignItems="center" color={getTextColor(text)}>
          <Text fontWeight={800}>{before}</Text>
          <Text fontWeight={800}>♯</Text>
          <Text fontWeight={800} adjustsFontSizeToFit numberOfLines={1}>
            {after}
          </Text>
        </Text>
      );
    }
    if (text.includes("b")) {
      const [before, after] = text.split("b");
      return (
        <Text flexDirection="row" alignItems="center" color={getTextColor(text)}>
          <Text fontWeight={800}>{before}</Text>
          <Text fontWeight={800}>♭</Text>
          <Text fontWeight={800} adjustsFontSizeToFit numberOfLines={1}>
            {after}
          </Text>
        </Text>
      );
    }
    return (
      <Text
        textAlign={align}
        fontSize={small ? "$5" : "$7"}
        // fontSize={small ? "$9" : "$10"}
        color={getTextColor(text)}
        // fontSize={small ? (superscript ? "$6" : "$9") : superscript ? "$8" : "$10"}
        fontWeight={800}
        adjustsFontSizeToFit
        numberOfLines={1}
      >
        {text}
      </Text>
    );
  }

  if (text.includes("/")) {
    const [beforeSlash, afterSlash] = text.split("/");
    return (
      <View position="relative" width={small ? 65 : 100} height={100} justifyContent="center" alignItems="center" overflow="visible">
        <Text
          position="absolute"
          top={small ? 15 : 0}
          left={0}
          fontSize={small ? "$5" : "$6"}
          textAlign="center"
          width={"45%"}
          adjustsFontSizeToFit
          numberOfLines={1}
        >
          {formatText(beforeSlash)}
        </Text>
        <View width={45} height={2} backgroundColor="black" transform={[{ rotate: "-55deg" }]} />
        <Text
          position="absolute"
          bottom={small ? 15 : 5}
          right={0}
          fontSize={small ? "$5" : "$6"}
          width={"45%"}
          textAlign="left"
          adjustsFontSizeToFit
          numberOfLines={1}
        >
          {formatText(afterSlash)}
        </Text>
      </View>
    );
  }

  if (text.includes("_")) {
    const [mainNumber, superscript] = text.split("_");
    return (
      <Text flexDirection="row" justifyContent="flex-end" alignItems="flex-start">
        <Text>{formatText(mainNumber)}</Text>
        <Text>{formatText(superscript)}</Text>
      </Text>
    );
  }

  return (
    <Text fontWeight={800} fontSize={small ? "$5" : "$7"}>
      {formatText(text)}
    </Text>
  );
}
