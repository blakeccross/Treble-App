import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Alert, KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator } from "react-native";
import { Button, Input, Label, Theme, View, YStack } from "tamagui";
import { useSignUpForm } from "../../../context/sign-up-context";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { supabase } from "../../../utils/supabase";

type FormInput = {
  password: string;
};

export default function SignUpPassword() {
  const { form, updateForm } = useSignUpForm();
  const [isLoading, setIsLoading] = useState(false);

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
    getValues,
  } = useForm<FormInput>();

  async function onSubmit(data: FormInput) {
    setIsLoading(true);
    try {
      updateForm(data);

      const { data: signUpData, error } = await supabase.auth.signUp({
        email: form.email,
        password: data.password,
      });

      if (error) {
        Alert.alert("Something went wrong", error.message);
      }

      if (signUpData.user) {
        router.push("/(auth)/(sign-up)/notifications");
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
      keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled" bounces={false}>
        <YStack flex={1} padding="$3" space="$4">
          <Controller
            control={control}
            rules={{
              required: true,
              minLength: 6,
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <View>
                <Theme name={errors.password ? "red" : null}>
                  <Label fontWeight={800}>Create a password</Label>
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
                    returnKeyType="next"
                  />
                </Theme>
              </View>
            )}
            name="password"
          />

          <View marginTop="auto">
            {errors.password && <Label color={"red"}>{errors.password.message}</Label>}
            <Button
              fontWeight={600}
              fontSize={"$7"}
              height={"$5"}
              onPress={handleSubmit(onSubmit)}
              disabled={isLoading}
              opacity={isLoading ? 0.7 : 1}
            >
              {isLoading ? <ActivityIndicator color="white" /> : "Create profile"}
            </Button>
          </View>
          <SafeAreaView edges={["bottom"]} />
        </YStack>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
