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

      // For now, we'll simulate login since we don't have auth endpoints yet
      // Later we'll uncomment this when we add JWT to backend:
      // const authResponse = await ApiService.login(loginData);

      // Temporary simulation - replace with real API call later
      const mockUser: User = {
        id: 1,
        username: loginData.username,
        email: `${loginData.username}@example.com`,
        createdAt: new Date().toISOString(),
      };

      // Save auth data
      await AuthStorage.saveToken("mock-token-123");
      await AuthStorage.saveUser(mockUser);
      setUser(mockUser);
    } catch (err: any) {
      setError(err.message || "Login failed");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: CreateUserDto) => {
    try {
      setIsLoading(true);
      setError(null);

      // For now, we'll simulate registration
      // Later we'll use: const authResponse = await ApiService.register(userData);

      // Temporary simulation
      const mockUser: User = {
        id: Date.now(), // Simple ID generation
        username: userData.username,
        email: userData.email,
        createdAt: new Date().toISOString(),
      };

      // Save auth data
      await AuthStorage.saveToken("mock-token-123");
      await AuthStorage.saveUser(mockUser);
      setUser(mockUser);
    } catch (err: any) {
      setError(err.message || "Registration failed");
      throw err;
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
