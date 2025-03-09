import React, { ReactElement, forwardRef, useImperativeHandle, useState } from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import { useSharedValue, runOnUI, runOnJS } from "react-native-reanimated";
import SortableWord from "./sortable";
import Lines from "./lines";
import { MARGIN_LEFT } from "./layout";

const containerWidth = Dimensions.get("window").width - MARGIN_LEFT * 2;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: MARGIN_LEFT,
    height: 300,
  },
  row: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    opacity: 0,
  },
});

interface WordListProps {
  children: ReactElement<{ id: number }>[];
}

const WordList = forwardRef(({ children }: WordListProps, ref) => {
  const [ready, setReady] = useState(false);
  const offsets = children.map(() => ({
    order: useSharedValue(0),
    width: useSharedValue(0),
    height: useSharedValue(0),
    x: useSharedValue(0),
    y: useSharedValue(0),
    originalX: useSharedValue(0),
    originalY: useSharedValue(0),
  }));

  useImperativeHandle(ref, () => ({
    validate,
  }));

  function validate() {
    const currentOrder = offsets.map((offset, index) => ({
      id: children[index].props.id,
      order: offset.order.value,
    }));
    currentOrder.sort((a, b) => a.order - b.order);
    const isCorrect = checkSorted(currentOrder.map((item) => item.id));

    return isCorrect;
  }

  function checkSorted(arr: number[]) {
    for (let i = 0; i < arr.length - 1; i++) {
      if (arr[i] > arr[i + 1]) {
        return false;
      }
    }
    return true;
  }

  if (!ready) {
    return (
      <View style={styles.row}>
        {children.map((child, index) => (
          <View
            onLayout={({
              nativeEvent: {
                layout: { x, y, width, height },
              },
            }) => {
              const offset = offsets[index]!;
              offset.order.value = -1;
              offset.width.value = width;
              offset.height.value = height;
              offset.originalX.value = x;
              offset.originalY.value = y;
              runOnUI(() => {
                "worklet";
                if (offsets.filter((o) => o.order.value !== -1).length === 0) {
                  runOnJS(setReady)(true);
                }
              })();
            }}
          >
            {child}
          </View>
        ))}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Lines />
      {children.map((child, index) => (
        <SortableWord key={index} offsets={offsets} index={index} containerWidth={containerWidth}>
          {child}
        </SortableWord>
      ))}
    </View>
  );
});

// Set the display name for the component
WordList.displayName = "WordList";

export default WordList;
