import TrebleLogo from "@/assets/trebleLogo";
import { BlurView } from "expo-blur";
import LottieView from "lottie-react-native";
import React from "react";
import {
  ActivityIndicator,
  Linking,
  Modal,
  ScrollView,
  StyleSheet,
  View as RNView,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import {
  Button,
  Check,
  Gamepad,
  H2,
  H4,
  Heart,
  LinearGradient,
  ListItem,
  Paragraph,
  SizableText,
  Star,
  View,
  X,
  XStack,
  YStack,
} from "@/ui";
import { isSmallScreen } from "@/utils";

const OFFER_GRADIENT = ["#EEF2F7", "#E4ECF8", "#D8E4FA"] as const;
const SUCCESS_GRADIENT = ["#007AFF", "#0A66D9"] as const;

function FeatureCard() {
  return (
    <BlurView intensity={56} tint="light" style={styles.featureBlur}>
      <ListItem
        backgroundColor="transparent"
        color="$color"
        icon={Heart}
        title="Unlimited hearts"
        subTitle={
          <Paragraph fontSize="$3" color="$gray11">
            Keep learning without waiting on lives
          </Paragraph>
        }
      />
      <ListItem
        backgroundColor="transparent"
        color="$color"
        icon={Star}
        title="Every module"
        subTitle={
          <Paragraph fontSize="$3" color="$gray11">
            Go beyond the basics at your own pace
          </Paragraph>
        }
      />
      <ListItem
        backgroundColor="transparent"
        color="$color"
        icon={Gamepad}
        title="Full ear training"
        subTitle={
          <Paragraph fontSize="$3" color="$gray11">
            Games and drills to train your ear
          </Paragraph>
        }
      />
    </BlurView>
  );
}

type PaywallOfferBodyProps = {
  isLoading: boolean;
  onSubscribe: () => void;
  onClose?: () => void;
  showCloseButton?: boolean;
};

export function PaywallOfferBody({
  isLoading,
  onSubscribe,
  onClose,
  showCloseButton,
}: PaywallOfferBodyProps) {
  const insets = useSafeAreaInsets();

  if (isLoading) {
    return (
      <View flex={1} justifyContent="center" alignItems="center">
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <View flex={1} paddingHorizontal="$5" paddingTop={showCloseButton ? "$2" : 0} justifyContent="space-between">
      {showCloseButton && onClose ? (
        <View
          position="absolute"
          top={insets.top + 8}
          right={20}
          zIndex={10}
        >
          <Button
            circular
            size="$2"
            backgroundColor="rgba(255,255,255,0.85)"
            borderWidth={StyleSheet.hairlineWidth * 2}
            borderColor="rgba(60,60,67,0.12)"
            pressStyle={{ scale: 0.96, backgroundColor: "$gray3" }}
            onPress={onClose}
          >
            <X size="$1" color="$color" />
          </Button>
        </View>
      ) : null}

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 24 }}>
        <View alignItems="center" marginTop={showCloseButton ? "$6" : "$2"}>
          <LottieView
            autoPlay
            loop={false}
            style={{
              width: isSmallScreen ? "100%" : "58%",
              aspectRatio: 2.5 / 2,
            }}
            source={require("@/assets/lottie/gopro.json")}
          />
        </View>

        <XStack gap="$3" justifyContent="center" alignItems="center" marginTop="$4">
          <TrebleLogo width={96} height={48} />
          <LinearGradient
            colors={["#007AFF", "#005FCC"]}
            start={[0, 0.5]}
            end={[1, 0.5]}
            paddingHorizontal="$3"
            paddingVertical="$2"
            borderRadius="$10"
          >
            <SizableText color="$backgroundStrong" fontSize="$2" fontFamily="InterBold">
              Pro
            </SizableText>
          </LinearGradient>
        </XStack>

        <H4 marginTop="$5" marginBottom="$4" color="$color" fontWeight="normal" textAlign="center">
          Unlock your full learning path
        </H4>

        <FeatureCard />
      </ScrollView>

      <YStack gap="$3" paddingBottom={insets.bottom + 8}>
        <Button
          height="$5"
          borderRadius="$6"
          onPress={onSubscribe}
          elevate
        >
          <YStack alignItems="center" gap="$1">
            <SizableText color="white" fontFamily="InterBold" fontSize="$6">
              Try free · then $3.99/mo
            </SizableText>
            <Paragraph
              color="rgba(255,255,255,0.9)"
              fontSize="$2"
              style={{ marginBottom: 0 }}
            >
              3-day trial, cancel anytime
            </Paragraph>
          </YStack>
        </Button>

        <XStack justifyContent="center" alignItems="center" gap="$5">
          <Paragraph
            fontSize="$2"
            color="$gray11"
            onPress={() =>
              Linking.openURL("https://treblemusictheory.vercel.app/privacy-policy")
            }
            style={{ textDecorationLine: "underline" }}
          >
            Privacy
          </Paragraph>
          <Paragraph
            fontSize="$2"
            color="$gray11"
            onPress={() =>
              Linking.openURL("https://treblemusictheory.vercel.app/terms")
            }
            style={{ textDecorationLine: "underline" }}
          >
            Terms
          </Paragraph>
        </XStack>
      </YStack>
    </View>
  );
}

