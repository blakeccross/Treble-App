import * as React from "react";
import Svg, { Path, SvgProps } from "react-native-svg";

function QuarterNote(props: SvgProps) {
  return (
    <Svg id="Layer_2" data-name="Layer 2" viewBox="0 0 11.1278 41.9644" {...props}>
      <Path
        d="M11.128.623c-.018-.152-.057-.3-.157-.414-.066-.075-.157-.123-.246-.17a.839.839 0 00-.297-.036.638.638 0 00-.478.33c-.063.12-.056.16-.072.29v32.794c-1.481-1.436-4.018-1.804-6.334-.72C.683 34.037-.734 37.057.38 39.44c1.114 2.382 4.342 3.23 7.203 1.89 2.162-1.012 3.497-2.985 3.54-4.916 0-.005.003-.009.004-.014V.623z"
        id="Layer_1-2"
        data-name="Layer 1"
        fillRule="evenodd"
      />
    </Svg>
  );
}

export default QuarterNote;
