import { supabase } from "@/utils/supabase";
import { router } from "expo-router";
import React, { useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { ActivityIndicator, KeyboardAvoidingView, Platform, StatusBar, TextInput } from "react-native";
import { Button, Input, Label, ScrollView, Theme, View, YStack } from "tamagui";
import Toast from "react-native-toast-message";
import { SafeAreaView } from "react-native-safe-area-context";

type FormInput = {
  email: string;
  password: string;
};

export default function Login() {
  const passwordRef = useRef<TextInput | null>(null);
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

  const [loading, setLoading] = useState(false);

  async function onSubmit(formInputs: FormInput) {
    setLoading(true);
    const { data: auth, error } = await supabase.auth.signInWithPassword({
      email: formInputs.email,
      password: formInputs.password,
    });

    setLoading(false);
    console.log("ERROR", error?.message);

    if (error) {
      Toast.show({
        text1: error?.message,
        type: "error",
      });
      console.error(error);
      setError("email", { type: "custom", message: "Invalid login credentials" });
      setError("password", { type: "custom", message: "Invalid login credentials" });
    }

    if (auth.session) {
      router.dismissAll();
      router.replace("/(tabs)/(home)");
    }
  }

  const KEYBOARD_VERTICAL_OFFSET = 80 + (StatusBar?.currentHeight ?? 0);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
      keyboardVerticalOffset={Platform.OS === "ios" ? KEYBOARD_VERTICAL_OFFSET : 0}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="never" bounces={false}>
        <YStack flex={1} justifyContent="space-between">
          <View>
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
                      autoCapitalize="none"
                      keyboardType="email-address"
                      placeholder="Email"
                      size={"$6"}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      // value={value}
                      returnKeyType="next"
                      onSubmitEditing={() => passwordRef?.current?.focus()}
                      autoFocus
                    />
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
                      ref={passwordRef}
                      placeholder="Password"
                      size={"$6"}
                      secureTextEntry
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      returnKeyType="send"
                      onSubmitEditing={handleSubmit(onSubmit)}
                    />
                  </Theme>
                </View>
              )}
              name="password"
            />
          </View>
          <View marginBottom="$4">
            <Button fontWeight={600} fontSize={"$7"} height={"$5"} onPress={handleSubmit(onSubmit)} disabled={loading}>
              {loading ? <ActivityIndicator color="white" /> : "Log in"}
            </Button>
            <SafeAreaView edges={["bottom"]} />
          </View>
        </YStack>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
