import { UserContext } from "@/context/user-context";
import { supabase } from "@/utils/supabase";
import { ChevronLeft } from "@tamagui/lucide-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useContext, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { SafeAreaView } from "react-native";
import { Button, Input, Label, Paragraph, Theme, ToggleGroup, View, YStack } from "tamagui";
import Login from "./logIn";
import SignUp from "./signUp";

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
      <YStack padding="$4" backgroundColor={"$blue10"}>
        <SafeAreaView />
        <View width={"$3"} height={"$3"} themeInverse alignItems="center" justifyContent="center" onPress={() => router.back()}>
          <ChevronLeft size={"$2"} />
        </View>
      </YStack>

      <YStack padding="$4" flex={1}>
        <ToggleGroup type="single" value={toggle}>
          <ToggleGroup.Item value="login" flex={1} onPress={() => setToggle("login")}>
            <Paragraph>Login</Paragraph>
          </ToggleGroup.Item>
          <ToggleGroup.Item value="signup" flex={1} onPress={() => setToggle("signup")}>
            <Paragraph>Sign Up</Paragraph>
          </ToggleGroup.Item>
        </ToggleGroup>
        {toggle === "login" && <Login />}

        {toggle === "signup" && <SignUp />}
      </YStack>
    </>
  );
}
