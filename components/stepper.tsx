// components/VerticalStepper.js
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import StepIndicator from "react-native-step-indicator";

const labels = ["Cart", "Delivery Address", "Order Summary", "Payment Method", "Track"];
const customStyles = {
  stepIndicatorSize: 25,
  currentStepIndicatorSize: 30,
  separatorStrokeWidth: 2,
  currentStepStrokeWidth: 3,
  stepStrokeCurrentColor: "#fe7013",
  stepStrokeWidth: 3,
  stepStrokeFinishedColor: "#fe7013",
  stepStrokeUnFinishedColor: "#aaaaaa",
  separatorFinishedColor: "#fe7013",
  separatorUnFinishedColor: "#aaaaaa",
  stepIndicatorFinishedColor: "#fe7013",
  stepIndicatorUnFinishedColor: "#ffffff",
  stepIndicatorCurrentColor: "#ffffff",
  stepIndicatorLabelFontSize: 13,
  currentStepIndicatorLabelFontSize: 13,
  stepIndicatorLabelCurrentColor: "#fe7013",
  stepIndicatorLabelFinishedColor: "#ffffff",
  stepIndicatorLabelUnFinishedColor: "#aaaaaa",
  labelColor: "#999999",
  labelSize: 13,
  currentStepLabelColor: "#fe7013",
};

const VerticalStepper = ({ activeStep }: any) => {
  return <StepIndicator customStyles={customStyles} currentPosition={0} labels={labels} direction="vertical" />;
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    alignItems: "flex-start",
  },
  stepContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  step: {
    alignItems: "center",
    marginRight: 10,
  },
  circle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
  },
  activeCircle: {
    backgroundColor: "#FF5722",
    borderColor: "#FF5722",
  },
  inactiveCircle: {
    backgroundColor: "#FFFFFF",
    borderColor: "#BDBDBD",
  },
  stepLabel: {
    fontSize: 16,
  },
  activeStepLabel: {
    color: "#FFFFFF",
  },
  inactiveStepLabel: {
    color: "#BDBDBD",
  },
  line: {
    width: 2,
    height: 30,
    backgroundColor: "#BDBDBD",
    marginTop: 5,
  },
  activeLine: {
    backgroundColor: "#FF5722",
  },
  inactiveLine: {
    backgroundColor: "#BDBDBD",
  },
  stepText: {
    fontSize: 16,
  },
  activeStepText: {
    color: "#FF5722",
  },
  inactiveStepText: {
    color: "#BDBDBD",
  },
});

export default VerticalStepper;
