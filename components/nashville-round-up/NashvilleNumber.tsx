import { getTextColor } from "@/utils/nashville-round-up/getTextColor";
import { Paragraph, View, Text } from "tamagui";

export default function NashvilleNumber({ text = "", small = false }: { text: string; small?: boolean }) {
  function formatText(text: string, align?: "center" | "left" | "right") {
    if (text.includes("#")) {
      const [before, after] = text.split("#");
      return (
        <View flexDirection="row" alignItems="center">
          <Paragraph fontWeight={800}>{before}</Paragraph>
          <Paragraph fontWeight={800}>♯</Paragraph>
          <Paragraph fontWeight={800} fontSize={small ? "$9" : "$10"} adjustsFontSizeToFit numberOfLines={1}>
            {after}
          </Paragraph>
        </View>
      );
    }
    if (text.includes("b")) {
      const [before, after] = text.split("b");
      return (
        <View flexDirection="row" alignItems="center">
          <Paragraph fontWeight={800}>{before}</Paragraph>
          <Paragraph fontWeight={800}>♭</Paragraph>
          <Paragraph fontWeight={800} fontSize={small ? "$9" : "$10"}>
            {after}
          </Paragraph>
        </View>
      );
    }
    return (
      <Paragraph
        textAlign={align}
        fontSize={small ? "$9" : "$10"}
        // fontSize={small ? (superscript ? "$6" : "$9") : superscript ? "$8" : "$10"}
        fontWeight={800}
        adjustsFontSizeToFit
        numberOfLines={1}
      >
        {text}
      </Paragraph>
    );
  }

  if (text.includes("/")) {
    const [beforeSlash, afterSlash] = text.split("/");
    return (
      <View position="relative" width={small ? 65 : 100} height={100} justifyContent="center" alignItems="center" overflow="visible">
        <Paragraph
          position="absolute"
          top={small ? 15 : 0}
          left={0}
          fontSize={small ? "$5" : "$6"}
          overflow="visible"
          textAlign="center"
          textShadowColor={"white"}
          width={"55%"}
          adjustsFontSizeToFit
          numberOfLines={1}
          padding={0}
        >
          {formatText(beforeSlash)}
        </Paragraph>
        <View width={45} height={2} backgroundColor="black" transform={[{ rotate: "-55deg" }]} />
        <Paragraph
          position="absolute"
          bottom={small ? 20 : 5}
          // right={small ? 15 : 12}
          right={0}
          fontSize={small ? "$5" : "$6"}
          textShadowColor={"white"}
          // width={small ? 30 : 30}
          // height={small ? 30 : 30}
          width={"55%"}
          adjustsFontSizeToFit
          numberOfLines={1}
          textAlign="center"
          padding={0}
        >
          {formatText(afterSlash)}
        </Paragraph>
      </View>
    );
  }

  if (text.includes("_")) {
    const [mainNumber, superscript] = text.split("_");
    return (
      <View flexDirection="row" justifyContent="flex-end" alignItems="flex-start">
        <Paragraph fontWeight={800} color={getTextColor(mainNumber)} fontSize={small ? "$5" : "$7"} adjustsFontSizeToFit numberOfLines={1}>
          {formatText(mainNumber)}
        </Paragraph>
        <Paragraph fontWeight={800} color={getTextColor(mainNumber)} fontSize={small ? "$3" : "$5"}>
          {formatText(superscript)}
        </Paragraph>
      </View>
    );
  }

  return (
    <Paragraph fontWeight={800} color={getTextColor(text)} fontSize={small ? "$5" : "$7"}>
      {formatText(text)}
    </Paragraph>
  );
}
