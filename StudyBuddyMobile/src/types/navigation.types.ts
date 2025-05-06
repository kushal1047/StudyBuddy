// Navigation parameter types for type-safe navigation
export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
};

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Decks: undefined;
  Study: { deckId: number } | undefined;
  Profile: undefined;
};

export type DecksStackParamList = {
  DecksList: undefined;
  DeckDetails: { deckId: number };
  CreateDeck: undefined;
  EditDeck: { deckId: number };
  CreateFlashcard: { deckId: number };
  EditFlashcard: { flashcardId: number; deckId: number };
  Study: { deckId: number };
};
