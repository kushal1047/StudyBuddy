import ApiService from "../../services/api.service";

describe("ApiService", () => {
  it("should export ApiService class", () => {
    expect(ApiService).toBeDefined();
  });

  it("should have all user endpoint methods", () => {
    expect(ApiService.getUsers).toBeDefined();
    expect(ApiService.getUser).toBeDefined();
    expect(ApiService.createUser).toBeDefined();
    expect(ApiService.updateUser).toBeDefined();
    expect(ApiService.deleteUser).toBeDefined();
  });

  it("should have all deck endpoint methods", () => {
    expect(ApiService.getDecksByUser).toBeDefined();
    expect(ApiService.getDeck).toBeDefined();
    expect(ApiService.createDeck).toBeDefined();
    expect(ApiService.updateDeck).toBeDefined();
    expect(ApiService.deleteDeck).toBeDefined();
    expect(ApiService.searchDecks).toBeDefined();
  });

  it("should have all flashcard endpoint methods", () => {
    expect(ApiService.getFlashcardsByDeck).toBeDefined();
    expect(ApiService.getFlashcard).toBeDefined();
    expect(ApiService.createFlashcard).toBeDefined();
    expect(ApiService.updateFlashcard).toBeDefined();
    expect(ApiService.deleteFlashcard).toBeDefined();
  });

  it("should have statistics endpoint methods", () => {
    expect(ApiService.getUserStatistics).toBeDefined();
  });

  it("should have study session endpoint methods", () => {
    expect(ApiService.createStudySession).toBeDefined();
  });
});
