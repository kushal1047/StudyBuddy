import {
  showSuccessToast,
  showErrorToast,
  showInfoToast,
} from "../../utils/toast.helper";
import Toast from "react-native-toast-message";

// Mock Toast
jest.mock("react-native-toast-message", () => ({
  show: jest.fn(),
}));

describe("Toast Helper", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("showSuccessToast", () => {
    it("should call Toast.show with success type", () => {
      showSuccessToast("Success", "Operation completed");

      expect(Toast.show).toHaveBeenCalledWith({
        type: "success",
        text1: "Success",
        text2: "Operation completed",
        position: "top",
        visibilityTime: 3000,
      });
    });

    it("should work without description", () => {
      showSuccessToast("Success");

      expect(Toast.show).toHaveBeenCalledWith({
        type: "success",
        text1: "Success",
        text2: undefined,
        position: "top",
        visibilityTime: 3000,
      });
    });
  });

  describe("showErrorToast", () => {
    it("should call Toast.show with error type", () => {
      showErrorToast("Error", "Something went wrong");

      expect(Toast.show).toHaveBeenCalledWith({
        type: "error",
        text1: "Error",
        text2: "Something went wrong",
        position: "top",
        visibilityTime: 4000,
      });
    });
  });

  describe("showInfoToast", () => {
    it("should call Toast.show with info type", () => {
      showInfoToast("Info", "Just so you know");

      expect(Toast.show).toHaveBeenCalledWith({
        type: "info",
        text1: "Info",
        text2: "Just so you know",
        position: "top",
        visibilityTime: 3000,
      });
    });
  });
});
