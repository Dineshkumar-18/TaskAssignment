using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NUnit.Framework;
using TaskAssignment.Controllers;
using TaskAssignment.Data;
using TaskAssignment.Models;
using TaskAssignment.Dtos;

namespace TaskAssignment.Tests
{
    [TestFixture]
    public class TasksControllerTests
    {
        private ApplicationDbContext _context;
        private TasksController _controller;

        [SetUp]
        public void SetUp()
        {
            var options = new DbContextOptionsBuilder<ApplicationDbContext>()
                .UseInMemoryDatabase(databaseName: "TasksDatabase_" + Guid.NewGuid()) // Unique database name
                .Options;

            _context = new ApplicationDbContext(options);

            // Seed data with all required properties
            _context.Tasks.AddRange(
                new Tasks { TaskId = 1, Title = "Test Task 1", Description = "Task 1 Description", UserId = 1, Priority = Priority.High, Status = Status.Pending },
                new Tasks { TaskId = 2, Title = "Test Task 2", Description = "Task 2 Description", UserId = 1, Priority = Priority.Low, Status = Status.Pending }
            );

            _context.Users.Add(new User
            {
                UserId = 1,
                Name = "TestUser",
                Email = "testuser@example.com",
                Password = "TestPassword123",
                Role = "User"
            });
            _context.SaveChanges();

            _controller = new TasksController(_context);

            // Mock user claims
            var userClaims = new ClaimsPrincipal(new ClaimsIdentity(new[]
            {
                new Claim(ClaimTypes.NameIdentifier, "1") // Simulating a user with ID 1
            }, "mock"));

            _controller.ControllerContext = new ControllerContext
            {
                HttpContext = new DefaultHttpContext
                {
                    User = userClaims
                }
            };
        }

        [TearDown]
        public void TearDown()
        {
            _context?.Dispose();
        }

        [Test]
        public async Task GetTasks_ReturnsOkResult_WithListOfTasks()
        {
            // Act
            var result = await _controller.GetTasks();

            // Assert
            var okResult = result.Result as OkObjectResult;
            Assert.IsNotNull(okResult);
            Assert.AreEqual(200, okResult.StatusCode);
            var taskDtos = okResult.Value as List<TaskDto>;
            Assert.AreEqual(2, taskDtos.Count);
        }

        [Test]
        public async Task UpdateTaskStatus_ValidTask_ReturnsOk()
        {
            // Arrange
            var userId = 1;
            var taskId = 1;

            // Act
            var result = await _controller.UpdateTaskStatus(userId, taskId);

            // Assert
            var okResult = result as OkObjectResult;
            Assert.IsNotNull(okResult);
            Assert.AreEqual(200, okResult.StatusCode);
            Assert.AreEqual("Status updated successfully", okResult.Value);

            // Verify the status was updated
            var updatedTask = await _context.Tasks.FindAsync(taskId);
            Assert.AreEqual(Status.Completed, updatedTask.Status);
        }

        [Test]
        public async Task UserFilerByPriority_ValidPriority_ReturnsOk()
        {
            // Arrange
            var userId = 1;
            var priority = "High";

            // Act
            var result = await _controller.UserFilerByPriority(priority, userId);

            // Assert
            var okResult = result as OkObjectResult;
            Assert.IsNotNull(okResult);
            Assert.AreEqual(200, okResult.StatusCode);
            var returnedTasks = okResult.Value as List<Tasks>;
            Assert.AreEqual(1, returnedTasks.Count);
            Assert.AreEqual(Priority.High, returnedTasks[0].Priority);
        }

        [Test]
        public async Task PostTasks_InvalidPriority_ReturnsBadRequest()
        {
            // Arrange
            var validUserId = 1;
            var invalidTaskDto = new TaskDto
            {
                Title = "Invalid Task",
                Description = "Task with invalid priority",
                DueDate = DateTime.Now.AddDays(1),
                Priority = "InvalidPriority", // Invalid priority
                UserId = validUserId
            };

            // Act
            var result = await _controller.PostTasks(invalidTaskDto);

            // Assert
            Assert.That(result.Result, Is.InstanceOf<BadRequestObjectResult>());
            var badRequestResult = (BadRequestObjectResult)result.Result;
            Assert.That(badRequestResult.StatusCode, Is.EqualTo(400));
            Assert.That(badRequestResult.Value, Is.EqualTo("Invalid priority value. Valid values are: Low, Medium, High."));
        }


    }
}
