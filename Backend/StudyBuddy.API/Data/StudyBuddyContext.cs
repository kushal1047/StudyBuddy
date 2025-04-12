using Microsoft.EntityFrameworkCore;
using StudyBuddy.API.Models;

namespace StudyBuddy.API.Data
{
    public class StudyBuddyContext : DbContext
    {
        public StudyBuddyContext(DbContextOptions<StudyBuddyContext> options) : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Deck> Decks { get; set; }
        public DbSet<Flashcard> Flashcards { get; set; }
        public DbSet<StudySession> StudySessions { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // User entity configuration
            modelBuilder.Entity<User>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.HasIndex(e => e.Username).IsUnique();
                entity.HasIndex(e => e.Email).IsUnique();
            });

            // Deck entity configuration
            modelBuilder.Entity<Deck>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.HasOne(d => d.User)
                      .WithMany(u => u.Decks)
                      .HasForeignKey(d => d.UserId)
                      .OnDelete(DeleteBehavior.Cascade);
            });

            // Flashcard entity configuration
            modelBuilder.Entity<Flashcard>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.HasOne(f => f.Deck)
                      .WithMany(d => d.Flashcards)
                      .HasForeignKey(f => f.DeckId)
                      .OnDelete(DeleteBehavior.Cascade);
            });

            // StudySession entity configuration
            modelBuilder.Entity<StudySession>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.HasOne(s => s.Flashcard)
                      .WithMany(f => f.StudySessions)
                      .HasForeignKey(s => s.FlashcardId)
                      .OnDelete(DeleteBehavior.Cascade);
                entity.HasOne(s => s.User)
                      .WithMany()
                      .HasForeignKey(s => s.UserId)
                      .OnDelete(DeleteBehavior.Cascade);
            });
        }
    }
}