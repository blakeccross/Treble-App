import { GetProps, styled } from "@tamagui/core";
import { blackA, whiteA } from "@tamagui/themes";
import { Button as ButtonTam } from "tamagui";

export const Button = styled(ButtonTam, {
  name: "StyledButton", // useful for debugging, and Component themes
  fontWeight: 600,
  fontSize: "$7",
  height: "$5",

  variants: {
    white: {
      true: {
        backgroundColor: whiteA.whiteA12,
        color: blackA.blackA12,
        elevate: true,
        pressStyle: { backgroundColor: blackA.blackA1 },
      },
    },
  },
});

// helper to get props for any TamaguiComponent
export type ButtonProps = GetProps<typeof ButtonTam>;
