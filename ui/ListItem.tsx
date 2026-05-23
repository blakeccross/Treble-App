import React from "react";
import { Pressable } from "react-native";
import { Paragraph, SizableText } from "./Text";
import { XStack, YStack } from "./Stack";
import type { TokenValue } from "./resolveToken";
import type { StyledViewProps } from "./styledProps";
import { View } from "./View";

export function ListItem({
  title,
  subTitle,
  icon: Icon,
  color,
  onPress,
  backgroundColor = "transparent",
  hoverTheme,
}: {
  title: string;
  subTitle?: React.ReactNode;
  icon?: React.ComponentType<{ color?: TokenValue | string; size?: TokenValue | number }>;
  color?: TokenValue;
  onPress?: () => void;
  backgroundColor?: TokenValue;
  hoverTheme?: boolean;
} & StyledViewProps) {
  const content = (
    <View backgroundColor={backgroundColor} paddingVertical="$2" paddingHorizontal="$2" borderRadius="$3">
      <XStack alignItems="center" gap="$3">
        {Icon ? <Icon color={color} size="$2" /> : null}
        <YStack flex={1} gap="$1">
          <Paragraph color={color} fontWeight="500" fontFamily="Inter">
            {title}
          </Paragraph>
          {subTitle ? (
            typeof subTitle === "string" ? (
              <SizableText size="$3" color="$gray11">
                {subTitle}
              </SizableText>
            ) : (
              subTitle
            )
          ) : null}
        </YStack>
      </XStack>
    </View>
  );

  if (onPress) {
    return <Pressable onPress={onPress}>{content}</Pressable>;
  }
  return content;
}
