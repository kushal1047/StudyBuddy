import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Alert,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import { useAuth } from "../contexts/AuthContext";
import { Deck } from "../types/api.types";
import ApiService from "../services/api.service";
import DeckCardSkeleton from "../components/DeckCardSkeleton";
import { useNetwork } from "../contexts/NetworkContext";
import { showSuccessToast, showErrorToast } from "../utils/toast.helper";

interface DecksListScreenProps {
  navigation: any;
}

export default function DecksListScreen({ navigation }: DecksListScreenProps) {
  const { user } = useAuth();
  const [decks, setDecks] = useState<Deck[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { isConnected } = useNetwork();
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  useFocusEffect(
    useCallback(() => {
      loadDecks();
    }, [user])
  );

  const loadDecks = async (page: number = 1, append: boolean = false) => {
    try {
      if (page === 1) setIsLoading(true);
      console.log("Loading decks for user:", user?.id, "page:", page);

      if (user) {
        const response = await ApiService.getDecksByUser(user.id, page, 20);
        console.log("Decks loaded:", response.decks.length);

        if (append) {
          setDecks((prevDecks) => [...prevDecks, ...response.decks]);
        } else {
          setDecks(response.decks);
        }

        setHasMore(page < response.totalPages);
        setCurrentPage(page);
      }
    } catch (error: any) {
      console.error("Error loading decks:", error);
      console.error("Error details:", error.response?.data);
      showErrorToast("Error", "Failed to load decks");
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  };

  const loadMoreDecks = async () => {
    if (!isLoadingMore && hasMore && !searchQuery) {
      setIsLoadingMore(true);
      await loadDecks(currentPage + 1, true);
    }
  };
  const handleSearch = async (query: string) => {
    setSearchQuery(query);

    if (!user) return;

    try {
      if (query.trim() === "") {
        // If search is empty, load all decks
        await loadDecks();
      } else {
        // Search with query
        const searchResults = await ApiService.searchDecks(
          user.id,
          query.trim()
        );
        setDecks(searchResults);
      }
    } catch (error) {
      console.error("Error searching decks:", error);
      Alert.alert("Error", "Failed to search decks");
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    setSearchQuery(""); // Clear search on refresh
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
              showSuccessToast("Deleted", "Deck deleted successfully");
            } catch (error) {
              showErrorToast("Error", "Failed to delete deck");
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
      <Text style={{ fontSize: 48, marginBottom: 16 }}>
        {searchQuery ? "🔍" : "📚"}
      </Text>
      <Text
        style={{
          fontSize: 20,
          fontWeight: "bold",
          color: "#1f2937",
          textAlign: "center",
          marginBottom: 8,
        }}
      >
        {searchQuery ? "No Decks Found" : "No Decks Yet"}
      </Text>
      <Text
        style={{
          fontSize: 14,
          color: "#6b7280",
          textAlign: "center",
          marginBottom: 24,
        }}
      >
        {searchQuery
          ? `No decks match "${searchQuery}"`
          : "Create your first deck to start studying with flashcards"}
      </Text>
      {!searchQuery && (
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
      )}
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f9fafb" }}>
      {!isConnected && (
        <View
          style={{
            backgroundColor: "#fef2f2",
            paddingVertical: 8,
            paddingHorizontal: 20,
            borderBottomWidth: 1,
            borderBottomColor: "#fecaca",
          }}
        >
          <Text
            style={{
              color: "#991b1b",
              fontSize: 14,
              textAlign: "center",
              fontWeight: "600",
            }}
          >
            📡 You're offline - Some features may not work
          </Text>
        </View>
      )}
      {/* Header */}
      <View
        style={{
          paddingHorizontal: 20,
          paddingTop: 16,
          paddingBottom: 12,
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
            marginBottom: 12,
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

        {/* Search Bar */}
        <View
          style={{
            backgroundColor: "#f3f4f6",
            borderRadius: 10,
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: 12,
            paddingVertical: 10,
          }}
        >
          <Text style={{ fontSize: 16, marginRight: 8 }}>🔍</Text>
          <TextInput
            style={{
              flex: 1,
              fontSize: 16,
              color: "#1f2937",
            }}
            placeholder="Search decks..."
            placeholderTextColor="#9ca3af"
            value={searchQuery}
            onChangeText={handleSearch}
            autoCapitalize="none"
            autoCorrect={false}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              onPress={() => handleSearch("")}
              style={{ padding: 4 }}
            >
              <Text style={{ fontSize: 16, color: "#6b7280" }}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Decks List */}
      {isLoading && decks.length === 0 ? (
        <View style={{ padding: 20 }}>
          <DeckCardSkeleton />
          <DeckCardSkeleton />
          <DeckCardSkeleton />
          <DeckCardSkeleton />
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
          onEndReached={loadMoreDecks}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            isLoadingMore ? (
              <View style={{ paddingVertical: 20 }}>
                <DeckCardSkeleton />
              </View>
            ) : null
          }
        />
      )}
    </SafeAreaView>
  );
}
