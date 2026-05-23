import { getTextColor } from "@/utils/nashville-round-up/getTextColor";
import { Text, View, YStack } from "@/ui";

type SizeKey = "normal" | "small";

const SIZES = {
  main: { normal: "$7", small: "$5" },
  bass: { normal: "$6", small: "$4" },
  extension: { normal: "$4", small: "$3" },
} as const;

function parseChord(text: string) {
  const slashIndex = text.indexOf("/");
  if (slashIndex !== -1) {
    return {
      kind: "slash" as const,
      chord: text.slice(0, slashIndex),
      bass: text.slice(slashIndex + 1),
    };
  }

  const underscoreIndex = text.indexOf("_");
  if (underscoreIndex !== -1) {
    return {
      kind: "extension" as const,
      root: text.slice(0, underscoreIndex),
      extension: text.slice(underscoreIndex + 1),
    };
  }

  return { kind: "plain" as const, content: text };
}

function ChordGlyphs({
  text,
  fontSize,
}: {
  text: string;
  fontSize: string;
}) {
  const color = getTextColor(text);
  const weight = "800" as const;

  if (text.includes("#")) {
    const [before, after] = text.split("#");
    return (
      <Text flexDirection="row" alignItems="center" color={color} numberOfLines={1}>
        <Text fontSize={fontSize} fontWeight={weight}>
          {before}
        </Text>
        <Text fontSize={fontSize} fontWeight={weight}>
          ♯
        </Text>
        <Text fontSize={fontSize} fontWeight={weight}>
          {after}
        </Text>
      </Text>
    );
  }

  if (text.includes("b")) {
    const [before, after] = text.split("b");
    return (
      <Text flexDirection="row" alignItems="center" color={color} numberOfLines={1}>
        <Text fontSize={fontSize} fontWeight={weight}>
          {before}
        </Text>
        <Text fontSize={fontSize} fontWeight={weight}>
          ♭
        </Text>
        <Text fontSize={fontSize} fontWeight={weight}>
          {after}
        </Text>
      </Text>
    );
  }

  return (
    <Text
      fontSize={fontSize}
      fontWeight={weight}
      color={color}
      textAlign="center"
      numberOfLines={1}
    >
      {text}
    </Text>
  );
}

function SlashChord({
  chord,
  bass,
  sizeKey,
}: {
  chord: string;
  bass: string;
  sizeKey: SizeKey;
}) {
  const lineColor = getTextColor(chord + bass);

  return (
    <YStack alignItems="stretch" justifyContent="center">
      <ChordGlyphs text={chord} fontSize={SIZES.main[sizeKey]} />
      <View
        height={2}
        backgroundColor={lineColor}
        marginVertical={sizeKey === "small" ? 2 : 3}
      />
      <ChordGlyphs text={bass} fontSize={SIZES.bass[sizeKey]} />
    </YStack>
  );
}

function ExtensionChord({
  root,
  extension,
  sizeKey,
}: {
  root: string;
  extension: string;
  sizeKey: SizeKey;
}) {
  return (
    <View flexDirection="row" alignItems="flex-start">
      <ChordGlyphs text={root} fontSize={SIZES.main[sizeKey]} />
      <View marginTop={sizeKey === "small" ? -1 : -2} marginLeft={1}>
        <ChordGlyphs text={extension} fontSize={SIZES.extension[sizeKey]} />
      </View>
    </View>
  );
}

export default function NashvilleNumber({
  text = "",
  small = false,
}: {
  text: string;
  small?: boolean;
}) {
  const sizeKey: SizeKey = small ? "small" : "normal";
  const parsed = parseChord(text);

  if (parsed.kind === "slash") {
    return <SlashChord chord={parsed.chord} bass={parsed.bass} sizeKey={sizeKey} />;
  }

  if (parsed.kind === "extension") {
    return (
      <ExtensionChord
        root={parsed.root}
        extension={parsed.extension}
        sizeKey={sizeKey}
      />
    );
  }

  return (
    <ChordGlyphs
      text={parsed.content}
      fontSize={SIZES.main[sizeKey]}
    />
  );
}
