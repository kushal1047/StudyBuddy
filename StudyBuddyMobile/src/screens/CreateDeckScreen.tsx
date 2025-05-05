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
import ApiService from "../services/api.service";

interface CreateDeckScreenProps {
  navigation: any;
}

export default function CreateDeckScreen({
  navigation,
}: CreateDeckScreenProps) {
  const { user } = useAuth();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleCreateDeck = async () => {
    if (!title.trim()) {
      Alert.alert("Error", "Please enter a deck title");
      return;
    }

    if (!user) {
      Alert.alert("Error", "User not found");
      return;
    }

    try {
      setIsLoading(true);
      await ApiService.createDeck(user.id, {
        title: title.trim(),
        description: description.trim(),
      });

      Alert.alert("Success", "Deck created successfully!", [
        {
          text: "OK",
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (error) {
      console.error("Error creating deck:", error);
      Alert.alert("Error", "Failed to create deck. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f9fafb" }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        {/* Header */}
        <View
          style={{
            paddingHorizontal: 20,
            paddingVertical: 16,
            backgroundColor: "white",
            borderBottomWidth: 1,
            borderBottomColor: "#e5e7eb",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{ marginRight: 16 }}
          >
            <Text style={{ fontSize: 24, color: "#3b82f6" }}>←</Text>
          </TouchableOpacity>
          <Text style={{ fontSize: 24, fontWeight: "bold", color: "#1f2937" }}>
            Create New Deck
          </Text>
        </View>

        <ScrollView contentContainerStyle={{ padding: 20 }}>
          {/* Form Card */}
          <View
            style={{
              backgroundColor: "white",
              borderRadius: 12,
              padding: 20,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 8,
              elevation: 3,
            }}
          >
            {/* Title Input */}
            <View style={{ marginBottom: 20 }}>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "600",
                  color: "#374151",
                  marginBottom: 8,
                }}
              >
                Deck Title *
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
                placeholder="e.g., Spanish Vocabulary"
                value={title}
                onChangeText={setTitle}
                maxLength={100}
              />
              <Text style={{ fontSize: 12, color: "#6b7280", marginTop: 4 }}>
                {title.length}/100 characters
              </Text>
            </View>

            {/* Description Input */}
            <View style={{ marginBottom: 24 }}>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "600",
                  color: "#374151",
                  marginBottom: 8,
                }}
              >
                Description (Optional)
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
                  height: 100,
                  textAlignVertical: "top",
                }}
                placeholder="What will you study with this deck?"
                value={description}
                onChangeText={setDescription}
                multiline
                maxLength={500}
              />
              <Text style={{ fontSize: 12, color: "#6b7280", marginTop: 4 }}>
                {description.length}/500 characters
              </Text>
            </View>

            {/* Create Button */}
            <TouchableOpacity
              style={{
                backgroundColor: isLoading ? "#9ca3af" : "#10b981",
                borderRadius: 8,
                paddingVertical: 14,
                alignItems: "center",
              }}
              onPress={handleCreateDeck}
              disabled={isLoading}
            >
              <Text style={{ color: "white", fontSize: 16, fontWeight: "600" }}>
                {isLoading ? "Creating..." : "Create Deck"}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Info Card */}
          <View
            style={{
              marginTop: 20,
              backgroundColor: "#dbeafe",
              borderRadius: 12,
              padding: 16,
            }}
          >
            <Text
              style={{ fontSize: 14, color: "#1e40af", textAlign: "center" }}
            >
              💡 After creating your deck, you can add flashcards to start
              studying!
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
