import { useAppTheme } from "@/theme/ThemeContext";
import React from "react";
import { Modal, Pressable, StyleSheet, View as RNView } from "react-native";
import { resolveColor, type TokenValue } from "./resolveToken";
import { View, type ViewProps } from "./View";

type SheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
  snapPointsMode?: "fit" | "percent";
  dismissOnOverlayPress?: boolean;
  zIndex?: number;
  transition?: string;
  modal?: boolean;
};

function SheetRoot({ open, onOpenChange, children, dismissOnOverlayPress = true }: SheetProps) {
  return (
    <Modal visible={open} transparent animationType="slide" onRequestClose={() => onOpenChange(false)}>
      <RNView style={styles.container}>
        {React.Children.map(children, (child) => {
          if (!React.isValidElement(child)) return child;
          if (child.type === SheetOverlay) {
            return React.cloneElement(child as React.ReactElement<{ onPress?: () => void }>, {
              onPress: dismissOnOverlayPress ? () => onOpenChange(false) : undefined,
            });
          }
          return child;
        })}
      </RNView>
    </Modal>
  );
}

function SheetOverlay({
  backgroundColor = "$shadowColor",
  onPress,
}: {
  backgroundColor?: TokenValue;
  onPress?: () => void;
  transition?: string;
  enterStyle?: object;
  exitStyle?: object;
}) {
  const { tokens, name } = useAppTheme();
  const bg = resolveColor(backgroundColor, tokens, name) ?? "rgba(0,0,0,0.4)";
  return <Pressable style={[StyleSheet.absoluteFillObject, { backgroundColor: bg }]} onPress={onPress} />;
}

function SheetFrame(props: ViewProps) {
  return (
    <View
      position="absolute"
      bottom={0}
      left={0}
      right={0}
      borderTopLeftRadius="$10"
      borderTopRightRadius="$10"
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-end",
  },
});

export const Sheet = Object.assign(SheetRoot, {
  Overlay: SheetOverlay,
  Frame: SheetFrame,
});
