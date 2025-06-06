import React from "react";
import { Controller, useForm } from "react-hook-form";
import { KeyboardAvoidingView, Platform, ScrollView, StatusBar } from "react-native";
import { Button, Input, Label, Theme, View, YStack } from "tamagui";
import { useSignUpForm } from "../../../context/sign-up-context";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";

type FormInput = {
  fullName: string;
};

export default function SignUpName() {
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
    router.push("/(auth)/(sign-up)/email");
  }

  const KEYBOARD_VERTICAL_OFFSET = 120 + (StatusBar?.currentHeight ?? 0);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
      keyboardVerticalOffset={Platform.OS === "ios" ? KEYBOARD_VERTICAL_OFFSET : 0}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled" bounces={false}>
        <YStack flex={1} padding="$3" space="$4">
          <Controller
            control={control}
            rules={{
              required: true,
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <View>
                <Theme name={errors.fullName ? "red" : null}>
                  <Label fontWeight={800}>What is your name?</Label>
                  <Input
                    placeholder="Name"
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
            name="fullName"
          />
          {errors.fullName && <Label color={"red"}>{errors.fullName.message}</Label>}

          <View marginTop="auto">
            <Button fontWeight={600} fontSize={"$7"} height={"$5"} onPress={handleSubmit(onSubmit)}>
              Next
            </Button>
          </View>
          <SafeAreaView edges={["bottom"]} />
        </YStack>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
