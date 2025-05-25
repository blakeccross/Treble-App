import { getTextColor } from "@/utils/nashville-round-up/getTextColor";
import { GetThemeValueForKey, H1, Paragraph, View, Text } from "tamagui";

export default function NashvilleNumber({ text = "", small = false }: { text: string; small?: boolean }) {
  function formatText(text: string) {
    if (text.includes("#")) {
      const [before, after] = text.split("#");
      return (
        <View flexDirection="row" alignItems="center">
          <Paragraph fontSize="$10" fontWeight={800}>
            {before}
          </Paragraph>
          <Paragraph fontSize="$8" fontWeight={800} marginRight={-5}>
            ♯
          </Paragraph>
          <Paragraph fontSize="$10" fontWeight={800}>
            {after}
          </Paragraph>
        </View>
      );
    }
    if (text.includes("b")) {
      const [before, after] = text.split("b");
      return (
        <View flexDirection="row" alignItems="center">
          <Paragraph fontSize="$10" fontWeight={800}>
            {before}
          </Paragraph>
          <Paragraph fontSize="$10" fontWeight={800} marginRight={-2}>
            ♭
          </Paragraph>
          <Paragraph fontSize="$10" fontWeight={800}>
            {after}
          </Paragraph>
        </View>
      );
    }
    return (
      <Paragraph fontSize="$10" fontWeight={800}>
        {text}
      </Paragraph>
    );
  }

  if (text.includes("/")) {
    const [beforeSlash, afterSlash] = text.split("/");
    return (
      <View position="relative" width={65} height={100} justifyContent="center" alignItems="center" style={{ scale: small ? 0.8 : 1 }}>
        <Paragraph
          position="absolute"
          top={0}
          left={0}
          fontWeight={800}
          color={getTextColor(beforeSlash)}
          fontSize={"$10"}
          adjustsFontSizeToFit
          numberOfLines={1}
        >
          {formatText(beforeSlash)}
        </Paragraph>
        <View width={60} height={2} backgroundColor="black" transform={[{ rotate: "-50deg" }]} />
        <Paragraph
          position="absolute"
          bottom={5}
          right={0}
          fontWeight={800}
          color={getTextColor(afterSlash)}
          fontSize={"$10"}
          numberOfLines={1}
          adjustsFontSizeToFit
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
        <Paragraph fontWeight={800} color={getTextColor(mainNumber)} fontSize={"$10"}>
          {formatText(mainNumber)}
        </Paragraph>
        <Paragraph fontWeight={800} color={getTextColor(mainNumber)} fontSize={"$6"}>
          {formatText(superscript)}
        </Paragraph>
      </View>
    );
  }

  return (
    <H1 fontWeight={800} color={getTextColor(text)}>
      {formatText(text)}
    </H1>
  );
}
