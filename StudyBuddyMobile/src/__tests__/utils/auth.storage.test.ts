import { AuthStorage } from "../../utils/auth.storage";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { mockUser } from "../../testUtils/mocks";

describe("AuthStorage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Token Management", () => {
    it("should save token", async () => {
      await AuthStorage.saveToken("test-token-123");

      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        "auth_token",
        "test-token-123"
      );
    });

    it("should get token", async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue("test-token-123");

      const token = await AuthStorage.getToken();

      expect(token).toBe("test-token-123");
    });

    it("should remove token", async () => {
      await AuthStorage.removeToken();

      expect(AsyncStorage.removeItem).toHaveBeenCalledWith("auth_token");
    });
  });

  describe("User Data Management", () => {
    it("should save user data", async () => {
      await AuthStorage.saveUser(mockUser);

      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        "user_data",
        JSON.stringify(mockUser)
      );
    });

    it("should get user data", async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(
        JSON.stringify(mockUser)
      );

      const user = await AuthStorage.getUser();

      expect(user).toEqual(mockUser);
    });

    it("should return null when no user data exists", async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);

      const user = await AuthStorage.getUser();

      expect(user).toBeNull();
    });

    it("should remove user data", async () => {
      await AuthStorage.removeUser();

      expect(AsyncStorage.removeItem).toHaveBeenCalledWith("user_data");
    });
  });

  describe("Clear All", () => {
    it("should clear all auth data", async () => {
      await AuthStorage.clearAll();

      expect(AsyncStorage.multiRemove).toHaveBeenCalledWith([
        "auth_token",
        "user_data",
      ]);
    });
  });
});
