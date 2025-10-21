using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using StudyBuddy.API.Data;
using StudyBuddy.API.Models;
using StudyBuddy.API.DTOs;

namespace StudyBuddy.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class FlashcardsController : ControllerBase
    {
        private readonly StudyBuddyContext _context;

        public FlashcardsController(StudyBuddyContext context)
        {
            _context = context;
        }

        // GET: api/Flashcards/deck/5
        [HttpGet("deck/{deckId}")]
        public async Task<ActionResult<IEnumerable<FlashcardDto>>> GetFlashcardsByDeck(int deckId)
        {
            // Make sure the deck is valid
            if (!await _context.Decks.AnyAsync(d => d.Id == deckId))
            {
                return NotFound("Deck not found");
            }

            var flashcards = await _context.Flashcards
                .Where(f => f.DeckId == deckId)
                .Include(f => f.Deck)
                .Select(f => new FlashcardDto
                {
                    Id = f.Id,
                    Question = f.Question,
                    Answer = f.Answer,
                    CreatedAt = f.CreatedAt,
                    UpdatedAt = f.UpdatedAt,
                    DeckId = f.DeckId,
                    DeckTitle = f.Deck.Title
                })
                .ToListAsync();

            return flashcards;
        }

        // GET: api/Flashcards/5
        [HttpGet("{id}")]
        public async Task<ActionResult<FlashcardDto>> GetFlashcard(int id)
        {
            var flashcard = await _context.Flashcards
                .Include(f => f.Deck)
                .FirstOrDefaultAsync(f => f.Id == id);

            if (flashcard == null)
            {
                return NotFound();
            }

            var flashcardDto = new FlashcardDto
            {
                Id = flashcard.Id,
                Question = flashcard.Question,
                Answer = flashcard.Answer,
                CreatedAt = flashcard.CreatedAt,
                UpdatedAt = flashcard.UpdatedAt,
                DeckId = flashcard.DeckId,
                DeckTitle = flashcard.Deck.Title
            };

            return flashcardDto;
        }

        // POST: api/Flashcards/deck/5
        [HttpPost("deck/{deckId}")]
        public async Task<ActionResult<FlashcardDto>> PostFlashcard(int deckId, CreateFlashcardDto createFlashcardDto)
        {
            // Check if deck exists
            var deck = await _context.Decks.FindAsync(deckId);
            if (deck == null)
            {
                return NotFound("Deck not found");
            }

            var flashcard = new Flashcard
            {
                Question = createFlashcardDto.Question,
                Answer = createFlashcardDto.Answer,
                DeckId = deckId,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _context.Flashcards.Add(flashcard);
            await _context.SaveChangesAsync();

            var flashcardDto = new FlashcardDto
            {
                Id = flashcard.Id,
                Question = flashcard.Question,
                Answer = flashcard.Answer,
                CreatedAt = flashcard.CreatedAt,
                UpdatedAt = flashcard.UpdatedAt,
                DeckId = flashcard.DeckId,
                DeckTitle = deck.Title
            };

            return CreatedAtAction("GetFlashcard", new { id = flashcard.Id }, flashcardDto);
        }

        // PUT: api/Flashcards/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutFlashcard(int id, UpdateFlashcardDto updateFlashcardDto)
        {
            var flashcard = await _context.Flashcards.FindAsync(id);

            if (flashcard == null)
            {
                return NotFound();
            }

            // Update only provided fields
            if (!string.IsNullOrEmpty(updateFlashcardDto.Question))
            {
                flashcard.Question = updateFlashcardDto.Question;
            }

            if (!string.IsNullOrEmpty(updateFlashcardDto.Answer))
            {
                flashcard.Answer = updateFlashcardDto.Answer;
            }

            flashcard.UpdatedAt = DateTime.UtcNow;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!FlashcardExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // DELETE: api/Flashcards/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteFlashcard(int id)
        {
            var flashcard = await _context.Flashcards.FindAsync(id);
            if (flashcard == null)
            {
                return NotFound();
            }

            _context.Flashcards.Remove(flashcard);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool FlashcardExists(int id)
        {
            return _context.Flashcards.Any(e => e.Id == id);
        }
    }
}