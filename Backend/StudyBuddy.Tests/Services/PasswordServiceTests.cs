using Xunit;
using FluentAssertions;
using StudyBuddy.API.Services;

namespace StudyBuddy.Tests.Services
{
    public class PasswordServiceTests
    {
        private readonly PasswordService _passwordService;

        public PasswordServiceTests()
        {
            _passwordService = new PasswordService();
        }

        [Fact]
        public void HashPassword_ShouldReturnNonEmptyString()
        {
            // Arrange
            var password = "testpassword123";

            // Act
            var hashedPassword = _passwordService.HashPassword(password);

            // Assert
            hashedPassword.Should().NotBeNullOrEmpty();
        }

        [Fact]
        public void HashPassword_ShouldReturnDifferentHashForDifferentPasswords()
        {
            // Arrange
            var password1 = "password123";
            var password2 = "password456";

            // Act
            var hash1 = _passwordService.HashPassword(password1);
            var hash2 = _passwordService.HashPassword(password2);

            // Assert
            hash1.Should().NotBe(hash2);
        }

        [Fact]
        public void HashPassword_ShouldReturnConsistentHashForSamePassword()
        {
            // Arrange
            var password = "consistentpassword";

            // Act
            var hash1 = _passwordService.HashPassword(password);
            var hash2 = _passwordService.HashPassword(password);

            // Assert
            hash1.Should().Be(hash2);
        }

        [Fact]
        public void VerifyPassword_ShouldReturnTrueForCorrectPassword()
        {
            // Arrange
            var password = "correctpassword";
            var hashedPassword = _passwordService.HashPassword(password);

            // Act
            var result = _passwordService.VerifyPassword(password, hashedPassword);

            // Assert
            result.Should().BeTrue();
        }

        [Fact]
        public void VerifyPassword_ShouldReturnFalseForIncorrectPassword()
        {
            // Arrange
            var correctPassword = "correctpassword";
            var incorrectPassword = "wrongpassword";
            var hashedPassword = _passwordService.HashPassword(correctPassword);

            // Act
            var result = _passwordService.VerifyPassword(incorrectPassword, hashedPassword);

            // Assert
            result.Should().BeFalse();
        }
    }
}