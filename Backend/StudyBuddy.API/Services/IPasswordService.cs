namespace StudyBuddy.API.Services
{
    // Interface for password security operations
    public interface IPasswordService
    {
        string HashPassword(string password);
        bool VerifyPassword(string password, string hashedPassword);
    }
}