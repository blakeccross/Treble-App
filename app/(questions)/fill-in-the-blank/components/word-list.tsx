import React, { ReactElement, forwardRef, useEffect, useImperativeHandle, useState, useMemo, useRef } from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import { useSharedValue, runOnUI, runOnJS, SharedValue } from "react-native-reanimated";
import SortableWord from "./sortable";
import Lines from "./lines";
import { MARGIN_LEFT } from "./layout";
import { Button } from "tamagui";

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

const WordOffset = ({
  children,
  onInit,
}: {
  children: ReactElement<{ id: number }>;
  onInit: (values: {
    order: SharedValue<number>;
    width: SharedValue<number>;
    height: SharedValue<number>;
    x: SharedValue<number>;
    y: SharedValue<number>;
    originalX: SharedValue<number>;
    originalY: SharedValue<number>;
  }) => void;
}) => {
  const order = useSharedValue(0);
  const width = useSharedValue(0);
  const height = useSharedValue(0);
  const x = useSharedValue(0);
  const y = useSharedValue(0);
  const originalX = useSharedValue(0);
  const originalY = useSharedValue(0);

  useEffect(() => {
    onInit({ order, width, height, x, y, originalX, originalY });
  }, []);

  return children;
};

const WordList = forwardRef(({ children }: WordListProps, ref) => {
  const [ready, setReady] = useState(false);
  const offsetsRef = useRef<
    Array<{
      order: SharedValue<number>;
      width: SharedValue<number>;
      height: SharedValue<number>;
      x: SharedValue<number>;
      y: SharedValue<number>;
      originalX: SharedValue<number>;
      originalY: SharedValue<number>;
    }>
  >([]);

  useEffect(() => {
    offsetsRef.current = new Array(children.length);
  }, [children.length]);

  const handleInit = (index: number, values: (typeof offsetsRef.current)[0]) => {
    offsetsRef.current[index] = values;
  };

  useImperativeHandle(ref, () => ({
    validate,
  }));

  function validate() {
    const currentOrder = offsetsRef.current.map((offset, index) => ({
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
          <WordOffset key={index} onInit={(values) => handleInit(index, values)}>
            <View
              onLayout={({
                nativeEvent: {
                  layout: { x, y, width, height },
                },
              }) => {
                const offset = offsetsRef.current[index]!;
                offset.order.value = -1;
                offset.width.value = width;
                offset.height.value = height;
                offset.originalX.value = x;
                offset.originalY.value = y;
                runOnUI(() => {
                  "worklet";
                  if (offsetsRef.current.filter((o) => o.order.value !== -1).length === 0) {
                    runOnJS(setReady)(true);
                  }
                })();
              }}
            >
              {child}
            </View>
          </WordOffset>
        ))}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Lines />
      {children.map((child, index) => (
        <WordOffset key={index} onInit={(values) => handleInit(index, values)}>
          <SortableWord offsets={offsetsRef.current} index={index} containerWidth={containerWidth}>
            {child}
          </SortableWord>
        </WordOffset>
      ))}
    </View>
  );
});

// Set the display name for the component
WordList.displayName = "WordList";

export default WordList;
