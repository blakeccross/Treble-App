import DoubleSharp from "@/assets/icons/doubleSharp";
import React, { useEffect, useState } from "react";
import { Dimensions, Image, Modal, Text as RNText, StyleSheet, TouchableOpacity, View, Linking } from "react-native";
import { useColorScheme } from "./useColorScheme";

// Add window dimensions
const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

// Hook that converts markdown text to React Native elements without dependencies
const useMarkdown = (markdownText: string) => {
  const colorScheme = useColorScheme() || "light";
  const [markdownElement, setMarkdownElement] = useState<JSX.Element | null>(null);
  // Add state for modal
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    if (markdownText) {
      // Pass setSelectedImage to parseMarkdown
      const parsedElements = parseMarkdown(markdownText, colorScheme, setSelectedImage);
      setMarkdownElement(
        <View>
          {parsedElements}
          <Modal visible={!!selectedImage} transparent={true} onRequestClose={() => setSelectedImage(null)}>
            <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setSelectedImage(null)}>
              <Image source={{ uri: selectedImage || "" }} style={styles.modalImage} resizeMode="contain" />
            </TouchableOpacity>
          </Modal>
        </View>
      );
    }
  }, [markdownText, colorScheme, selectedImage]);

  return markdownElement;
};

// Function to parse the markdown text and return corresponding React Native elements
const parseMarkdown = (text: string, colorScheme: "light" | "dark", setSelectedImage: (url: string) => void): JSX.Element[] => {
  const lines = text.split("\n");
  const elements: JSX.Element[] = [];

  let i = 0;
  while (i < lines.length) {
    const line = lines[i];

    if (line.startsWith("# ")) {
      elements.push(
        <RNText key={`h1-${i}`} style={{ ...styles.heading1, color: colorScheme === "light" ? "black" : "white" }}>
          {parseUnicodeSymbols(line.replace("# ", ""), colorScheme)}
        </RNText>
      );
    } else if (line.startsWith("## ")) {
      elements.push(
        <RNText key={`h2-${i}`} style={{ ...styles.heading2, color: colorScheme === "light" ? "black" : "white" }}>
          {parseUnicodeSymbols(line.replace("## ", ""), colorScheme)}
        </RNText>
      );
    } else if (line.startsWith("### ")) {
      elements.push(
        <RNText key={`h3-${i}`} style={{ ...styles.heading3, color: colorScheme === "light" ? "black" : "white" }}>
          {parseUnicodeSymbols(line.replace("### ", ""), colorScheme)}
        </RNText>
      );
    } else if (line.startsWith("|")) {
      // Handle table block
      const tableBlock = [];
      while (i < lines.length && lines[i].startsWith("|")) {
        tableBlock.push(lines[i]);
        i++;
      }
      elements.push(renderTable(tableBlock, elements.length, colorScheme));
      continue; // Skip increment to avoid missing lines
    } else if (line.startsWith("![")) {
      // Handle images
      elements.push(renderImage(line, i, setSelectedImage, colorScheme));
    } else {
      const formattedText = parseUnicodeSymbols(line, colorScheme);
      elements.push(
        <RNText style={{ ...styles.plainText, color: colorScheme === "light" ? "black" : "white" }} key={`text-${i}-${elements.length}`}>
          {formattedText}
        </RNText>
      );
    }
    i++;
  }

  return elements;
};

// Function to render a table from a block of markdown
const renderTable = (tableBlock: string[], key: number, colorScheme: "light" | "dark"): JSX.Element => {
  const rows = tableBlock.map((row, rowIndex) => {
    const cells = row.split("|").filter((cell) => cell.trim() !== "");

    if (rowIndex === 0) {
      return renderTableRow(cells, true, rowIndex, colorScheme); // Header row
    } else {
      return renderTableRow(cells, false, rowIndex, colorScheme); // Body rows
    }
  });

  return (
    <View key={key} style={styles.table}>
      {rows}
    </View>
  );
};

// Function to render a table row
const renderTableRow = (cells: string[], isHeader: boolean, index: number, colorScheme: "light" | "dark"): JSX.Element => {
  return (
    <View key={index} style={[styles.tableRow, isHeader && { backgroundColor: colorScheme === "light" ? "#f0f0f0" : "#333" }]}>
      {cells.map((cell, cellIndex) => (
        <View key={`${index}-cell-${cellIndex}`} style={[styles.tableCell]}>
          {parseUnicodeSymbols(cell, colorScheme)}
        </View>
      ))}
    </View>
  );
};

// Function to render images
const renderImage = (line: string, index: number, setSelectedImage: (url: string) => void, colorScheme: "light" | "dark"): JSX.Element => {
  const match = line.match(/!\[(.*?)\]\((.*?)\)/);
  if (match) {
    const altText = match[1];
    const imageUrl = match[2];
    return (
      <View key={index} style={styles.imageContainer}>
        <TouchableOpacity onPress={() => setSelectedImage(imageUrl)}>
          <Image source={{ uri: imageUrl }} style={styles.image} />
          <RNText style={{ ...styles.imageCaption, color: colorScheme === "light" ? "black" : "white" }}>{altText}</RNText>
        </TouchableOpacity>
      </View>
    );
  }
  return <View key={index} />;
};

