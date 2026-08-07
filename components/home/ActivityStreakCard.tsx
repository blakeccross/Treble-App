import { getCurrentStreak, getRecentActivityDays } from "@/hooks/getRecentActivityDays";
import { blueA } from "@/theme/palettes";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import React, { useMemo } from "react";
import { StyleSheet } from "react-native";
import { Card, Circle, Paragraph, View, XStack, YStack } from "@/ui";

const CIRCLE_SIZE = 52;
const ZIGZAG_OFFSET = 10;

type ActivityStreakCardProps = {
  activeDays?: string[];
};

export function ActivityStreakCard({ activeDays }: ActivityStreakCardProps) {
  const days = useMemo(() => getRecentActivityDays(activeDays), [activeDays]);
  const streak = useMemo(() => getCurrentStreak(activeDays), [activeDays]);

  const streakLabel =
    streak === 0
      ? "Start your streak"
      : streak === 1
        ? "1 day streak"
        : `${streak} day streak`;

  return (
    <Card bordered padding="$3.5" marginBottom="$4">
      <YStack gap="$3">
        <YStack gap="$1">
          <Paragraph fontFamily="InterBold" fontSize="$4" color="$color">
            {streakLabel}
          </Paragraph>
          <Paragraph fontSize="$2" color="$gray11">
            Practice 5 days in a row
          </Paragraph>
        </YStack>

        <XStack
          justifyContent="space-between"
          alignItems="center"
          paddingHorizontal="$1"
          style={styles.zigzagRow}
        >
          {days.map((day, index) => {
            const zigzagY = index % 2 === 0 ? -ZIGZAG_OFFSET : ZIGZAG_OFFSET;

            return (
              <YStack
                key={day.date.format("YYYY-MM-DD")}
                alignItems="center"
                gap="$1.5"
                style={{ transform: [{ translateY: zigzagY }] }}
              >
                <View position="relative" alignItems="center" justifyContent="center">
                  <Circle
                    size={CIRCLE_SIZE}
                    backgroundColor={day.isActive ? "$blue3" : "$gray3"}
                    borderWidth={2}
                    borderColor={day.isActive ? "$blue8" : "$gray6"}
                  >
                    {day.isActive && (
                      <MaterialCommunityIcons
                        name="music-note"
                        size={26}
                        color={blueA.blueA10}
                      />
                    )}
                  </Circle>
                </View>
                <Paragraph
                  fontSize="$1"
                  color={day.isActive ? "$blue11" : "$gray10"}
                  fontFamily={index === 4 ? "InterBold" : undefined}
                >
                  {day.label}
                </Paragraph>
              </YStack>
            );
          })}
        </XStack>
      </YStack>
    </Card>
  );
}

const styles = StyleSheet.create({
  zigzagRow: {
    minHeight: CIRCLE_SIZE + ZIGZAG_OFFSET * 2 + 8,
  },
});
