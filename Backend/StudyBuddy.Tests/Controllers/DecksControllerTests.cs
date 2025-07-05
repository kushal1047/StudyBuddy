using Xunit;
using FluentAssertions;
using Microsoft.AspNetCore.Mvc;
using StudyBuddy.API.Controllers;
using StudyBuddy.API.DTOs;
using StudyBuddy.API.Models;
using StudyBuddy.Tests.Helpers;

namespace StudyBuddy.Tests.Controllers
{
    public class DecksControllerTests
    {
        [Fact]
        public async Task GetDecksByUser_ShouldReturnUserDecks()
        {
            // Arrange
            var context = TestDatabaseHelper.CreateInMemoryContext("GetDecksByUserTest");
            var controller = new DecksController(context);

            // Create a test user
            var user = new User
            {
                Username = "testuser",
                Email = "test@example.com",
                PasswordHash = "hash",
                CreatedAt = DateTime.UtcNow
            };
            context.Users.Add(user);
            await context.SaveChangesAsync();

            // Create decks for the user
            var deck1 = new Deck { Title = "Deck 1", UserId = user.Id, CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow };
            var deck2 = new Deck { Title = "Deck 2", UserId = user.Id, CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow };
            context.Decks.AddRange(deck1, deck2);
            await context.SaveChangesAsync();

            // Act
            var result = await controller.GetDecksByUser(user.Id);

            // Assert
            result.Result.Should().BeOfType<OkObjectResult>();
            var okResult = result.Result as OkObjectResult;
            var paginatedDecks = okResult?.Value as PaginatedDecksDto;
            paginatedDecks.Should().NotBeNull();
            paginatedDecks!.Decks.Should().HaveCount(2);
        }

        [Fact]
        public async Task PostDeck_ShouldCreateNewDeck()
        {
            // Arrange
            var context = TestDatabaseHelper.CreateInMemoryContext("PostDeckTest");
            var controller = new DecksController(context);

            var user = new User
            {
                Username = "testuser",
                Email = "test@example.com",
                PasswordHash = "hash",
                CreatedAt = DateTime.UtcNow
            };
            context.Users.Add(user);
            await context.SaveChangesAsync();

            var createDeckDto = new CreateDeckDto
            {
                Title = "New Deck",
                Description = "Test Description"
            };

            // Act
            var result = await controller.PostDeck(user.Id, createDeckDto);

            // Assert
            result.Result.Should().BeOfType<CreatedAtActionResult>();
            var createdResult = result.Result as CreatedAtActionResult;
            var deckDto = createdResult?.Value as DeckDto;
            deckDto.Should().NotBeNull();
            deckDto!.Title.Should().Be("New Deck");
            deckDto.UserId.Should().Be(user.Id);
        }

        [Fact]
        public async Task PostDeck_ShouldReturnNotFound_WhenUserDoesNotExist()
        {
            // Arrange
            var context = TestDatabaseHelper.CreateInMemoryContext("PostDeckNoUserTest");
            var controller = new DecksController(context);

            var createDeckDto = new CreateDeckDto
            {
                Title = "New Deck",
                Description = "Test Description"
            };

            // Act
            var result = await controller.PostDeck(999, createDeckDto);

            // Assert
            result.Result.Should().BeOfType<NotFoundObjectResult>();
        }

        [Fact]
        public async Task GetDeck_ShouldReturnDeck_WhenDeckExists()
        {
            // Arrange
            var context = TestDatabaseHelper.CreateInMemoryContext("GetDeckTest");
            var controller = new DecksController(context);

            var user = new User
            {
                Username = "testuser",
                Email = "test@example.com",
                PasswordHash = "hash",
                CreatedAt = DateTime.UtcNow
            };
            context.Users.Add(user);
            await context.SaveChangesAsync();

            var deck = new Deck
            {
                Title = "Test Deck",
                Description = "Description",
                UserId = user.Id,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };
            context.Decks.Add(deck);
            await context.SaveChangesAsync();

            // Act
            var result = await controller.GetDeck(deck.Id);

            // Assert
            result.Value.Should().NotBeNull();
            result.Value!.Title.Should().Be("Test Deck");
        }

        [Fact]
        public async Task DeleteDeck_ShouldRemoveDeck()
        {
            // Arrange
            var context = TestDatabaseHelper.CreateInMemoryContext("DeleteDeckTest");
            var controller = new DecksController(context);

            var user = new User
            {
                Username = "testuser",
                Email = "test@example.com",
                PasswordHash = "hash",
                CreatedAt = DateTime.UtcNow
            };
            context.Users.Add(user);
            await context.SaveChangesAsync();

            var deck = new Deck
            {
                Title = "Delete Me",
                UserId = user.Id,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };
            context.Decks.Add(deck);
            await context.SaveChangesAsync();

            // Act
            var deleteResult = await controller.DeleteDeck(deck.Id);

            // Assert
            deleteResult.Should().BeOfType<NoContentResult>();

            var getResult = await controller.GetDeck(deck.Id);
            getResult.Result.Should().BeOfType<NotFoundResult>();
        }

        [Fact]
        public async Task SearchDecks_ShouldReturnMatchingDecks()
        {
            // Arrange
            var context = TestDatabaseHelper.CreateInMemoryContext("SearchDecksTest");
            var controller = new DecksController(context);

            var user = new User
            {
                Username = "testuser",
                Email = "test@example.com",
                PasswordHash = "hash",
                CreatedAt = DateTime.UtcNow
            };
            context.Users.Add(user);
            await context.SaveChangesAsync();

            var deck1 = new Deck { Title = "Spanish Vocabulary", UserId = user.Id, CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow };
            var deck2 = new Deck { Title = "Biology Terms", UserId = user.Id, CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow };
            var deck3 = new Deck { Title = "Spanish Grammar", UserId = user.Id, CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow };
            context.Decks.AddRange(deck1, deck2, deck3);
            await context.SaveChangesAsync();

            // Act
            var result = await controller.SearchDecks("Spanish", user.Id);

            // Assert
            result.Result.Should().BeOfType<OkObjectResult>();
            var okResult = result.Result as OkObjectResult;
            var decks = okResult?.Value as List<DeckDto>;
            decks.Should().HaveCount(2);
            decks!.All(d => d.Title.Contains("Spanish")).Should().BeTrue();
        }
    }
}