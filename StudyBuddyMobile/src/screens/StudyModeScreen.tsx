import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  Alert,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Flashcard } from "../types/api.types";
import ApiService from "../services/api.service";

interface StudyModeScreenProps {
  navigation: any;
  route: any;
}

const { width } = Dimensions.get("window");

export default function StudyModeScreen({
  navigation,
  route,
}: StudyModeScreenProps) {
  const { deckId } = route.params;
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [deckTitle, setDeckTitle] = useState("Study Mode");
  const [correctCount, setCorrectCount] = useState(0);
  const [incorrectCount, setIncorrectCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadFlashcards();
  }, []);

  const loadFlashcards = async () => {
    try {
      setIsLoading(true);

      // Mock flashcards - same as DeckDetails
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
        {
          id: 4,
          question: 'What is "Please" in Spanish?',
          answer: "Por favor",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          deckId: deckId,
          deckTitle: "Spanish Vocabulary",
        },
        {
          id: 5,
          question: 'What is "Yes" in Spanish?',
          answer: "Sí",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          deckId: deckId,
          deckTitle: "Spanish Vocabulary",
        },
      ];

      // Shuffle flashcards for variety
      const shuffled = [...mockFlashcards].sort(() => Math.random() - 0.5);
      setFlashcards(shuffled);
      if (shuffled.length > 0) {
        setDeckTitle(shuffled[0].deckTitle);
      }

      // When ready: const cards = await ApiService.getFlashcardsByDeck(deckId);
    } catch (error) {
      console.error("Error loading flashcards:", error);
      Alert.alert("Error", "Failed to load flashcards");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFlipCard = () => {
    setIsFlipped(!isFlipped);
  };

  const handleAnswer = (isCorrect: boolean) => {
    const newCorrect = isCorrect ? correctCount + 1 : correctCount;
    const newIncorrect = isCorrect ? incorrectCount : incorrectCount + 1;

    // Always update the UI counters
    setCorrectCount(newCorrect);
    setIncorrectCount(newIncorrect);

    if (currentIndex < flashcards.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false);
    } else {
      // Finished studying — use the updated counts directly
      showCompletionAlert(newCorrect, newIncorrect);
    }
  };

  const showCompletionAlert = (
    finalCorrect: number,
    finalIncorrect: number
  ) => {
    const total = finalCorrect + finalIncorrect;
    const percentage = Math.round((finalCorrect / total) * 100);

    Alert.alert(
      "🎉 Study Session Complete!",
      `You got ${finalCorrect} out of ${total} correct (${percentage}%)\n\nGreat job!`,
      [
        {
          text: "Study Again",
          onPress: () => {
            setCurrentIndex(0);
            setIsFlipped(false);
            setCorrectCount(0);
            setIncorrectCount(0);
            loadFlashcards(); // Reshuffle
          },
        },
        { text: "Done", onPress: () => navigation.goBack() },
      ]
    );
  };

  if (isLoading) {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: "#f0f9ff",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text style={{ color: "#6b7280" }}>Loading flashcards...</Text>
      </SafeAreaView>
    );
  }

  if (flashcards.length === 0) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#f0f9ff" }}>
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            padding: 40,
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
            No Flashcards
          </Text>
          <Text
            style={{
              fontSize: 14,
              color: "#6b7280",
              textAlign: "center",
              marginBottom: 24,
            }}
          >
            Add some flashcards to this deck first!
          </Text>
          <TouchableOpacity
            style={{
              backgroundColor: "#3b82f6",
              borderRadius: 8,
              paddingHorizontal: 24,
              paddingVertical: 12,
            }}
            onPress={() => navigation.goBack()}
          >
            <Text style={{ color: "white", fontSize: 16, fontWeight: "600" }}>
              Go Back
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const currentCard = flashcards[currentIndex];
  const progress = ((currentIndex + 1) / flashcards.length) * 100;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f0f9ff" }}>
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
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={{ fontSize: 24, color: "#3b82f6" }}>✕</Text>
          </TouchableOpacity>
          <Text style={{ fontSize: 16, fontWeight: "600", color: "#1f2937" }}>
            {deckTitle}
          </Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Progress Bar */}
        <View style={{ marginTop: 12 }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginBottom: 4,
            }}
          >
            <Text style={{ fontSize: 12, color: "#6b7280" }}>
              Card {currentIndex + 1} of {flashcards.length}
            </Text>
            <Text style={{ fontSize: 12, color: "#6b7280" }}>
              {Math.round(progress)}%
            </Text>
          </View>
          <View
            style={{ height: 4, backgroundColor: "#e5e7eb", borderRadius: 2 }}
          >
            <View
              style={{
                height: 4,
                backgroundColor: "#10b981",
                borderRadius: 2,
                width: `${progress}%`,
              }}
            />
          </View>
        </View>
      </View>

      {/* Score */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          paddingVertical: 16,
          gap: 20,
        }}
      >
        <View style={{ alignItems: "center" }}>
          <Text style={{ fontSize: 24, fontWeight: "bold", color: "#10b981" }}>
            {correctCount}
          </Text>
          <Text style={{ fontSize: 12, color: "#6b7280" }}>Correct</Text>
        </View>
        <View style={{ alignItems: "center" }}>
          <Text style={{ fontSize: 24, fontWeight: "bold", color: "#ef4444" }}>
            {incorrectCount}
          </Text>
          <Text style={{ fontSize: 12, color: "#6b7280" }}>Incorrect</Text>
        </View>
      </View>

      {/* Flashcard */}
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          paddingHorizontal: 20,
        }}
      >
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={handleFlipCard}
          style={{
            width: width - 40,
            minHeight: 300,
            backgroundColor: isFlipped ? "#10b981" : "#3b82f6",
            borderRadius: 20,
            padding: 32,
            justifyContent: "center",
            alignItems: "center",
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 12,
            elevation: 8,
          }}
        >
          <Text
            style={{
              fontSize: 12,
              color: "rgba(255, 255, 255, 0.8)",
              fontWeight: "600",
              marginBottom: 16,
              textTransform: "uppercase",
              letterSpacing: 1,
            }}
          >
            {isFlipped ? "ANSWER" : "QUESTION"}
          </Text>
          <Text
            style={{
              fontSize: 24,
              fontWeight: "bold",
              color: "white",
              textAlign: "center",
              lineHeight: 32,
            }}
          >
            {isFlipped ? currentCard.answer : currentCard.question}
          </Text>
          <Text
            style={{
              fontSize: 14,
              color: "rgba(255, 255, 255, 0.7)",
              marginTop: 24,
              textAlign: "center",
            }}
          >
            {isFlipped ? "👆 Tap to see question" : "👆 Tap to reveal answer"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Answer Buttons */}
      {isFlipped && (
        <View style={{ padding: 20, gap: 12 }}>
          <TouchableOpacity
            style={{
              backgroundColor: "#10b981",
              borderRadius: 12,
              paddingVertical: 16,
              alignItems: "center",
              shadowColor: "#10b981",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.3,
              shadowRadius: 4,
              elevation: 4,
            }}
            onPress={() => handleAnswer(true)}
          >
            <Text style={{ color: "white", fontSize: 18, fontWeight: "600" }}>
              ✓ I knew it!
            </Text>
          </TouchableOpacity>
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
            onPress={() => handleAnswer(false)}
          >
            <Text style={{ color: "white", fontSize: 18, fontWeight: "600" }}>
              ✗ Need to review
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}
