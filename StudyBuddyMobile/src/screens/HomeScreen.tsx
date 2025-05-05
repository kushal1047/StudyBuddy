import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../contexts/AuthContext";

export default function HomeScreen() {
  const { user, logout } = useAuth();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f0f9ff" }}>
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          padding: 20,
        }}
      >
        {/* Welcome Card */}
        <View
          style={{
            backgroundColor: "white",
            borderRadius: 16,
            padding: 32,
            width: "100%",
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 3,
          }}
        >
          <Text style={{ fontSize: 40, textAlign: "center", marginBottom: 16 }}>
            🎉
          </Text>
          <Text
            style={{
              fontSize: 28,
              fontWeight: "bold",
              color: "#1e40af",
              textAlign: "center",
              marginBottom: 12,
            }}
          >
            Welcome to StudyBuddy!
          </Text>
          <Text
            style={{
              fontSize: 18,
              color: "#64748b",
              textAlign: "center",
              marginBottom: 24,
            }}
          >
            Hello, {user?.username}!
          </Text>

          <View
            style={{
              backgroundColor: "#dbeafe",
              borderRadius: 12,
              padding: 16,
              marginBottom: 24,
            }}
          >
            <Text
              style={{ fontSize: 14, color: "#1e40af", textAlign: "center" }}
            >
              ✅ Authentication working perfectly!
            </Text>
            <Text
              style={{
                fontSize: 14,
                color: "#1e40af",
                textAlign: "center",
                marginTop: 8,
              }}
            >
              Your decks and study features coming soon...
            </Text>
          </View>

          {/* Logout Button */}
          <TouchableOpacity
            style={{
              backgroundColor: "#ef4444",
              borderRadius: 8,
              paddingVertical: 14,
              alignItems: "center",
            }}
            onPress={logout}
          >
            <Text style={{ color: "white", fontSize: 16, fontWeight: "600" }}>
              Logout
            </Text>
          </TouchableOpacity>
        </View>

        {/* User Info Card */}
        <View
          style={{
            marginTop: 20,
            backgroundColor: "#ecfdf5",
            borderRadius: 12,
            padding: 16,
            width: "100%",
          }}
        >
          <Text
            style={{
              fontSize: 12,
              color: "#059669",
              fontWeight: "600",
              marginBottom: 8,
            }}
          >
            Your Account Info:
          </Text>
          <Text style={{ fontSize: 12, color: "#047857" }}>
            📧 Email: {user?.email}
          </Text>
          <Text style={{ fontSize: 12, color: "#047857", marginTop: 4 }}>
            👤 Username: {user?.username}
          </Text>
          <Text style={{ fontSize: 12, color: "#047857", marginTop: 4 }}>
            🆔 User ID: {user?.id}
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