type PaywallSuccessBodyProps = {
  onContinue: () => void;
};

export function PaywallSuccessBody({ onContinue }: PaywallSuccessBodyProps) {
  const insets = useSafeAreaInsets();

  return (
    <LinearGradient
      flex={1}
      width="100%"
      colors={[...SUCCESS_GRADIENT]}
      start={[0.2, 0]}
      end={[1, 1]}
      paddingHorizontal="$5"
      paddingTop={insets.top + 24}
      paddingBottom={insets.bottom + 16}
    >
      <YStack alignItems="center" justifyContent="center" flex={1} gap="$4">
        <XStack gap="$2" alignItems="center">
          <Paragraph color="white" fontFamily="InterBold">
            Success
          </Paragraph>
          <Check color="white" size="$1" />
        </XStack>
        <H2 color="white" textAlign="center" fontWeight="normal">
          Welcome to Treble Pro
        </H2>
        <View maxWidth={320} alignSelf="center">
          <Paragraph textAlign="center" color="rgba(255,255,255,0.9)">
            Everything is unlocked. Enjoy the full library and ear training.
          </Paragraph>
        </View>
      </YStack>
      <Button
        white
        height="$5"
        borderRadius="$6"
        onPress={onContinue}
        color="#111111"
      >
        Continue
      </Button>
    </LinearGradient>
  );
}

type PaywallShellProps = {
  isSubscribed: boolean;
  isLoading: boolean;
  onSubscribe: () => void;
  onContinueSuccess: () => void;
  onClose?: () => void;
  showCloseButton?: boolean;
  /** When set, wraps offer + success in a Modal (home Paywall modal) */
  modalPresented?: boolean;
  modalVisible?: boolean;
  onModalRequestClose?: () => void;
};

/**
 * Shared paywall UI for root route, sign-up flow, and optional Modal presentation.
 */
export function PaywallShell({
  isSubscribed,
  isLoading,
  onSubscribe,
  onContinueSuccess,
  onClose,
  showCloseButton = true,
  modalPresented,
  modalVisible,
  onModalRequestClose,
}: PaywallShellProps) {
  const inner =
    isSubscribed ? (
      <PaywallSuccessBody onContinue={onContinueSuccess} />
    ) : (
      <LinearGradient flex={1} width="100%" colors={[...OFFER_GRADIENT]} start={[0.5, 0]} end={[0.5, 1]}>
        <SafeAreaView edges={["top"]} style={{ backgroundColor: "transparent" }} />
        <PaywallOfferBody
          isLoading={isLoading}
          onSubscribe={onSubscribe}
          onClose={onClose}
          showCloseButton={showCloseButton}
        />
      </LinearGradient>
    );

  if (modalPresented) {
    return (
      <Modal
        animationType="slide"
        presentationStyle="pageSheet"
        visible={!!modalVisible}
        onRequestClose={onModalRequestClose}
      >
        <RNView style={{ flex: 1 }}>{inner}</RNView>
      </Modal>
    );
  }

  return inner;
}

const styles = StyleSheet.create({
  featureBlur: {
    borderRadius: 22,
    overflow: "hidden",
    borderWidth: StyleSheet.hairlineWidth * 2,
    borderColor: "rgba(60, 60, 67, 0.10)",
    paddingVertical: 8,
  },
});
