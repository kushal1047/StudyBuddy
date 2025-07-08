using Xunit;
using FluentAssertions;
using Microsoft.AspNetCore.Mvc;
using StudyBuddy.API.Controllers;
using StudyBuddy.API.DTOs;
using StudyBuddy.API.Services;
using StudyBuddy.Tests.Helpers;

namespace StudyBuddy.Tests.Controllers
{
    public class AuthControllerTests
    {
        [Fact]
        public async Task Register_ShouldCreateUser_AndReturnAuthResponse()
        {
            // Arrange
            var context = TestDatabaseHelper.CreateInMemoryContext("RegisterTest");
            var passwordService = new PasswordService();
            var controller = new AuthController(context, passwordService);

            var createUserDto = new CreateUserDto
            {
                Username = "newuser",
                Email = "newuser@example.com",
                Password = "password123"
            };

            // Act
            var result = await controller.Register(createUserDto);

            // Assert
            result.Result.Should().BeOfType<CreatedAtActionResult>();
            var createdResult = result.Result as CreatedAtActionResult;
            var authResponse = createdResult?.Value as AuthResponseDto;
            authResponse.Should().NotBeNull();
            authResponse!.User.Username.Should().Be("newuser");
            authResponse.Token.Should().NotBeNullOrEmpty();
        }

        [Fact]
        public async Task Register_ShouldReturnBadRequest_WhenUsernameExists()
        {
            // Arrange
            var context = TestDatabaseHelper.CreateInMemoryContext("RegisterDuplicateTest");
            var passwordService = new PasswordService();
            var controller = new AuthController(context, passwordService);

            var createUserDto1 = new CreateUserDto
            {
                Username = "existinguser",
                Email = "first@example.com",
                Password = "password123"
            };
            await controller.Register(createUserDto1);

            var createUserDto2 = new CreateUserDto
            {
                Username = "existinguser",
                Email = "second@example.com",
                Password = "password456"
            };

            // Act
            var result = await controller.Register(createUserDto2);

            // Assert
            result.Result.Should().BeOfType<BadRequestObjectResult>();
        }

        [Fact]
        public async Task Login_ShouldReturnAuthResponse_WithValidCredentials()
        {
            // Arrange
            var context = TestDatabaseHelper.CreateInMemoryContext("LoginTest");
            var passwordService = new PasswordService();
            var controller = new AuthController(context, passwordService);

            // Register a user first
            var createUserDto = new CreateUserDto
            {
                Username = "loginuser",
                Email = "loginuser@example.com",
                Password = "password123"
            };
            await controller.Register(createUserDto);

            var loginDto = new LoginDto
            {
                Username = "loginuser",
                Password = "password123"
            };

            // Act
            var result = await controller.Login(loginDto);

            // Assert
            result.Result.Should().BeOfType<OkObjectResult>();
            var okResult = result.Result as OkObjectResult;
            var authResponse = okResult?.Value as AuthResponseDto;
            authResponse.Should().NotBeNull();
            authResponse!.User.Username.Should().Be("loginuser");
            authResponse.Token.Should().NotBeNullOrEmpty();
        }

        [Fact]
        public async Task Login_ShouldReturnUnauthorized_WithInvalidUsername()
        {
            // Arrange
            var context = TestDatabaseHelper.CreateInMemoryContext("LoginInvalidUserTest");
            var passwordService = new PasswordService();
            var controller = new AuthController(context, passwordService);

            var loginDto = new LoginDto
            {
                Username = "nonexistent",
                Password = "password123"
            };

            // Act
            var result = await controller.Login(loginDto);

            // Assert
            result.Result.Should().BeOfType<UnauthorizedObjectResult>();
        }

        [Fact]
        public async Task Login_ShouldReturnUnauthorized_WithInvalidPassword()
        {
            // Arrange
            var context = TestDatabaseHelper.CreateInMemoryContext("LoginInvalidPasswordTest");
            var passwordService = new PasswordService();
            var controller = new AuthController(context, passwordService);

            // Register a user first
            var createUserDto = new CreateUserDto
            {
                Username = "testuser",
                Email = "testuser@example.com",
                Password = "correctpassword"
            };
            await controller.Register(createUserDto);

            var loginDto = new LoginDto
            {
                Username = "testuser",
                Password = "wrongpassword"
            };

            // Act
            var result = await controller.Login(loginDto);

            // Assert
            result.Result.Should().BeOfType<UnauthorizedObjectResult>();
        }
    }
}