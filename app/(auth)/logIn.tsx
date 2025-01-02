import { router, useRouter } from "expo-router";
import React, { useContext, useEffect, useState } from "react";
import { Avatar, Button, Card, H3, H5, Input, Label, Paragraph, ScrollView, Separator, Stack, Theme, View, XStack, YStack } from "tamagui";
import { useForm, Controller } from "react-hook-form";
import { supabase } from "@/utils/supabase";
import { KeyboardAvoidingView, Platform } from "react-native";

type FormInput = {
  email: string;
  password: string;
};

export default function Login() {
  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(formInputs: FormInput) {
    const { data: auth, error } = await supabase.auth.signInWithPassword({
      email: formInputs.email,
      password: formInputs.password,
    });

    if (error) {
      console.error(error);
      setError("email", { type: "custom", message: "Invalid login credentials" });
      setError("password", { type: "custom", message: "Invalid login credentials" });
    }

    if (auth.session) {
      router.dismissAll();
      router.push("/(tabs)/(home)/");
    }
  }

  return (
    <>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }} keyboardVerticalOffset={110}>
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
                    <Input autoCapitalize="none" placeholder="Email" size={"$6"} onBlur={onBlur} onChangeText={onChange} value={value} />
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
                <View marginBottom="$4">
                  <Theme name={errors.password ? "red" : null}>
                    <Label>Password</Label>

                    <Input
                      placeholder="Password"
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
              name="password"
            />
            {errors.email && <Label color={"red"}>Incorrect log in credentials</Label>}
          </YStack>
        </ScrollView>
        <Button fontWeight={600} fontSize={"$7"} height={"$5"} onPress={handleSubmit(onSubmit)} marginTop="auto" marginBottom="$4">
          Log in
        </Button>
      </KeyboardAvoidingView>
    </>
  );
}
