using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using StudyBuddy.API.Data;

namespace StudyBuddy.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class StatisticsController : ControllerBase
    {
        private readonly StudyBuddyContext _context;

        public StatisticsController(StudyBuddyContext context)
        {
            _context = context;
        }

        // GET: api/Statistics/user/5
        [HttpGet("user/{userId}")]
        public async Task<ActionResult<UserStatisticsDto>> GetUserStatistics(int userId)
        {
            // Check if user exists
            if (!await _context.Users.AnyAsync(u => u.Id == userId))
            {
                return NotFound("User not found");
            }

            // Get total decks
            var totalDecks = await _context.Decks
                .Where(d => d.UserId == userId)
                .CountAsync();

            // Get total flashcards
            var totalFlashcards = await _context.Flashcards
                .Where(f => f.Deck.UserId == userId)
                .CountAsync();

            // Get total study sessions
            var totalStudySessions = await _context.StudySessions
                .Where(s => s.UserId == userId)
                .CountAsync();

            // Get correct answers count
            var correctAnswers = await _context.StudySessions
                .Where(s => s.UserId == userId && s.IsCorrect)
                .CountAsync();

            // Calculate accuracy percentage
            var accuracy = totalStudySessions > 0
                ? Math.Round((double)correctAnswers / totalStudySessions * 100, 1)
                : 0;

            // Get last study date
            var lastStudySession = await _context.StudySessions
                .Where(s => s.UserId == userId)
                .OrderByDescending(s => s.StudiedAt)
                .FirstOrDefaultAsync();

            var stats = new UserStatisticsDto
            {
                TotalDecks = totalDecks,
                TotalFlashcards = totalFlashcards,
                TotalStudySessions = totalStudySessions,
                CorrectAnswers = correctAnswers,
                IncorrectAnswers = totalStudySessions - correctAnswers,
                AccuracyPercentage = accuracy,
                LastStudyDate = lastStudySession?.StudiedAt
            };

            return Ok(stats);
        }
    }

    public class UserStatisticsDto
    {
        public int TotalDecks { get; set; }
        public int TotalFlashcards { get; set; }
        public int TotalStudySessions { get; set; }
        public int CorrectAnswers { get; set; }
        public int IncorrectAnswers { get; set; }
        public double AccuracyPercentage { get; set; }
        public DateTime? LastStudyDate { get; set; }
    }
}