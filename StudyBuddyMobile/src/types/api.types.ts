// API Response Types (matching our backend DTOs)
export interface User {
  id: number;
  username: string;
  email: string;
  createdAt: string;
}

export interface CreateUserDto {
  username: string;
  email: string;
  password: string;
}

export interface UpdateUserDto {
  username?: string;
  email?: string;
}

export interface Deck {
  id: number;
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  userId: number;
  flashcardCount: number;
}

export interface CreateDeckDto {
  title: string;
  description: string;
}

export interface UpdateDeckDto {
  title?: string;
  description?: string;
}

export interface Flashcard {
  id: number;
  question: string;
  answer: string;
  createdAt: string;
  updatedAt: string;
  deckId: number;
  deckTitle: string;
}

export interface CreateFlashcardDto {
  question: string;
  answer: string;
}

export interface UpdateFlashcardDto {
  question?: string;
  answer?: string;
}

// Study session related types
export interface StudySession {
  id: number;
  isCorrect: boolean;
  studiedAt: string;
  flashcardId: number;
  userId: number;
}

// Authentication types
export interface LoginDto {
  username: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

// Statistics types
export interface UserStatistics {
  totalDecks: number;
  totalFlashcards: number;
  totalStudySessions: number;
  correctAnswers: number;
  incorrectAnswers: number;
  accuracyPercentage: number;
  lastStudyDate: string | null;
}
