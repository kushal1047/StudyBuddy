import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Flashcard } from "../types/api.types";
import ApiService from "../services/api.service";

interface DeckDetailsScreenProps {
  navigation: any;
  route: any;
}

export default function DeckDetailsScreen({
  navigation,
  route,
}: DeckDetailsScreenProps) {
  const { deckId } = route.params;
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [deckTitle, setDeckTitle] = useState("Loading...");
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadFlashcards();
  }, [deckId]);

  const loadFlashcards = async () => {
    try {
      setIsLoading(true);

      // Mock flashcards data for testing
      const mockFlashcards: Flashcard[] = [
        {
          id: 1,
          question: 'What is "Hello" in Spanish?',
          answer: "Hola",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          deckId: deckId,
          deckTitle: "Spanish Vocabulary",
        },
        {
          id: 2,
          question: 'What is "Thank you" in Spanish?',
          answer: "Gracias",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          deckId: deckId,
          deckTitle: "Spanish Vocabulary",
        },
        {
          id: 3,
          question: 'What is "Goodbye" in Spanish?',
          answer: "Adiós",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          deckId: deckId,
          deckTitle: "Spanish Vocabulary",
        },
      ];

      setFlashcards(mockFlashcards);
      if (mockFlashcards.length > 0) {
        setDeckTitle(mockFlashcards[0].deckTitle);
      } else {
        setDeckTitle("Deck Details");
      }

      // When ready to use real API:
      // const cards = await ApiService.getFlashcardsByDeck(deckId);
      // setFlashcards(cards);
      // if (cards.length > 0) setDeckTitle(cards[0].deckTitle);
    } catch (error) {
      console.error("Error loading flashcards:", error);
      Alert.alert("Error", "Failed to load flashcards");
    } finally {
      setIsLoading(false);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadFlashcards();
    setRefreshing(false);
  }, []);

  const handleDeleteFlashcard = (flashcardId: number) => {
    Alert.alert(
      "Delete Flashcard",
      "Are you sure you want to delete this flashcard?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await ApiService.deleteFlashcard(flashcardId);
              setFlashcards(flashcards.filter((f) => f.id !== flashcardId));
              Alert.alert("Success", "Flashcard deleted");
            } catch (error) {
              Alert.alert("Error", "Failed to delete flashcard");
            }
          },
        },
      ]
    );
  };

  const renderFlashcardItem = ({ item }: { item: Flashcard }) => (
    <View
      style={{
        backgroundColor: "white",
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
      }}
    >
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <View style={{ flex: 1 }}>
          <View style={{ marginBottom: 12 }}>
            <Text
              style={{
                fontSize: 12,
                color: "#6b7280",
                fontWeight: "600",
                marginBottom: 4,
              }}
            >
              QUESTION
            </Text>
            <Text style={{ fontSize: 16, color: "#1f2937", fontWeight: "500" }}>
              {item.question}
            </Text>
          </View>
          <View>
            <Text
              style={{
                fontSize: 12,
                color: "#6b7280",
                fontWeight: "600",
                marginBottom: 4,
              }}
            >
              ANSWER
            </Text>
            <Text style={{ fontSize: 16, color: "#10b981", fontWeight: "500" }}>
              {item.answer}
            </Text>
          </View>
        </View>
        <TouchableOpacity
          onPress={() => handleDeleteFlashcard(item.id)}
          style={{ padding: 8 }}
        >
          <Text style={{ fontSize: 20 }}>🗑️</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderEmptyState = () => (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 40,
      }}
    >
      <Text style={{ fontSize: 48, marginBottom: 16 }}>📝</Text>
      <Text
        style={{
          fontSize: 20,
          fontWeight: "bold",
          color: "#1f2937",
          textAlign: "center",
          marginBottom: 8,
        }}
      >
        No Flashcards Yet
      </Text>
      <Text
        style={{
          fontSize: 14,
          color: "#6b7280",
          textAlign: "center",
          marginBottom: 24,
        }}
      >
        Add flashcards to this deck to start studying
      </Text>
      <TouchableOpacity
        style={{
          backgroundColor: "#3b82f6",
          borderRadius: 8,
          paddingHorizontal: 24,
          paddingVertical: 12,
        }}
        onPress={() => navigation.navigate("CreateFlashcard", { deckId })}
      >
        <Text style={{ color: "white", fontSize: 16, fontWeight: "600" }}>
          Add First Flashcard
        </Text>
      </TouchableOpacity>
    </View>
  );

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
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 8,
          }}
        >
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{ marginRight: 16 }}
          >
            <Text style={{ fontSize: 24, color: "#3b82f6" }}>←</Text>
          </TouchableOpacity>
          <Text
            style={{
              fontSize: 24,
              fontWeight: "bold",
              color: "#1f2937",
              flex: 1,
            }}
            numberOfLines={1}
          >
            {deckTitle}
          </Text>
          <TouchableOpacity
            onPress={() => navigation.navigate("EditDeck", { deckId })}
            style={{ padding: 8 }}
          >
            <Text style={{ fontSize: 20 }}>✏️</Text>
          </TouchableOpacity>
        </View>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginTop: 8,
          }}
        >
          <Text style={{ fontSize: 14, color: "#6b7280" }}>
            {flashcards.length} {flashcards.length === 1 ? "card" : "cards"}
          </Text>
          <View style={{ flexDirection: "row", gap: 12 }}>
            {flashcards.length > 0 && (
              <TouchableOpacity
                style={{
                  backgroundColor: "#10b981",
                  borderRadius: 8,
                  paddingHorizontal: 16,
                  paddingVertical: 8,
                  marginRight: 8,
                }}
                onPress={() => navigation.navigate("Study", { deckId })}
              >
                <Text
                  style={{ color: "white", fontSize: 14, fontWeight: "600" }}
                >
                  📚 Study
                </Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={{
                backgroundColor: "#3b82f6",
                borderRadius: 8,
                paddingHorizontal: 16,
                paddingVertical: 8,
              }}
              onPress={() => navigation.navigate("CreateFlashcard", { deckId })}
            >
              <Text style={{ color: "white", fontSize: 14, fontWeight: "600" }}>
                + Add Card
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Flashcards List */}
      {isLoading && flashcards.length === 0 ? (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text style={{ color: "#6b7280" }}>Loading flashcards...</Text>
        </View>
      ) : flashcards.length === 0 ? (
        renderEmptyState()
      ) : (
        <FlatList
          data={flashcards}
          renderItem={renderFlashcardItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{ padding: 20 }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={["#3b82f6"]}
            />
          }
        />
      )}
    </SafeAreaView>
  );
}
