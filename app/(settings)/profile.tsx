import { UserContext } from "@/context/user-context";
import { supabase } from "@/utils/supabase";
import { Music, X } from "@tamagui/lucide-icons";
import { ImageManipulator, SaveFormat } from "expo-image-manipulator";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import React, { useContext, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Alert, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { Avatar, Button, H5, Input, Label, ScrollView, Theme, View, XStack, YStack } from "tamagui";

type FormInput = {
  fullName: string;
  email: string;
  password: string;
};

export default function ProfileSettings() {
  const [profile, setProfile] = useState({ name: "", email: "" });
  const { currentUser, handleUpdateUserInfo, handleSignOut } = useContext(UserContext);

  useEffect(() => {
    async function getUser() {
      const { data, error } = await supabase.auth.getSession();
      if (data.session) {
        setProfile({ name: currentUser?.full_name || "", email: data.session.user.email || "" });
        setValue("fullName", currentUser?.full_name || "");
        setValue("email", data.session.user.email || "");
      }
    }
    getUser();
  }, []);

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors, isDirty },
  } = useForm({
    defaultValues: {
      fullName: "",
      email: "",
      password: "Hello123",
    },
  });

  function handleUpdate(formInputs: FormInput) {
    handleUpdateUserInfo({ full_name: formInputs.fullName });
    Toast.show({
      type: "success",
      text1: "Account Updated",
    });
    router.back();
  }

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      allowsMultipleSelection: false,
      aspect: [1, 1],
    });

    if (!result.canceled) {
      const image = result.assets[0];

      const content = ImageManipulator.manipulate(image.uri).resize({ width: 500, height: 500 });
      const { uri } = await (await content.renderAsync()).saveAsync({ format: SaveFormat.JPEG });

      const fileExt = uri?.split(".").pop()?.toLowerCase() ?? "jpeg";
      const path = `${Date.now()}.${fileExt}`;

      const arraybuffer = await fetch(uri).then((res) => res.arrayBuffer());

      const { data, error } = await supabase.storage.from("avatars").upload(path, arraybuffer, {
        cacheControl: "3600",
        contentType: "image/jpeg",
        upsert: false,
      });

      if (error) console.error(error);
      if (data) {
        handleUpdateUserInfo({ avatar_url: "https://pueoumkuxzosxrzqoefw.supabase.co/storage/v1/object/public/" + data?.fullPath });
        Toast.show({
          type: "success",
          text1: "Profile image updated",
        });
      }
    }
  };

  function handleRemoveAccount() {
    Alert.alert("Remove Account", "Are you sure you want to remove your account?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Remove",
        style: "destructive",
        onPress: async () => {
          const { data, error } = await supabase.auth.admin.deleteUser(currentUser?.id || "");
        },
      },
    ]);
  }

  return (
    <SafeAreaView>
      <YStack gap="$2" padding="$3">
        <XStack alignItems="center" justifyContent="space-between">
          <Pressable onPress={() => router.back()}>
            <X size="$3" />
          </Pressable>
          <H5 fontWeight={500}>Profile Settings</H5>

          <XStack gap="$1" width={"$3"}></XStack>
        </XStack>
      </YStack>
      <ScrollView height={"100%"}>
        <YStack gap="$2" padding="$4">
          <YStack alignItems="center">
            <Avatar circular size="$12" onPress={pickImage}>
              {currentUser?.avatar_url && <Avatar.Image accessibilityLabel="Cam" src={currentUser.avatar_url} />}
              <Avatar.Fallback backgroundColor="$blue10" />
              <Music size={70} />
            </Avatar>
          </YStack>

          <Controller
            control={control}
            rules={{
              required: true,
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <View>
                <Theme name={errors.fullName ? "red" : null}>
                  <Label>Name</Label>
                  <Input
                    placeholder="Full Name"
                    size={"$6"}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    // value={profile.name}
                    // onChangeText={(text) => setProfile({ ...profile, name: text })}
                  />
                  {errors.email && <Label color={"red"}>Please enter your full name.</Label>}
                </Theme>
              </View>
            )}
            name="fullName"
          />

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
                  {errors.email && <Label color={"red"}>Please enter a valid email address.</Label>}
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

                  <Input placeholder="Password" size={"$6"} secureTextEntry onBlur={onBlur} onChangeText={onChange} value={value} />
                  {errors.password && <Label color={"red"}>Password needs to be at least 6 characters long.</Label>}
                </Theme>
              </View>
            )}
            name="password"
          />

          <Button fontWeight={600} fontSize={"$7"} height={"$5"} marginBottom="$2" onPress={handleSubmit(handleUpdate)}>
            Update
          </Button>

          <Button
            variant="outlined"
            borderColor={"$red8"}
            backgroundColor={"$red3"}
            color={"$red9"}
            fontWeight={600}
            fontSize={"$7"}
            height={"$5"}
            onPress={handleRemoveAccount}
          >
            Delete Account
          </Button>
        </YStack>
      </ScrollView>
    </SafeAreaView>
  );
}
