import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../contexts/AuthContext";

interface LoginScreenProps {
  navigation: any;
}

export default function LoginScreen({ navigation }: LoginScreenProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { login, isLoading, error, clearError } = useAuth();

  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    try {
      clearError();
      await login({ username: username.trim(), password });
      // AuthContext will handle navigation after successful login
    } catch (err) {
      Alert.alert("Login Failed", error || "Something went wrong");
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f0f9ff" }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: "center",
            padding: 20,
          }}
        >
          {/* Header */}
          <View style={{ alignItems: "center", marginBottom: 40 }}>
            <Text
              style={{
                fontSize: 32,
                fontWeight: "bold",
                color: "#1e40af",
                marginBottom: 8,
              }}
            >
              📚 StudyBuddy
            </Text>
            <Text
              style={{ fontSize: 16, color: "#64748b", textAlign: "center" }}
            >
              Welcome back! Sign in to continue studying
            </Text>
          </View>

          {/* Login Form */}
          <View
            style={{
              backgroundColor: "white",
              borderRadius: 16,
              padding: 24,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 8,
              elevation: 3,
            }}
          >
            <Text
              style={{
                fontSize: 24,
                fontWeight: "bold",
                color: "#1f2937",
                marginBottom: 24,
                textAlign: "center",
              }}
            >
              Sign In
            </Text>

            {/* Username Input */}
            <View style={{ marginBottom: 16 }}>
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "600",
                  color: "#374151",
                  marginBottom: 8,
                }}
              >
                Username
              </Text>
              <TextInput
                style={{
                  backgroundColor: "#f9fafb",
                  borderWidth: 1,
                  borderColor: "#d1d5db",
                  borderRadius: 8,
                  paddingHorizontal: 16,
                  paddingVertical: 12,
                  fontSize: 16,
                }}
                placeholder="Enter your username"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            {/* Password Input */}
            <View style={{ marginBottom: 24 }}>
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "600",
                  color: "#374151",
                  marginBottom: 8,
                }}
              >
                Password
              </Text>
              <TextInput
                style={{
                  backgroundColor: "#f9fafb",
                  borderWidth: 1,
                  borderColor: "#d1d5db",
                  borderRadius: 8,
                  paddingHorizontal: 16,
                  paddingVertical: 12,
                  fontSize: 16,
                }}
                placeholder="Enter your password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </View>

            {/* Login Button */}
            <TouchableOpacity
              style={{
                backgroundColor: isLoading ? "#9ca3af" : "#3b82f6",
                borderRadius: 8,
                paddingVertical: 14,
                alignItems: "center",
                marginBottom: 16,
              }}
              onPress={handleLogin}
              disabled={isLoading}
            >
              <Text style={{ color: "white", fontSize: 16, fontWeight: "600" }}>
                {isLoading ? "Signing In..." : "Sign In"}
              </Text>
            </TouchableOpacity>

            {/* Register Link */}
            <View style={{ flexDirection: "row", justifyContent: "center" }}>
              <Text style={{ color: "#64748b" }}>Don't have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate("Register")}>
                <Text style={{ color: "#3b82f6", fontWeight: "600" }}>
                  Sign Up
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Test Credentials Info */}
          <View
            style={{
              marginTop: 20,
              backgroundColor: "#ecfdf5",
              borderRadius: 8,
              padding: 16,
            }}
          >
            <Text
              style={{ fontSize: 12, color: "#059669", textAlign: "center" }}
            >
              💡 For testing: Use any username/password combination
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
