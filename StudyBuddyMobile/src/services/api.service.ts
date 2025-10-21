import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  User,
  CreateUserDto,
  UpdateUserDto,
  Deck,
  CreateDeckDto,
  UpdateDeckDto,
  Flashcard,
  CreateFlashcardDto,
  UpdateFlashcardDto,
  CreateStudySessionDto,
  LoginDto,
  AuthResponse,
  UserStatistics,
  PaginatedDecks,
} from "../types/api.types";

// API base URL - update this to match your backend server
const BASE_URL = "https://444b110284c5.ngrok-free.app/api";

// Set up the HTTP client
const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Automatically add auth token to requests
apiClient.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem("auth_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Log API errors for debugging
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Log detailed error info
      console.error("API Error:", error.response.status);
      console.error("Error Data:", error.response.data);
      console.error("Error URL:", error.config.url);
    }
    return Promise.reject(error);
  }
);

// Main API service class
export class ApiService {
  // Auth endpoints
  static async login(loginData: LoginDto): Promise<AuthResponse> {
    const response = await apiClient.post("/auth/login", loginData);
    return response.data;
  }

  static async register(userData: CreateUserDto): Promise<AuthResponse> {
    const response = await apiClient.post("/auth/register", userData);
    return response.data;
  }

  // User endpoints
  static async getUsers(): Promise<User[]> {
    const response = await apiClient.get("/users");
    return response.data;
  }

  static async getUser(id: number): Promise<User> {
    const response = await apiClient.get(`/users/${id}`);
    return response.data;
  }

  static async createUser(userData: CreateUserDto): Promise<User> {
    const response = await apiClient.post("/users", userData);
    return response.data;
  }

  static async updateUser(id: number, userData: UpdateUserDto): Promise<void> {
    await apiClient.put(`/users/${id}`, userData);
  }

  static async deleteUser(id: number): Promise<void> {
    await apiClient.delete(`/users/${id}`);
  }

  // Deck endpoints
  static async getDecks(): Promise<Deck[]> {
    const response = await apiClient.get("/decks");
    return response.data;
  }

  static async getDecksByUser(
    userId: number,
    page: number = 1,
    pageSize: number = 20
  ): Promise<PaginatedDecks> {
    const response = await apiClient.get(`/decks/user/${userId}`, {
      params: { page, pageSize },
    });
    return response.data;
  }

  static async getDeck(id: number): Promise<Deck> {
    const response = await apiClient.get(`/decks/${id}`);
    return response.data;
  }

  static async createDeck(
    userId: number,
    deckData: CreateDeckDto
  ): Promise<Deck> {
    const response = await apiClient.post(`/decks/user/${userId}`, deckData);
    return response.data;
  }

  static async updateDeck(id: number, deckData: UpdateDeckDto): Promise<void> {
    await apiClient.put(`/decks/${id}`, deckData);
  }

  static async deleteDeck(id: number): Promise<void> {
    await apiClient.delete(`/decks/${id}`);
  }

  // Flashcard endpoints
  static async getFlashcardsByDeck(deckId: number): Promise<Flashcard[]> {
    const response = await apiClient.get(`/flashcards/deck/${deckId}`);
    return response.data;
  }

  static async getFlashcard(id: number): Promise<Flashcard> {
    const response = await apiClient.get(`/flashcards/${id}`);
    return response.data;
  }

  static async createFlashcard(
    deckId: number,
    flashcardData: CreateFlashcardDto
  ): Promise<Flashcard> {
    const response = await apiClient.post(
      `/flashcards/deck/${deckId}`,
      flashcardData
    );
    return response.data;
  }

  static async updateFlashcard(
    id: number,
    flashcardData: UpdateFlashcardDto
  ): Promise<void> {
    await apiClient.put(`/flashcards/${id}`, flashcardData);
  }

  static async deleteFlashcard(id: number): Promise<void> {
    await apiClient.delete(`/flashcards/${id}`);
  }

  // Statistics endpoints
  static async getUserStatistics(userId: number): Promise<UserStatistics> {
    const response = await apiClient.get(`/statistics/user/${userId}`);
    return response.data;
  }

  // Study Session endpoints
  static async createStudySession(
    sessionData: CreateStudySessionDto
  ): Promise<void> {
    await apiClient.post("/studysessions", sessionData);
  }

  static async searchDecks(userId: number, query: string): Promise<Deck[]> {
    const response = await apiClient.get(`/decks/search`, {
      params: { userId, query },
    });
    return response.data;
  }
}

export default ApiService;
