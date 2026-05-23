import { AuthFlowHeader } from "@/components/auth/AuthFlowHeader";
import { usePathname } from "expo-router";
import React, { useMemo } from "react";
import Animated, { FadeIn, SlideOutUp } from "react-native-reanimated";

function signUpStepProgress(pathname: string): number | undefined {
  const p = pathname ?? "";
  if (/\/name$/.test(p) || p === "/name") return 22;
  if (/\/email$/.test(p) || p === "/email") return 45;
  if (/\/password$/.test(p) || p === "/password") return 62;
  if (/\/instrument$/.test(p) || p === "/instrument") return 82;
  return 12;
}

export default function SignUpProgressHeader() {
  const pathname = usePathname();
  const progress = useMemo(() => signUpStepProgress(pathname), [pathname]);

  return (
    <Animated.View entering={FadeIn} exiting={SlideOutUp}>
      <AuthFlowHeader title="Sign up" progress={progress} />
    </Animated.View>
  );
}
