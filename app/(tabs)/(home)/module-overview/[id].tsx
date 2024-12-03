import { Lock, Play, RefreshCw } from "@tamagui/lucide-icons";
import { Link, useLocalSearchParams, useRouter } from "expo-router";
import React, { useContext, useEffect } from "react";

import { Button } from "@/components/button";
import { StickyHeader } from "@/components/StickyHeader";
import { ModuleContext } from "@/context/module-context";
import { UserContext } from "@/context/user-context";
import { window } from "@/utils";
import { H4, Paragraph, ScrollView, View, XStack, YStack } from "tamagui";

const PAGE_WIDTH = window.width;
const PAGE_HEIGHT = window.height;

export default function ModuleStartScreen() {
  const router = useRouter();
  const { currentUser } = useContext(UserContext);
  const { id } = useLocalSearchParams();
  const { modules } = useContext(ModuleContext);
  const currentModule = modules.data && modules.data.find((item) => item.id === Number(id));

  useEffect(() => {
    if (!currentModule) router.dismissAll();
  }, []);

  return (
    <StickyHeader image={currentModule?.local_poster_uri || ""} title={currentModule?.title || ""}>
      <ScrollView backgroundColor={"$background"} minHeight={PAGE_HEIGHT - 118.6}>
        <View paddingBottom="$10">
          {currentModule?.section.map((section) => (
            <Link
              asChild
              href={{ pathname: `/${section.section_item[0]?.type}`, params: { module_id: currentModule.id, section_id: section.id } }}
              disabled={(section.premium && currentUser?.premium) || !section.section_item[0]?.type}
              key={section.id}
            >
              <XStack
                padding="$4"
                alignItems="center"
                justifyContent="space-between"
                pressStyle={{ scale: 0.99, backgroundColor: "$backgroundPress" }}
              >
                <YStack flex={1}>
                  <H4 fontWeight={600}>{section.title}</H4>
                  <Paragraph>
                    {section.section_item.length} minutes{" "}
                    {section.completed && (
                      <>
                        •{" "}
                        <Paragraph color={"$blue10"} fontWeight={600}>
                          Completed
                        </Paragraph>
                      </>
                    )}
                  </Paragraph>
                </YStack>
                {section.premium && !currentUser?.premium ? (
                  <Button disabled variant="outlined" theme={"alt1"} circular icon={Lock} />
                ) : (
                  <Button disabled variant="outlined" theme={"alt1"} circular icon={section.completed ? RefreshCw : Play} />
                )}
              </XStack>
            </Link>
          ))}
        </View>
      </ScrollView>
    </StickyHeader>
  );
}
