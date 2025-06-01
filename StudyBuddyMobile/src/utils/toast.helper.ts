import Toast from "react-native-toast-message";

export const showSuccessToast = (message: string, description?: string) => {
  Toast.show({
    type: "success",
    text1: message,
    text2: description,
    position: "top",
    visibilityTime: 3000,
  });
};

export const showErrorToast = (message: string, description?: string) => {
  Toast.show({
    type: "error",
    text1: message,
    text2: description,
    position: "top",
    visibilityTime: 4000,
  });
};

export const showInfoToast = (message: string, description?: string) => {
  Toast.show({
    type: "info",
    text1: message,
    text2: description,
    position: "top",
    visibilityTime: 3000,
  });
};
