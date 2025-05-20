using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using StudyBuddy.API.Data;
using StudyBuddy.API.Models;

namespace StudyBuddy.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class StudySessionsController : ControllerBase
    {
        private readonly StudyBuddyContext _context;

        public StudySessionsController(StudyBuddyContext context)
        {
            _context = context;
        }

        // POST: api/StudySessions
        [HttpPost]
        public async Task<ActionResult<StudySession>> PostStudySession(CreateStudySessionDto createStudySessionDto)
        {
            // Verify flashcard exists
            if (!await _context.Flashcards.AnyAsync(f => f.Id == createStudySessionDto.FlashcardId))
            {
                return NotFound("Flashcard not found");
            }

            // Verify user exists
            if (!await _context.Users.AnyAsync(u => u.Id == createStudySessionDto.UserId))
            {
                return NotFound("User not found");
            }

            var studySession = new StudySession
            {
                FlashcardId = createStudySessionDto.FlashcardId,
                UserId = createStudySessionDto.UserId,
                IsCorrect = createStudySessionDto.IsCorrect,
                StudiedAt = DateTime.UtcNow
            };

            _context.StudySessions.Add(studySession);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(PostStudySession), new { id = studySession.Id }, studySession);
        }
    }

    public class CreateStudySessionDto
    {
        public int FlashcardId { get; set; }
        public int UserId { get; set; }
        public bool IsCorrect { get; set; }
    }
}