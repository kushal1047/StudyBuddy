import React, { useState, useEffect } from "react";
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
import ApiService from "../services/api.service";

interface EditDeckScreenProps {
  navigation: any;
  route: any;
}

export default function EditDeckScreen({
  navigation,
  route,
}: EditDeckScreenProps) {
  const { deckId } = route.params;
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadDeck();
  }, []);

  const loadDeck = async () => {
    try {
      setIsLoading(true);
      // Mock data - in real app would load from API
      // const deck = await ApiService.getDeck(deckId);

      // For now, use mock data
      setTitle("Spanish Vocabulary");
      setDescription("Basic Spanish words and phrases");
    } catch (error) {
      console.error("Error loading deck:", error);
      Alert.alert("Error", "Failed to load deck");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateDeck = async () => {
    if (!title.trim()) {
      Alert.alert("Error", "Please enter a deck title");
      return;
    }

    try {
      setIsSaving(true);
      await ApiService.updateDeck(deckId, {
        title: title.trim(),
        description: description.trim(),
      });

      Alert.alert("Success", "Deck updated successfully!", [
        {
          text: "OK",
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (error) {
      console.error("Error updating deck:", error);
      Alert.alert("Error", "Failed to update deck. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: "#f9fafb",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text style={{ color: "#6b7280" }}>Loading deck...</Text>
      </SafeAreaView>
    );
  }

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
            Edit Deck
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

            {/* Update Button */}
            <TouchableOpacity
              style={{
                backgroundColor: isSaving ? "#9ca3af" : "#3b82f6",
                borderRadius: 8,
                paddingVertical: 14,
                alignItems: "center",
              }}
              onPress={handleUpdateDeck}
              disabled={isSaving}
            >
              <Text style={{ color: "white", fontSize: 16, fontWeight: "600" }}>
                {isSaving ? "Saving..." : "Save Changes"}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
