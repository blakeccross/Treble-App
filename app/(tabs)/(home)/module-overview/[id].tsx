import { Lock, Play, RefreshCw } from "@tamagui/lucide-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useContext, useEffect } from "react";

import { Button } from "@/components/button";
import { StickyHeader } from "@/components/StickyHeader";
import { ModuleContext } from "@/context/module-context";
import { UserContext } from "@/context/user-context";
import { window } from "@/utils";
import { H4, Paragraph, ScrollView, View, XStack, YStack } from "tamagui";

const PAGE_HEIGHT = window.height;

export default function ModuleStartScreen() {
  const router = useRouter();
  const { currentUser } = useContext(UserContext);
  const { id } = useLocalSearchParams();
  const { modules } = useContext(ModuleContext);
  const currentModule = modules?.data && modules.data.find((item) => item.id === Number(id));

  useEffect(() => {
    if (!currentModule) router.dismissAll();
  }, []);

  function handleSectionPress(section: any, userCanAccessSection: boolean) {
    if (userCanAccessSection) {
      router.push({ pathname: `/${section.section_item[0]?.type}` as any, params: { module_id: currentModule?.id, section_id: section.id } });
    } else {
      router.push("/paywall");
    }
  }

  return (
    <StickyHeader
      image={currentModule?.local_poster_uri || ""}
      title={currentModule?.title || ""}
      onBackPress={() => router.dismissTo("/(tabs)/(home)")}
    >
      <ScrollView backgroundColor={"$background"} minHeight={PAGE_HEIGHT - 118.6}>
        <View paddingBottom="$10">
          {currentModule?.section.map((section) => {
            const userCanAccessSection = !(section.premium && (currentUser?.is_subscribed === false || !currentUser?.is_subscribed));
            return (
              <XStack
                key={section.id}
                padding="$4"
                alignItems="center"
                justifyContent="space-between"
                pressStyle={{ scale: 0.99, backgroundColor: "$backgroundPress" }}
                onPress={() => handleSectionPress(section, userCanAccessSection)}
              >
                <YStack flex={1}>
                  <H4 fontWeight={600}>{section.title}</H4>
                  <Paragraph>
                    {section.section_item.length <= 10 ? Math.round(section.section_item.length * 0.5) + " minutes" : "10 minutes"}
                    {currentUser?.completed_sections?.includes(section.id) && (
                      <>
                        {" "}
                        •{" "}
                        <Paragraph color={"$blue10"} fontWeight={600}>
                          Completed
                        </Paragraph>
                      </>
                    )}
                  </Paragraph>
                </YStack>
                {userCanAccessSection ? (
                  <Button variant="outlined" theme={"alt1"} circular icon={section.completed ? RefreshCw : Play} />
                ) : (
                  <Button disabled variant="outlined" theme={"alt1"} circular icon={Lock} />
                )}
              </XStack>
            );
          })}
        </View>
      </ScrollView>
    </StickyHeader>
  );
}
