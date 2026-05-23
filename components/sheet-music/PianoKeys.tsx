import React from "react";
import { Dimensions } from "react-native";
import { XStack, YStack, Text, View } from "@/ui";

interface PianoKeyProps {
  note: string;
  isBlack?: boolean;
  onPress?: () => void;
  width?: number;
  height?: number;
  paddingLeft?: number;
  disabled?: boolean;
}

const PianoKey: React.FC<PianoKeyProps> = ({ note, isBlack = false, onPress, width, height, paddingLeft, disabled }) => {
  return (
    <View
      backgroundColor={isBlack ? "#1a1a1a" : "#ffffff"}
      borderColor={isBlack ? "#000000" : "#cccccc"}
      borderWidth={1}
      borderRadius={isBlack ? 4 : 8}
      borderTopLeftRadius={0}
      borderTopRightRadius={0}
      width={width}
      height={height}
      paddingLeft={paddingLeft}
      onPress={disabled ? undefined : onPress}
      pressStyle={{
        backgroundColor: isBlack ? "#333333" : "#f0f0f0",
      }}
      justifyContent="flex-end"
      alignItems="center"
      paddingBottom={10}
      shadowColor="#000"
      shadowOffset={{ width: 0, height: 5 }}
      shadowOpacity={0.1}
      shadowRadius={3.84}
      elevation={1}
      opacity={disabled ? 0.7 : 1}
    >
      {!isBlack && (
        <Text color="#000000" fontSize="$5" fontWeight="600" textAlign="center" width="100%">
          {note}
        </Text>
      )}
    </View>
  );
};

export interface PianoKeysProps {
  onKeyPress?: (note: string) => void;
  disabled?: boolean;
}

export const PianoKeys: React.FC<PianoKeysProps> = ({ onKeyPress, disabled }) => {
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
              <PianoKey
                note={key.note}
                height={screenHeight / 9}
                isBlack={true}
                width={screenWidth / 9}
                onPress={() => handleKeyPress(key.note)}
                disabled={disabled}
              />
            </XStack>
          ))}
        </XStack>

        <XStack flexDirection="row">
          {whiteKeys.map((note, index) => (
            <PianoKey
              width={screenWidth / 7}
              height={screenHeight / 5}
              key={note}
              note={note}
              onPress={() => handleKeyPress(note)}
              disabled={disabled}
            />
          ))}
        </XStack>
      </YStack>
    </>
  );
};

export default PianoKeys;
