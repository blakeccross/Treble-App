import React from "react";
import { Dimensions } from "react-native";
import { XStack, YStack, Button, Text, View } from "tamagui";
import { LinearGradient } from "expo-linear-gradient";

interface PianoKeyProps {
  note: string;
  isBlack?: boolean;
  onPress?: () => void;
  width?: number;
  height?: number;
  paddingLeft?: number;
}

const PianoKey: React.FC<PianoKeyProps> = ({ note, isBlack = false, onPress, width, height, paddingLeft }) => {
  return (
    <Button
      backgroundColor={isBlack ? "#1a1a1a" : "#ffffff"}
      borderColor={isBlack ? "#000000" : "#cccccc"}
      borderWidth={1}
      borderRadius={isBlack ? 4 : 8}
      borderTopLeftRadius={0}
      borderTopRightRadius={0}
      //   aspectRatio={3 / 4}
      width={width}
      height={height}
      paddingLeft={paddingLeft}
      //   marginHorizontal={isBlack ? 0 : 1}
      onPress={onPress}
      pressStyle={{
        backgroundColor: isBlack ? "#333333" : "#f0f0f0",
      }}
      unstyled
      justifyContent="flex-end"
      paddingBottom={10}
      shadowColor="#000"
      shadowOffset={{ width: 0, height: 5 }}
      shadowOpacity={0.1}
      shadowRadius={3.84}
      elevation={1}
    >
      {!isBlack && (
        <Text color={isBlack ? "#ffffff" : "#000000"} fontSize={"$5"} fontWeight="600" textAlign="center">
          {note}
        </Text>
      )}
    </Button>
  );
};

interface PianoKeysProps {
  onKeyPress?: (note: string) => void;
}

export const PianoKeys: React.FC<PianoKeysProps> = ({ onKeyPress }) => {
  const screenWidth = Dimensions.get("window").width;
  const screenHeight = Dimensions.get("window").height;
  const whiteKeys = ["C", "D", "E", "F", "G", "A", "B"];
  const blackKeys = [
    { note: "C#", position: 0.5 },
    { note: "D#", position: 1.5 },
    { note: "F#", position: 3.5 },
    { note: "G#", position: 4.5 },
    { note: "A#", position: 5.5 },
  ];

  const handleKeyPress = (note: string) => {
    onKeyPress?.(note);
  };

  return (
    <>
      <YStack alignItems="center" paddingBottom="$6">
        <XStack position="relative" zIndex={1} width={screenWidth}>
          {blackKeys.map((key, index) => (
            <XStack key={key.note} position="absolute" left={(key.position * screenWidth) / 7 + 5}>
              <PianoKey note={key.note} height={screenHeight / 9} isBlack={true} width={screenWidth / 9} onPress={() => handleKeyPress(key.note)} />
            </XStack>
          ))}
        </XStack>

        <XStack flexDirection="row">
          {whiteKeys.map((note, index) => (
            <PianoKey width={screenWidth / 7} height={screenHeight / 5} key={note} note={note} onPress={() => handleKeyPress(note)} />
          ))}
        </XStack>
      </YStack>
    </>
  );
};

export default PianoKeys;
