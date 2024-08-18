import { UserContext } from "@/context/user-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import { color } from "@tamagui/themes";
import { router, useRouter } from "expo-router";
import React, { useContext, useEffect, useState } from "react";
import { StyleSheet, Image, Platform, SafeAreaView } from "react-native";
import Toast from "react-native-toast-message";
import { Avatar, Button, Card, H3, H5, Input, Label, Paragraph, ScrollView, Separator, Stack, Theme, View, XStack, YStack } from "tamagui";
import * as ImagePicker from "expo-image-picker";
import { Music } from "@tamagui/lucide-icons";
import { useForm, Controller } from "react-hook-form";
import { supabase } from "@/utils/supabase";

type FormInput = {
  email: string;
  password: string;
};

export default function ProfileSettings() {
  const [profile, setProfile] = useState({ name: "", email: "" });
  const { currentUser, handleUpdateUserInfo } = useContext(UserContext);
  const [open, setOpen] = React.useState(false);
  const timerRef = React.useRef(0);

  useEffect(() => {
    setProfile({ name: currentUser?.name || "", email: currentUser?.email || "" });
  }, []);

  React.useEffect(() => {
    return () => clearTimeout(timerRef.current);
  }, []);

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
    <SafeAreaView>
      <YStack gap="$2" padding="$4">
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

        <Button fontWeight={600} fontSize={"$7"} height={"$5"} onPress={handleSubmit(onSubmit)}>
          Log in
        </Button>
        {errors.email && <Label color={"red"}>Incorrect log in credentials</Label>}
      </YStack>
    </SafeAreaView>
  );
}
