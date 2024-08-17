import { UserContext } from "@/context/user-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import { color } from "@tamagui/themes";
import { router, useRouter } from "expo-router";
import React, { useContext, useEffect, useState } from "react";
import { StyleSheet, Image, Platform, SafeAreaView } from "react-native";
import Toast from "react-native-toast-message";
import { Avatar, Button, Card, H3, H5, Input, Label, Paragraph, ScrollView, Separator, Stack, View, XStack, YStack } from "tamagui";
import * as ImagePicker from "expo-image-picker";
import { Music } from "@tamagui/lucide-icons";

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

  function handleUpdate() {
    handleUpdateUserInfo({ ...profile });
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

    console.log(result);

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
      {/* <ToastViewport /> */}
      <ScrollView height={"100%"}>
        <YStack gap="$2" padding="$4">
          <YStack alignItems="center">
            <Avatar circular size="$12" onPress={pickImage}>
              <Avatar.Image accessibilityLabel="Cam" src={currentUser?.profileImageURL} />
              <Avatar.Fallback backgroundColor="$blue10" />
              <Music size={70} />
            </Avatar>
          </YStack>
          <View>
            <Label>Name</Label>
            <Input placeholder="Full Name" size={"$6"} value={profile.name} onChangeText={(text) => setProfile({ ...profile, name: text })} />
          </View>
          <View>
            <Label>Email</Label>
            <Input placeholder="Email" size={"$6"} value={profile.email} onChangeText={(text) => setProfile({ ...profile, email: text })} />
          </View>
          <View>
            <Label>Password</Label>
            <Input placeholder="Password" size={"$6"} secureTextEntry />
          </View>
          <Button fontWeight={600} fontSize={"$7"} height={"$5"} onPress={handleUpdate}>
            Update
          </Button>
          {/* <Toast
            onOpenChange={setOpen}
            open={open}
            animation="100ms"
            enterStyle={{ x: -20, opacity: 0 }}
            exitStyle={{ x: -20, opacity: 0 }}
            opacity={1}
            x={0}
          >
            <Toast.Title>TOAST!!!</Toast.Title>
            <Toast.Description>Updated Boi</Toast.Description>
          </Toast> */}
          {/* <H5>Overview</H5>
        <YStack alignItems="flex-start" gap="$4" marginHorizontal="$4">
          <XStack gap="$4">
            <Card flex={1}>
              <Card.Header>
                <Paragraph fontWeight="800">3</Paragraph>
                <Paragraph>Modules Completed</Paragraph>
              </Card.Header>
            </Card>
            <Card flex={1}>
              <Card.Header>
                <Paragraph fontWeight="800">73</Paragraph>
                <Paragraph>Total XP</Paragraph>
              </Card.Header>
            </Card>
          </XStack>
          <XStack gap="$4">
            <Card flex={1}>
              <Card.Header>
                <Paragraph fontWeight="800">157</Paragraph>
                <Paragraph>Ranking</Paragraph>
              </Card.Header>
            </Card>
            <Card flex={1}>
              <Card.Header>
                <Paragraph fontWeight="800">3</Paragraph>
                <Paragraph>Current League</Paragraph>
              </Card.Header>
            </Card>
          </XStack> */}
          {/* {stats.map((item) => (
            <Card>
              <Card.Header>
                <Paragraph>{item.title}</Paragraph>
                <Paragraph>{item.value}</Paragraph>
              </Card.Header>
            </Card>
          ))} */}
        </YStack>
      </ScrollView>
    </SafeAreaView>
  );
}
