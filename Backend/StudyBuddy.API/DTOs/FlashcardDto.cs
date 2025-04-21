using System.ComponentModel.DataAnnotations;

namespace StudyBuddy.API.DTOs
{
    public class FlashcardDto
    {
        public int Id { get; set; }
        public string Question { get; set; } = string.Empty;
        public string Answer { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public int DeckId { get; set; }
        public string DeckTitle { get; set; } = string.Empty;
    }

    public class CreateFlashcardDto
    {
        [Required]
        [MaxLength(1000)]
        public string Question { get; set; } = string.Empty;

        [Required]
        [MaxLength(1000)]
        public string Answer { get; set; } = string.Empty;
    }

    public class UpdateFlashcardDto
    {
        [MaxLength(1000)]
        public string? Question { get; set; }

        [MaxLength(1000)]
        public string? Answer { get; set; }
    }
}