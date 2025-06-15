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
import ApiService from "../services/api.service";
import { showSuccessToast, showErrorToast } from "../utils/toast.helper";

interface CreateFlashcardScreenProps {
  navigation: any;
  route: any;
}

export default function CreateFlashcardScreen({
  navigation,
  route,
}: CreateFlashcardScreenProps) {
  const { deckId } = route.params;
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleCreateFlashcard = async () => {
    if (!question.trim()) {
      showErrorToast("Error", "Please enter a question");
      return;
    }

    if (!answer.trim()) {
      showErrorToast("Error", "Please enter an answer");
      return;
    }

    try {
      setIsLoading(true);
      await ApiService.createFlashcard(deckId, {
        question: question.trim(),
        answer: answer.trim(),
      });

      showSuccessToast("Success", "Flashcard created!");
      setQuestion("");
      setAnswer("");
    } catch (error) {
      console.error("Error creating flashcard:", error);
      showErrorToast("Error", "Failed to create flashcard");
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
            Add Flashcard
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
            {/* Question Input */}
            <View style={{ marginBottom: 20 }}>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "600",
                  color: "#374151",
                  marginBottom: 8,
                }}
              >
                Question *
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
                placeholder="What do you want to remember?"
                value={question}
                onChangeText={setQuestion}
                multiline
                maxLength={1000}
              />
              <Text style={{ fontSize: 12, color: "#6b7280", marginTop: 4 }}>
                {question.length}/1000 characters
              </Text>
            </View>

            {/* Answer Input */}
            <View style={{ marginBottom: 24 }}>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "600",
                  color: "#374151",
                  marginBottom: 8,
                }}
              >
                Answer *
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
                placeholder="What's the answer?"
                value={answer}
                onChangeText={setAnswer}
                multiline
                maxLength={1000}
              />
              <Text style={{ fontSize: 12, color: "#6b7280", marginTop: 4 }}>
                {answer.length}/1000 characters
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
              onPress={handleCreateFlashcard}
              disabled={isLoading}
            >
              <Text style={{ color: "white", fontSize: 16, fontWeight: "600" }}>
                {isLoading ? "Creating..." : "Add Flashcard"}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Tips Card */}
          <View
            style={{
              marginTop: 20,
              backgroundColor: "#fef3c7",
              borderRadius: 12,
              padding: 16,
            }}
          >
            <Text
              style={{
                fontSize: 14,
                fontWeight: "600",
                color: "#92400e",
                marginBottom: 8,
              }}
            >
              💡 Tips for great flashcards:
            </Text>
            <Text style={{ fontSize: 13, color: "#92400e", marginBottom: 4 }}>
              • Keep questions clear and concise
            </Text>
            <Text style={{ fontSize: 13, color: "#92400e", marginBottom: 4 }}>
              • One concept per card
            </Text>
            <Text style={{ fontSize: 13, color: "#92400e" }}>
              • Use your own words for better memory
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
