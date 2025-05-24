import { getTextColor } from "@/utils/nashville-round-up/getTextColor";
import { H1, Paragraph, View } from "tamagui";

export default function NashvilleNumber({ text = "" }: { text: string }) {
  if (text.includes("/")) {
    const [beforeSlash, afterSlash] = text.split("/");
    return (
      <View position="relative" width={60} height={100} justifyContent="center" alignItems="center">
        <Paragraph position="absolute" top={0} left={0} fontWeight={800} color={getTextColor(beforeSlash)} fontSize={"$10"}>
          {beforeSlash}
        </Paragraph>
        <View width={60} height={2} backgroundColor="black" transform={[{ rotate: "-50deg" }]} />
        <Paragraph position="absolute" bottom={5} right={0} fontWeight={800} color={getTextColor(afterSlash)} fontSize={"$10"}>
          {afterSlash}
        </Paragraph>
      </View>
    );
  }

  if (text.includes("_")) {
    const [mainNumber, superscript] = text.split("_");
    return (
      <View flexDirection="row" justifyContent="flex-end" alignItems="flex-start">
        <Paragraph fontWeight={800} color={getTextColor(mainNumber)} fontSize={"$10"}>
          {mainNumber}
        </Paragraph>
        <Paragraph fontWeight={800} color={getTextColor(mainNumber)} fontSize={"$6"}>
          {superscript}
        </Paragraph>
      </View>
    );
  }

  return (
    <H1 fontWeight={800} color={getTextColor(text)}>
      {text}
    </H1>
  );
}
