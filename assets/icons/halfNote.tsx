import * as React from "react";
import Svg, { Path, SvgProps } from "react-native-svg";

function HalfNote(props: SvgProps) {
  return (
    <Svg data-name="Layer 2" viewBox="0 0 31.3642 99.0464" {...props}>
      <Path
        d="M31.364 1.5c0-.8-.7-1.5-1.5-1.5s-1.5.7-1.5 1.5v73.6c-4.2-4-12-4.3-18.9-.3-7.9 4.6-11.6 13.1-8.2 19 3.4 5.9 12.6 7 20.5 2.4 5.9-3.4 9.4-8.9 9.4-14V1.5h.2zm-12.9 88.6c-6.5 3.8-13 4.7-14.5 2.2-1.5-2.6 2.6-7.7 9.1-11.5s13-4.7 14.5-2.2-2.6 7.7-9.1 11.5z"
        data-name="Layer 1"
      />
    </Svg>
  );
}

export default HalfNote;
