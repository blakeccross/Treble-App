import { blue, green, purple, red, teal, yellow } from "@tamagui/themes";
import React, { useState } from "react";
import { View, Animated, Dimensions } from "react-native";

interface AnimationSquare {
  id: string;
  note: string;
  position: number;
  color: string;
  animation: Animated.Value;
}

interface KeyPressAnimationProps {
  onKeyPress?: (note: string) => void;
  children: React.ReactNode;
}

const KeyPressAnimation: React.FC<KeyPressAnimationProps> = ({ onKeyPress, children }) => {
  const [squares, setSquares] = useState<AnimationSquare[]>([]);
  const screenWidth = Dimensions.get("window").width;
  const whiteKeys = ["C", "D", "E", "F", "G", "A", "B"];
  const blackKeys = [
    { note: "C#", position: 0.5 },
    { note: "D#", position: 1.5 },
    { note: "F#", position: 3.5 },
    { note: "G#", position: 4.5 },
    { note: "A#", position: 5.5 },
  ];

  const colors = [
    red.red10, // Red
    blue.blue10, // Teal
    blue.blue10, // Blue
    green.green10, // Green
    yellow.yellow10, // Yellow
    purple.purple10, // Plum
    teal.teal10, // Mint
  ];

  const getKeyPosition = (note: string): number => {
    // Check if it's a white key
    const whiteKeyIndex = whiteKeys.indexOf(note);
    if (whiteKeyIndex !== -1) {
      return whiteKeyIndex;
    }

    // Check if it's a black key
    const blackKey = blackKeys.find((key) => key.note === note);
    if (blackKey) {
      return blackKey.position;
    }

    return 0; // Default position
  };

  const getKeyColor = (note: string): string => {
    const keyIndex = whiteKeys.indexOf(note);
    if (keyIndex !== -1) {
      return colors[keyIndex % colors.length];
    }

    const blackKeyIndex = blackKeys.findIndex((key) => key.note === note);
    if (blackKeyIndex !== -1) {
      return colors[(blackKeyIndex + 3) % colors.length]; // Offset for black keys
    }

    return colors[0]; // Default color
  };

  const handleKeyPress = (note: string) => {
    const position = getKeyPosition(note);
    const color = getKeyColor(note);
    const id = `${note}-${Date.now()}`;

    const newSquare: AnimationSquare = {
      id,
      note,
      position,
      color,
      animation: new Animated.Value(0),
    };

    setSquares((prev) => [...prev, newSquare]);

    // Animate the square
    Animated.timing(newSquare.animation, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start(() => {
      // Remove the square after animation completes
      setSquares((prev) => prev.filter((square) => square.id !== id));
    });

    // Call the original onKeyPress handler
    onKeyPress?.(note);
  };

  const getSquareStyle = (square: AnimationSquare) => {
    const translateY = square.animation.interpolate({
      inputRange: [0, 1],
      outputRange: [0, -200], // Move up 200 units
    });

    const opacity = square.animation.interpolate({
      inputRange: [0, 0.8, 1],
      outputRange: [1, 0.8, 0], // Fade out
    });

    const scale = square.animation.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [0.5, 1, 0.8], // Scale up then down slightly
    });

    return {
      transform: [{ translateY }, { scale }],
      zIndex: 1000,
      opacity,
    };
  };

  const getSquarePosition = (position: number) => {
    const keyWidth = screenWidth / 7;
    return position * keyWidth + keyWidth / 2 - 15; // Center the square on the key
  };

  return (
    <View>
      {/* Animated squares */}
      {squares.map((square) => (
        <Animated.View
          key={square.id}
          style={[
            {
              position: "absolute",
              left: getSquarePosition(square.position),
              bottom: 200, // Start above the piano keys
              width: 30,
              height: 30,
              backgroundColor: square.color,
              borderRadius: 6,
              shadowColor: square.color,
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.8,
              shadowRadius: 4,
              elevation: 8,
            },
            getSquareStyle(square),
          ]}
        />
      ))}

      {/* Render children with modified onKeyPress */}
      {React.isValidElement(children) ? React.cloneElement(children, { onKeyPress: handleKeyPress } as any) : children}
    </View>
  );
};

export default KeyPressAnimation;
