using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using StudyBuddy.API.Data;
using StudyBuddy.API.Models;
using StudyBuddy.API.DTOs;

namespace StudyBuddy.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DecksController : ControllerBase
    {
        private readonly StudyBuddyContext _context;

        public DecksController(StudyBuddyContext context)
        {
            _context = context;
        }

        // GET: api/Decks
        [HttpGet]
        public async Task<ActionResult<IEnumerable<DeckDto>>> GetDecks()
        {
            var decks = await _context.Decks
                .Include(d => d.Flashcards)
                .Select(d => new DeckDto
                {
                    Id = d.Id,
                    Title = d.Title,
                    Description = d.Description,
                    CreatedAt = d.CreatedAt,
                    UpdatedAt = d.UpdatedAt,
                    UserId = d.UserId,
                    FlashcardCount = d.Flashcards.Count
                })
                .ToListAsync();

            return decks;
        }

        // GET: api/Decks/user/5
        [HttpGet("user/{userId}")]
        public async Task<ActionResult<PaginatedDecksDto>> GetDecksByUser(
            int userId,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10)
        {
            // Check if user exists
            if (!await _context.Users.AnyAsync(u => u.Id == userId))
            {
                return NotFound("User not found");
            }

            var query = _context.Decks
                .Where(d => d.UserId == userId)
                .Include(d => d.Flashcards)
                .OrderByDescending(d => d.UpdatedAt);

            var totalCount = await query.CountAsync();
            var totalPages = (int)Math.Ceiling(totalCount / (double)pageSize);

            var decks = await query
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(d => new DeckDto
                {
                    Id = d.Id,
                    Title = d.Title,
                    Description = d.Description,
                    CreatedAt = d.CreatedAt,
                    UpdatedAt = d.UpdatedAt,
                    UserId = d.UserId,
                    FlashcardCount = d.Flashcards.Count
                })
                .ToListAsync();

            return Ok(new PaginatedDecksDto
            {
                Decks = decks,
                Page = page,
                PageSize = pageSize,
                TotalCount = totalCount,
                TotalPages = totalPages
            });
        }

        // GET: api/Decks/5
        [HttpGet("{id}")]
        public async Task<ActionResult<DeckDto>> GetDeck(int id)
        {
            var deck = await _context.Decks
                .Include(d => d.Flashcards)
                .FirstOrDefaultAsync(d => d.Id == id);

            if (deck == null)
            {
                return NotFound();
            }

            var deckDto = new DeckDto
            {
                Id = deck.Id,
                Title = deck.Title,
                Description = deck.Description,
                CreatedAt = deck.CreatedAt,
                UpdatedAt = deck.UpdatedAt,
                UserId = deck.UserId,
                FlashcardCount = deck.Flashcards.Count
            };

            return deckDto;
        }

        // POST: api/Decks
        [HttpPost("user/{userId}")]
        public async Task<ActionResult<DeckDto>> PostDeck(int userId, CreateDeckDto createDeckDto)
        {
            // Check if user exists
            if (!await _context.Users.AnyAsync(u => u.Id == userId))
            {
                return NotFound("User not found");
            }

            var deck = new Deck
            {
                Title = createDeckDto.Title,
                Description = createDeckDto.Description,
                UserId = userId,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _context.Decks.Add(deck);
            await _context.SaveChangesAsync();

            var deckDto = new DeckDto
            {
                Id = deck.Id,
                Title = deck.Title,
                Description = deck.Description,
                CreatedAt = deck.CreatedAt,
                UpdatedAt = deck.UpdatedAt,
                UserId = deck.UserId,
                FlashcardCount = 0
            };

            return CreatedAtAction("GetDeck", new { id = deck.Id }, deckDto);
        }

        // PUT: api/Decks/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutDeck(int id, UpdateDeckDto updateDeckDto)
        {
            var deck = await _context.Decks.FindAsync(id);

            if (deck == null)
            {
                return NotFound();
            }

            // Update only provided fields
            if (!string.IsNullOrEmpty(updateDeckDto.Title))
            {
                deck.Title = updateDeckDto.Title;
            }

            if (!string.IsNullOrEmpty(updateDeckDto.Description))
            {
                deck.Description = updateDeckDto.Description;
            }

            deck.UpdatedAt = DateTime.UtcNow;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!DeckExists(id))
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

        // DELETE: api/Decks/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteDeck(int id)
        {
            var deck = await _context.Decks.FindAsync(id);
            if (deck == null)
            {
                return NotFound();
            }

            _context.Decks.Remove(deck);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool DeckExists(int id)
        {
            return _context.Decks.Any(e => e.Id == id);
        }

        // GET: api/Decks/search?query=spanish&userId=1
        [HttpGet("search")]
        public async Task<ActionResult<IEnumerable<DeckDto>>> SearchDecks([FromQuery] string query, [FromQuery] int userId)
        {
            if (string.IsNullOrWhiteSpace(query))
            {
                // If no query, get all user's decks (without pagination for search)
                var allDecks = await _context.Decks
                    .Where(d => d.UserId == userId)
                    .Include(d => d.Flashcards)
                    .OrderByDescending(d => d.UpdatedAt)
                    .Select(d => new DeckDto
                    {
                        Id = d.Id,
                        Title = d.Title,
                        Description = d.Description,
                        CreatedAt = d.CreatedAt,
                        UpdatedAt = d.UpdatedAt,
                        UserId = d.UserId,
                        FlashcardCount = d.Flashcards.Count
                    })
                    .ToListAsync();

                return Ok(allDecks);
            }

            var decks = await _context.Decks
                .Where(d => d.UserId == userId &&
                           (d.Title.Contains(query) || d.Description.Contains(query)))
                .Include(d => d.Flashcards)
                .OrderByDescending(d => d.UpdatedAt)
                .Select(d => new DeckDto
                {
                    Id = d.Id,
                    Title = d.Title,
                    Description = d.Description,
                    CreatedAt = d.CreatedAt,
                    UpdatedAt = d.UpdatedAt,
                    UserId = d.UserId,
                    FlashcardCount = d.Flashcards.Count
                })
                .ToListAsync();

            return Ok(decks);
        }
    }
}