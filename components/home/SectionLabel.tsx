import { Paragraph, View } from "@/ui";

type Props = {
  children: string;
  marginTop?: string;
};

/** Robinhood-style uppercase section header */
export function SectionLabel({ children, marginTop = "$2" }: Props) {
  return (
    <View marginTop={marginTop} marginBottom="$2">
      <Paragraph
        fontSize="$2"
        fontFamily="InterBold"
        color="$gray11"
        letterSpacing={0.8}
        style={{ textTransform: "uppercase" }}
      >
        {children}
      </Paragraph>
    </View>
  );
}
