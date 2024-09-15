import * as React from "react";
import Svg, { Path, SvgProps } from "react-native-svg";

function WholeNote(props: SvgProps) {
  return (
    <Svg data-name="Layer 2" viewBox="0 0 25.748 19.043" {...props}>
      <Path
        d="M12.848 0C5.296 0 0 4.298 0 9.554c0 5.259 5.302 9.489 12.848 9.489s12.9-4.334 12.9-9.592S20.393 0 12.848 0zm.024 17.366c-4.083 0-7.391-3.381-7.391-7.553 0-3.671 2.564-6.73 5.961-7.407a4.629 4.629 0 011.406-.226c.471 0 .925.077 1.36.21 3.442.644 6.056 3.719 6.056 7.422 0 4.174-3.308 7.554-7.392 7.554z"
        data-name="Layer 1"
      />
    </Svg>
  );
}

export default WholeNote;
