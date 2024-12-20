import TrebleLogo from "@/assets/trebleLogo";
import { UserContext } from "@/context/user-context";
import { useRouter } from "expo-router";

import { useContext, useEffect, useState } from "react";
import { View } from "tamagui";
import { LinearGradient } from "tamagui/linear-gradient";

export default function Splash() {
  const router = useRouter();
  const { currentUser, handleUpdateUserInfo } = useContext(UserContext);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted && !currentUser) {
      router.push("/(auth)/welcome");
    }
  }, [currentUser, isMounted]);

  return (
    <LinearGradient flex={1} colors={["$blue10", "$blue8"]} start={[0.3, 1]} end={[0, 0]}>
      <View flex={1} justifyContent="center" alignItems="center">
        <View width={180} height={280}>
          <TrebleLogo />
        </View>
      </View>
    </LinearGradient>
  );
}
