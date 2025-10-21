import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { User, LoginDto, CreateUserDto } from "../types/api.types";
import { AuthStorage } from "../utils/auth.storage";
import ApiService from "../services/api.service";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (loginData: LoginDto) => Promise<void>;
  register: (userData: CreateUserDto) => Promise<void>;
  logout: () => Promise<void>;
  error: string | null;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isAuthenticated = !!user;

  // Initialize auth state on app start
  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      setIsLoading(true);
      const token = await AuthStorage.getToken();
      const userData = await AuthStorage.getUser();

      if (token && userData) {
        setUser(userData);
      }
    } catch (err) {
      console.error("Auth initialization error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (loginData: LoginDto) => {
    try {
      setIsLoading(true);
      setError(null);

      // Call the backend login endpoint
      const authResponse = await ApiService.login(loginData);

      // Save auth data
      await AuthStorage.saveToken(authResponse.token);
      await AuthStorage.saveUser(authResponse.user);
      setUser(authResponse.user);
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || err.message || "Login failed";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: CreateUserDto) => {
    try {
      setIsLoading(true);
      setError(null);

      // Call the backend registration endpoint
      console.log("Registering user:", userData);
      const authResponse = await ApiService.register(userData);
      console.log("Registration response:", authResponse);

      // Save auth data
      await AuthStorage.saveToken(authResponse.token);
      await AuthStorage.saveUser(authResponse.user);
      setUser(authResponse.user);
    } catch (err: any) {
      console.error("Registration error:", err);
      console.error("Error response:", err.response?.data);
      const errorMessage =
        err.response?.data?.message || err.message || "Registration failed";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      await AuthStorage.clearAll();
      setUser(null);
      setError(null);
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated,
    login,
    register,
    logout,
    error,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
