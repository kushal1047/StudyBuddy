// Sample user for testing
export const mockUser = {
  id: 1,
  username: "testuser",
  email: "test@example.com",
  createdAt: "2024-01-01T00:00:00Z",
};

// Sample deck for testing
export const mockDeck = {
  id: 1,
  title: "Test Deck",
  description: "Test Description",
  createdAt: "2024-01-01T00:00:00Z",
  updatedAt: "2024-01-01T00:00:00Z",
  userId: 1,
  flashcardCount: 5,
};

// Sample flashcard for testing
export const mockFlashcard = {
  id: 1,
  question: "What is React?",
  answer: "A JavaScript library",
  createdAt: "2024-01-01T00:00:00Z",
  updatedAt: "2024-01-01T00:00:00Z",
  deckId: 1,
  deckTitle: "Test Deck",
};

// Sample stats for testing
export const mockStatistics = {
  totalDecks: 5,
  totalFlashcards: 25,
  totalStudySessions: 50,
  correctAnswers: 35,
  incorrectAnswers: 15,
  accuracyPercentage: 70.0,
  lastStudyDate: "2024-01-01T00:00:00Z",
};
