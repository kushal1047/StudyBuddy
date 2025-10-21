using System.ComponentModel.DataAnnotations;

namespace StudyBuddy.API.DTOs
{
    // User data sent to client (no password)
    public class UserDto
    {
        public int Id { get; set; }
        public string Username { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
    }

    // Data for creating a new user
    public class CreateUserDto
    {
        [Required]
        [MaxLength(50)]
        public string Username { get; set; } = string.Empty;

        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        [Required]
        [MinLength(6)]
        public string Password { get; set; } = string.Empty;
    }

    // Data for updating user info
    public class UpdateUserDto
    {
        [MaxLength(50)]
        public string? Username { get; set; }

        [EmailAddress]
        public string? Email { get; set; }
    }
}