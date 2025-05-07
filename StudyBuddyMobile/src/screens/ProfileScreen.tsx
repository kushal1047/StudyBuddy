import React from "react";
import { View, Text, TouchableOpacity, Alert, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../contexts/AuthContext";

interface ProfileScreenProps {
  navigation: any;
}

export default function ProfileScreen({ navigation }: ProfileScreenProps) {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          await logout();
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f9fafb" }}>
      {/* Header */}
      <View
        style={{
          paddingHorizontal: 20,
          paddingVertical: 16,
          backgroundColor: "white",
          borderBottomWidth: 1,
          borderBottomColor: "#e5e7eb",
        }}
      >
        <Text style={{ fontSize: 28, fontWeight: "bold", color: "#1f2937" }}>
          Profile
        </Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 20 }}>
        {/* User Info Card */}
        <View
          style={{
            backgroundColor: "white",
            borderRadius: 16,
            padding: 24,
            marginBottom: 20,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 3,
            alignItems: "center",
          }}
        >
          <View
            style={{
              width: 80,
              height: 80,
              borderRadius: 40,
              backgroundColor: "#dbeafe",
              justifyContent: "center",
              alignItems: "center",
              marginBottom: 16,
            }}
          >
            <Text style={{ fontSize: 36 }}>👤</Text>
          </View>

          <Text
            style={{
              fontSize: 24,
              fontWeight: "bold",
              color: "#1f2937",
              marginBottom: 4,
            }}
          >
            {user?.username}
          </Text>
          <Text style={{ fontSize: 14, color: "#6b7280", marginBottom: 20 }}>
            {user?.email}
          </Text>

          <View
            style={{
              backgroundColor: "#f0f9ff",
              borderRadius: 8,
              paddingHorizontal: 12,
              paddingVertical: 6,
            }}
          >
            <Text style={{ fontSize: 12, color: "#1e40af", fontWeight: "600" }}>
              User ID: {user?.id}
            </Text>
          </View>
        </View>

        {/* Account Info */}
        <View
          style={{
            backgroundColor: "white",
            borderRadius: 12,
            padding: 20,
            marginBottom: 20,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 2,
          }}
        >
          <Text
            style={{
              fontSize: 16,
              fontWeight: "600",
              color: "#1f2937",
              marginBottom: 16,
            }}
          >
            Account Information
          </Text>

          <View style={{ marginBottom: 12 }}>
            <Text style={{ fontSize: 12, color: "#6b7280", marginBottom: 4 }}>
              USERNAME
            </Text>
            <Text style={{ fontSize: 16, color: "#1f2937", fontWeight: "500" }}>
              {user?.username}
            </Text>
          </View>

          <View style={{ marginBottom: 12 }}>
            <Text style={{ fontSize: 12, color: "#6b7280", marginBottom: 4 }}>
              EMAIL
            </Text>
            <Text style={{ fontSize: 16, color: "#1f2937", fontWeight: "500" }}>
              {user?.email}
            </Text>
          </View>

          <View>
            <Text style={{ fontSize: 12, color: "#6b7280", marginBottom: 4 }}>
              MEMBER SINCE
            </Text>
            <Text style={{ fontSize: 16, color: "#1f2937", fontWeight: "500" }}>
              {new Date(user?.createdAt || "").toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </Text>
          </View>
        </View>

        {/* App Info */}
        <View
          style={{
            backgroundColor: "white",
            borderRadius: 12,
            padding: 20,
            marginBottom: 20,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 2,
          }}
        >
          <Text
            style={{
              fontSize: 16,
              fontWeight: "600",
              color: "#1f2937",
              marginBottom: 16,
            }}
          >
            About StudyBuddy
          </Text>

          <View style={{ marginBottom: 12 }}>
            <Text style={{ fontSize: 14, color: "#6b7280", lineHeight: 20 }}>
              📚 StudyBuddy is your personal flashcard companion for effective
              learning.
            </Text>
          </View>

          <View style={{ marginBottom: 12 }}>
            <Text style={{ fontSize: 14, color: "#6b7280", lineHeight: 20 }}>
              ✨ Version 1.0.0
            </Text>
          </View>

          <View>
            <Text style={{ fontSize: 14, color: "#6b7280", lineHeight: 20 }}>
              Built with React Native & ASP.NET Core
            </Text>
          </View>
        </View>

        {/* Logout Button */}
        <TouchableOpacity
          style={{
            backgroundColor: "#ef4444",
            borderRadius: 12,
            paddingVertical: 16,
            alignItems: "center",
            shadowColor: "#ef4444",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.3,
            shadowRadius: 4,
            elevation: 4,
          }}
          onPress={handleLogout}
        >
          <Text style={{ color: "white", fontSize: 16, fontWeight: "600" }}>
            🚪 Logout
          </Text>
        </TouchableOpacity>

        {/* Extra spacing at bottom */}
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}
