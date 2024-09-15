import * as React from "react";
import Svg, { Path, SvgProps } from "react-native-svg";

export default function Flat(props: SvgProps) {
  return (
    <Svg data-name="Layer 2" viewBox="0 0 38.1367 98.75" {...props}>
      <Path
        d="M6.128 57.202L6.126 0H0c0 32.51.005 66.241.005 98.75 4.819-2.662 10.279-7.855 17.057-12.246 8.402-5.439 19.966-10.391 20.993-20.555 1.701-16.81-23.621-15.567-31.927-8.747zm0 31.053V64.2c3.736-7.363 16.521-7.342 17.494.875 1.239 10.471-12.712 18.02-17.494 23.18z"
        data-name="Layer 1"
      />
    </Svg>
  );
}
