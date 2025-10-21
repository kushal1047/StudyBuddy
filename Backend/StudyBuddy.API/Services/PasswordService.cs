using System.Security.Cryptography;
using System.Text;

namespace StudyBuddy.API.Services
{
    // Handles password hashing and verification
    public class PasswordService : IPasswordService
    {
        // Hash a password with salt for secure storage
        public string HashPassword(string password)
        {
            using (var sha256 = SHA256.Create())
            {
                var hashedBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password + "StudyBuddySalt"));
                return Convert.ToBase64String(hashedBytes);
            }
        }

        // Check if a password matches the stored hash
        public bool VerifyPassword(string password, string hashedPassword)
        {
            var hashOfInput = HashPassword(password);
            return hashOfInput == hashedPassword;
        }
    }
}