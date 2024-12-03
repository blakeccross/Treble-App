import { UserContext } from "@/context/user-context";
import { supabase } from "@/utils/supabase";
import { ChevronLeft } from "@tamagui/lucide-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useContext, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { SafeAreaView } from "react-native";
import { Button, Input, Label, Paragraph, Theme, ToggleGroup, View, YStack } from "tamagui";
import Login from "./log-in";

type FormInput = {
  email: string;
  password: string;
  confirmPassword: string;
};

export default function SignUp() {
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

  async function onSubmit(formInputs: FormInput) {
    const { data: auth, error } = await supabase.auth.signUp({
      email: formInputs.email,
      password: formInputs.password,
    });

    if (error) {
      console.error(error);
      setError("email", { type: "custom", message: "Email already in use" });
      setError("password", { type: "custom", message: "Password is too short" });
    }

    console.log("AUTH", auth);

    if (auth.user) {
      router.dismissAll();
      router.push("/(tabs)/(home)/");
    }
  }

  return (
    <>
      <YStack padding="$4" backgroundColor={"$blue10"}>
        <SafeAreaView />
        <View width={"$3"} height={"$3"} themeInverse alignItems="center" justifyContent="center" onPress={() => router.back()}>
          <ChevronLeft size={"$2"} />
        </View>
      </YStack>

      <YStack padding="$4">
        <ToggleGroup type="single" value={toggle}>
          <ToggleGroup.Item value="login" flex={1} onPress={() => setToggle("login")}>
            <Paragraph>Login</Paragraph>
          </ToggleGroup.Item>
          <ToggleGroup.Item value="signup" flex={1} onPress={() => setToggle("signup")}>
            <Paragraph>Sign Up</Paragraph>
          </ToggleGroup.Item>
        </ToggleGroup>
        {toggle === "login" && <Login />}

        {toggle === "signup" && (
          <>
            <Controller
              control={control}
              rules={{
                required: true,
                pattern: {
                  value: /\S+@\S+\.\S+/,
                  message: "Entered value does not match email format",
                },
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <View>
                  <Theme name={errors.email ? "red" : null}>
                    <Label>Email</Label>
                    <Input placeholder="Email" size={"$6"} onBlur={onBlur} onChangeText={onChange} value={value} />
                  </Theme>
                </View>
              )}
              name="email"
            />

            <Controller
              control={control}
              rules={{
                required: true,
                minLength: 6,
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <View>
                  <Theme name={errors.password ? "red" : null}>
                    <Label>Password</Label>

                    <Input placeholder="Password" size={"$6"} secureTextEntry onBlur={onBlur} onChangeText={onChange} value={value} />
                  </Theme>
                </View>
              )}
              name="password"
            />
            <Controller
              control={control}
              rules={{
                required: true,
                minLength: 6,
                validate: (value) => value === getValues("password") || "Passwords do not match",
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <View marginBottom="$4">
                  <Theme name={errors.password ? "red" : null}>
                    <Label>Confirm Password</Label>

                    <Input placeholder="Confirm Password" size={"$6"} secureTextEntry onBlur={onBlur} onChangeText={onChange} value={value} />
                  </Theme>
                </View>
              )}
              name="confirmPassword"
            />

            <Button fontWeight={600} fontSize={"$7"} height={"$5"} onPress={handleSubmit(onSubmit)}>
              Continue
            </Button>
          </>
        )}
        {errors.email && <Label color={"red"}>Please enter a valid email</Label>}
        {errors.password && <Label color={"red"}>Password is too short</Label>}
        {errors.confirmPassword && <Label color={"red"}>Passwords do not match</Label>}
      </YStack>
    </>
  );
}
