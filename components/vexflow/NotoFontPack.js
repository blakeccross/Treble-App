import opentype from "opentype.js";
import { decode } from "base64-arraybuffer";

import NotoSansRegular from "./fonts/NotoSans-Regular.ttf.js";
import NotoSansItalic from "./fonts/NotoSans-Italic.ttf.js";
import NotoSansBold from "./fonts/NotoSans-Bold.ttf.js";
import NotoSansBoldItalic from "./fonts/NotoSans-BoldItalic.ttf.js";
import NotoSerifRegular from "./fonts/NotoSerif-Regular.ttf.js";
import NotoSerifItalic from "./fonts/NotoSerif-Italic.ttf.js";
import NotoSerifBold from "./fonts/NotoSerif-Bold.ttf.js";
import NotoSerifBoldItalic from "./fonts/NotoSerif-BoldItalic.ttf.js";

const loadFont = (base64Font) => opentype.parse(decode(base64Font));

const fonts = {
  NotoSans: {
    regular: loadFont(NotoSansRegular),
    italic: loadFont(NotoSansItalic),
    bold: loadFont(NotoSansBold),
    bolditalic: loadFont(NotoSansBoldItalic),
  },
  NotoSerif: {
    regular: loadFont(NotoSerifRegular),
    italic: loadFont(NotoSerifItalic),
    bold: loadFont(NotoSerifBold),
    bolditalic: loadFont(NotoSerifBoldItalic),
  },
};

const NotoFontPack = {
  ...fonts,
  getFont: (style) => {
    const fontName = /(times|serif)+/i.test(style["font-family"]) ? "NotoSerif" : "NotoSans";
    const weight = style["font-weight"] === "bold" ? "bold" : "";
    const italic = style["font-style"] === "italic" ? "italic" : "";
    const fontStyle = weight + italic || "regular";

    return fonts[fontName][fontStyle];
  },
};

export default NotoFontPack;
