using Xunit;
using FluentAssertions;
using Microsoft.AspNetCore.Mvc;
using StudyBuddy.API.Controllers;
using StudyBuddy.API.DTOs;
using StudyBuddy.API.Services;
using StudyBuddy.Tests.Helpers;

namespace StudyBuddy.Tests.Controllers
{
    public class UsersControllerTests
    {
        [Fact]
        public async Task GetUsers_ShouldReturnAllUsers()
        {
            // Arrange
            var context = TestDatabaseHelper.CreateInMemoryContext("GetUsersTest");
            var passwordService = new PasswordService();
            var controller = new UsersController(context, passwordService);

            // Act
            var result = await controller.GetUsers();

            // Assert
            result.Should().NotBeNull();
            result.Value.Should().BeAssignableTo<IEnumerable<UserDto>>();
        }

        [Fact]
        public async Task PostUser_ShouldCreateNewUser()
        {
            // Arrange
            var context = TestDatabaseHelper.CreateInMemoryContext("PostUserTest");
            var passwordService = new PasswordService();
            var controller = new UsersController(context, passwordService);
            var createUserDto = new CreateUserDto
            {
                Username = "testuser",
                Email = "test@example.com",
                Password = "password123"
            };

            // Act
            var result = await controller.PostUser(createUserDto);

            // Assert
            result.Result.Should().BeOfType<CreatedAtActionResult>();
            var createdResult = result.Result as CreatedAtActionResult;
            var userDto = createdResult?.Value as UserDto;
            userDto.Should().NotBeNull();
            userDto!.Username.Should().Be("testuser");
            userDto.Email.Should().Be("test@example.com");
        }

        [Fact]
        public async Task PostUser_ShouldReturnBadRequest_WhenUsernameExists()
        {
            // Arrange
            var context = TestDatabaseHelper.CreateInMemoryContext("PostUserDuplicateTest");
            var passwordService = new PasswordService();
            var controller = new UsersController(context, passwordService);

            var createUserDto1 = new CreateUserDto
            {
                Username = "duplicateuser",
                Email = "first@example.com",
                Password = "password123"
            };
            await controller.PostUser(createUserDto1);

            var createUserDto2 = new CreateUserDto
            {
                Username = "duplicateuser",
                Email = "second@example.com",
                Password = "password456"
            };

            // Act
            var result = await controller.PostUser(createUserDto2);

            // Assert
            result.Result.Should().BeOfType<BadRequestObjectResult>();
        }

        [Fact]
        public async Task GetUser_ShouldReturnUser_WhenUserExists()
        {
            // Arrange
            var context = TestDatabaseHelper.CreateInMemoryContext("GetUserTest");
            var passwordService = new PasswordService();
            var controller = new UsersController(context, passwordService);

            var createUserDto = new CreateUserDto
            {
                Username = "findme",
                Email = "findme@example.com",
                Password = "password123"
            };
            var createResult = await controller.PostUser(createUserDto);
            var createdUser = ((createResult.Result as CreatedAtActionResult)?.Value as UserDto)!;

            // Act
            var result = await controller.GetUser(createdUser.Id);

            // Assert
            result.Should().NotBeNull();
            result.Value.Should().NotBeNull();
            result.Value!.Username.Should().Be("findme");
        }

        [Fact]
        public async Task GetUser_ShouldReturnNotFound_WhenUserDoesNotExist()
        {
            // Arrange
            var context = TestDatabaseHelper.CreateInMemoryContext("GetUserNotFoundTest");
            var passwordService = new PasswordService();
            var controller = new UsersController(context, passwordService);

            // Act
            var result = await controller.GetUser(999);

            // Assert
            result.Result.Should().BeOfType<NotFoundResult>();
        }

        [Fact]
        public async Task DeleteUser_ShouldRemoveUser()
        {
            // Arrange
            var context = TestDatabaseHelper.CreateInMemoryContext("DeleteUserTest");
            var passwordService = new PasswordService();
            var controller = new UsersController(context, passwordService);

            var createUserDto = new CreateUserDto
            {
                Username = "deleteme",
                Email = "deleteme@example.com",
                Password = "password123"
            };
            var createResult = await controller.PostUser(createUserDto);
            var createdUser = ((createResult.Result as CreatedAtActionResult)?.Value as UserDto)!;

            // Act
            var deleteResult = await controller.DeleteUser(createdUser.Id);

            // Assert
            deleteResult.Should().BeOfType<NoContentResult>();

            var getResult = await controller.GetUser(createdUser.Id);
            getResult.Result.Should().BeOfType<NotFoundResult>();
        }
    }
}