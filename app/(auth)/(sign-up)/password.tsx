import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator, StatusBar } from "react-native";
import { Button, H4, Input, Label, Theme, View, YStack } from "@/ui";
import { useSignUpForm } from "../../../context/sign-up-context";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";

type FormInput = {
  password: string;
};

export default function SignUpPassword() {
  const { updateForm } = useSignUpForm();
  const [isLoading, setIsLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormInput>();

  async function onSubmit(data: FormInput) {
    setIsLoading(true);
    updateForm(data);
    router.push("/(auth)/(sign-up)/instrument");
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
              minLength: 6,
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <View>
                <H4 fontWeight="normal" marginBottom="$3">
                  Create a password
                </H4>
                <Theme name={errors.password ? "red" : null}>
                  <Input
                    placeholder="Password"
                    autoCapitalize="none"
                    secureTextEntry
                    autoCorrect={false}
                    keyboardType="default"
                    size={"$6"}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    returnKeyType="done"
                    onSubmitEditing={() => handleSubmit(onSubmit)()}
                    autoFocus
                  />
                </Theme>
              </View>
            )}
            name="password"
          />

          <View marginTop="auto">
            {errors.password && <Label color={"red"}>{errors.password.message}</Label>}
            <Button
              height="$5"
              borderRadius="$6"
              onPress={handleSubmit(onSubmit)}
              disabled={isLoading}
              opacity={isLoading ? 0.65 : 1}
              elevate
            >
              {isLoading ? <ActivityIndicator color="white" /> : "Continue"}
            </Button>
          </View>
          <SafeAreaView edges={["bottom"]} />
        </YStack>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
