import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator, Alert, StyleSheet } from "react-native";
import { Button, H4, Label, View, YStack, XStack, SizableText } from "@/ui";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";

import Animated, { FadeInDown } from "react-native-reanimated";
import { useUser } from "../../../context/user-context";
import { supabase } from "@/utils/supabase";
import { useSignUpForm } from "@/context/sign-up-context";

type FormInput = {
  instrument: string;
};

export default function SignUpInstrument() {
  const { handleUpdateUserInfo, currentUser } = useUser();
  const { form } = useSignUpForm();
  const [isLoading, setIsLoading] = useState(false);
  const instruments = ["🎸", "🎹", "🎻", "🎤", "🎷", "🥁", "🎺", "💻", "🪈", "🪗", "🪕", "🎛️"];

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
    watch,
  } = useForm<FormInput>();

  const selectedInstrument = watch("instrument");

  async function onSubmit(data: FormInput) {
    setIsLoading(true);
    try {
      const { data: signUpData, error } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: {
          data: {
            full_name: form.fullName,
            instrument: selectedInstrument,
            active_days: currentUser?.active_days ?? null,
            completed_modules: currentUser?.completed_modules ?? null,
            completed_sections: currentUser?.completed_sections ?? null,
            total_xp: currentUser?.total_xp ?? null,
            expo_push_token: currentUser?.expo_push_token ?? null,
          },
        },
      });

      if (error) {
        Alert.alert("Something went wrong", error.message);
      }

      if (signUpData.user) {
        router.push("/(auth)/(sign-up)/paywall");
      }
      // //   updateForm({ instrument: data.instrument });
      // await handleUpdateUserInfo({ instrument: data.instrument });
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
        <YStack flex={1} paddingHorizontal="$5" paddingTop="$4" gap="$5">
          <Controller
            control={control}
            rules={{
              required: "Please select an instrument",
            }}
            render={({ field: { onChange, value } }) => (
              <View>
                <H4 fontWeight="normal" marginBottom="$2">
                  What instrument do you play?
                </H4>
                <YStack gap="$3" marginTop="$2">
                  {chunk(instruments, 4).map((row, rowIndex) => (
                    <XStack key={rowIndex} gap="$3" flexWrap="wrap" justifyContent={row.length < 4 ? "flex-start" : "space-between"}>
                      {row.map((instrument, index) => (
                        <Animated.View key={instrument} entering={FadeInDown.delay(rowIndex * 100 + index * 100)} style={{ flex: 1, aspectRatio: 1 }}>
                          <Button
                            key={instrument}
                            backgroundColor={value === instrument ? "$blue10" : "$gray3"}
                            borderWidth={StyleSheet.hairlineWidth * 2}
                            borderColor={value === instrument ? "transparent" : "$borderColor"}
                            borderRadius="$5"
                            onPress={() => onChange(instrument)}
                            aspectRatio={1}
                            flex={1}
                            paddingVertical={"$2"}
                            disabled={!instrument}
                            pressStyle={{ scale: 0.97 }}
                          >
                            <SizableText fontSize="$10">{instrument}</SizableText>
                          </Button>
                        </Animated.View>
                      ))}
                    </XStack>
                  ))}
                </YStack>
                {errors.instrument && (
                  <Label color="$red10" marginTop="$2">
                    {errors.instrument.message}
                  </Label>
                )}
              </View>
            )}
            name="instrument"
          />

          <View marginTop="auto">
            <Button
              height="$5"
              borderRadius="$6"
              onPress={handleSubmit(onSubmit)}
              disabled={isLoading || !selectedInstrument}
              opacity={isLoading ? 0.65 : 1}
              elevate
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

// Helper function to chunk array into groups
function chunk<T>(array: T[], size: number): T[][] {
  return Array.from({ length: Math.ceil(array.length / size) }, (_, i) => array.slice(i * size, i * size + size));
}
