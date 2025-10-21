using System.ComponentModel.DataAnnotations;

namespace StudyBuddy.API.Models
{
    // Individual question/answer pair for studying
    public class Flashcard
    {
        public int Id { get; set; }

        [Required]
        [MaxLength(1000)]
        public string Question { get; set; } = string.Empty;

        [Required]
        [MaxLength(1000)]
        public string Answer { get; set; } = string.Empty;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        public int DeckId { get; set; }
        public Deck Deck { get; set; } = null!;

        public ICollection<StudySession> StudySessions { get; set; } = new List<StudySession>();
    }
}