import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useContext, useEffect } from "react";

import { Button } from "@/components/button";
import { StickyHeader } from "@/components/StickyHeader";
import { ModuleContext } from "@/context/module-context";
import { UserContext } from "@/context/user-context";
import { Section } from "@/types";
import { sectionItemRoute } from "@/types/navigation";
import { window } from "@/utils";
import { H4, Lock, Paragraph, Play, RefreshCw, ScrollView, View, XStack, YStack } from "@/ui";

const PAGE_HEIGHT = window.height;

export default function ModuleStartScreen() {
  const router = useRouter();
  const { currentUser } = useContext(UserContext);
  const { id: idParam } = useLocalSearchParams<{ id: string | string[] }>();
  const idRaw = Array.isArray(idParam) ? idParam[0] : idParam;
  const idNum = Number(idRaw);
  const { modules } = useContext(ModuleContext);
  const currentModule =
    modules?.data && modules.data.find((item) => item.id === idNum);

  useEffect(() => {
    if (!currentModule) router.back();
  }, [currentModule, router]);

  function handleSectionPress(section: Section, userCanAccessSection: boolean) {
    const path = sectionItemRoute(section.section_item[0]?.type);
    if (userCanAccessSection && path) {
      router.push({
        pathname: path,
        params: {
          module_id: String(currentModule?.id),
          section_id: String(section.id),
        },
      });
    } else {
      router.push("/paywall");
    }
  }

  return (
    <StickyHeader
      poster={currentModule?.poster}
      title={currentModule?.title || ""}
      onBackPress={() => router.back()}
    >
      <ScrollView
        backgroundColor={"$background"}
        minHeight={PAGE_HEIGHT - 118.6}
      >
        <View paddingBottom="$10">
          {currentModule?.section.map((section: Section) => {
            const userCanAccessSection = !(
              section.premium &&
              (currentUser?.is_subscribed === false ||
                !currentUser?.is_subscribed)
            );
            return (
              <XStack
                key={section.id}
                paddingVertical="$4"
                paddingHorizontal="$4"
                alignItems="center"
                justifyContent="space-between"
                borderBottomWidth={1}
                borderBottomColor="$borderColor"
                pressStyle={{ backgroundColor: "$backgroundPress" }}
                onPress={() =>
                  handleSectionPress(section, userCanAccessSection)
                }
              >
                <YStack flex={1} gap="$1">
                  <H4 fontWeight="normal" fontFamily="InterBold">
                    {section.title}
                  </H4>
                  <Paragraph fontSize="$3" color="$gray11">
                    {section.section_item.length <= 10
                      ? Math.round(section.section_item.length * 0.5) + " min"
                      : "10 min"}
                    {currentUser?.completed_sections?.includes(section.id) && (
                      <>
                        {" · "}
                        <Paragraph color="$blue10" fontFamily="InterBold">
                          Completed
                        </Paragraph>
                      </>
                    )}
                  </Paragraph>
                </YStack>
                {userCanAccessSection ? (
                  <Button
                    variant="outlined"
                    theme={"alt1"}
                    circular
                    icon={section.completed ? RefreshCw : Play}
                  />
                ) : (
                  <Button
                    disabled
                    variant="outlined"
                    theme={"alt1"}
                    circular
                    icon={Lock}
                  />
                )}
              </XStack>
            );
          })}
        </View>
      </ScrollView>
    </StickyHeader>
  );
}
