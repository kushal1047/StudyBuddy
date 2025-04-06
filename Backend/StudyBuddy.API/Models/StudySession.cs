namespace StudyBuddy.API.Models
{
    public class StudySession
    {
        public int Id { get; set; }
        public bool IsCorrect { get; set; }
        public DateTime StudiedAt { get; set; } = DateTime.UtcNow;

        public int FlashcardId { get; set; }
        public Flashcard Flashcard { get; set; } = null!;

        public int UserId { get; set; }
        public User User { get; set; } = null!;
    }
}