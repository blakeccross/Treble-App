import * as React from "react";
import Svg, { Path, SvgProps } from "react-native-svg";

export default function Sharp(props: SvgProps) {
  return (
    <Svg data-name="Layer 2" viewBox="0 0 23.21 34.249" {...props}>
      <Path
        d="M7.658 1.035v7.824l7.316-1.477V0h2.088v7.087l5.918-1.183V9.89l-5.918 1.034v9.004l6.148-1.329v3.986l-6.148 1.329v8.563h-2.088v-8.12l-7.316 1.329v8.563H5.569v-8.118L0 27.016v-4.134l5.569-.887v-9.15L0 13.878v-3.839l5.569-.886V1.034l2.089.001zm0 20.668l7.316-1.328v-9.152l-7.316 1.476v9.004z"
        data-name="Layer 1"
      />
    </Svg>
  );
}
