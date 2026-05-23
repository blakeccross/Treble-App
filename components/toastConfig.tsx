import { View } from "react-native";
import { BaseToast, ErrorToast, ToastConfig, ToastConfigParams } from "react-native-toast-message";

export const toastConfig = {
  /*
      Overwrite 'success' type,
      by modifying the existing `BaseToast` component
    */
  success: (props: ToastConfigParams<object>) => (
    <BaseToast
      {...props}
      style={{
        borderLeftWidth: 0,
        borderRadius: 20,
        flex: 0,
        width: "auto",
        shadowOpacity: 0.12,
        shadowRadius: 16,
        shadowOffset: { width: 0, height: 8 },
      }}
      contentContainerStyle={{ paddingHorizontal: 20, paddingVertical: 4, flex: 0 }}
      text1Style={{
        fontSize: 16,
        fontWeight: "500",
        textAlign: "center",
      }}
    />
  ),
};
