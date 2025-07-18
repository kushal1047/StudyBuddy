import axios from "axios";
import ApiService from "../../services/api.service";
import { mockUser, mockDeck, mockFlashcard } from "../../testUtils/mocks";

// Mock axios
jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

// Mock axios instance
const mockAxiosInstance = {
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  delete: jest.fn(),
  interceptors: {
    request: { use: jest.fn() },
    response: { use: jest.fn() },
  },
};

mockedAxios.create = jest.fn(() => mockAxiosInstance as any);

describe("ApiService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("User Endpoints", () => {
    it("should get users", async () => {
      const mockUsers = [mockUser];
      mockAxiosInstance.get.mockResolvedValue({ data: mockUsers });

      const result = await ApiService.getUsers();

      expect(mockAxiosInstance.get).toHaveBeenCalledWith("/users");
      expect(result).toEqual(mockUsers);
    });

    it("should get user by id", async () => {
      mockAxiosInstance.get.mockResolvedValue({ data: mockUser });

      const result = await ApiService.getUser(1);

      expect(mockAxiosInstance.get).toHaveBeenCalledWith("/users/1");
      expect(result).toEqual(mockUser);
    });

    it("should create user", async () => {
      const createUserDto = {
        username: "newuser",
        email: "new@example.com",
        password: "password123",
      };
      mockAxiosInstance.post.mockResolvedValue({ data: mockUser });

      const result = await ApiService.createUser(createUserDto);

      expect(mockAxiosInstance.post).toHaveBeenCalledWith(
        "/users",
        createUserDto
      );
      expect(result).toEqual(mockUser);
    });
  });

  describe("Deck Endpoints", () => {
    it("should get decks by user", async () => {
      const mockResponse = {
        decks: [mockDeck],
        page: 1,
        pageSize: 20,
        totalCount: 1,
        totalPages: 1,
      };
      mockAxiosInstance.get.mockResolvedValue({ data: mockResponse });

      const result = await ApiService.getDecksByUser(1);

      expect(mockAxiosInstance.get).toHaveBeenCalledWith("/decks/user/1", {
        params: { page: 1, pageSize: 20 },
      });
      expect(result).toEqual(mockResponse);
    });

    it("should create deck", async () => {
      const createDeckDto = {
        title: "New Deck",
        description: "Test Description",
      };
      mockAxiosInstance.post.mockResolvedValue({ data: mockDeck });

      const result = await ApiService.createDeck(1, createDeckDto);

      expect(mockAxiosInstance.post).toHaveBeenCalledWith(
        "/decks/user/1",
        createDeckDto
      );
      expect(result).toEqual(mockDeck);
    });

    it("should delete deck", async () => {
      mockAxiosInstance.delete.mockResolvedValue({ data: null });

      await ApiService.deleteDeck(1);

      expect(mockAxiosInstance.delete).toHaveBeenCalledWith("/decks/1");
    });
  });

  describe("Flashcard Endpoints", () => {
    it("should get flashcards by deck", async () => {
      const mockFlashcards = [mockFlashcard];
      mockAxiosInstance.get.mockResolvedValue({ data: mockFlashcards });

      const result = await ApiService.getFlashcardsByDeck(1);

      expect(mockAxiosInstance.get).toHaveBeenCalledWith("/flashcards/deck/1");
      expect(result).toEqual(mockFlashcards);
    });

    it("should create flashcard", async () => {
      const createFlashcardDto = {
        question: "Test Question",
        answer: "Test Answer",
      };
      mockAxiosInstance.post.mockResolvedValue({ data: mockFlashcard });

      const result = await ApiService.createFlashcard(1, createFlashcardDto);

      expect(mockAxiosInstance.post).toHaveBeenCalledWith(
        "/flashcards/deck/1",
        createFlashcardDto
      );
      expect(result).toEqual(mockFlashcard);
    });
  });

  describe("Search Endpoints", () => {
    it("should search decks", async () => {
      const mockDecks = [mockDeck];
      mockAxiosInstance.get.mockResolvedValue({ data: mockDecks });

      const result = await ApiService.searchDecks(1, "test");

      expect(mockAxiosInstance.get).toHaveBeenCalledWith("/decks/search", {
        params: { userId: 1, query: "test" },
      });
      expect(result).toEqual(mockDecks);
    });
  });
});
