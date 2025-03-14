import { UserContext } from "@/context/user-context";
import { supabase } from "@/utils/supabase";
import { ChevronLeft } from "@tamagui/lucide-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useContext, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Button, Input, Label, Paragraph, Theme, ToggleGroup, View, XStack, YStack } from "tamagui";
import Login from "./logIn";
import SignUp from "./signUp";
import LottieView from "lottie-react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type FormInput = {
  email: string;
  password: string;
  confirmPassword: string;
};

export default function Auth() {
  const { type } = useLocalSearchParams();
  const { currentUser, handleUpdateUserInfo } = useContext(UserContext);
  const [open, setOpen] = React.useState(false);
  const timerRef = React.useRef(0);
  const [toggle, setToggle] = useState("login");

  useEffect(() => {
    setToggle(type as string);
  }, [type]);

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
    getValues,
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  return (
    <>
      <YStack backgroundColor={"$blue10"}>
        <SafeAreaView edges={["top"]} />
        <XStack position="relative" justifyContent="space-between" alignItems="center" padding="$4">
          <View width={"$3"} height={"$3"} themeInverse alignItems="center" justifyContent="center" onPress={() => router.back()}>
            <ChevronLeft size={"$2"} color={"white"} />
          </View>
          <Paragraph fontSize={"$6"} color={"white"} fontWeight={800}>
            Log in
          </Paragraph>
          <View width={"$3"} height={"$3"}></View>
        </XStack>
      </YStack>
      <View flex={1} padding="$4">
        <Login />
      </View>
    </>
  );
}
