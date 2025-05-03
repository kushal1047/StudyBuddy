import AsyncStorage from "@react-native-async-storage/async-storage";
import { User } from "../types/api.types";

const AUTH_TOKEN_KEY = "auth_token";
const USER_DATA_KEY = "user_data";

export class AuthStorage {
  // Token management
  static async saveToken(token: string): Promise<void> {
    try {
      await AsyncStorage.setItem(AUTH_TOKEN_KEY, token);
    } catch (error) {
      console.error("Error saving token:", error);
    }
  }

  static async getToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(AUTH_TOKEN_KEY);
    } catch (error) {
      console.error("Error getting token:", error);
      return null;
    }
  }

  static async removeToken(): Promise<void> {
    try {
      await AsyncStorage.removeItem(AUTH_TOKEN_KEY);
    } catch (error) {
      console.error("Error removing token:", error);
    }
  }

  // User data management
  static async saveUser(user: User): Promise<void> {
    try {
      await AsyncStorage.setItem(USER_DATA_KEY, JSON.stringify(user));
    } catch (error) {
      console.error("Error saving user:", error);
    }
  }

  static async getUser(): Promise<User | null> {
    try {
      const userData = await AsyncStorage.getItem(USER_DATA_KEY);
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error("Error getting user:", error);
      return null;
    }
  }

  static async removeUser(): Promise<void> {
    try {
      await AsyncStorage.removeItem(USER_DATA_KEY);
    } catch (error) {
      console.error("Error removing user:", error);
    }
  }

  // Clear all auth data
  static async clearAll(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([AUTH_TOKEN_KEY, USER_DATA_KEY]);
    } catch (error) {
      console.error("Error clearing auth data:", error);
    }
  }
}
