import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  ScrollView,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import { useAuth } from "../contexts/AuthContext";
import ApiService from "../services/api.service";
import { UserStatistics } from "../types/api.types";

interface ProfileScreenProps {
  navigation: any;
}

export default function ProfileScreen({ navigation }: ProfileScreenProps) {
  const { user, logout } = useAuth();
  const [statistics, setStatistics] = useState<UserStatistics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useFocusEffect(
    useCallback(() => {
      loadStatistics();
    }, [user])
  );

  const loadStatistics = async () => {
    try {
      setIsLoading(true);
      if (user) {
        const stats = await ApiService.getUserStatistics(user.id);
        setStatistics(stats);
      }
    } catch (error) {
      console.error("Error loading statistics:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadStatistics();
    setRefreshing(false);
  }, [user]);

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

  const formatLastStudyDate = (date: string | null) => {
    if (!date) return "Never";
    const studyDate = new Date(date);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - studyDate.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    return studyDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
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

      <ScrollView
        contentContainerStyle={{ padding: 20 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#3b82f6"]}
          />
        }
      >
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
              Member since{" "}
              {new Date(user?.createdAt || "").toLocaleDateString("en-US", {
                month: "short",
                year: "numeric",
              })}
            </Text>
          </View>
        </View>

        {/* Statistics Card */}
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
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 16,
            }}
          >
            <Text style={{ fontSize: 18, fontWeight: "600", color: "#1f2937" }}>
              Study Statistics
            </Text>
            {isLoading && (
              <Text style={{ fontSize: 12, color: "#6b7280" }}>Loading...</Text>
            )}
          </View>

          {/* Stats Grid */}
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 12 }}>
            {/* Total Decks */}
            <View
              style={{
                flex: 1,
                minWidth: "45%",
                backgroundColor: "#eff6ff",
                borderRadius: 12,
                padding: 16,
                alignItems: "center",
              }}
            >
              <Text
                style={{ fontSize: 32, fontWeight: "bold", color: "#1e40af" }}
              >
                {statistics?.totalDecks || 0}
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  color: "#1e40af",
                  fontWeight: "600",
                  marginTop: 4,
                }}
              >
                Total Decks
              </Text>
            </View>

            {/* Total Flashcards */}
            <View
              style={{
                flex: 1,
                minWidth: "45%",
                backgroundColor: "#f0fdf4",
                borderRadius: 12,
                padding: 16,
                alignItems: "center",
              }}
            >
              <Text
                style={{ fontSize: 32, fontWeight: "bold", color: "#059669" }}
              >
                {statistics?.totalFlashcards || 0}
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  color: "#059669",
                  fontWeight: "600",
                  marginTop: 4,
                }}
              >
                Flashcards
              </Text>
            </View>

            {/* Study Sessions */}
            <View
              style={{
                flex: 1,
                minWidth: "45%",
                backgroundColor: "#fef3c7",
                borderRadius: 12,
                padding: 16,
                alignItems: "center",
              }}
            >
              <Text
                style={{ fontSize: 32, fontWeight: "bold", color: "#d97706" }}
              >
                {statistics?.totalStudySessions || 0}
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  color: "#d97706",
                  fontWeight: "600",
                  marginTop: 4,
                }}
              >
                Study Sessions
              </Text>
            </View>

            {/* Accuracy */}
            <View
              style={{
                flex: 1,
                minWidth: "45%",
                backgroundColor: "#fce7f3",
                borderRadius: 12,
                padding: 16,
                alignItems: "center",
              }}
            >
              <Text
                style={{ fontSize: 32, fontWeight: "bold", color: "#be185d" }}
              >
                {statistics?.accuracyPercentage.toFixed(0) || 0}%
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  color: "#be185d",
                  fontWeight: "600",
                  marginTop: 4,
                }}
              >
                Accuracy
              </Text>
            </View>
          </View>

          {/* Last Study */}
          <View
            style={{
              marginTop: 16,
              paddingTop: 16,
              borderTopWidth: 1,
              borderTopColor: "#e5e7eb",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Text style={{ fontSize: 14, color: "#6b7280" }}>
                Last studied:
              </Text>
              <Text
                style={{ fontSize: 14, color: "#1f2937", fontWeight: "600" }}
              >
                {formatLastStudyDate(statistics?.lastStudyDate || null)}
              </Text>
            </View>
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
