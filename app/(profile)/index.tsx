import { UserContext } from "@/context/user-context";
import { supabase } from "@/utils/supabase";
import { Music, X } from "@tamagui/lucide-icons";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import React, { useContext, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Pressable, SafeAreaView } from "react-native";
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
    console.log("DIRTY", isDirty);
    handleUpdateUserInfo({ full_name: formInputs.fullName });
    Toast.show({
      type: "success",
      text1: "Account Updated",
    });
    router.back();
  }

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      allowsMultipleSelection: false,
      aspect: [1, 1],
    });

    if (!result.canceled) {
      handleUpdateUserInfo({ profileImageURL: result.assets[0].uri || "" });
      Toast.show({
        type: "success",
        text1: "Profile image updated",
      });
    }
  };

  return (
    <SafeAreaView>
      <SafeAreaView />
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
              <Avatar.Image accessibilityLabel="Cam" src={currentUser?.avatar_url || ""} />
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
              <View>
                <Theme name={errors.password ? "red" : null}>
                  <Label>Password</Label>

                  <Input placeholder="Password" size={"$6"} secureTextEntry onBlur={onBlur} onChangeText={onChange} value={value} />
                  {errors.password && <Label color={"red"}>Password needs to be at least 6 characters long.</Label>}
                </Theme>
              </View>
            )}
            name="password"
          />

          {/* include validation with required or other standard HTML validation rules */}
          {/* <input {...register("exampleRequired", { required: true })} /> */}
          {/* errors will return when field validation fails  */}
          {/* {errors.exampleRequired && <span>This field is required</span>} */}

          <Button
            fontWeight={600}
            fontSize={"$7"}
            height={"$5"}
            // onPress={handleUpdate}
            onPress={handleSubmit(handleUpdate)}
          >
            Update
          </Button>
          <Theme name={"red"}>
            <Button
              fontWeight={600}
              fontSize={"$7"}
              height={"$5"}
              // variant="outlined"
              onPress={handleSignOut}
            >
              Sign out
            </Button>
          </Theme>
        </YStack>
      </ScrollView>
    </SafeAreaView>
  );
}
