import React from "react";
import { Controller, useForm } from "react-hook-form";
import { KeyboardAvoidingView, Platform, ScrollView, StatusBar } from "react-native";
import { Button, H4, Input, Label, Theme, View, YStack } from "@/ui";
import { useSignUpForm } from "../../../context/sign-up-context";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";

type FormInput = {
  email: string;
};

export default function SignUpEmail() {
  const { updateForm } = useSignUpForm();

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
    getValues,
  } = useForm<FormInput>();

  function onSubmit(data: FormInput) {
    updateForm(data);
    router.push("/(auth)/(sign-up)/password");
  }

  const KEYBOARD_VERTICAL_OFFSET = 120 + (StatusBar?.currentHeight ?? 0);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
      keyboardVerticalOffset={Platform.OS === "ios" ? KEYBOARD_VERTICAL_OFFSET : 0}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled" bounces={false}>
        <YStack flex={1} paddingHorizontal="$5" paddingTop="$4" gap="$5">
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
                <H4 fontWeight="normal" marginBottom="$3">
                  What is your email?
                </H4>
                <Theme name={errors.email ? "red" : null}>
                  <Input
                    placeholder="Email"
                    autoCapitalize="none"
                    autoCorrect={false}
                    keyboardType="default"
                    size={"$6"}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    returnKeyType="next"
                    onSubmitEditing={() => handleSubmit(onSubmit)()}
                    autoFocus
                  />
                </Theme>
              </View>
            )}
            name="email"
          />

          <View marginTop="auto">
            {errors.email && (
              <Label textAlign="center" color={"red"}>
                {errors.email.message}
              </Label>
            )}
            <Button height="$5" borderRadius="$6" onPress={handleSubmit(onSubmit)} elevate>
              Next
            </Button>
          </View>
          <SafeAreaView edges={["bottom"]} />
        </YStack>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
