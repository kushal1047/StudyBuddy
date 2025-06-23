using System.ComponentModel.DataAnnotations;

namespace StudyBuddy.API.DTOs
{
    public class DeckDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public int UserId { get; set; }
        public int FlashcardCount { get; set; }
    }

    public class CreateDeckDto
    {
        [Required]
        [MaxLength(100)]
        public string Title { get; set; } = string.Empty;

        [MaxLength(500)]
        public string Description { get; set; } = string.Empty;
    }

    public class UpdateDeckDto
    {
        [MaxLength(100)]
        public string? Title { get; set; }

        [MaxLength(500)]
        public string? Description { get; set; }
    }

    public class PaginatedDecksDto
    {
        public List<DeckDto> Decks { get; set; } = new List<DeckDto>();
        public int Page { get; set; }
        public int PageSize { get; set; }
        public int TotalCount { get; set; }
        public int TotalPages { get; set; }
    }
}