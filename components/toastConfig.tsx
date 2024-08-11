import { View } from "react-native";
import { BaseToast, ErrorToast, ToastConfig, ToastConfigParams } from "react-native-toast-message";

export const toastConfig = {
  /*
      Overwrite 'success' type,
      by modifying the existing `BaseToast` component
    */
  success: (props: ToastConfigParams<any>) => (
    <BaseToast
      {...props}
      style={{ borderLeftWidth: 0, borderRadius: 50, flex: 0, width: "auto" }}
      contentContainerStyle={{ paddingHorizontal: 15, flex: 0 }}
      text1Style={{
        fontSize: 15,
        fontWeight: "400",
        textAlign: "center",
      }}
    />
  ),
};