// Main function to parse Unicode symbols and italic text
const parseUnicodeSymbols = (text: string, colorScheme: "light" | "dark"): JSX.Element[] => {
  const italicRegex = /(\*|_)(.*?)\1/g;
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  const elements: JSX.Element[] = [];
  let lastIndex = 0;
  let match;

  while ((match = linkRegex.exec(text)) !== null) {
    if (lastIndex < match.index) {
      const plainText = text.slice(lastIndex, match.index);
      elements.push(...parsePlainTextAndUnicode(plainText, `text-${elements.length}`, colorScheme));
    }

    const linkText = match[1];
    const url = match[2];
    elements.push(
      <TouchableOpacity key={`link-${elements.length}`} onPress={() => Linking.openURL(url)}>
        <RNText style={{ ...styles.link, color: colorScheme === "light" ? "#0066cc" : "#66b3ff" }}>{linkText}</RNText>
      </TouchableOpacity>
    );

    lastIndex = match.index + match[0].length;
  }

  // Then parse italics in remaining text
  const remainingText = text.slice(lastIndex);
  if (remainingText) {
    let italicLastIndex = 0;
    while ((match = italicRegex.exec(remainingText)) !== null) {
      if (italicLastIndex < match.index) {
        const plainText = remainingText.slice(italicLastIndex, match.index);
        elements.push(...parsePlainTextAndUnicode(plainText, `text-${elements.length}`, colorScheme));
      }

      elements.push(
        <RNText
          key={`italic-${elements.length}`}
          style={{ ...styles.plainText, fontStyle: "italic", color: colorScheme === "light" ? "black" : "white" }}
        >
          {parseUnicodeSymbols(match[2], colorScheme)}
        </RNText>
      );

      italicLastIndex = match.index + match[0].length;
    }

    if (italicLastIndex < remainingText.length) {
      const finalText = remainingText.slice(italicLastIndex);
      elements.push(...parsePlainTextAndUnicode(finalText, `remaining-${elements.length}`, colorScheme));
    }
  }

  return elements;
};

// Helper function to handle plain text and Unicode symbols
const parsePlainTextAndUnicode = (text: string, keyPrefix: string, colorScheme: "light" | "dark"): JSX.Element[] => {
  const unicodeRegex = /&#x([0-9A-Fa-f]+);/g;
  const parts = text.split(unicodeRegex);
  const elements: JSX.Element[] = [];

  parts.forEach((part, index) => {
    if (index % 2 === 0) {
      if (part.trim()) {
        elements.push(
          <RNText style={{ color: colorScheme === "light" ? "black" : "white" }} key={`${keyPrefix}-text-${index}`}>
            {part}
          </RNText>
        );
      }
    } else {
      const unicode = parseInt(parts[index], 16);
      const svgPath = getSvgPathForUnicode(unicode, colorScheme);
      elements.push(
        <RNText key={`${keyPrefix}-unicode-${index}`} style={{ color: colorScheme === "light" ? "black" : "white" }}>
          {svgPath}
        </RNText>
      );
    }
  });

  return elements;
};

// Function to map Unicode symbols to their corresponding SVG paths
const getSvgPathForUnicode = (unicode: number, colorScheme: "light" | "dark"): JSX.Element => {
  const fill = colorScheme === "dark" ? "white" : "black";

  // Log to see if the colorScheme is updated

  switch (unicode) {
    // case 0x1d15d:
    //   return <WholeNote width={15} height={15} fill={fill} />;
    // case 0x266e:
    //   return <Natural width={15} height={25} fill={fill} />;
    // case 0x1d15c:
    //   return <Breve width={20} height={25} fill={fill} />;
    // case 0x1d15e:
    //   return <HalfNote width={15} height={40} fill={fill} />;
    // case 0x1d15f:
    //   return <QuarterNote width={15} height={40} fill={fill} />;
    // case 0x1d160:
    //   return <EighthNote width={20} height={40} fill={fill} />;
    // case 0x1d161:
    //   return <SixteenthNote width={20} height={40} fill={fill} />;
    // case 0x266f:
    //   return <Sharp width={15} height={20} fill={fill} />;
    // case 0x266d:
    //   return <Flat width={15} height={20} fill={fill} />;
    case 0x1d12a:
      return <DoubleSharp width={15} height={20} fill={fill} />;
    // case 0x1d12b:
    //   return <DoubleFlat width={15} height={20} fill={fill} />;
    // case 0x1d162:
    //   return <ThirtySecond width={25} height={40} fill={fill} />;
    // case 0x1d163:
    //   return <SixtySecondNote width={25} height={45} fill={fill} />;
    default:
      return <RNText style={{ fontFamily: "BravuraText", fontSize: 40, color: fill }}>{String.fromCodePoint(unicode)}</RNText>;
  }
};

// Basic styles for markdown elements
const styles = StyleSheet.create({
  bold: { fontWeight: "bold" },
  italic: { fontStyle: "italic" },
  table: { marginVertical: 8, borderWidth: 1, borderColor: "#ddd" },
  tableRow: { flexDirection: "row" },
  tableHeader: { backgroundColor: "#f0f0f0" },
  tableCell: { flex: 1, padding: 5, borderWidth: 1, borderColor: "#ddd" },
  tableHeaderCell: { fontWeight: "bold", color: "black" },
  imageContainer: { marginVertical: 10, alignItems: "center" },
  image: { width: 200, height: 200, resizeMode: "contain" },
  imageCaption: { marginTop: 5, fontStyle: "italic", fontSize: 12, textAlign: "center" },
  plainText: { fontStyle: "normal", lineHeight: 28, fontSize: 20 },
  heading1: { fontWeight: "bold", fontSize: 40, marginBottom: 10 },
  heading2: { fontWeight: 800, fontSize: 30 },
  heading3: { fontWeight: 800, fontSize: 25 },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalImage: {
    width: windowWidth * 0.9,
    height: windowHeight * 0.7,
  },
  link: {
    textDecorationLine: "underline",
    fontSize: 20,
    lineHeight: 28,
  },
});

export default useMarkdown;
