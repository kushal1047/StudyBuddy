using Microsoft.EntityFrameworkCore;
using StudyBuddy.API.Data;

namespace StudyBuddy.Tests.Helpers
{
    public static class TestDatabaseHelper
    {
        public static StudyBuddyContext CreateInMemoryContext(string databaseName)
        {
            var options = new DbContextOptionsBuilder<StudyBuddyContext>()
                .UseInMemoryDatabase(databaseName: databaseName)
                .Options;

            return new StudyBuddyContext(options);
        }
    }
}