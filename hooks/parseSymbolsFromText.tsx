import DoubleFlat from "@/assets/icons/doubleFlat";
import DoubleSharp from "@/assets/icons/doubleSharp";
import EighthNote from "@/assets/icons/eighthNote";
import Flat from "@/assets/icons/flat";
import HalfNote from "@/assets/icons/halfNote";
import QuarterNote from "@/assets/icons/quarterNote";
import Sharp from "@/assets/icons/sharp";
import SixteenthNote from "@/assets/icons/sixteenthNote";
import WholeNote from "@/assets/icons/wholeNote";
import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, Image } from "react-native";
import { H1, H2, H3, Paragraph } from "tamagui";

// Hook that converts markdown text to React Native elements without dependencies
const useMarkdown = (markdownText: string) => {
  const [markdownElement, setMarkdownElement] = useState<JSX.Element | null>(null);

  useEffect(() => {
    if (markdownText) {
      // Parse the markdown text and create React Native elements
      const parsedElements = parseMarkdown(markdownText);
      setMarkdownElement(<View>{parsedElements}</View>);
    }
  }, [markdownText]);

  return markdownElement;
};

// Function to parse the markdown text and return corresponding React Native elements
const parseMarkdown = (text: string): JSX.Element[] => {
  const lines = text.split("\n");
  const elements: JSX.Element[] = [];

  let i = 0;
  while (i < lines.length) {
    const line = lines[i];

    if (line.startsWith("# ")) {
      elements.push(
        <H1 key={i} fontWeight={600}>
          {parseUnicodeSymbols(line.replace("# ", ""))}
        </H1>
      );
    } else if (line.startsWith("## ")) {
      elements.push(
        <H2 key={i} fontWeight={600}>
          {parseUnicodeSymbols(line.replace("## ", ""))}
        </H2>
      );
    } else if (line.startsWith("### ")) {
      elements.push(
        <H3 key={i} fontWeight={600}>
          {parseUnicodeSymbols(line.replace("### ", ""))}
        </H3>
      );
    } else if (line.startsWith("|")) {
      // Handle table block
      const tableBlock = [];
      while (i < lines.length && lines[i].startsWith("|")) {
        tableBlock.push(lines[i]);
        i++;
      }
      elements.push(renderTable(tableBlock, elements.length));
      continue; // Skip increment to avoid missing lines
    } else if (line.startsWith("![")) {
      // Handle images
      elements.push(renderImage(line, i));
    } else {
      const formattedText = parseUnicodeSymbols(line);
      elements.push(
        <Text style={{ fontSize: 20, lineHeight: 27 }} key={i}>
          {formattedText}
        </Text>
      );
    }
    i++;
  }

  return elements;
};

// Function to render a table from a block of markdown
const renderTable = (tableBlock: string[], key: number): JSX.Element => {
  const rows = tableBlock.map((row, rowIndex) => {
    const cells = row.split("|").filter((cell) => cell.trim() !== "");

    if (rowIndex === 0) {
      return renderTableRow(cells, true, rowIndex); // Header row
    } else {
      return renderTableRow(cells, false, rowIndex); // Body rows
    }
  });

  return (
    <View key={key} style={styles.table}>
      {rows}
    </View>
  );
};

// Function to render a table row
const renderTableRow = (cells: string[], isHeader: boolean, index: number): JSX.Element => {
  return (
    <View key={index} style={[styles.tableRow, isHeader && styles.tableHeader]}>
      {cells.map((cell, cellIndex) => (
        <View key={cellIndex} style={[styles.tableCell, isHeader && styles.tableHeaderCell]}>
          {parseUnicodeSymbols(cell)}
        </View>
      ))}
    </View>
  );
};

// Function to render images
const renderImage = (line: string, index: number): JSX.Element => {
  const match = line.match(/!\[(.*?)\]\((.*?)\)/);
  if (match) {
    const altText = match[1];
    const imageUrl = match[2];
    return (
      <View key={index} style={styles.imageContainer}>
        <Image source={{ uri: imageUrl }} style={styles.image} />
        <Text style={styles.imageCaption}>{altText}</Text>
      </View>
    );
  }
  return <View key={index} />;
};

// Main function to parse Unicode symbols and italic text
const parseUnicodeSymbols = (text: string): JSX.Element[] => {
  const italicRegex = /(\*|_)(.*?)\1/g;
  const elements: JSX.Element[] = [];
  let lastIndex = 0;
  let match;

  while ((match = italicRegex.exec(text)) !== null) {
    if (lastIndex < match.index) {
      const plainText = text.slice(lastIndex, match.index);
      elements.push(...parsePlainTextAndUnicode(plainText, `text-${elements.length}`));
    }

    elements.push(<Text style={{ fontStyle: "italic" }}>{parseUnicodeSymbols(match[2])}</Text>);

    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    const remainingText = text.slice(lastIndex);
    elements.push(...parsePlainTextAndUnicode(remainingText, `remaining-${elements.length}`));
  }

  return elements;
};

// Helper function to handle plain text and Unicode symbols
const parsePlainTextAndUnicode = (text: string, keyPrefix: string): JSX.Element[] => {
  const unicodeRegex = /&#x([0-9A-Fa-f]+);/g;
  const parts = text.split(unicodeRegex);
  const elements: JSX.Element[] = [];

  parts.forEach((part, index) => {
    if (index % 2 === 0) {
      if (part.trim()) {
        elements.push(<Text>{part}</Text>);
      }
    } else {
      const unicode = parseInt(parts[index], 16);
      const svgPath = getSvgPathForUnicode(unicode);
      elements.push(<React.Fragment key={`${keyPrefix}-unicode-${index}`}>{svgPath}</React.Fragment>);
    }
  });

  return elements;
};

// Function to map Unicode symbols to their corresponding SVG paths
const getSvgPathForUnicode = (unicode: number): JSX.Element => {
  const paths: { [key: number]: JSX.Element } = {
    0x1d15d: <WholeNote width={15} height={15} />,
    0x1d15e: <HalfNote width={15} height={40} />,
    0x1d15f: <QuarterNote width={15} height={40} />,
    0x1d160: <EighthNote width={20} height={40} />,
    0x1d161: <SixteenthNote width={20} height={40} />,
    0x266f: <Sharp width={15} height={20} />,
    0x266d: <Flat width={15} height={20} />,
    0x1d12a: <DoubleSharp width={15} height={20} />,
    0x1d12b: <DoubleFlat width={15} height={20} />,
  };

  return paths[unicode] || <></>;
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
  imageCaption: { marginTop: 5, fontStyle: "italic", fontSize: 12 },
  plainText: { fontStyle: "normal" },
});

export default useMarkdown;
