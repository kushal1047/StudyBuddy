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
import { useAuth } from "../contexts/AuthContext";
import { Deck } from "../types/api.types";
import ApiService from "../services/api.service";
import { useFocusEffect } from "@react-navigation/native";

interface DecksListScreenProps {
  navigation: any;
}

export default function DecksListScreen({ navigation }: DecksListScreenProps) {
  const { user } = useAuth();
  const [decks, setDecks] = useState<Deck[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useFocusEffect(
    useCallback(() => {
      loadDecks();
    }, [user])
  );

  const loadDecks = async () => {
    try {
      setIsLoading(true);
      if (user) {
        // Use real API now!
        const userDecks = await ApiService.getDecksByUser(user.id);
        setDecks(userDecks);
      }
    } catch (error) {
      console.error("Error loading decks:", error);
      Alert.alert(
        "Error",
        "Failed to load decks. Make sure backend is running."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadDecks();
    setRefreshing(false);
  }, []);

  const handleDeleteDeck = (deckId: number, deckTitle: string) => {
    Alert.alert(
      "Delete Deck",
      `Are you sure you want to delete "${deckTitle}"? This will delete all flashcards in this deck.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await ApiService.deleteDeck(deckId);
              setDecks(decks.filter((d) => d.id !== deckId));
              Alert.alert("Success", "Deck deleted successfully");
            } catch (error) {
              Alert.alert("Error", "Failed to delete deck");
            }
          },
        },
      ]
    );
  };

  const renderDeckCard = ({ item }: { item: Deck }) => (
    <TouchableOpacity
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
      onPress={() => navigation.navigate("DeckDetails", { deckId: item.id })}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "flex-start",
        }}
      >
        <View style={{ flex: 1 }}>
          <Text
            style={{
              fontSize: 18,
              fontWeight: "bold",
              color: "#1f2937",
              marginBottom: 4,
            }}
          >
            {item.title}
          </Text>
          {item.description ? (
            <Text
              style={{ fontSize: 14, color: "#6b7280", marginBottom: 8 }}
              numberOfLines={2}
            >
              {item.description}
            </Text>
          ) : null}
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <View
              style={{
                backgroundColor: "#dbeafe",
                borderRadius: 12,
                paddingHorizontal: 10,
                paddingVertical: 4,
              }}
            >
              <Text
                style={{ fontSize: 12, color: "#1e40af", fontWeight: "600" }}
              >
                📝 {item.flashcardCount} cards
              </Text>
            </View>
          </View>
        </View>
        <TouchableOpacity
          onPress={() => handleDeleteDeck(item.id, item.title)}
          style={{ padding: 8 }}
        >
          <Text style={{ fontSize: 20 }}>🗑️</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
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
      <Text style={{ fontSize: 48, marginBottom: 16 }}>📚</Text>
      <Text
        style={{
          fontSize: 20,
          fontWeight: "bold",
          color: "#1f2937",
          textAlign: "center",
          marginBottom: 8,
        }}
      >
        No Decks Yet
      </Text>
      <Text
        style={{
          fontSize: 14,
          color: "#6b7280",
          textAlign: "center",
          marginBottom: 24,
        }}
      >
        Create your first deck to start studying with flashcards
      </Text>
      <TouchableOpacity
        style={{
          backgroundColor: "#3b82f6",
          borderRadius: 8,
          paddingHorizontal: 24,
          paddingVertical: 12,
        }}
        onPress={() => navigation.navigate("CreateDeck")}
      >
        <Text style={{ color: "white", fontSize: 16, fontWeight: "600" }}>
          Create Your First Deck
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
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <View>
            <Text
              style={{ fontSize: 28, fontWeight: "bold", color: "#1f2937" }}
            >
              My Decks
            </Text>
            <Text style={{ fontSize: 14, color: "#6b7280", marginTop: 2 }}>
              {decks.length} {decks.length === 1 ? "deck" : "decks"}
            </Text>
          </View>
          <TouchableOpacity
            style={{
              backgroundColor: "#3b82f6",
              borderRadius: 8,
              paddingHorizontal: 16,
              paddingVertical: 10,
              flexDirection: "row",
              alignItems: "center",
            }}
            onPress={() => navigation.navigate("CreateDeck")}
          >
            <Text style={{ color: "white", fontSize: 18, marginRight: 4 }}>
              +
            </Text>
            <Text style={{ color: "white", fontSize: 14, fontWeight: "600" }}>
              New
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Decks List */}
      {isLoading && decks.length === 0 ? (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text style={{ color: "#6b7280" }}>Loading decks...</Text>
        </View>
      ) : decks.length === 0 ? (
        renderEmptyState()
      ) : (
        <FlatList
          data={decks}
          renderItem={renderDeckCard}
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
