import { UserContext } from "@/context/user-context";
import { supabase } from "@/utils/supabase";
import { ChevronLeft } from "@tamagui/lucide-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useContext, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { Button, Input, Label, Paragraph, Theme, ToggleGroup, View, YStack } from "tamagui";
import Login from "./logIn";

type FormInput = {
  email: string;
  password: string;
  confirmPassword: string;
};

export default function SignUp() {
  const { type } = useLocalSearchParams();
  const { getUser } = useContext(UserContext);

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
      if (error.message.toLocaleLowerCase().includes("email")) {
        setError("email", { type: "custom", message: error.message });
      }

      if (error.message.toLocaleLowerCase().includes("password")) {
        setError("password", { type: "custom", message: error.message });
      }

      console.error(error.message);
    }
    console.log("AUTH", auth);

    if (auth.user) {
      // await getUser();
      router.dismissAll();
      router.push("/(tabs)/(home)/");
    }
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="never">
        <YStack flex={1}>
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
                  <Input
                    placeholder="Email"
                    autoCapitalize="none"
                    autoCorrect={false}
                    keyboardType="email-address"
                    size={"$6"}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                  />
                </Theme>
              </View>
            )}
            name="email"
          />
          {errors.email && <Label color={"red"}>{errors.email.message}</Label>}

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
          {errors.password && <Label color={"red"}>{errors.password.message}</Label>}
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

                  <Input
                    placeholder="Confirm Password"
                    size={"$6"}
                    secureTextEntry
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    returnKeyType="send"
                  />
                </Theme>
              </View>
            )}
            name="confirmPassword"
          />
          {errors.confirmPassword && <Label color={"red"}>Passwords do not match</Label>}

          <Button fontWeight={600} fontSize={"$7"} height={"$5"} onPress={handleSubmit(onSubmit)} marginTop="auto" marginBottom="$4">
            Continue
          </Button>
        </YStack>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
